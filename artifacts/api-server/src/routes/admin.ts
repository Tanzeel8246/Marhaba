import { Router } from "express";
import { z } from "zod";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { requireAdmin, ADMIN_SESSION_COOKIE } from "../middlewares/requireAdmin";
import { auditLog } from "../middlewares/requireAdmin";

const router = Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SESSION_SECRET = process.env.SESSION_SECRET ?? "change-me-in-production";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

/** Generate a signed session token: base64data.hmac */
function createSessionToken(): string {
  const data = randomBytes(32).toString("hex");
  const sig = createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
  return `${data}.${sig}`;
}

/** Verify a signed session token (constant-time comparison) */
function verifySessionToken(token: string): boolean {
  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return false;
  const data = token.substring(0, dotIdx);
  const sig  = token.substring(dotIdx + 1);
  const expected = createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

// ─── Login Attempt Tracker (in-memory, production → Redis) ────────────────────
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; remainingMs: number } {
  const now = Date.now();
  let rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    rec = { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(ip, rec);
  }
  if (rec.count >= MAX_ATTEMPTS) {
    return { allowed: false, remainingMs: rec.resetAt - now };
  }
  return { allowed: true, remainingMs: 0 };
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  let rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    rec = { count: 0, resetAt: now + WINDOW_MS };
  }
  rec.count += 1;
  attempts.set(ip, rec);
}

function clearAttempts(ip: string): void {
  attempts.delete(ip);
}

// ─── POST /admin/login ────────────────────────────────────────────────────────
router.post("/admin/login", async (req, res) => {
  const ip = (req.ip ?? req.socket.remoteAddress ?? "unknown").replace(/^::ffff:/, "");

  // Rate limit check
  const { allowed, remainingMs } = checkRateLimit(ip);
  if (!allowed) {
    const mins = Math.ceil(remainingMs / 60000);
    res.status(429).json({
      success: false,
      message: `بہت زیادہ ناکام کوششیں۔ ${mins} منٹ بعد دوبارہ کوشش کریں۔`,
    });
    return;
  }

  const parsed = z.object({ password: z.string() }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Password required." });
    return;
  }

  const inputPassword = parsed.data.password.trim();
  const expectedPassword = ADMIN_PASSWORD.trim();
  const match = inputPassword === expectedPassword;

  // Extra Debug logs
  console.log(`[Login Debug] IP: ${ip}`);
  console.log(`[Login Debug] Input: ${inputPassword.length} chars, Expected: ${expectedPassword.length} chars`);
  console.log(`[Login Debug] Match Result: ${match}`);
  console.log(`[Login Debug] Expected password starts with: ${expectedPassword.substring(0, 1)}...`);


  if (!match) {
    recordFailedAttempt(ip);
    await auditLog("admin.login.failed", "auth", null, null, { ip }, ip);
    res.status(401).json({ success: false, message: "غلط پاسورڈ۔" });
    return;
  }

  // Success — issue signed token
  clearAttempts(ip);
  const token = createSessionToken();

  res.cookie(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: true,
    maxAge: 8 * 60 * 60 * 1000,
  });

  await auditLog("admin.login.success", "auth", null, null, { ip }, ip);
  res.json({ success: true, message: "کامیابی سے لاگن ہو گئے۔" });
});

// ─── POST /admin/logout ───────────────────────────────────────────────────────
router.post("/admin/logout", requireAdmin, async (req, res) => {
  const ip = (req.ip ?? req.socket.remoteAddress ?? "unknown").replace(/^::ffff:/, "");
  res.clearCookie(ADMIN_SESSION_COOKIE);
  await auditLog("admin.logout", "auth", null, null, { ip }, ip);
  res.json({ success: true, message: "لاگ آؤٹ ہو گئے۔" });
});

// ─── GET /admin/me ────────────────────────────────────────────────────────────
router.get("/admin/me", (req, res) => {
  const token = req.cookies?.[ADMIN_SESSION_COOKIE];
  res.json({ authenticated: !!token && verifySessionToken(token) });
});

export default router;
