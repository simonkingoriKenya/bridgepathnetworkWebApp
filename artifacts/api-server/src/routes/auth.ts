import { Router } from "express";
import crypto from "crypto";
import { Resend } from "resend";
import { db, usersTable, profilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, generateToken } from "../lib/auth";
import type { AuthenticatedRequest } from "../lib/auth";
import { requireAuth } from "../lib/auth";
import { authLimiter } from "../lib/limiters";

const router = Router();

const DEMO_EMAILS = ["jobseeker@demo.bridgepath.network", "employer@demo.bridgepath.network"];
const FROM_ADDRESS = "Bridgepath Africa <onboarding@resend.dev>";

function getResend(): Resend | null {
  const k = process.env.RESEND_API_KEY;
  return k ? new Resend(k) : null;
}

function getAppBaseUrl(): string {
  if (process.env.OAUTH_BASE_URL) return process.env.OAUTH_BASE_URL;
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  return "https://bridgepathafricahr.com";
}

function generateVerificationToken(): { token: string; expiresAt: Date } {
  return {
    token: crypto.randomBytes(32).toString("hex"),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

function isPasswordStrong(pw: string): { ok: boolean; message?: string } {
  if (!pw || pw.length < 8) return { ok: false, message: "Password must be at least 8 characters" };
  if (!/[A-Za-z]/.test(pw)) return { ok: false, message: "Password must contain at least one letter" };
  if (!/[0-9]/.test(pw)) return { ok: false, message: "Password must contain at least one number" };
  return { ok: true };
}

async function sendVerificationEmail(email: string, name: string, token: string) {
  const resend = getResend();
  if (!resend) {
    console.log(`[DEV] Verification link for ${email}: ${getAppBaseUrl()}/auth/verify-email?token=${token}`);
    return;
  }
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: [email],
    subject: "Confirm your Bridgepath Africa account",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="background: #1C1917; padding: 20px 24px; border-radius: 6px 6px 0 0; margin: -24px -24px 24px;">
          <h1 style="color: #ffffff; font-size: 20px; margin: 0;">Bridgepath Africa</h1>
          <p style="color: #9CA3AF; font-size: 13px; margin: 4px 0 0;">Shaping People. Strengthening Institutions.</p>
        </div>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 15px; color: #374151; line-height: 1.6;">
          Welcome to Bridgepath Africa! Please verify your email address to activate your account.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${getAppBaseUrl()}/auth/verify-email?token=${token}"
            style="display: inline-block; background: #D94F20; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 13px; color: #9CA3AF; line-height: 1.6;">
          This link expires in 24 hours. If you did not create an account, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #9CA3AF; text-align: center;">
          Bridgepath Africa · Ghana &amp; Kenya · <a href="https://bridgepathafricahr.com" style="color: #D94F20;">bridgepathafricahr.com</a>
        </p>
      </div>`,
  });
}

function serializeUser(user: typeof usersTable.$inferSelect, profile: typeof profilesTable.$inferSelect | null) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
    oauthProvider: user.oauthProvider ?? null,
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

async function ensureProfile(userId: number, linkedinUrl?: string) {
  const existing = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId)).limit(1);
  if (existing.length > 0) {
    if (linkedinUrl) {
      await db.update(profilesTable).set({ linkedinUrl, updatedAt: new Date() }).where(eq(profilesTable.userId, userId));
      return { ...existing[0], linkedinUrl };
    }
    return existing[0];
  }
  const [profile] = await db.insert(profilesTable).values({ userId, skills: "[]", linkedinUrl: linkedinUrl ?? null }).returning();
  return profile;
}

// ── REGISTER ────────────────────────────────────────────────────────
router.post("/auth/register", authLimiter, async (req: AuthenticatedRequest, res) => {
  try {
    const { email, password, name, role, linkedinUrl } = req.body as {
      email: string; password?: string; name: string; role: string; linkedinUrl?: string;
    };

    if (!email || !name || !role) {
      res.status(400).json({ error: "Bad Request", message: "Email, name, and role are required" });
      return;
    }
    const validRoles = ["job_seeker", "employer"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: "Bad Request", message: "Invalid role" });
      return;
    }

    if (password) {
      const pwCheck = isPasswordStrong(password);
      if (!pwCheck.ok) {
        res.status(400).json({ error: "WeakPassword", message: pwCheck.message });
        return;
      }
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "EmailExists", message: "An account with this email already exists. Please sign in." });
      return;
    }

    const passwordHash = password ? hashPassword(password) : hashPassword(crypto.randomBytes(16).toString("hex"));
    const isDemo = DEMO_EMAILS.includes(email.toLowerCase());
    const { token: vToken, expiresAt: vExpires } = generateVerificationToken();

    const [user] = await db.insert(usersTable).values({
      email: email.toLowerCase(),
      passwordHash,
      name,
      role,
      emailVerified: isDemo,
      verificationToken: isDemo ? null : vToken,
      verificationTokenExpiresAt: isDemo ? null : vExpires,
    }).returning();

    await ensureProfile(user.id, linkedinUrl);

    if (!isDemo) {
      try { await sendVerificationEmail(user.email, user.name, vToken); } catch {}
      res.status(201).json({ needsVerification: true, email: user.email });
      return;
    }

    const profile = await ensureProfile(user.id);
    const authToken = generateToken(user.id);
    res.status(201).json({ user: serializeUser(user, profile), token: authToken, isNew: true });
  } catch (err) {
    req.log.error({ err }, "Error registering user");
    res.status(500).json({ error: "Internal Server Error", message: "Registration failed" });
  }
});

// ── LOGIN ────────────────────────────────────────────────────────────
router.post("/auth/login", authLimiter, async (req: AuthenticatedRequest, res) => {
  try {
    const { email, password } = req.body as { email: string; password?: string };
    if (!email) {
      res.status(400).json({ error: "Bad Request", message: "Email is required" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);

    if (!user) {
      res.status(401).json({ error: "InvalidCredentials", message: "No account found with that email. Please sign up." });
      return;
    }

    if (password) {
      const isDemo = DEMO_EMAILS.includes(user.email);
      const hashOk = isDemo ? true : verifyPassword(password, user.passwordHash);
      if (!hashOk) {
        res.status(401).json({ error: "InvalidCredentials", message: "Incorrect password." });
        return;
      }
    }

    const needsVerification = !user.emailVerified && !!user.verificationToken && !user.oauthProvider;
    if (needsVerification) {
      res.status(403).json({
        error: "EmailNotVerified",
        message: "Please verify your email before signing in. Check your inbox for a confirmation link.",
      });
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

// ── VERIFY EMAIL ─────────────────────────────────────────────────────
router.get("/auth/verify-email", async (req: AuthenticatedRequest, res) => {
  try {
    const { token } = req.query as { token?: string };
    if (!token) {
      res.status(400).json({ success: false, message: "Verification token is required" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.verificationToken, token)).limit(1);

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid or already-used verification link." });
      return;
    }
    if (user.emailVerified) {
      res.json({ success: true, alreadyVerified: true });
      return;
    }
    if (user.verificationTokenExpiresAt && user.verificationTokenExpiresAt < new Date()) {
      res.status(400).json({ success: false, message: "This verification link has expired. Please request a new one." });
      return;
    }

    await db.update(usersTable).set({
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
      updatedAt: new Date(),
    }).where(eq(usersTable.id, user.id));

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error verifying email");
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

// ── RESEND VERIFICATION ───────────────────────────────────────────────
router.post("/auth/resend-verification", authLimiter, async (req: AuthenticatedRequest, res) => {
  try {
    const { email } = req.body as { email: string };
    if (!email) { res.status(400).json({ error: "Bad Request", message: "Email required" }); return; }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (!user) { res.json({ message: "If that email is registered, a new verification link has been sent." }); return; }
    if (user.emailVerified) { res.json({ message: "Email already verified." }); return; }

    const { token: vToken, expiresAt: vExpires } = generateVerificationToken();
    await db.update(usersTable).set({ verificationToken: vToken, verificationTokenExpiresAt: vExpires, updatedAt: new Date() }).where(eq(usersTable.id, user.id));

    try { await sendVerificationEmail(user.email, user.name, vToken); } catch {}
    res.json({ message: "A new verification email has been sent." });
  } catch (err) {
    req.log.error({ err }, "Error resending verification");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ── MAGIC AUTH ────────────────────────────────────────────────────────
router.post("/auth/magic", authLimiter, async (req: AuthenticatedRequest, res) => {
  try {
    const { email, name, role } = req.body as { email: string; name?: string; role?: string };
    if (!email) { res.status(400).json({ error: "Bad Request", message: "Email is required" }); return; }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
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
    const passwordHash = hashPassword(crypto.randomBytes(16).toString("hex"));
    const [user] = await db.insert(usersTable).values({ email: email.toLowerCase(), passwordHash, name, role, emailVerified: true }).returning();
    const profile = await ensureProfile(user.id);
    const token = generateToken(user.id);
    res.status(201).json({ user: serializeUser(user, profile), token, isNew: true });
  } catch (err) {
    req.log.error({ err }, "Error with magic auth");
    res.status(500).json({ error: "Internal Server Error", message: "Authentication failed" });
  }
});

// ── PROVIDERS (feature flags for frontend) ───────────────────────────
router.get("/auth/providers", (_req, res) => {
  res.json({
    google: !!process.env.GOOGLE_CLIENT_ID,
    linkedin: !!process.env.LINKEDIN_CLIENT_ID,
    emailVerification: true,
  });
});

router.post("/auth/logout", (_req, res) => {
  res.json({ success: true, message: "Logged out" });
});

router.get("/auth/me", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId!;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (!user) { res.status(401).json({ error: "Unauthorized", message: "User not found" }); return; }
    const profile = await ensureProfile(user.id);
    res.json(serializeUser(user, profile));
  } catch (err) {
    req.log.error({ err }, "Error getting current user");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { serializeUser, serializeProfile };
export default router;
