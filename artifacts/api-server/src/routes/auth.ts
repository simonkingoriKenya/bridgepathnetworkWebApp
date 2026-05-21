import { Router } from "express";
import { db, usersTable, profilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, generateToken } from "../lib/auth";
import type { AuthenticatedRequest } from "../lib/auth";
import { requireAuth } from "../lib/auth";
import { authLimiter } from "../lib/limiters";

const router = Router();

function serializeUser(user: typeof usersTable.$inferSelect, profile: typeof profilesTable.$inferSelect | null) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    profile: profile ? serializeProfile(profile) : null,
  };
}

function serializeProfile(profile: typeof profilesTable.$inferSelect) {
  return {
    id: profile.id,
    userId: profile.userId,
    bio: profile.bio ?? null,
    location: profile.location ?? null,
    country: profile.country ?? null,
    skills: JSON.parse(profile.skills ?? "[]") as string[],
    experience: profile.experience ?? null,
    education: profile.education ?? null,
    linkedinUrl: profile.linkedinUrl ?? null,
    portfolioUrl: profile.portfolioUrl ?? null,
    resumeUrl: profile.resumeUrl ?? null,
    companyName: profile.companyName ?? null,
    companyWebsite: profile.companyWebsite ?? null,
    industry: profile.industry ?? null,
    companySize: profile.companySize ?? null,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

async function ensureProfile(userId: number) {
  const existing = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  const [profile] = await db.insert(profilesTable).values({ userId, skills: "[]" }).returning();
  return profile;
}

// REGISTER — email + password + name + role
router.post("/auth/register", authLimiter, async (req: AuthenticatedRequest, res) => {
  try {
    const { email, password, name, role } = req.body as {
      email: string; password?: string; name: string; role: string;
    };

    if (!email || !name || !role) {
      res.status(400).json({ error: "Bad Request", message: "Email, name, and role are required" });
      return;
    }

    const validRoles = ["job_seeker", "employer", "admin"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: "Bad Request", message: "Invalid role" });
      return;
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      // Email exists — just log them in (demo mode)
      const user = existing[0];
      const profile = await ensureProfile(user.id);
      const token = generateToken(user.id);
      res.status(200).json({ user: serializeUser(user, profile), token, isNew: false });
      return;
    }

    const passwordHash = password ? hashPassword(password) : hashPassword(email + "_demo_" + Date.now());
    const [user] = await db.insert(usersTable).values({ email, passwordHash, name, role }).returning();
    const profile = await ensureProfile(user.id);
    const token = generateToken(user.id);

    res.status(201).json({ user: serializeUser(user, profile), token, isNew: true });
  } catch (err) {
    req.log.error({ err }, "Error registering user");
    res.status(500).json({ error: "Internal Server Error", message: "Registration failed" });
  }
});

// LOGIN — accepts any email+password (demo mode: no password check)
router.post("/auth/login", authLimiter, async (req: AuthenticatedRequest, res) => {
  try {
    const { email, password } = req.body as { email: string; password?: string };

    if (!email) {
      res.status(400).json({ error: "Bad Request", message: "Email is required" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    if (!user) {
      // Auto-create demo account for unknown emails
      const name = email.split("@")[0].replace(/[^a-zA-Z\s]/g, " ").replace(/\s+/g, " ").trim() || "Demo User";
      const role = "job_seeker";
      const passwordHash = hashPassword(email + "_demo_" + Date.now());
      const [newUser] = await db.insert(usersTable).values({ email, passwordHash, name, role }).returning();
      const profile = await ensureProfile(newUser.id);
      const token = generateToken(newUser.id);
      res.status(201).json({ user: serializeUser(newUser, profile), token, isNew: true });
      return;
    }

    const profile = await ensureProfile(user.id);
    const token = generateToken(user.id);
    res.json({ user: serializeUser(user, profile), token });
  } catch (err) {
    req.log.error({ err }, "Error logging in");
    res.status(500).json({ error: "Internal Server Error", message: "Login failed" });
  }
});

// MAGIC AUTH — email only (or email + name + role for new accounts)
router.post("/auth/magic", authLimiter, async (req: AuthenticatedRequest, res) => {
  try {
    const { email, name, role } = req.body as { email: string; name?: string; role?: string };

    if (!email) {
      res.status(400).json({ error: "Bad Request", message: "Email is required" });
      return;
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    if (existing.length > 0) {
      const user = existing[0];
      const profile = await ensureProfile(user.id);
      const token = generateToken(user.id);
      res.json({ user: serializeUser(user, profile), token, isNew: false });
      return;
    }

    if (!name || !role) {
      res.status(400).json({ error: "Bad Request", message: "Name and role required for new account" });
      return;
    }

    if (!["job_seeker", "employer"].includes(role)) {
      res.status(400).json({ error: "Bad Request", message: "Invalid role" });
      return;
    }

    const passwordHash = hashPassword(email + "_magic_" + Date.now());
    const [user] = await db.insert(usersTable).values({ email, passwordHash, name, role }).returning();
    const profile = await ensureProfile(user.id);
    const token = generateToken(user.id);

    res.status(201).json({ user: serializeUser(user, profile), token, isNew: true });
  } catch (err) {
    req.log.error({ err }, "Error with magic auth");
    res.status(500).json({ error: "Internal Server Error", message: "Authentication failed" });
  }
});

router.post("/auth/logout", (_req, res) => {
  res.json({ success: true, message: "Logged out" });
});

router.get("/auth/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "User not found" });
      return;
    }

    const profile = await ensureProfile(user.id);
    res.json(serializeUser(user, profile));
  } catch (err) {
    req.log.error({ err }, "Error getting current user");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { serializeUser, serializeProfile };
export default router;
