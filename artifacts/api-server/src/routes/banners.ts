import { Router } from "express";
import { db } from "@workspace/db";
import { bannersTable, insertBannerSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

router.get("/banners", async (req, res) => {
  const banners = await db
    .select()
    .from(bannersTable)
    .orderBy(bannersTable.sortOrder);
  res.json(banners);
});

router.post("/banners", requireAdmin, async (req, res) => {
  const parsed = insertBannerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [banner] = await db
    .insert(bannersTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(banner);
});

router.put("/banners/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertBannerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [banner] = await db
    .update(bannersTable)
    .set(parsed.data)
    .where(eq(bannersTable.id, id))
    .returning();
  if (!banner) {
    res.status(404).json({ error: "Banner not found" });
    return;
  }
  res.json(banner);
});

router.delete("/banners/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(bannersTable).where(eq(bannersTable.id, id));
  res.status(204).send();
});

export default router;
