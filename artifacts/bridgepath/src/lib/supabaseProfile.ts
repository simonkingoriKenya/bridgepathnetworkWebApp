import { supabase } from "./supabase";

export type ProfileRow = {
  id: string;
  role: string;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  country: string | null;
  skills: string[] | null;
  experience: string | null;
  education: string | null;
  linkedin_url: string | null;
  company_name: string | null;
  company_website: string | null;
  industry: string | null;
  company_size: string | null;
  preferences: Record<string, unknown> | null;
  onboarding_completed_at: string | null;
};

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) {
    console.warn("fetchProfile", error.message);
    return null;
  }
  return data as ProfileRow | null;
}

export async function upsertProfile(partial: Partial<ProfileRow> & { id: string }) {
  const { error } = await supabase.from("profiles").upsert(
    {
      ...partial,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}
