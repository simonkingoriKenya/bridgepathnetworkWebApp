#!/usr/bin/env node
/**
 * Bridgepath Africa — End-to-End API Smoke Test
 * Run: node scripts/smoke-test.mjs
 * Requires: backend running on http://localhost:8080
 */

const BASE = "http://localhost:8080/api";
let pass = 0;
let fail = 0;

const EMPLOYER_EMAIL = "smoke-employer@bridgepathnetwork.com";
const SEEKER_EMAIL   = "smoke-jobseeker@bridgepathnetwork.com";
const PASSWORD       = "SmokeTest123!";

let employerToken = "";
let seekerToken   = "";
let seekerId      = 0;
let employerId    = 0;
let createdJobId  = 0;
let applicationId = 0;
let cvReviewId    = 0;

async function req(method, path, body, token) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  try {
    const res = await fetch(`${BASE}${path}`, opts);
    const json = await res.json().catch(() => ({}));
    return { status: res.status, json };
  } catch (e) {
    return { status: 0, json: { error: e.message } };
  }
}

function check(name, status, expected, json, extraCheck) {
  const ok = status === expected && (!extraCheck || extraCheck(json));
  if (ok) {
    console.log(`  ✅  ${name}`);
    pass++;
  } else {
    console.log(`  ❌  ${name} — got ${status} (expected ${expected}) ${JSON.stringify(json).slice(0, 120)}`);
    fail++;
  }
  return ok;
}

// ── AUTH ─────────────────────────────────────────────────────────────────────
console.log("\n── Auth ──────────────────────────────────────────────────────────");

{
  const unique = `test-${Date.now()}@smoke.example.com`;
  const r = await req("POST", "/auth/register", { email: unique, password: "SmokeTest123!", name: "Smoke Test", role: "job_seeker" });
  check("POST /auth/register (new user)", r.status, 201, r.json);
}

{
  const r = await req("POST", "/auth/register", { email: EMPLOYER_EMAIL, password: PASSWORD, name: "Kofi Mensah", role: "employer" });
  check("POST /auth/register (duplicate email → 409)", r.status, 409, r.json);
}

{
  const r = await req("POST", "/auth/login", { email: EMPLOYER_EMAIL, password: PASSWORD });
  if (check("POST /auth/login (employer)", r.status, 200, r.json, j => !!j.token)) {
    employerToken = r.json.token;
    employerId = r.json.user?.id;
  }
}

{
  const r = await req("POST", "/auth/login", { email: SEEKER_EMAIL, password: PASSWORD });
  if (check("POST /auth/login (job seeker)", r.status, 200, r.json, j => !!j.token)) {
    seekerToken = r.json.token;
    seekerId = r.json.user?.id;
  }
}

{
  const r = await req("POST", "/auth/login", { email: EMPLOYER_EMAIL, password: "wrongpass" });
  check("POST /auth/login (wrong password → 401)", r.status, 401, r.json);
}

{
  const r = await req("GET", "/auth/me", null, seekerToken);
  check("GET /auth/me (job seeker)", r.status, 200, r.json, j => j.id === seekerId);
}

{
  const r = await req("GET", "/auth/me", null, employerToken);
  check("GET /auth/me (employer)", r.status, 200, r.json, j => j.id === employerId);
}

{
  const r = await req("GET", "/auth/me", null, "bad-token");
  check("GET /auth/me (bad token → 401)", r.status, 401, r.json);
}

{
  const r = await req("GET", "/auth/providers", null);
  check("GET /auth/providers", r.status, 200, r.json);
}

{
  const r = await req("POST", "/auth/forgot-password", { email: SEEKER_EMAIL });
  check("POST /auth/forgot-password", r.status, 200, r.json);
}

{
  const r = await req("POST", "/auth/magic-link", { email: SEEKER_EMAIL });
  check("POST /auth/magic-link", r.status, 200, r.json);
}

// ── JOBS ─────────────────────────────────────────────────────────────────────
console.log("\n── Jobs ──────────────────────────────────────────────────────────");

{
  const r = await req("GET", "/jobs");
  check("GET /jobs (public, no auth)", r.status, 200, r.json, j => Array.isArray(j.jobs ?? j));
}

{
  const r = await req("GET", "/jobs?search=engineer");
  check("GET /jobs?search=engineer", r.status, 200, r.json);
}

{
  const r = await req("GET", "/jobs?country=Ghana");
  check("GET /jobs?country=Ghana", r.status, 200, r.json);
}

{
  const r = await req("POST", "/jobs", {
    title: "Smoke Test Role",
    description: "This is a smoke-test job. Please ignore.",
    location: "Accra",
    country: "Ghana",
    type: "full_time",
    industry: "Technology",
    salaryMin: 30000,
    salaryMax: 50000,
    currency: "USD",
    skills: ["TypeScript"],
  }, employerToken);
  if (check("POST /jobs (employer creates job)", r.status, 201, r.json, j => !!j.id)) {
    createdJobId = r.json.id;
  }
}

{
  const r = await req("POST", "/jobs", { title: "Unauthorized" }, seekerToken);
  check("POST /jobs (job seeker → 403)", r.status, 403, r.json);
}

if (createdJobId) {
  const r = await req("GET", `/jobs/${createdJobId}`);
  check(`GET /jobs/${createdJobId}`, r.status, 200, r.json, j => j.id === createdJobId);
}

if (createdJobId) {
  const r = await req("PUT", `/jobs/${createdJobId}`, { title: "Smoke Test Role (Updated)" }, employerToken);
  check(`PUT /jobs/${createdJobId} (employer updates job)`, r.status, 200, r.json);
}

// ── APPLICATIONS ──────────────────────────────────────────────────────────────
console.log("\n── Applications ──────────────────────────────────────────────────");

if (createdJobId) {
  const r = await req("POST", "/applications", {
    jobId: createdJobId,
    coverLetter: "This is a smoke test application. I am highly interested in this role.",
  }, seekerToken);
  if (check("POST /applications (job seeker applies)", r.status, 201, r.json, j => !!j.id)) {
    applicationId = r.json.id;
  }
}

{
  const r = await req("GET", "/applications/my", null, seekerToken);
  check("GET /applications/my (job seeker)", r.status, 200, r.json, j => Array.isArray(j));
}

if (createdJobId) {
  const r = await req("GET", `/jobs/${createdJobId}/applications`, null, employerToken);
  check(`GET /jobs/${createdJobId}/applications (employer)`, r.status, 200, r.json, j => Array.isArray(j));
}

if (applicationId) {
  const r = await req("PUT", `/applications/${applicationId}/status`, { status: "shortlisted" }, employerToken);
  check(`PUT /applications/${applicationId}/status → shortlisted`, r.status, 200, r.json);
}

// ── PROFILES ─────────────────────────────────────────────────────────────────
console.log("\n── Profiles ──────────────────────────────────────────────────────");

if (seekerId) {
  const r = await req("GET", `/profiles/${seekerId}`, null, seekerToken);
  check(`GET /profiles/${seekerId}`, r.status, 200, r.json);
}

if (seekerId) {
  const r = await req("PUT", `/profiles/${seekerId}`, { bio: "Updated via smoke test." }, seekerToken);
  check(`PUT /profiles/${seekerId}`, r.status, 200, r.json);
}

// ── CV REVIEWS ────────────────────────────────────────────────────────────────
console.log("\n── CV Reviews ────────────────────────────────────────────────────");

{
  const r = await req("POST", "/cv-reviews", {
    cvFileName: "kwame-asante-cv.pdf",
    cvText: `Kwame Asante\nSenior Software Engineer\n\nExperience:\n- 6 years building fintech APIs in Node.js and TypeScript\n- Led team of 4 engineers at Hubtel\n- Built payment integrations for MTN Mobile Money\n\nEducation: BSc Computer Science, University of Ghana\n\nSkills: TypeScript, Node.js, React, PostgreSQL, AWS`,
  }, seekerToken);
  if (check("POST /cv-reviews (AI analysis)", r.status, 201, r.json, j => !!j.id)) {
    cvReviewId = r.json.id;
  }
}

{
  const r = await req("GET", "/cv-reviews/my", null, seekerToken);
  check("GET /cv-reviews/my", r.status, 200, r.json, j => Array.isArray(j));
}

if (cvReviewId) {
  const r = await req("GET", `/cv-reviews/${cvReviewId}`, null, seekerToken);
  check(`GET /cv-reviews/${cvReviewId}`, r.status, 200, r.json, j => j.id === cvReviewId);
}

// ── STATS ─────────────────────────────────────────────────────────────────────
console.log("\n── Stats ─────────────────────────────────────────────────────────");

{
  const r = await req("GET", "/stats/dashboard", null, employerToken);
  check("GET /stats/dashboard (employer)", r.status, 200, r.json);
}

{
  const r = await req("GET", "/stats/dashboard", null, seekerToken);
  check("GET /stats/dashboard (job seeker)", r.status, 200, r.json);
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
console.log("\n── Contact ───────────────────────────────────────────────────────");

{
  const r = await req("POST", "/contact", {
    name: "Smoke Test",
    email: "smoke@example.com",
    type: "General enquiry",
    message: "This is a smoke test submission.",
  });
  check("POST /contact", r.status, 201, r.json, j => j.success === true);
}

// ── OG IMAGE ──────────────────────────────────────────────────────────────────
console.log("\n── OG Image ──────────────────────────────────────────────────────");

{
  const r = await fetch("http://localhost:8080/og-image");
  check("GET /og-image", r.status, 200, {}, () => r.headers.get("content-type")?.startsWith("image/"));
}

// ── CLEANUP ────────────────────────────────────────────────────────────────────
if (createdJobId && employerToken) {
  await req("DELETE", `/jobs/${createdJobId}`, null, employerToken);
}

// ── SUMMARY ────────────────────────────────────────────────────────────────────
console.log("\n══════════════════════════════════════════════════════════════════");
console.log(`  Total: ${pass + fail}  |  Passed: ${pass}  |  Failed: ${fail}`);
console.log("══════════════════════════════════════════════════════════════════\n");

if (fail > 0) process.exit(1);
