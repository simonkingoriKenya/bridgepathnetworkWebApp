import { useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { fetchProfile } from "@/lib/supabaseProfile";

const GREEN = "#8CC63F";

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session?.user) {
        setLocation("/auth/login");
        return;
      }

      const prof = await fetchProfile(session.user.id);
      const role =
        prof?.role ||
        session.user.user_metadata?.role ||
        localStorage.getItem("bridgepath_user_role") ||
        "job_seeker";

      if (role === "employer" || role === "job_seeker") {
        localStorage.setItem("bridgepath_user_role", role);
      }

      const lsRole = localStorage.getItem("bridgepath_user_role");
      if (lsRole === "employer" || lsRole === "job_seeker") {
        await supabase.from("profiles").update({ role: lsRole }).eq("id", session.user.id);
      }

      const profAfter = await fetchProfile(session.user.id);
      const finalRole = profAfter?.role || role;

      if (profAfter?.onboarding_completed_at) {
        setLocation(finalRole === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker");
        return;
      }

      setLocation(finalRole === "employer" ? "/onboarding/employer" : "/onboarding/jobseeker");
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

