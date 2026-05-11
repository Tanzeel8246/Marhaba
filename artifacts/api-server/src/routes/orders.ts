import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable, blackoutDatesTable, couponsTable, insertOrderSchema } from "@workspace/db";
import { eq, sql, and, desc, gte, lte } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const DAILY_ORDER_LIMIT = 20;

router.get("/orders", async (req, res) => {
  const { status, date } = req.query;
  const conditions = [];
  if (status) conditions.push(eq(ordersTable.status, status as string));
  if (date) conditions.push(eq(ordersTable.deliveryDate, date as string));

  let query = db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).$dynamic();
  if (conditions.length > 0) query = query.where(and(...conditions));

  const orders = await query;
  res.json(orders);
});

router.get("/orders/summary", async (req, res) => {
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
    .select({
      status: ordersTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.status);

  const recentOrders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt))
    .limit(5);

  res.json({
    totalOrders,
    todayOrders,
    pendingOrders,
    totalRevenue: Number(totalRevenue),
    todayRevenue: Number(todayRevenue),
    statusBreakdown,
    recentOrders,
  });
});

router.get("/orders/calendar", async (req, res) => {
  const { month } = req.query;
  let startDate: Date;
  let endDate: Date;

  if (month && typeof month === "string") {
    const [year, m] = month.split("-").map(Number);
    startDate = new Date(year, m - 1, 1);
    endDate = new Date(year, m, 0);
  } else {
    const now = new Date();
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  const startStr = startDate.toISOString().split("T")[0];
  const endStr = endDate.toISOString().split("T")[0];

  const orders = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        gte(ordersTable.deliveryDate, startStr),
        lte(ordersTable.deliveryDate, endStr),
      ),
    )
    .orderBy(ordersTable.deliveryDate);

  const grouped: Record<string, typeof orders> = {};
  for (const order of orders) {
    if (!grouped[order.deliveryDate]) grouped[order.deliveryDate] = [];
    grouped[order.deliveryDate].push(order);
  }

  const calendar = Object.entries(grouped).map(([date, orders]) => ({
    date,
    orderCount: orders.length,
    orders,
  }));

  res.json(calendar);
});

router.get("/orders/check-capacity", async (req, res) => {
  const { date, timeSlot } = req.query;
  if (!date || typeof date !== "string") {
    res.status(400).json({ error: "date is required" });
    return;
  }

  const [blackout] = await db
    .select()
    .from(blackoutDatesTable)
    .where(eq(blackoutDatesTable.date, date));

  if (blackout) {
    res.json({ available: false, remainingSlots: 0, isBlackout: true });
    return;
  }

  const [{ orderCount }] = await db
    .select({ orderCount: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(eq(ordersTable.deliveryDate, date));

  const remaining = Math.max(0, DAILY_ORDER_LIMIT - orderCount);
  res.json({
    available: remaining > 0,
    remainingSlots: remaining,
    isBlackout: false,
  });
});

router.get("/orders/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

router.post("/orders", async (req, res) => {
  const createOrderSchema = z.object({
    customerName: z.string().min(1),
    customerPhone: z.string().min(1),
    customerEmail: z.string().email().optional().nullable(),
    deliveryAddress: z.string().min(1),
    deliveryDate: z.string().min(1),
    deliveryTimeSlot: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    couponCode: z.string().optional().nullable(),
    items: z.array(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1),
        selectedVariants: z.record(z.string()),
        selectedAddons: z.array(z.string()),
        customMessage: z.string().optional().nullable(),
      }),
    ).min(1),
  });

  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { items, couponCode, ...orderData } = parsed.data;

  // Check delivery date capacity
  const [blackout] = await db
    .select()
    .from(blackoutDatesTable)
    .where(eq(blackoutDatesTable.date, orderData.deliveryDate));
  if (blackout) {
    res.status(400).json({ error: "This date is unavailable for delivery." });
    return;
  }

  // Check lead time: delivery date must be at least tomorrow (date comparison, timezone-safe)
  const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local timezone
  if (orderData.deliveryDate <= todayStr) {
    res.status(400).json({ error: "کم از کم کل کی تاریخ منتخب کریں۔" });
    return;
  }

  // Compute prices
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, item.productId));

    if (!product || !product.isAvailable) {
      res.status(400).json({ error: `Product ${item.productId} is not available.` });
      return;
    }

    let unitPrice = Number(product.basePrice);
    const variants = (product.variants as Array<{ name: string; type: string; options: Array<{ label: string; priceAdjustment: number }> }>) || [];
    for (const [variantType, selectedOption] of Object.entries(item.selectedVariants)) {
      const variant = variants.find((v) => v.type === variantType || v.name === variantType);
      if (variant) {
        const opt = variant.options.find((o) => o.label === selectedOption);
        if (opt) unitPrice += opt.priceAdjustment;
      }
    }

    const addons = (product.addons as Array<{ name: string; price: number }>) || [];
    for (const addonName of item.selectedAddons) {
      const addon = addons.find((a) => a.name === addonName);
      if (addon) unitPrice += addon.price;
    }

    const itemSubtotal = unitPrice * item.quantity;
    subtotal += itemSubtotal;

    const imageUrls = (product.imageUrls as string[]) || [];
    orderItems.push({
      productId: item.productId,
      productName: product.name,
      productImageUrl: imageUrls[0] ?? null,
      quantity: item.quantity,
      unitPrice,
      selectedVariants: item.selectedVariants,
      selectedAddons: item.selectedAddons,
      customMessage: item.customMessage ?? null,
      subtotal: itemSubtotal,
    });
  }

  // Apply coupon
  let discountAmount = 0;
  let appliedCouponCode: string | null = null;

  if (couponCode) {
    const [coupon] = await db
      .select()
      .from(couponsTable)
      .where(
        and(
          eq(couponsTable.code, couponCode.toUpperCase()),
          eq(couponsTable.isActive, true),
        ),
      );

    if (coupon) {
      if (coupon.discountType === "percentage") {
        discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
      } else {
        discountAmount = Math.min(Number(coupon.discountValue), subtotal);
      }
      appliedCouponCode = coupon.code;
      await db
        .update(couponsTable)
        .set({ usedCount: coupon.usedCount + 1 })
        .where(eq(couponsTable.id, coupon.id));
    }
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
    await db
      .update(productsTable)
      .set({ orderCount: sql`order_count + ${item.quantity}` })
      .where(eq(productsTable.id, item.productId));
  }

  res.status(201).json(order);
});

router.patch("/orders/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = z.object({ status: z.string() }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "status is required" });
    return;
  }
  const [order] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, id))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

export default router;
