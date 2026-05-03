import { Router } from "express";
import { db } from "@workspace/db";
import { storeSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const ADMIN_SESSION_COOKIE = "bake_admin_session";

const DEFAULT_SETTINGS: Record<string, string> = {
  whatsappNumber: "923001234567",
  storeName: "Bake Delight Pro",
  storeTagline: "Handcrafted with love. Order by WhatsApp.",
  storeAddress: "Karachi, Pakistan",
  minLeadHours: "24",
  dailyOrderLimit: "20",
};

async function getSetting(key: string): Promise<string> {
  const [row] = await db
    .select()
    .from(storeSettingsTable)
    .where(eq(storeSettingsTable.key, key));
  return row?.value ?? DEFAULT_SETTINGS[key] ?? "";
}

async function setSetting(key: string, value: string): Promise<void> {
  const existing = await db
    .select()
    .from(storeSettingsTable)
    .where(eq(storeSettingsTable.key, key));

  if (existing.length > 0) {
    await db
      .update(storeSettingsTable)
      .set({ value, updatedAt: new Date() })
      .where(eq(storeSettingsTable.key, key));
  } else {
    await db.insert(storeSettingsTable).values({ key, value });
  }
}

router.get("/settings/public", async (_req, res) => {
  try {
    const keys = ["whatsappNumber", "storeName", "storeTagline", "storeAddress", "minLeadHours", "dailyOrderLimit"];
    const settings: Record<string, string> = {};
    for (const key of keys) {
      settings[key] = await getSetting(key);
    }
    res.json(settings);
  } catch {
    res.json(DEFAULT_SETTINGS);
  }
});

router.get("/admin/settings", async (req, res) => {
  const session = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (session !== "authenticated") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const rows = await db.select().from(storeSettingsTable);
    const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    res.json({ ...DEFAULT_SETTINGS, ...stored });
  } catch {
    res.json(DEFAULT_SETTINGS);
  }
});

router.patch("/admin/settings", async (req, res) => {
  const session = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (session !== "authenticated") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const schema = z.object({
    whatsappNumber: z.string().optional(),
    storeName: z.string().optional(),
    storeTagline: z.string().optional(),
    storeAddress: z.string().optional(),
    minLeadHours: z.string().optional(),
    dailyOrderLimit: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data" });
    return;
  }

  for (const [key, value] of Object.entries(parsed.data)) {
    if (value !== undefined) {
      await setSetting(key, value);
    }
  }

  const rows = await db.select().from(storeSettingsTable);
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  res.json({ ...DEFAULT_SETTINGS, ...stored });
});

export default router;
