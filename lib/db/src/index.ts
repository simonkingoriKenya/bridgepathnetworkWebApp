import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const connectionString = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL (or SUPABASE_DATABASE_URL) must be set. Did you forget to provision a database?",
  );
}

const isSupabase = connectionString.includes("supabase.co") ||
  connectionString.includes("supabase.com");
const useSSL = isSupabase || process.env.DB_SSL === "true";

export const pool = new Pool({
  connectionString,
  ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
});

export const db = drizzle(pool, { schema });

export * from "./schema";
