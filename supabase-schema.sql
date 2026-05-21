-- ============================================================
-- Bridgepath Africa — Supabase / PostgreSQL Schema
-- Run this entire file in your Supabase SQL Editor to set up
-- all tables, indexes, and constraints for production.
-- ============================================================

-- Enable UUID extension (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- 1. USERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'job_seeker'
                  CHECK (role IN ('job_seeker', 'employer', 'admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users (role);

-- ─────────────────────────────────────────────
-- 2. PROFILES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio              TEXT,
  location         TEXT,
  country          TEXT,
  skills           TEXT DEFAULT '[]',
  experience       TEXT,
  education        TEXT,
  linkedin_url     TEXT,
  portfolio_url    TEXT,
  resume_url       TEXT,
  company_name     TEXT,
  company_website  TEXT,
  industry         TEXT,
  company_size     TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles (user_id);

-- ─────────────────────────────────────────────
-- 3. JOBS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id           SERIAL PRIMARY KEY,
  employer_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  requirements TEXT,
  location     TEXT NOT NULL,
  country      TEXT NOT NULL,
  type         TEXT NOT NULL DEFAULT 'full_time'
                 CHECK (type IN ('full_time', 'part_time', 'contract', 'internship', 'remote')),
  salary_min   INTEGER,
  salary_max   INTEGER,
  currency     TEXT DEFAULT 'USD',
  industry     TEXT,
  skills       TEXT DEFAULT '[]',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs (employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active   ON jobs (is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_country     ON jobs (country);
CREATE INDEX IF NOT EXISTS idx_jobs_type        ON jobs (type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at  ON jobs (created_at DESC);

-- ─────────────────────────────────────────────
-- 4. APPLICATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id           SERIAL PRIMARY KEY,
  job_id       INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  viewed_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (job_id, applicant_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job_id       ON applications (job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON applications (applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status       ON applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at   ON applications (created_at DESC);

-- ─────────────────────────────────────────────
-- 5. CV REVIEWS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cv_reviews (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cv_file_name      TEXT NOT NULL,
  cv_text           TEXT,
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'ai_processing', 'ai_complete', 'human_pending', 'human_complete', 'failed')),
  ai_review         TEXT,
  human_review      TEXT,
  payment_status    TEXT NOT NULL DEFAULT 'none'
                      CHECK (payment_status IN ('none', 'pending', 'paid', 'refunded')),
  stripe_session_id TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cv_reviews_user_id    ON cv_reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_cv_reviews_status     ON cv_reviews (status);
CREATE INDEX IF NOT EXISTS idx_cv_reviews_created_at ON cv_reviews (created_at DESC);

-- ─────────────────────────────────────────────
-- 6. CONTACT SUBMISSIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  company     TEXT,
  email       TEXT NOT NULL,
  phone       TEXT,
  type        TEXT NOT NULL DEFAULT 'General enquiry',
  message     TEXT,
  email_sent  TEXT NOT NULL DEFAULT 'pending'
                CHECK (email_sent IN ('pending', 'sent', 'failed', 'skipped')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email      ON contact_submissions (email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions (created_at DESC);

-- ─────────────────────────────────────────────
-- 7. APPLICATION FEEDBACK
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS application_feedback (
  id              SERIAL PRIMARY KEY,
  application_id  INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  employer_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  candidate_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_anonymous    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_application_id ON application_feedback (application_id);
CREATE INDEX IF NOT EXISTS idx_feedback_candidate_id   ON application_feedback (candidate_id);
CREATE INDEX IF NOT EXISTS idx_feedback_employer_id    ON application_feedback (employer_id);

-- ─────────────────────────────────────────────
-- AUTO-UPDATE updated_at TRIGGER
-- Keeps updated_at current automatically on all tables that have it
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_cv_reviews_updated_at
  BEFORE UPDATE ON cv_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Disabled here because auth is handled by the Express backend.
-- Enable per-table only if you later use Supabase client-side queries.
-- ─────────────────────────────────────────────
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cv_reviews ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE application_feedback ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- DONE — Schema created successfully
-- ─────────────────────────────────────────────
