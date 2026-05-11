import { Router } from "express";
import { db, usersTable, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

const router = Router();
const USER_SESSION_COOKIE = "bake_user_session";

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const hashToVerify = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(hash), Buffer.from(hashToVerify));
}

router.post("/auth/register", async (req, res) => {
  const schema = z.object({
    phone: z.string(),
    name: z.string(),
    password: z.string().min(6),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid data" });

  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.phone, parsed.data.phone));
    if (existing.length > 0) return res.status(400).json({ error: "Phone number already registered" });

    const [user] = await db.insert(usersTable).values({
      phone: parsed.data.phone,
      name: parsed.data.name,
      password: hashPassword(parsed.data.password),
    }).returning();

    res.cookie(USER_SESSION_COOKIE, String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ id: user.id, name: user.name, phone: user.phone });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/auth/login", async (req, res) => {
  const schema = z.object({
    phone: z.string(),
    password: z.string(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid data" });

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.phone, parsed.data.phone));
    if (!user || !verifyPassword(parsed.data.password, user.password)) {
      return res.status(401).json({ error: "Invalid phone or password" });
    }

    res.cookie(USER_SESSION_COOKIE, String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ id: user.id, name: user.name, phone: user.phone });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/auth/logout", (req, res) => {
  res.clearCookie(USER_SESSION_COOKIE);
  res.json({ success: true });
});

router.get("/auth/me", async (req, res) => {
  const userId = req.cookies?.[USER_SESSION_COOKIE];
  if (!userId) return res.json({ authenticated: false });

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, Number(userId)));
    if (!user) return res.json({ authenticated: false });

    return res.json({ authenticated: true, user: { id: user.id, name: user.name, phone: user.phone } });
  } catch {
    return res.json({ authenticated: false });
  }
});

router.get("/auth/orders", async (req, res) => {
  const userId = req.cookies?.[USER_SESSION_COOKIE];
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const userOrders = await db.select().from(ordersTable).where(eq(ordersTable.userId, Number(userId)));
    return res.json(userOrders);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
