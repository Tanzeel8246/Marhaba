import { Router } from "express";
import { db } from "@workspace/db";
import { couponsTable, insertCouponSchema } from "@workspace/db";
import { eq, and, gt, or, isNull } from "drizzle-orm";
import { z } from "zod";

const router = Router();

router.get("/coupons", async (req, res) => {
  const coupons = await db.select().from(couponsTable);
  res.json(coupons);
});

router.post("/coupons", async (req, res) => {
  const parsed = insertCouponSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [coupon] = await db
    .insert(couponsTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(coupon);
});

router.post("/coupons/validate", async (req, res) => {
  const bodySchema = z.object({
    code: z.string(),
    orderAmount: z.number(),
  });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { code, orderAmount } = parsed.data;

  const [coupon] = await db
    .select()
    .from(couponsTable)
    .where(
      and(
        eq(couponsTable.code, code.toUpperCase()),
        eq(couponsTable.isActive, true),
        or(isNull(couponsTable.expiresAt), gt(couponsTable.expiresAt, new Date())),
      ),
    );

  if (!coupon) {
    res.json({ valid: false, coupon: null, discountAmount: 0, message: "Invalid or expired coupon code." });
    return;
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    res.json({ valid: false, coupon, discountAmount: 0, message: "This coupon has reached its usage limit." });
    return;
  }

  const minOrder = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : 0;
  if (orderAmount < minOrder) {
    res.json({
      valid: false,
      coupon,
      discountAmount: 0,
      message: `Minimum order amount of Rs. ${minOrder.toFixed(0)} required.`,
    });
    return;
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (orderAmount * Number(coupon.discountValue)) / 100;
  } else {
    discountAmount = Math.min(Number(coupon.discountValue), orderAmount);
  }

  res.json({ valid: true, coupon, discountAmount: Number(discountAmount.toFixed(2)), message: "Coupon applied!" });
});

router.delete("/coupons/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(couponsTable).where(eq(couponsTable.id, id));
  res.status(204).send();
});

export default router;
