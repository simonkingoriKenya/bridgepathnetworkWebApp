# Bridgepath Africa

A premium HR hiring platform connecting African talent (Ghana & Kenya) with global employers — featuring job listings, AI-powered CV reviews, dashboards for job seekers and employers, and HR consultancy services.

## Run & Operate

| Command | Purpose |
|---|---|
| `pnpm install` | Install all workspace dependencies |
| `pnpm --filter @workspace/db run push` | Push DB schema changes (dev) |
| `pnpm --filter @workspace/bridgepath run dev` | Start frontend (port 5000) |
| `pnpm --filter @workspace/api-server run dev` | Start backend (port 8080) |
| `pnpm build` | Typecheck + build all packages |

**Required env vars:** `DATABASE_URL` (auto-provisioned), `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL` (both auto-set by Replit AI integration).

## Stack

- **Frontend:** React 19, Vite 7, TailwindCSS v4, ShadCN UI, Radix UI, Framer Motion, Wouter (routing), TanStack Query
- **Backend:** Node.js 24, Express 5, Pino logging, esbuild (bundler)
- **Database:** PostgreSQL via Replit, Drizzle ORM
- **AI:** OpenAI via Replit AI Integrations (`gpt-5-mini` for CV analysis)
- **Auth:** Custom JWT (sha256 hash + base64 token), stored in localStorage
- **Monorepo:** pnpm workspaces

## Where things live

```
artifacts/
  bridgepath/      # React frontend (src/, vite.config.ts)
    public/photos/ # AI-generated African corporate photos (10+ images)
  api-server/      # Express backend (src/routes/, src/lib/)
lib/
  db/              # Drizzle schema + migrations (src/schema/)
  api-spec/        # OpenAPI spec (openapi.yaml) — source of truth for API
  api-client-react/ # Generated React Query hooks (via Orval)
  api-zod/         # Generated Zod schemas (via Orval)
```

## Architecture Decisions

- **Vite proxy for `/api`:** The frontend dev server proxies `/api/*` to `localhost:8080`, so all API calls use relative URLs — no CORS issues in dev.
- **Custom JWT auth (no Supabase/Clerk):** Auth is implemented directly in Express using sha256 hashing and base64 tokens. Demo mode auto-creates accounts for unknown emails.
- **pnpm workspaces with catalog:** All shared dependency versions are pinned in `pnpm-workspace.yaml` catalog to prevent version drift.
- **OpenAI via Replit AI Integrations:** CV review AI uses `AI_INTEGRATIONS_OPENAI_API_KEY` / `AI_INTEGRATIONS_OPENAI_BASE_URL` — no external API key needed.
- **esbuild bundling for backend:** The API server is bundled with esbuild for fast cold starts; pino logging uses a plugin for worker compatibility.
- **Demo job data in frontend:** `jobs/[id].tsx` contains a full `demoMockJobs` record for IDs 101–112 so demo users get instant job detail views without API calls.

## Product

- Landing page with bold full-bleed hero, stats bar, dark navy sections (Deel/Remote.com style)
- Job listings with search, filtering, and detailed job pages (12 demo mock jobs: IDs 101–112)
- Employer dashboard: post jobs, manage candidates, view applications
- Job seeker dashboard: track applications, manage profile
- AI CV Review: paste CV text → GPT analysis with score ring, strengths, improvements, role recommendations
- Human HR Review upgrade button: calls Stripe checkout (graceful 503 fallback to email when Stripe not configured)
- 9 HR service pages (Employment of Record, Payroll & Tax, etc.)
- Demo mode: pre-configured accounts for testing without registration (jobseeker@demo.bridgepath.network / employer@demo.bridgepath.network — both pw: Demo123!)
- Real contact form → saves to `contact_submissions` DB table

## Design System

- **Fonts:** Syne (display headings) + Plus Jakarta Sans (body) via Google Fonts
- **Colors:** GREEN=#8CC63F, DARK=#0D1B2A, AMBER=#F97316
- **Hero style:** Full-bleed African corporate photos (80% Black African professionals) with gradient overlay — text pinned to bottom. No shadows on body photo sections.
- **Photos in `/public/photos/`:** hero-team-meeting.png, coworking-team.png, boardroom-deal.png, job-interview.png, team-celebration.png, africa-city-skyline.png, hr-leader.png, hr-leader-woman.png, modern-africa-office.png, africa-office-team.png
- **Contact email:** pkumanyc@gmail.com (used everywhere)

## User Preferences

- Bold, vibrant design emulating Deel / Remote.com / Rippling
- No image shadows or overlays on photo sections
- Full-bleed hero images with gradient overlays (bottom-heavy)
- Syne font for display headings
- All brand references: "Bridgepath Africa" (never "BridgePath Network")

## Gotchas

- **Always run `pnpm install` before starting workflows** — node_modules may be missing after a fresh clone.
- **Backend must be running for API calls** — Vite proxies `/api` to port 8080; if the backend is down, all API calls fail.
- **DB schema changes:** Run `pnpm --filter @workspace/db run push` after editing `lib/db/src/schema/`. Replit's publish flow handles production schema diffs automatically.
- **pnpm preinstall script** blocks `npm install` — always use `pnpm`.
- **Mock jobs (IDs 101–112) are frontend-only** — they don't exist in the DB. Non-demo users clicking them get "Job Not Found". Real employers must post jobs first. Demo users see full detail via `demoMockJobs` in `[id].tsx`.
- **Stripe not configured** — Human HR Review upgrade button gracefully falls back to email contact when `STRIPE_SECRET_KEY` env var is missing.

## Pointers

- DB schema: `lib/db/src/schema/`
- API routes: `artifacts/api-server/src/routes/`
- Frontend pages: `artifacts/bridgepath/src/pages/`
- Auth logic: `artifacts/api-server/src/lib/auth.ts` + `artifacts/bridgepath/src/lib/auth.tsx`
- Theme/CSS: `artifacts/bridgepath/src/index.css`
- Demo data: `artifacts/bridgepath/src/lib/demoAuth.ts`
- Demo job detail data: `artifacts/bridgepath/src/pages/jobs/[id].tsx` (demoMockJobs record)
