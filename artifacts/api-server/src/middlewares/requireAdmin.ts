import { Request, Response, NextFunction } from "express";
import { createHmac } from "crypto";
import { db } from "@workspace/db";
import { auditLogsTable } from "@workspace/db";

export const ADMIN_SESSION_COOKIE = "bake_admin_session";

// ─── Session Token Verification ────────────────────────────────────────────────
export function verifyAdminToken(token: string): boolean {
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;
  const expected = createHmac("sha256", process.env.SESSION_SECRET ?? "change-me-in-production")
    .update(data)
    .digest("hex");
  return sig === expected;
}

// ─── Require Admin Middleware ───────────────────────────────────────────────────
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (!token || !verifyAdminToken(token)) {
    res.status(401).json({ error: "Unauthorized — Admin login required" });
    return;
  }
  next();
}

// ─── Require Admin for Mutating Ops, Allow Public GET ──────────────────────────
export function requireAdminForWrite(req: Request, res: Response, next: NextFunction): void {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }
  requireAdmin(req, res, next);
}

// ─── Audit Logger ──────────────────────────────────────────────────────────────
export async function auditLog(
  action: string,
  entityType: string,
  entityId: number | null,
  oldValue: unknown,
  newValue: unknown,
  ip: string
): Promise<void> {
  try {
    await db.insert(auditLogsTable).values({
      action,
      entityType,
      entityId,
      oldValue: oldValue as any,
      newValue: newValue as any,
      ip,
    });
  } catch {
    // audit logging should never crash the main flow
  }
}
