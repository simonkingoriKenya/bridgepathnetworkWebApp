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

---

## Vibe Cheat-Sheet for Coding Agents

> Palette name: **Warm Pan-African Editorial**
> Feeling target: Kente-inspired warmth + modern HR editorial polish (Gusto / Lattice) + African print color confidence — vibrant, grounded, trustworthy.

### Hard Rules

- **NO greens** anywhere in the UI (not olive, sage, emerald, lime, teal-green — teal is allowed only as the rare third accent)
- **NO dark mode as the default** — light ivory cream is always the page default; `.dark` class exists but is opt-in only
- **NO cool grays** — all neutral surfaces use warm brown-tinted hues (HSL hue 22–32°); never slate, zinc, or cool neutral classes
- **NO pure white (`#fff` / `white`)** for page backgrounds — always use the ivory cream token
- **NO pure black** for text — always use the warm ink token

### Color Tokens (CSS variables in `artifacts/bridgepath/src/index.css`)

| Role | CSS variable | HSL value | Hex approx | Usage |
|---|---|---|---|---|
| **Background** | `--background` / `--cream` | `32 60% 97%` | `#FEF9F4` | Page bg, light sections — unbleached paper feel |
| **Foreground / Ink** | `--foreground` / `--ink` | `22 18% 11%` | `#1E1511` | Headlines, body text, logo chip, dark CTA sections |
| **Primary / Terracotta** | `--primary` / `--terracotta` | `16 72% 43%` | `#C04020` | Buttons, "Africa" wordmark, link hovers, nav active |
| **Primary foreground** | `--primary-foreground` | `32 60% 97%` | cream | Text on terracotta buttons/badges |
| **Accent / Marigold** | `--accent` / `--marigold` | `38 90% 50%` | `#F0A010` | Eyebrow labels, highlight chips, warm gradient washes |
| **Accent foreground** | `--accent-foreground` | `22 18% 11%` | ink | Text on marigold surfaces |
| **Rare Third / Deep Teal** | `--teal` | `184 58% 30%` | `#1F7A78` | Trust badges, certifications, secondary chips only |
| **Muted surface** | `--muted` | `30 30% 94%` | `#F2EDE6` | Subtle card backgrounds, input fills |
| **Muted text** | `--muted-foreground` | `24 12% 44%` | `#7A6A5A` | Secondary body copy, placeholders — warm mid-tone |
| **Border** | `--border` | `28 28% 87%` | `#E0D4C4` | Dividers — warm taupe, almost invisible |
| **Card** | `--card` | `30 50% 99%` | `#FFFCF9` | Card surfaces — barely-there warm white |
| **Sidebar** | `--sidebar` | `22 22% 13%` | `#221710` | Warm charcoal sidebar — NOT cool dark gray |
| **Sidebar active** | `--sidebar-primary` | `16 72% 50%` | terracotta | Active nav item in sidebar |
| **Destructive** | `--destructive` | `0 72% 50%` | `#E02020` | Errors and danger states only |

### Named Semantic Tokens (Tailwind classes)

```
bg-background        → ivory cream page bg (#FEF9F4)
text-foreground      → warm ink for primary text (#1E1511)
bg-primary           → terracotta (#C04020)
text-primary         → terracotta for colored text / links
bg-accent            → marigold (#F0A010)
text-accent          → marigold for colored text
bg-muted             → warm beige surface (#F2EDE6)
text-muted-foreground → warm mid-gray body copy (#7A6A5A)
border-border        → warm taupe hairline
bg-card              → barely-there warm white (#FFFCF9)
bg-sidebar           → warm charcoal (#221710)
```

### Tailwind Utility Shorthand (use these, not arbitrary hex)

```
bg-[hsl(32,60%,97%)]  → NEVER — use bg-background instead
bg-white              → NEVER for page backgrounds
bg-gray-*             → NEVER — always use bg-muted or bg-secondary
text-gray-*           → NEVER — always use text-muted-foreground or text-foreground
text-black            → NEVER — use text-foreground
```

### Section Surface Patterns

| Pattern | Class | Description |
|---|---|---|
| Default page | `bg-background` | Ivory cream — most sections |
| Alternating light | `premium-grid-bg` | Same cream, slightly elevated |
| Warm sand depth | `premium-grid-bg-dark` | `hsl(30 40% 94%)` — subtle contrast |
| Inverted / dark CTA | `section-ink` | Warm charcoal `hsl(22 22% 11%)` + cream text |
| Terracotta fill | `section-coral` | Full terracotta block + cream text |
| Marigold fill | `section-gold` | Full marigold block + ink text |
| Teal fill (rare) | `section-teal` | Deep teal block + cream text — trust only |

### Typography

| Role | Font | Weight | Style |
|---|---|---|---|
| Display headings (H1–H3) | Bricolage Grotesque (`--font-display`) | 600–800 | Tight tracking, large |
| Body / UI | Inter (`--font-sans`) | 400–600 | Comfortable line-height |
| Code / mono | system monospace (`--font-mono`) | 400 | — |

- Heading color: `text-foreground` (warm ink) on cream; `text-cream` on ink/terracotta sections
- Eyebrow labels (small caps above headings): `text-accent` (marigold) or `text-primary` (terracotta)
- Body copy: `text-foreground` at 90% or `text-muted-foreground` for secondary

### Interactive States

- **Primary button:** `bg-primary text-primary-foreground` (terracotta + cream) — hover darken 8%
- **Ghost / outline button:** `border-border text-foreground` hover `bg-muted`
- **Link hover:** `text-primary` (terracotta)
- **Focus ring:** `ring-primary` (terracotta)
- **Card hover lift:** `.focus-card-glow` → `-4px translateY` + terracotta shadow glow

### Gradient Recipes

```css
/* Warm cream-to-sand section gradient */
background: linear-gradient(to bottom, hsl(32 60% 97%), hsl(30 40% 94%));

/* Hero overlay (bottom-heavy, cinematic) */
background: linear-gradient(to top,
  rgba(30,21,17,0.95) 0%,
  rgba(30,21,17,0.70) 35%,
  rgba(30,21,17,0.30) 65%,
  rgba(30,21,17,0.10) 100%);

/* Terracotta-to-marigold brand gradient */
background: linear-gradient(135deg, hsl(16 72% 43%), hsl(38 90% 50%));

/* Subtle teal trust band */
background: linear-gradient(90deg, hsl(184 58% 30%), hsl(184 50% 36%));
```

### Shadow Tokens (warm-tinted, not cool black)

All shadows use `rgba(28,16,8, …)` (warm brown base) — never `rgba(0,0,0, …)`:

```
shadow-sm   → subtle lift for cards
shadow-md   → floating panels, dropdowns
shadow-lg   → modals, popovers
```

### Photo / Image Direction

- Hero: full-bleed, cinematic gradient overlay (bottom-heavy), text pinned to bottom-left
- 80%+ Black African professionals — diverse age, gender, profession
- **No shadows on section photos** — photos bleed edge-to-edge or sit in tinted containers
- Files live in `artifacts/bridgepath/public/photos/` — reference via `/photos/filename.ext`

### What NOT to build

- No white-background cards with cool gray borders (feels cold, generic SaaS)
- No dark mode toggle as a hero feature — it's a class, not a product story
- No green badges, green success states — use marigold or teal instead
- No cool slate/zinc/neutral-gray anywhere in the palette
- No pure black text — warm ink (`hsl(22 18% 11%)`) only

---

## Design System

- **Fonts:** Bricolage Grotesque (display headings) + Inter (body/UI) via Google Fonts
- **Colors:** TERRACOTTA=`#C04020` (primary), MARIGOLD=`#F0A010` (accent), DEEP TEAL=`#1F7A78` (rare third), CREAM=`#FEF9F4` (bg), INK=`#1E1511` (text)
- **Hero style:** Full-bleed African corporate photos (80% Black African professionals) with gradient overlay — text pinned to bottom. No shadows on body photo sections.
- **Auth pages:** Premium split-screen layout — vibrant African office photo left, clean white form right.
- **Dashboard sidebar:** Warm charcoal (`hsl(22 22% 13%)`) with terracotta active states.
- **Favicon:** Terracotta SVG rounded rect with white "b" lettermark.
- **Logo:** `/logo-new.png` (transparent PNG) displayed on terracotta circle background.
- **Photos in `/public/photos/`:** hero-team-meeting.png, coworking-team.png, boardroom-deal.png, job-interview.png, team-celebration.png, africa-city-skyline.png, hr-leader.png, hr-leader-woman.png, modern-africa-office.png, africa-office-team.png
- **Contact email:** pkumanyc@gmail.com (used everywhere)

## User Preferences

- Bold, vibrant design emulating Deel / Remote.com / Rippling
- No image shadows or overlays on photo sections
- Full-bleed hero images with gradient overlays (bottom-heavy)
- All brand references: "Bridgepath Africa" (never "BridgePath Network")
- No greens. No dark mode as default. No cool grays anywhere.

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
