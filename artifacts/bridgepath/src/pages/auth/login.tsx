import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, Lock, Mail, Eye, EyeOff, Sparkles, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { DEMO_JOBSEEKER, DEMO_EMPLOYER } from "@/lib/demoAuth";

const CORAL = "#D94F20";
const CHARCOAL = "#1C1917";

export default function Login() {
  const { signInWithPassword } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<"jobseeker" | "employer" | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error) toast({ variant: "destructive", title: "Sign-in error", description: error });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { toast({ variant: "destructive", title: "Invalid email" }); return; }
    if (!password) { toast({ variant: "destructive", title: "Password required" }); return; }
    setIsLoading(true);
    const result = await signInWithPassword(email.trim(), password);
    setIsLoading(false);
    if (result.error) {
      if (result.error.includes("EmailNotVerified") || result.error.includes("verify your email")) {
        setUnverifiedEmail(email.trim());
      } else {
        toast({ variant: "destructive", title: "Could not sign in", description: result.error });
      }
      return;
    }
    toast({ title: "Welcome back", description: "Signed in to Bridgepath Africa." });
    setLocation(result.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker");
  };

  const handleDemoLogin = async (type: "jobseeker" | "employer") => {
    setDemoLoading(type);
    const demo = type === "jobseeker" ? DEMO_JOBSEEKER : DEMO_EMPLOYER;
    const result = await signInWithPassword(demo.email, demo.password);
    setDemoLoading(null);
    if (result.error) { toast({ variant: "destructive", title: "Demo login failed", description: result.error }); return; }
    const dest = type === "employer" ? "/onboarding/employer" : "/onboarding/jobseeker";
    setLocation(dest);
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setResendLoading(true);
    await fetch("/api/auth/resend-verification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: unverifiedEmail }) });
    setResendLoading(false);
    toast({ title: "Verification email sent", description: `Check your inbox at ${unverifiedEmail}` });
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col"
        style={{ background: `linear-gradient(145deg, #2A0D05 0%, #5A1E0A 40%, ${CORAL} 80%, #D4641F 100%)` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 15% 85%, rgba(240,168,32,0.25) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.06) 0%, transparent 40%)" }} />
        <div className="absolute inset-0">
          <img src="/photos/coworking-team.png" alt="" className="w-full h-full object-cover opacity-20 object-center" />
        </div>
        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
              <img src="/logo-new.png" alt="Bridgepath Africa" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <div className="font-bold text-xl text-white tracking-tight">Bridgepath Africa</div>
              <div className="text-[10px] text-white/50 italic">Shaping People. Strengthening Institutions.</div>
            </div>
          </Link>
          <div className="mt-auto">
            <div className="flex gap-3 mb-8">
              {[{ v: "Ghana", l: "Launch" }, { v: "Kenya", l: "Launch" }, { v: "20+", l: "Years HR" }].map((s) => (
                <div key={s.v} className="text-center px-5 py-3 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)" }}>
                  <div className="text-2xl font-extrabold text-white">{s.v}</div>
                  <div className="text-xs text-white/60 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <h2 className="text-4xl font-bold text-white leading-[1.1] mb-4">
              Africa's next great hire is already on this platform.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">Your next career move — or your best hire yet — starts here.</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[48%] flex items-center justify-center px-6 py-12 bg-white">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CORAL }}>
                <img src="/logo-new.png" alt="Bridgepath Africa" className="h-7 w-7 object-contain" />
              </div>
              <div>
                <div className="font-bold text-lg tracking-tight" style={{ color: CHARCOAL }}>Bridgepath<span style={{ color: CORAL }}> Africa</span></div>
                <div className="text-[10px] italic text-gray-400">Shaping People. Strengthening Institutions.</div>
              </div>
            </Link>
          </div>

          {/* Email not verified banner */}
          {unverifiedEmail && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border p-4 text-sm"
              style={{ borderColor: CORAL + "50", backgroundColor: CORAL + "08" }}>
              <p className="font-semibold mb-1" style={{ color: CHARCOAL }}>Email not verified</p>
              <p className="text-gray-500 text-xs mb-3">
                Please check your inbox at <strong>{unverifiedEmail}</strong> and click the verification link before signing in.
              </p>
              <button onClick={handleResendVerification} disabled={resendLoading}
                className="text-xs font-bold underline disabled:opacity-50" style={{ color: CORAL }}>
                {resendLoading ? "Sending…" : "Resend verification email"}
              </button>
            </motion.div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: CHARCOAL }}>Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your Bridgepath Africa account.</p>
          </div>

          {/* OAuth sign-in */}
          <div className="space-y-3 mb-6">
            <a href="/api/auth/google"
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white font-semibold text-sm transition-all hover:border-gray-400 hover:shadow-sm"
              style={{ color: CHARCOAL }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </a>
            <a href="/api/auth/linkedin"
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white font-semibold text-sm transition-all hover:border-blue-400 hover:shadow-sm"
              style={{ color: CHARCOAL }}>
              <Linkedin className="h-5 w-5" style={{ color: "#0A66C2" }} />
              Continue with LinkedIn
            </a>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="text-xs text-gray-400 bg-white px-3">or with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="name@example.com" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base pl-11 rounded-xl border-gray-200 focus:ring-2"
                  autoComplete="email" autoFocus />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: CORAL }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Your password"
                  type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base pl-11 pr-11 rounded-xl border-gray-200"
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <motion.button type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }}
              className="w-full h-12 font-bold text-white rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 text-base shadow-md mt-2"
              style={{ backgroundColor: CORAL }}>
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            New to Bridgepath?{" "}
            <Link href="/auth/signup" className="font-bold hover:underline" style={{ color: CORAL }}>
              Create an account
            </Link>
          </p>

          {/* Demo access */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-8 rounded-2xl border p-5" style={{ borderColor: CORAL + "40", backgroundColor: CORAL + "06" }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4" style={{ color: CORAL }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: CHARCOAL }}>
                Try a live demo — no sign-up needed
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Explore the full platform instantly. Click a card to enter the demo experience.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => handleDemoLogin("jobseeker")} disabled={!!demoLoading}
                className="text-left rounded-xl p-3.5 bg-white border-2 border-transparent hover:shadow-md transition-all group disabled:opacity-60"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = CORAL + "60")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: CORAL }}>A</div>
                    <span className="text-sm font-bold" style={{ color: CHARCOAL }}>Job Seeker</span>
                  </div>
                  {demoLoading === "jobseeker" ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:translate-x-0.5 transition-transform" />}
                </div>
                <p className="text-xs text-gray-500">Ama Boateng · Software Engineer</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Accra, Ghana · Seeking remote roles</p>
              </button>

              <button type="button" onClick={() => handleDemoLogin("employer")} disabled={!!demoLoading}
                className="text-left rounded-xl p-3.5 bg-white border-2 border-transparent hover:shadow-md transition-all group disabled:opacity-60"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = CHARCOAL + "40")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: CHARCOAL }}>K</div>
                    <span className="text-sm font-bold" style={{ color: CHARCOAL }}>Employer</span>
                  </div>
                  {demoLoading === "employer" ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" /> : <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:translate-x-0.5 transition-transform" />}
                </div>
                <p className="text-xs text-gray-500">Kofi Mensah · TechBridge Africa</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Technology · Hiring in Ghana &amp; Kenya</p>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
