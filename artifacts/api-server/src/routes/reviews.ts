import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable, insertReviewSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/products/:id/reviews", async (req, res) => {
  const productId = Number(req.params.id);
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, productId))
    .orderBy(reviewsTable.createdAt);
  res.json(reviews);
});

router.post("/products/:id/reviews", async (req, res) => {
  const productId = Number(req.params.id);
  const parsed = insertReviewSchema.safeParse({ ...req.body, productId });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [review] = await db
    .insert(reviewsTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(review);
});

export default router;
