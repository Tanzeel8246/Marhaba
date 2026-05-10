import { Router } from "express";
import { db } from "@workspace/db";
import { storeSettingsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const ADMIN_SESSION_COOKIE = "bake_admin_session";

const DEFAULT_SETTINGS: Record<string, string> = {
  whatsappNumber: "923001234567",
  storeName: "مرحبا سویٹس اینڈ بیکرز",
  storeTagline: "Handcrafted with love. Order by WhatsApp.",
  storeAddress: "مین روڈ فروکہ، تحصیل ساہیوال، ضلع سرگودھا",
  deliveryCharges: "300",
  minLeadHours: "24",
  dailyOrderLimit: "20",
  jazzcashDetails: "0300-1234567 (Ali Ahmed)",
  easypaisaDetails: "0321-7654321 (Ali Ahmed)",
  bankDetails: "HBL: 1234-5678-9012-3456 (Marhaba Bakers)",
};

async function getSetting(key: string): Promise<string> {
  const [row] = await db
    .select()
    .from(storeSettingsTable)
    .where(eq(storeSettingsTable.key, key));
  return row?.value ?? DEFAULT_SETTINGS[key] ?? "";
}

async function setSetting(key: string, value: string): Promise<void> {
  await db.insert(storeSettingsTable)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: storeSettingsTable.key,
      set: { value, updatedAt: new Date() }
    });
}

router.get("/settings/public", async (_req, res) => {
  try {
    const keys = ["whatsappNumber", "storeName", "storeTagline", "storeAddress", "deliveryCharges", "minLeadHours", "dailyOrderLimit", "jazzcashDetails", "easypaisaDetails", "bankDetails"];
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

  try {
    const data = req.body;
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        await setSetting(key, value);
      }
    }

    const rows = await db.select().from(storeSettingsTable);
    const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const response = { ...DEFAULT_SETTINGS, ...stored };
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
