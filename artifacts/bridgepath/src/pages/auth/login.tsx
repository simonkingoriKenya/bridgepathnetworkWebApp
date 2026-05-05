import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, Lock, Mail, Eye, EyeOff, Sparkles, Briefcase, Users } from "lucide-react";
import { motion } from "framer-motion";
import loginHero from "@assets/unnamed_1776009115714.jpg";
import { DEMO_JOBSEEKER, DEMO_EMPLOYER } from "@/lib/demoAuth";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

export default function Login() {
  const { signInWithPassword } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<"jobseeker" | "employer" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast({ variant: "destructive", title: "Invalid email" });
      return;
    }
    if (!password) {
      toast({ variant: "destructive", title: "Password required" });
      return;
    }
    setIsLoading(true);
    const result = await signInWithPassword(email.trim(), password);
    setIsLoading(false);
    if (result.error) {
      toast({ variant: "destructive", title: "Could not sign in", description: result.error });
      return;
    }
    toast({ title: "Signed in", description: "Welcome back to Bridgepath Africa." });
    setLocation(result.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker");
  };

  const handleDemoLogin = async (type: "jobseeker" | "employer") => {
    setDemoLoading(type);
    const demo = type === "jobseeker" ? DEMO_JOBSEEKER : DEMO_EMPLOYER;
    const result = await signInWithPassword(demo.email, demo.password);
    setDemoLoading(null);
    if (result.error) {
      toast({ variant: "destructive", title: "Demo login failed", description: result.error });
      return;
    }
    const dest = type === "employer" ? "/onboarding/employer" : "/onboarding/jobseeker";
    setLocation(dest);
  };

  return (
    <div className="min-h-screen flex premium-grid-bg" style={{ backgroundColor: "#f8f9fc" }}>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: DARK }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55"
          style={{ backgroundImage: `url("${loginHero}")` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(26,35,64,0.86) 0%, rgba(26,35,64,0.28) 100%)" }}
        />
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <Link href="/" className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Bridgepath Africa" className="h-9 w-9 object-contain" />
              <span className="font-bold text-2xl text-white">
                Bridgepath<span style={{ color: GREEN }}>Africa</span>
              </span>
            </div>
            <span className="text-xs italic text-gray-400 ml-11">Shaping People. Strengthening Institutions.</span>
          </Link>
          <div>
            <div className="flex gap-3 mb-6">
              {[
                { v: "Ghana", l: "Launch", k: "ghana" },
                { v: "Kenya", l: "Launch", k: "kenya" },
                { v: "15+", l: "Years HR", k: "years" },
              ].map((s) => (
                <div key={s.k} className="text-center px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <div className="text-xl font-bold text-white">{s.v}</div>
                  <div className="text-xs text-gray-400">{s.l}</div>
                </div>
              ))}
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">A focused talent marketplace for Africa&apos;s next chapter</h2>
            <p className="text-gray-400 text-lg">Your next opportunity — or your next great hire — is waiting.</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Bridgepath Africa" className="h-8 w-8 object-contain" />
                <span className="font-bold text-xl" style={{ color: DARK }}>
                  Bridgepath<span style={{ color: GREEN }}>Africa</span>
                </span>
              </div>
              <span className="text-xs italic text-gray-400 ml-10">Shaping People. Strengthening Institutions.</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1" style={{ color: DARK }}>
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">Sign in with your email and password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base pl-10"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 text-base shadow-md"
              style={{ backgroundColor: GREEN }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link href="/auth/forgot-password" className="font-semibold hover:underline" style={{ color: GREEN }}>
              Forgot your password?
            </Link>
          </p>

          <p className="text-center text-sm text-gray-500 mt-3">
            New to Bridgepath?{" "}
            <Link href="/auth/signup" className="font-semibold hover:underline" style={{ color: GREEN }}>
              Create an account
            </Link>
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-8 rounded-2xl border border-dashed p-4"
            style={{ borderColor: GREEN + "60", backgroundColor: GREEN + "08" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4" style={{ color: GREEN }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: DARK }}>
                Try a live demo — one click
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              No sign-up needed. Click a card to instantly enter a guided demo experience.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin("jobseeker")}
                disabled={!!demoLoading}
                className="text-left rounded-xl p-3.5 bg-white border-2 border-transparent hover:border-green-400 hover:shadow-md transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: GREEN }}>A</div>
                    <span className="text-sm font-bold" style={{ color: DARK }}>Job Seeker</span>
                  </div>
                  {demoLoading === "jobseeker"
                    ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    : <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-green-500 transition-colors" />}
                </div>
                <p className="text-xs text-gray-500 leading-snug">Ama Boateng · Software Engineer</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Accra, Ghana · Looking for remote roles</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("employer")}
                disabled={!!demoLoading}
                className="text-left rounded-xl p-3.5 bg-white border-2 border-transparent hover:border-green-400 hover:shadow-md transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: DARK }}>K</div>
                    <span className="text-sm font-bold" style={{ color: DARK }}>Employer</span>
                  </div>
                  {demoLoading === "employer"
                    ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    : <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-green-500 transition-colors" />}
                </div>
                <p className="text-xs text-gray-500 leading-snug">Kofi Mensah · TechBridge Africa</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Technology · Hiring across Ghana &amp; Kenya</p>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
