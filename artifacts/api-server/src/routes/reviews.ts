import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, insertReviewSchema } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

// Public: Get approved reviews for a product
router.get("/products/:id/reviews", async (req, res) => {
  const productId = Number(req.params.id);
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(and(eq(reviewsTable.productId, productId), eq(reviewsTable.status, "approved")))
    .orderBy(reviewsTable.createdAt);
  res.json(reviews);
});

// Admin: Get all reviews (for moderation)
router.get("/admin/reviews", requireAdmin, async (req, res) => {
  const reviews = await db.select().from(reviewsTable).orderBy(desc(reviewsTable.createdAt));
  res.json(reviews);
});

// Public: Post a review (default pending)
router.post("/products/:id/reviews", async (req, res) => {
  const productId = Number(req.params.id);
  const parsed = insertReviewSchema.safeParse({ ...req.body, productId });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [review] = await db
    .insert(reviewsTable)
    .values({ ...parsed.data, status: "pending" })
    .returning();
  res.status(201).json(review);
});

// Admin: Moderate review
router.patch("/admin/reviews/:id/status", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body; // approved | rejected
  const [review] = await db
    .update(reviewsTable)
    .set({ status })
    .where(eq(reviewsTable.id, id))
    .returning();
  res.json(review);
});

// Admin: Delete review
router.delete("/admin/reviews/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
  res.status(204).send();
});

export default router;
