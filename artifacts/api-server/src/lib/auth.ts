import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";

export interface AuthenticatedRequest extends Request {
  userId?: number;
  userRole?: string;
}

function getTokenSecret(): string {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("TOKEN_SECRET env var must be set in production.");
    }
    return "dev_only_insecure_secret_change_before_deploy";
  }
  return secret;
}

export function hashPassword(password: string): string {
  const salt = process.env.PASSWORD_SALT ?? "bridgepath_salt_v1";
  return crypto.createHash("sha256").update(password + salt).digest("hex");
}

export function generateToken(userId: number): string {
  const issuedAt = Date.now();
  const payload = `${userId}:${issuedAt}`;
  const sig = crypto
    .createHmac("sha256", getTokenSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function parseToken(token: string): number | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;

    const payload = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);

    const expectedSig = crypto
      .createHmac("sha256", getTokenSecret())
      .update(payload)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return null;
    }

    const colonIdx = payload.indexOf(":");
    if (colonIdx === -1) return null;
    const userId = parseInt(payload.slice(0, colonIdx), 10);
    const issuedAt = parseInt(payload.slice(colonIdx + 1), 10);

    if (isNaN(userId) || isNaN(issuedAt)) return null;

    const TOKEN_TTL_MS = 90 * 24 * 60 * 60 * 1000;
    if (Date.now() - issuedAt > TOKEN_TTL_MS) return null;

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
    res.status(401).json({ error: "Unauthorized", message: "Invalid or expired token" });
    return;
  }

  req.userId = userId;
  next();
}
