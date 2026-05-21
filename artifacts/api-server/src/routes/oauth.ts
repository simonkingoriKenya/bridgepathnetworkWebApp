import { Router } from "express";
import crypto from "crypto";
import { db, usersTable, profilesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { generateToken, hashPassword } from "../lib/auth";
import type { AuthenticatedRequest } from "../lib/auth";

const router = Router();

function getAppBaseUrl(): string {
  if (process.env.OAUTH_BASE_URL) return process.env.OAUTH_BASE_URL;
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  return "https://bridgepathafricahr.com";
}

const pendingStates = new Map<string, { role?: string; expiresAt: number }>();
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of pendingStates) {
    if (v.expiresAt < now) pendingStates.delete(k);
  }
}, 5 * 60 * 1000);

function makeState(role?: string): string {
  const state = crypto.randomBytes(20).toString("hex");
  pendingStates.set(state, { role, expiresAt: Date.now() + 10 * 60 * 1000 });
  return state;
}

function consumeState(state: string): { role?: string } | null {
  const data = pendingStates.get(state);
  if (!data || data.expiresAt < Date.now()) return null;
  pendingStates.delete(state);
  return data;
}

async function ensureProfile(userId: number, linkedinUrl?: string) {
  const existing = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId)).limit(1);
  if (existing.length > 0) {
    if (linkedinUrl) {
      await db.update(profilesTable)
        .set({ linkedinUrl, updatedAt: new Date() })
        .where(eq(profilesTable.userId, userId));
    }
    return;
  }
  await db.insert(profilesTable).values({ userId, skills: "[]", linkedinUrl: linkedinUrl ?? null });
}

async function findOrCreateOAuthUser(params: {
  email: string;
  name: string;
  oauthProvider: string;
  oauthId: string;
  role?: string;
  linkedinUrl?: string;
}) {
  const { email, name, oauthProvider, oauthId, role = "job_seeker", linkedinUrl } = params;

  const byOAuth = await db.select().from(usersTable)
    .where(and(eq(usersTable.oauthProvider, oauthProvider), eq(usersTable.oauthId, oauthId)))
    .limit(1);

  if (byOAuth.length > 0) {
    await ensureProfile(byOAuth[0].id, linkedinUrl);
    return byOAuth[0];
  }

  const byEmail = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (byEmail.length > 0) {
    await db.update(usersTable)
      .set({ oauthProvider, oauthId, emailVerified: true, updatedAt: new Date() })
      .where(eq(usersTable.id, byEmail[0].id));
    await ensureProfile(byEmail[0].id, linkedinUrl);
    return byEmail[0];
  }

  const passwordHash = hashPassword(crypto.randomBytes(32).toString("hex"));
  const [user] = await db.insert(usersTable).values({
    email,
    passwordHash,
    name,
    role,
    emailVerified: true,
    oauthProvider,
    oauthId,
  }).returning();
  await ensureProfile(user.id, linkedinUrl);
  return user;
}

function oauthErrorRedirect(res: any, msg: string) {
  return res.redirect(`/auth/login?error=${encodeURIComponent(msg)}`);
}

// ──────────────────────────────────────
// GOOGLE OAuth 2.0
// ──────────────────────────────────────

router.get("/auth/google", (req: AuthenticatedRequest, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) { res.status(503).json({ error: "Google OAuth not configured" }); return; }

  const role = (req.query.role as string) || "job_seeker";
  const state = makeState(role);
  const redirectUri = `${getAppBaseUrl()}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account",
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get("/auth/google/callback", async (req: AuthenticatedRequest, res) => {
  try {
    const { code, state, error } = req.query as Record<string, string>;

    if (error) return oauthErrorRedirect(res, "Google sign-in was cancelled.");
    if (!code || !state) return oauthErrorRedirect(res, "Invalid OAuth response.");

    const stateData = consumeState(state);
    if (!stateData) return oauthErrorRedirect(res, "OAuth state expired — please try again.");

    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = `${getAppBaseUrl()}/api/auth/google/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }),
    });

    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
    if (!tokenData.access_token) return oauthErrorRedirect(res, "Failed to get Google access token.");

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json() as { id: string; email: string; name: string };

    if (!googleUser.email) return oauthErrorRedirect(res, "Could not get email from Google.");

    const user = await findOrCreateOAuthUser({
      email: googleUser.email.toLowerCase(),
      name: googleUser.name || googleUser.email.split("@")[0],
      oauthProvider: "google",
      oauthId: googleUser.id,
      role: stateData.role,
    });

    const token = generateToken(user.id);
    res.redirect(`/auth/oauth/callback?token=${encodeURIComponent(token)}&role=${encodeURIComponent(user.role)}`);
  } catch (err) {
    req.log.error({ err }, "Google OAuth callback error");
    return oauthErrorRedirect(res, "Google sign-in failed. Please try again.");
  }
});

// ──────────────────────────────────────
// LINKEDIN OAuth 2.0 (OpenID Connect)
// ──────────────────────────────────────

router.get("/auth/linkedin", (req: AuthenticatedRequest, res) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) { res.status(503).json({ error: "LinkedIn OAuth not configured" }); return; }

  const role = (req.query.role as string) || "job_seeker";
  const state = makeState(role);
  const redirectUri = `${getAppBaseUrl()}/api/auth/linkedin/callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: "openid profile email r_liteprofile",
  });

  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
});

router.get("/auth/linkedin/callback", async (req: AuthenticatedRequest, res) => {
  try {
    const { code, state, error } = req.query as Record<string, string>;

    if (error) return oauthErrorRedirect(res, "LinkedIn sign-in was cancelled.");
    if (!code || !state) return oauthErrorRedirect(res, "Invalid OAuth response.");

    const stateData = consumeState(state);
    if (!stateData) return oauthErrorRedirect(res, "OAuth state expired — please try again.");

    const clientId = process.env.LINKEDIN_CLIENT_ID!;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
    const redirectUri = `${getAppBaseUrl()}/api/auth/linkedin/callback`;

    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri, client_id: clientId, client_secret: clientSecret }),
    });
    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };
    if (!tokenData.access_token) return oauthErrorRedirect(res, "Failed to get LinkedIn access token.");

    const accessToken = tokenData.access_token;

    const userInfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const liUser = await userInfoRes.json() as { sub?: string; email?: string; name?: string; given_name?: string; family_name?: string };

    let linkedinUrl: string | undefined;
    try {
      const profileRes = await fetch("https://api.linkedin.com/v2/me?projection=(id,vanityName,localizedFirstName,localizedLastName)", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await profileRes.json() as { vanityName?: string };
      if (profile.vanityName) {
        linkedinUrl = `https://www.linkedin.com/in/${profile.vanityName}`;
      }
    } catch {}

    const email = liUser.email;
    if (!email) return oauthErrorRedirect(res, "Could not get email from LinkedIn.");

    const name = liUser.name || `${liUser.given_name ?? ""} ${liUser.family_name ?? ""}`.trim() || email.split("@")[0];
    const oauthId = liUser.sub ?? email;

    const user = await findOrCreateOAuthUser({
      email: email.toLowerCase(),
      name,
      oauthProvider: "linkedin",
      oauthId,
      role: stateData.role,
      linkedinUrl,
    });

    const token = generateToken(user.id);
    res.redirect(`/auth/oauth/callback?token=${encodeURIComponent(token)}&role=${encodeURIComponent(user.role)}`);
  } catch (err) {
    req.log.error({ err }, "LinkedIn OAuth callback error");
    return oauthErrorRedirect(res, "LinkedIn sign-in failed. Please try again.");
  }
});

export default router;
