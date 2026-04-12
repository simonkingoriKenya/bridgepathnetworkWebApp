import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
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
    const result = await signInWithEmail(email.trim(), password);
    setIsLoading(false);
    if (result.error) {
      if (result.error.includes("Invalid login credentials")) {
        toast({ variant: "destructive", title: "Sign in failed", description: "Email or password is incorrect. Try creating an account." });
      } else {
        toast({ variant: "destructive", title: "Sign in failed", description: result.error });
      }
      return;
    }
    toast({ title: "Welcome back!" });
    const role = localStorage.getItem("bridgepath_user_role") || "job_seeker";
    setLocation(role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker");
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result.error) {
      toast({ variant: "destructive", title: "Google sign in failed", description: result.error });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f8f9fc" }}>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=85')" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,35,64,0.97) 0%, rgba(26,35,64,0.55) 100%)" }} />
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <Link href="/" className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Bridgepath Network" className="h-9 w-9 object-contain" />
              <span className="font-bold text-2xl text-white">Bridgepath<span style={{ color: GREEN }}>Network</span></span>
            </div>
            <span className="text-xs italic text-gray-400 ml-11">Shaping People. Strengthening Institutions.</span>
          </Link>
          <div>
            <div className="flex gap-3 mb-6">
              {[{ v: "45+", l: "Countries" }, { v: "20k+", l: "Professionals" }, { v: "150+", l: "Companies" }].map((s) => (
                <div key={s.l} className="text-center px-4 py-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <div className="text-xl font-bold text-white">{s.v}</div>
                  <div className="text-xs text-gray-400">{s.l}</div>
                </div>
              ))}
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">Africa's premier talent marketplace</h2>
            <p className="text-gray-400 text-lg">Your next opportunity — or your next great hire — is waiting.</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Bridgepath Network" className="h-8 w-8 object-contain" />
                <span className="font-bold text-xl" style={{ color: DARK }}>Bridgepath<span style={{ color: GREEN }}>Network</span></span>
              </div>
              <span className="text-xs italic text-gray-400 ml-10">Shaping People. Strengthening Institutions.</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1" style={{ color: DARK }}>Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={isGoogleLoading}
            className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mb-5 shadow-sm disabled:opacity-60"
          >
            {isGoogleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
              <Input placeholder="name@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 text-base" autoFocus />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-medium hover:underline" style={{ color: GREEN }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <Input placeholder="Your password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 text-base pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <motion.button
              type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }}
              className="w-full h-12 font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 text-base shadow-md"
              style={{ backgroundColor: GREEN }}
            >
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New to Bridgepath?{" "}
            <Link href="/auth/signup" className="font-semibold hover:underline" style={{ color: GREEN }}>Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
