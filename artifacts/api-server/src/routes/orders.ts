import { Router } from "express";
import { db } from "@workspace/db";
import {
  ordersTable, productsTable, blackoutDatesTable, couponsTable,
  cashBookTable,
} from "@workspace/db";
import { eq, sql, and, desc, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { auditLog } from "../middlewares/requireAdmin";

const router = Router();

// ─── Settings helpers (DB-driven, with fallback) ───────────────────────────────
async function getNumericSetting(key: string, fallback: number): Promise<number> {
  try {
    const { storeSettingsTable } = await import("@workspace/db");
    const [row] = await db.select().from(storeSettingsTable).where(
      eq(storeSettingsTable.key, key)
    );
    const val = parseInt(row?.value ?? "");
    return isNaN(val) ? fallback : val;
  } catch {
    return fallback;
  }
}

// ─── Order Status Transition Map ──────────────────────────────────────────────
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending:          ["confirmed", "cancelled"],
  confirmed:        ["in_baking", "cancelled"],
  in_baking:        ["out_for_delivery"],
  out_for_delivery: ["completed"],
  completed:        [],
  cancelled:        [],
};

// ─── GET /orders — Admin only ─────────────────────────────────────────────────
router.get("/orders", requireAdmin, async (req, res) => {
  const { status, date } = req.query;
  const conditions = [];
  if (status) conditions.push(eq(ordersTable.status, status as string));
  if (date) conditions.push(eq(ordersTable.deliveryDate, date as string));

  let query = db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).$dynamic();
  if (conditions.length > 0) query = query.where(and(...conditions));

  const orders = await query;
  res.json(orders);
});

// ─── GET /orders/summary — Admin only ────────────────────────────────────────
router.get("/orders/summary", requireAdmin, async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const [{ totalOrders }] = await db
    .select({ totalOrders: sql<number>`count(*)::int` })
    .from(ordersTable);

  const [{ todayOrders }] = await db
    .select({ todayOrders: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, new Date(today)));

  const [{ pendingOrders }] = await db
    .select({ pendingOrders: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending"));

  const [{ totalRevenue }] = await db
    .select({ totalRevenue: sql<number>`coalesce(sum(total_amount::numeric), 0)` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "completed"));

  const [{ todayRevenue }] = await db
    .select({ todayRevenue: sql<number>`coalesce(sum(total_amount::numeric), 0)` })
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.status, "completed"),
        gte(ordersTable.createdAt, new Date(today)),
      ),
    );

  const statusBreakdown = await db
    .select({ status: ordersTable.status, count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .groupBy(ordersTable.status);

  const recentOrders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt))
    .limit(5);

  res.json({ totalOrders, todayOrders, pendingOrders, totalRevenue: Number(totalRevenue), todayRevenue: Number(todayRevenue), statusBreakdown, recentOrders });
});

// ─── GET /orders/calendar — Admin only ───────────────────────────────────────
router.get("/orders/calendar", requireAdmin, async (req, res) => {
  const { month } = req.query;
  let startDate: Date, endDate: Date;

  if (month && typeof month === "string") {
    const [year, m] = month.split("-").map(Number);
    startDate = new Date(year, m - 1, 1);
    endDate   = new Date(year, m, 0);
  } else {
    const now = new Date();
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate   = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  const startStr = startDate.toISOString().split("T")[0];
  const endStr   = endDate.toISOString().split("T")[0];

  const orders = await db
    .select()
    .from(ordersTable)
    .where(and(gte(ordersTable.deliveryDate, startStr), lte(ordersTable.deliveryDate, endStr)))
    .orderBy(ordersTable.deliveryDate);

  const grouped: Record<string, typeof orders> = {};
  for (const order of orders) {
    if (!grouped[order.deliveryDate]) grouped[order.deliveryDate] = [];
    grouped[order.deliveryDate].push(order);
  }

  res.json(Object.entries(grouped).map(([date, orders]) => ({ date, orderCount: orders.length, orders })));
});

// ─── GET /orders/check-capacity — Public (needed at checkout) ─────────────────
router.get("/orders/check-capacity", async (req, res) => {
  const { date, timeSlot } = req.query;
  if (!date || typeof date !== "string") {
    res.status(400).json({ error: "date is required" });
    return;
  }

  const [blackout] = await db.select().from(blackoutDatesTable).where(eq(blackoutDatesTable.date, date));
  if (blackout) {
    res.json({ available: false, remainingSlots: 0, isBlackout: true });
    return;
  }

  // ✅ Read from DB settings — not hardcoded
  const DAILY_ORDER_LIMIT = await getNumericSetting("dailyOrderLimit", 20);

  const [{ orderCount }] = await db
    .select({ orderCount: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(eq(ordersTable.deliveryDate, date));

  const remaining = Math.max(0, DAILY_ORDER_LIMIT - orderCount);
  res.json({ available: remaining > 0, remainingSlots: remaining, isBlackout: false });
});

// ─── GET /orders/:id — Admin only ────────────────────────────────────────────
router.get("/orders/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  res.json(order);
});

// ─── POST /orders — Public (Customer Checkout) ────────────────────────────────
router.post("/orders", async (req, res) => {
  const createOrderSchema = z.object({
    customerName:     z.string().min(1),
    customerPhone:    z.string().min(1),
    customerEmail:    z.string().email().optional().nullable(),
    deliveryAddress:  z.string().min(1),
    deliveryDate:     z.string().min(1),
    deliveryTimeSlot: z.string().optional().nullable(),
    notes:            z.string().optional().nullable(),
    couponCode:       z.string().optional().nullable(),
    items: z.array(z.object({
      productId:        z.number(),
      quantity:         z.number().min(1),
      selectedVariants: z.record(z.string()),
      selectedAddons:   z.array(z.string()),
      customMessage:    z.string().optional().nullable(),
    })).min(1),
  });

  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const { items, couponCode, ...orderData } = parsed.data;

  // 1. Blackout date check
  const [blackout] = await db.select().from(blackoutDatesTable).where(eq(blackoutDatesTable.date, orderData.deliveryDate));
  if (blackout) { res.status(400).json({ error: "یہ تاریخ ڈیلیوری کے لیے دستیاب نہیں ہے۔" }); return; }

  // 2. Lead time check (from DB settings)
  const MIN_LEAD_HOURS = await getNumericSetting("minLeadHours", 24);
  const minDate = new Date(Date.now() + MIN_LEAD_HOURS * 60 * 60 * 1000);
  const minDateStr = minDate.toLocaleDateString("en-CA");
  if (orderData.deliveryDate < minDateStr) {
    res.status(400).json({ error: `کم از کم ${MIN_LEAD_HOURS} گھنٹے پہلے آرڈر ضروری ہے۔` });
    return;
  }

  // 3. Daily capacity check (from DB settings)
  const DAILY_ORDER_LIMIT = await getNumericSetting("dailyOrderLimit", 20);
  const [{ orderCount }] = await db
    .select({ orderCount: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(eq(ordersTable.deliveryDate, orderData.deliveryDate));
  if (orderCount >= DAILY_ORDER_LIMIT) {
    res.status(400).json({ error: "اس تاریخ کی تمام slots بھر گئی ہیں۔" });
    return;
  }

  // 4. Compute prices
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
    if (!product || !product.isAvailable) {
      res.status(400).json({ error: `Product ${item.productId} is not available.` });
      return;
    }

    let unitPrice = Number(product.basePrice);
    const variants = (product.variants as Array<{ name: string; type: string; options: Array<{ label: string; priceAdjustment: number }> }>) || [];
    for (const [variantType, selectedOption] of Object.entries(item.selectedVariants)) {
      const variant = variants.find(v => v.type === variantType || v.name === variantType);
      if (variant) {
        const opt = variant.options.find(o => o.label === selectedOption);
        if (opt) unitPrice += opt.priceAdjustment;
      }
    }

    const addons = (product.addons as Array<{ name: string; price: number }>) || [];
    for (const addonName of item.selectedAddons) {
      const addon = addons.find(a => a.name === addonName);
      if (addon) unitPrice += addon.price;
    }

    const itemSubtotal = unitPrice * item.quantity;
    subtotal += itemSubtotal;

    const imageUrls = (product.imageUrls as string[]) || [];
    orderItems.push({
      productId: item.productId, productName: product.name,
      productImageUrl: imageUrls[0] ?? null, quantity: item.quantity,
      unitPrice, selectedVariants: item.selectedVariants,
      selectedAddons: item.selectedAddons, customMessage: item.customMessage ?? null,
      subtotal: itemSubtotal,
    });
  }

  // 5. Coupon validation — FULL check (expiry + maxUses + minOrder)
  let discountAmount = 0;
  let appliedCouponCode: string | null = null;

  if (couponCode) {
    const [coupon] = await db.select().from(couponsTable).where(
      and(
        eq(couponsTable.code, couponCode.toUpperCase()),
        eq(couponsTable.isActive, true),
      ),
    );

    if (!coupon) {
      res.status(400).json({ error: "کوپن کوڈ غلط یا غیر فعال ہے۔" });
      return;
    }

    // Expiry check
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      res.status(400).json({ error: "یہ کوپن کوڈ کی میعاد ختم ہو چکی ہے۔" });
      return;
    }

    // Max uses check
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      res.status(400).json({ error: "اس کوپن کی استعمال حد پوری ہو چکی ہے۔" });
      return;
    }

    // Min order amount check
    const minAmt = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
    if (subtotal < minAmt) {
      res.status(400).json({ error: `یہ کوپن کم از کم Rs ${minAmt} کے آرڈر پر لاگو ہوتا ہے۔` });
      return;
    }

    if (coupon.discountType === "percentage") {
      discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
    } else {
      discountAmount = Math.min(Number(coupon.discountValue), subtotal);
    }
    appliedCouponCode = coupon.code;
    await db.update(couponsTable).set({ usedCount: coupon.usedCount + 1 }).where(eq(couponsTable.id, coupon.id));
  }

  const totalAmount = subtotal - discountAmount;
  const userId = req.cookies?.["bake_user_session"];

  const [order] = await db
    .insert(ordersTable)
    .values({
      ...orderData,
      userId: userId ? Number(userId) : null,
      couponCode: appliedCouponCode,
      items: orderItems,
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    })
    .returning();

  // Increment order counts
  for (const item of items) {
    await db.update(productsTable)
      .set({ orderCount: sql`order_count + ${item.quantity}` })
      .where(eq(productsTable.id, item.productId));
  }

  // Auto cash-book entry for COD orders
  await db.insert(cashBookTable).values({
    type: "in",
    description: `آرڈر #${order.id} — ${order.customerName}`,
    amount: totalAmount.toFixed(2),
    reference: `ORDER-${order.id}`,
    date: order.deliveryDate,
  });

  res.status(201).json(order);
});

// ─── PATCH /orders/:id/status — Admin only, with transitions ─────────────────
router.patch("/orders/:id/status", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const ip = (req.ip ?? req.socket.remoteAddress ?? "unknown").replace(/^::ffff:/, "");

  const parsed = z.object({ status: z.string() }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "status is required" }); return; }

  const [current] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!current) { res.status(404).json({ error: "Order not found" }); return; }

  const newStatus = parsed.data.status;
  const allowed = VALID_TRANSITIONS[current.status] ?? [];
  if (!allowed.includes(newStatus)) {
    res.status(400).json({
      error: `${current.status} سے ${newStatus} میں تبدیلی ممکن نہیں`,
      validTransitions: allowed,
    });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: newStatus })
    .where(eq(ordersTable.id, id))
    .returning();

  await auditLog(
    "order.status.changed", "order", id,
    { status: current.status }, { status: newStatus }, ip,
  );

  res.json(order);
});

export default router;
