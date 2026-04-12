import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { fetchProfile, upsertProfile } from "@/lib/supabaseProfile";

const GREEN = "#8CC63F";
const DARK = "#1a2340";
const ROLE_KEY = "bridgepath_user_role";
const NAME_KEY = "bridgepath_user_name";

type Status = "loading" | "success" | "expired" | "error";

function classifyError(msg: string): "expired" | "error" {
  const lower = msg.toLowerCase();
  if (
    lower.includes("expired") ||
    lower.includes("invalid") ||
    lower.includes("already used") ||
    lower.includes("token has expired") ||
    lower.includes("otp expired")
  ) {
    return "expired";
  }
  return "error";
}

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resendEmail, setResendEmail] = useState<string>("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const params = new URLSearchParams(window.location.search);

      // Supabase may redirect back with error params
      const urlError = params.get("error");
      const urlErrorDesc = params.get("error_description");
      if (urlError) {
        if (cancelled) return;
        const kind = classifyError(urlErrorDesc || urlError);
        setErrorMessage(urlErrorDesc || urlError);
        setStatus(kind);
        return;
      }

      // Exchange the PKCE code for a session
      if (params.has("code")) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        );
        if (exchangeError) {
          if (cancelled) return;
          const kind = classifyError(exchangeError.message);
          setErrorMessage(exchangeError.message);
          setStatus(kind);
          return;
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      if (!session?.user) {
        // No session and no code — link was likely already used or expired
        setStatus("expired");
        return;
      }

      setStatus("success");

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

      setResendEmail(u.email || "");
      localStorage.setItem(ROLE_KEY, role);
      if (displayName) localStorage.setItem(NAME_KEY, displayName);

      try {
        await upsertProfile({ id: u.id, role, full_name: displayName });
      } catch {
        /* RLS or network — still route the user */
      }

      const profAfter = await fetchProfile(u.id);
      const finalRole =
        profAfter?.role === "employer" || profAfter?.role === "job_seeker"
          ? profAfter.role
          : role;

      // Brief success moment then redirect
      await new Promise((r) => setTimeout(r, 1200));
      if (!cancelled) {
        setLocation(finalRole === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker");
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [setLocation]);

  const handleResendConfirmation = async () => {
    if (!resendEmail) return;
    setResending(true);
    await supabase.auth.resend({ type: "signup", email: resendEmail });
    setResending(false);
    setResent(true);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: GREEN }} />
        <p className="text-gray-500 text-sm">Verifying your account…</p>
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${GREEN}18` }}
        >
          <CheckCircle2 className="h-7 w-7" style={{ color: GREEN }} />
        </div>
        <p className="text-gray-700 font-medium text-sm">Email confirmed! Redirecting…</p>
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── Expired link ─────────────────────────────────────────────────────────
  if (status === "expired") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#f8f9fc" }}
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#fef3c718" }}
          >
            <Mail className="h-7 w-7 text-amber-500" />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: DARK }}>
            This link has expired
          </h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Confirmation links are single-use and expire after a short time. You can request a
            new one or sign in if you've already confirmed your email.
          </p>

          {resent ? (
            <p className="text-sm text-gray-600 font-medium mb-4">
              A new confirmation email has been sent. Check your inbox.
            </p>
          ) : resendEmail ? (
            <button
              type="button"
              disabled={resending}
              onClick={handleResendConfirmation}
              className="w-full h-11 font-semibold text-white rounded-xl flex items-center justify-center gap-2 mb-3 disabled:opacity-60 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: GREEN }}
            >
              {resending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Resending…</>
              ) : (
                <><Mail className="h-4 w-4" /> Resend confirmation email</>
              )}
            </button>
          ) : null}

          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full h-11 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Go to sign in
          </Link>

          <p className="text-xs text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="font-semibold underline" style={{ color: GREEN }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Generic error ─────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#f8f9fc" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-50">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>
        <h1 className="text-xl font-bold mb-2" style={{ color: DARK }}>
          Something went wrong
        </h1>
        <p className="text-gray-500 text-sm mb-2 leading-relaxed">
          We couldn't verify your account. Please try again or contact support if the problem
          persists.
        </p>
        {errorMessage && (
          <p className="text-xs text-gray-400 mb-6 font-mono bg-gray-50 rounded-lg px-3 py-2">
            {errorMessage}
          </p>
        )}
        <Link
          href="/auth/signup"
          className="inline-flex items-center justify-center w-full h-11 rounded-xl font-semibold text-sm text-white mb-3 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: GREEN }}
        >
          Back to sign up
        </Link>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center w-full h-11 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-colors"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
