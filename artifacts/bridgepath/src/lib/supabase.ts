import { createClient } from "@supabase/supabase-js";

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Local dev only — production builds must set VITE_* in Netlify / CI. */
const DEV_FALLBACK_URL = "https://xuktfrhuvzsjxaivooho.supabase.co";
const DEV_FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1a3Rmcmh1dnpzanhhaXZvb2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MzgxMDUsImV4cCI6MjA5MTUxNDEwNX0.T9hu_40TC-9yYPwmvmlcgTdt2tb8NZZJuV61gP0MP3w";

const supabaseUrl =
  envUrl?.trim() ||
  (import.meta.env.DEV ? DEV_FALLBACK_URL : "");
const supabaseAnonKey =
  envKey?.trim() ||
  (import.meta.env.DEV ? DEV_FALLBACK_ANON_KEY : "");

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required for production builds.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type SupabaseUser = {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    role?: string;
  };
};
