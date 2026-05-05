# Bridgepath Network

A premium hiring platform connecting African talent with global employers — featuring job listings, AI-powered CV reviews, dashboards for job seekers and employers, and HR consultancy services.

## Run & Operate

| Command | Purpose |
|---|---|
| `pnpm install` | Install all workspace dependencies |
| `pnpm --filter @workspace/db run push` | Push DB schema changes (dev) |
| `pnpm --filter @workspace/bridgepath run dev` | Start frontend (port 20522) |
| `pnpm --filter @workspace/api-server run dev` | Start backend (port 8080) |
| `pnpm build` | Typecheck + build all packages |

**Required env vars:** `DATABASE_URL` (auto-provisioned), `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL` (both auto-set by Replit AI integration).

## Stack

- **Frontend:** React 19, Vite 7, TailwindCSS v4, ShadCN UI, Radix UI, Framer Motion, Wouter (routing), TanStack Query
- **Backend:** Node.js 24, Express 5, Pino logging, esbuild (bundler)
- **Database:** PostgreSQL via Replit, Drizzle ORM
- **AI:** OpenAI via Replit AI Integrations (`gpt-5-mini` for CV analysis)
- **Auth:** Custom JWT (sha256 hash + base64 token), stored in localStorage
- **Payments:** Stripe (configured, not fully wired)
- **Monorepo:** pnpm workspaces

## Where things live

```
artifacts/
  bridgepath/      # React frontend (src/, vite.config.ts)
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

## Product

- Landing page with hero, services overview, and employer/job seeker CTAs
- Job listings with search, filtering, and detailed job pages
- Employer dashboard: post jobs, manage candidates, view applications
- Job seeker dashboard: track applications, manage profile
- AI CV Review: upload CV text → GPT analysis with scores, strengths, and recommendations
- 9 HR service pages (Employment of Record, Payroll & Tax, etc.)
- Demo mode: pre-configured accounts for testing without registration

## User Preferences

_Populate as you build_

## Gotchas

- **Always run `pnpm install` before starting workflows** — node_modules may be missing after a fresh clone.
- **Backend must be running for API calls** — Vite proxies `/api` to port 8080; if the backend is down, all API calls fail.
- **DB schema changes:** Run `pnpm --filter @workspace/db run push` after editing `lib/db/src/schema/`. Replit's publish flow handles production schema diffs automatically.
- **pnpm preinstall script** blocks `npm install` — always use `pnpm`.

## Pointers

- DB schema: `lib/db/src/schema/`
- API routes: `artifacts/api-server/src/routes/`
- Frontend pages: `artifacts/bridgepath/src/pages/`
- Auth logic: `artifacts/api-server/src/lib/auth.ts` + `artifacts/bridgepath/src/lib/auth.tsx`
