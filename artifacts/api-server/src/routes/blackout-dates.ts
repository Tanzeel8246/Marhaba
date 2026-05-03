import { Router } from "express";
import { db } from "@workspace/db";
import { blackoutDatesTable, insertBlackoutDateSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/blackout-dates", async (req, res) => {
  const dates = await db
    .select()
    .from(blackoutDatesTable)
    .orderBy(blackoutDatesTable.date);
  res.json(dates);
});

router.post("/blackout-dates", async (req, res) => {
  const parsed = insertBlackoutDateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [entry] = await db
    .insert(blackoutDatesTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(entry);
});

router.delete("/blackout-dates/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(blackoutDatesTable).where(eq(blackoutDatesTable.id, id));
  res.status(204).send();
});

export default router;
