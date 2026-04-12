import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { fetchProfile, upsertProfile } from "@/lib/supabaseProfile";

const GREEN = "#8CC63F";
const ROLE_KEY = "bridgepath_user_role";
const NAME_KEY = "bridgepath_user_name";

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      if (params.has("code")) {
        await supabase.auth.exchangeCodeForSession(window.location.href);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session?.user) {
        setLocation("/auth/login");
        return;
      }

      const u = session.user;
      const roleRaw =
        (await fetchProfile(u.id))?.role ||
        (u.user_metadata?.role as string | undefined) ||
        localStorage.getItem(ROLE_KEY) ||
        "job_seeker";
      const role: "job_seeker" | "employer" =
        roleRaw === "employer" ? "employer" : "job_seeker";

      const displayName =
        (u.user_metadata?.full_name as string | undefined) ||
        (u.user_metadata?.name as string | undefined) ||
        localStorage.getItem(NAME_KEY) ||
        u.email?.split("@")[0] ||
        "User";

      localStorage.setItem(ROLE_KEY, role);
      if (displayName) localStorage.setItem(NAME_KEY, displayName);

      try {
        await upsertProfile({
          id: u.id,
          role,
          full_name: displayName,
        });
      } catch {
        /* RLS or network — callback still tries to route user */
      }

      const profAfter = await fetchProfile(u.id);
      const finalRole =
        profAfter?.role === "employer" || profAfter?.role === "job_seeker" ? profAfter.role : role;

      setLocation(finalRole === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker");
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: GREEN }} />
      <p className="text-gray-500 text-sm">Completing sign in...</p>
    </div>
  );
}
