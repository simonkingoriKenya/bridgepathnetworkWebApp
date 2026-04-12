import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";

export interface AuthenticatedRequest extends Request {
  userId?: number;
  userRole?: string;
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "bridgepath_salt").digest("hex");
}

export function generateToken(userId: number): string {
  const payload = `${userId}:${Date.now()}:${Math.random()}`;
  return Buffer.from(payload).toString("base64");
}

export function parseToken(token: string): number | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    const userId = parseInt(parts[0], 10);
    if (isNaN(userId)) return null;
    return userId;
  } catch {
    return null;
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized", message: "No token provided" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  const userId = parseToken(token);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
    return;
  }

  req.userId = userId;
  next();
}
