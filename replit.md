# Bridgepath Network

## Overview

A premium hiring platform connecting global employers with Africa's best talent. Built as a full-stack React + Vite + Express application with Supabase email/password auth, comprehensive service pages, legal pages, and interactive dashboards.

## Brand Colors
- **Green** (primary): `#8CC63F`
- **Dark** (secondary): `#1a2340`

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19 + Vite + TailwindCSS v4 + ShadCN UI + Framer Motion
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **AI**: OpenAI via Replit AI Integrations (no API key needed)
- **Build**: esbuild

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Project Structure

- `artifacts/bridgepath/` — React frontend (landing page, dashboards, CV review, jobs, services, about)
- `artifacts/api-server/` — Express backend (auth, jobs, applications, CV reviews, payments, stats)
- `lib/db/` — Drizzle schema (users, profiles, jobs, applications, cv_reviews)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod schemas

## Features

1. **Landing page** (`/`) — Hero, services grid, Africa map, testimonials, stats, contact form, news, FAQ
2. **Supabase Auth** — Email/password signup and login with confirmation callback, role persistence, and optional magic-link fallback.
3. **Services overview** (`/services`) — Grid of all 9 HR services with links to detail pages
4. **Service detail pages** (`/services/:slug`) — Rich pages with hero, stats, benefits, process steps, FAQs for each of 9 services
5. **About page** (`/about`) — Company story, timeline, team, values
6. **Job Seeker Dashboard** (`/dashboard/jobseeker`) — Application tracking, AI CV review CTA, mock data
7. **Employer Dashboard** (`/dashboard/employer`) — Job postings, applicant funnel, analytics charts
8. **Jobs Listing** (`/jobs`) — Search, filter by location and type, 12 mock jobs
9. **AI CV Review** (`/cv-review`) — Free AI analysis via OpenAI
10. **Human HR Review** — Paid $20 upgrade via Stripe (Stripe not connected)
11. **BackToTop** — Global floating button on all pages (triggers at 400px scroll)
12. **ChatSupport** — Floating chat widget with auto-replies and quick options
13. **Legal pages** — `/privacy`, `/terms`, and `/cookies` linked from the footer

## Auth Flow

- Signup uses Supabase `signUp` with email, password, full name, and role metadata.
- Email confirmation lands on `/auth/callback`, exchanges Supabase auth codes for a session, upserts the profile, and routes by role.
- Login uses Supabase email/password as the primary flow, with magic-link fallback still available.
- Role and display name are persisted locally as a fallback for callback routing and dashboard personalization.
- Supabase environment variables should be set in production as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Services (9 slugs)

| Slug | Label |
|------|-------|
| `employment-of-record` | Employment of Record |
| `secondment-services` | Secondment Services |
| `expatriate-services` | Expatriate Services |
| `hr-consultancy` | HR Consultancy |
| `payroll-tax` | Payroll & Tax Administration |
| `psychometric-assessments` | Psychometric Assessments |
| `recruitment-services` | Recruitment Services |
| `staff-outsourcing` | Staff Outsourcing |
| `interim-management` | Interim Management |

## Global Components

- `BackToTop` — `/src/components/ui/BackToTop.tsx`
- `ChatSupport` — `/src/components/ui/ChatSupport.tsx`
- Both mounted in `App.tsx` outside the router, always visible

## Navbar

- Top bar with social links + contact info + "Become a Member"
- Main nav with Services dropdown (9 services), About, Find Jobs, Contact
- User avatar dropdown with Dashboard, Profile, Logout when signed in
- Mobile hamburger menu

## DB Schema Notes

- Supabase `profiles` table should include `id`, `role`, `full_name`, profile/contact fields, company fields, `preferences`, `onboarding_completed_at`, and `updated_at`.
- API server still contains legacy local auth/database code; the active frontend authentication path is Supabase.

## Stripe Integration

Stripe was NOT connected via Replit integration. To enable payments:
1. Connect Stripe integration in Replit
2. Set `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
3. Update payment routes in `artifacts/api-server/src/routes/payments.ts`
