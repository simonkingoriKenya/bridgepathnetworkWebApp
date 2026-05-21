---
name: SUPABASE_DATABASE_URL conflict
description: SUPABASE_DATABASE_URL env var is set to an https:// URL (Supabase REST API), not a postgres:// connection string. Using it directly as a DB connection string causes ETIMEDOUT on every query.
---

## Rule
In `lib/db/src/index.ts`, only use `SUPABASE_DATABASE_URL` if it starts with `postgresql://` or `postgres://`.

## Fix Applied
```ts
const supabaseUrl = process.env.SUPABASE_DATABASE_URL;
const isValidPgUrl = (s?: string) => !!s && (s.startsWith("postgresql://") || s.startsWith("postgres://"));
const connectionString = isValidPgUrl(supabaseUrl) ? supabaseUrl : process.env.DATABASE_URL;
```

**Why:** Replit injects `SUPABASE_DATABASE_URL` = `https://...supabase.co` for its REST API integration. The pg-pool tries to TCP-connect to that URL and gets ETIMEDOUT, breaking all DB queries even though `DATABASE_URL` is perfectly valid.

**How to apply:** Any time the backend DB pool stops responding after a restart, check if `SUPABASE_DATABASE_URL` is an https:// URL. The fix is already in lib/db/src/index.ts.
