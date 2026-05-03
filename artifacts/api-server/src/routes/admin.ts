import { Router } from "express";
import { z } from "zod";

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const ADMIN_SESSION_COOKIE = "bake_admin_session";

router.post("/admin/login", async (req, res) => {
  const parsed = z.object({ password: z.string() }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Password required." });
    return;
  }
  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ success: false, message: "Incorrect password." });
    return;
  }
  res.cookie(ADMIN_SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ success: true, message: "Logged in successfully." });
});

router.post("/admin/logout", async (req, res) => {
  res.clearCookie(ADMIN_SESSION_COOKIE);
  res.json({ success: true, message: "Logged out." });
});

router.get("/admin/me", async (req, res) => {
  const session = req.cookies?.[ADMIN_SESSION_COOKIE];
  res.json({ authenticated: session === "authenticated" });
});

export default router;
