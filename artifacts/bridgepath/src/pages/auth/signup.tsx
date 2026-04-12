import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2, Briefcase, User as UserIcon, ArrowLeft, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

type Step = "role" | "details";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<"job_seeker" | "employer" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signUpWithEmail, signInWithGoogle, updateRole } = useAuth();
  const { toast } = useToast();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast({ variant: "destructive", title: "Name required" }); return; }
    if (!email.trim() || !email.includes("@")) { toast({ variant: "destructive", title: "Invalid email" }); return; }
    if (!password || password.length < 6) { toast({ variant: "destructive", title: "Password too short", description: "At least 6 characters." }); return; }
    setIsLoading(true);
    const result = await signUpWithEmail(email.trim(), password, name.trim(), selectedRole || "job_seeker");
    setIsLoading(false);
    if (result.error) {
      toast({ variant: "destructive", title: "Sign up failed", description: result.error });
      return;
    }
    toast({ title: "✅ Account created!", description: `Welcome to Bridgepath Network, ${name}!` });
    const dest = selectedRole === "employer" ? "/onboarding/employer" : "/onboarding/jobseeker";
    setLocation(dest);
  };

  const handleGoogle = async () => {
    if (selectedRole) updateRole(selectedRole);
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result.error) {
      toast({ variant: "destructive", title: "Google sign in failed", description: result.error });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fc" }}>
      <div className="p-6">
        <Link href="/" className="flex flex-col gap-0.5 w-fit">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Bridgepath Network" className="h-8 w-8 object-contain" />
            <span className="font-bold text-xl" style={{ color: DARK }}>Bridgepath<span style={{ color: GREEN }}>Network</span></span>
          </div>
          <span className="text-xs italic text-gray-400 ml-10">Shaping People. Strengthening Institutions.</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {step === "role" ? (
            <motion.div key="role" className="w-full max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-3" style={{ color: DARK }}>Join Bridgepath Network</h1>
                <p className="text-gray-500">Tell us who you are to get the right experience</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button onClick={() => { setSelectedRole("job_seeker"); setStep("details"); }} className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-green-400 transition-all text-left group shadow-sm hover:shadow-lg">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-200" style={{ backgroundColor: GREEN + "15" }}>
                    <UserIcon className="h-7 w-7" style={{ color: GREEN }} />
                  </div>
                  <h2 className="text-xl font-bold mb-2" style={{ color: DARK }}>I'm a Professional</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">Find jobs across Africa and globally, get AI-powered CV review, and track your applications.</p>
                  <ul className="space-y-2">
                    {["Browse 1,000+ African opportunities", "Free AI CV Analysis", "Apply with one click"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: GREEN }} /> {item}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: GREEN }}>Get started <ArrowRight className="h-4 w-4" /></div>
                </button>
                <button onClick={() => { setSelectedRole("employer"); setStep("details"); }} className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-400 transition-all text-left group shadow-sm hover:shadow-lg">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-200" style={{ backgroundColor: DARK + "12" }}>
                    <Briefcase className="h-7 w-7" style={{ color: DARK }} />
                  </div>
                  <h2 className="text-xl font-bold mb-2" style={{ color: DARK }}>I'm an Employer</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">Post jobs, discover Africa's top talent, manage applications, and build your remote team.</p>
                  <ul className="space-y-2">
                    {["Post unlimited job listings", "Access verified candidate profiles", "Hire from 45+ African countries"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: DARK }} /> {item}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: DARK }}>Get started <ArrowRight className="h-4 w-4" /></div>
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-8">Already have an account? <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: GREEN }}>Sign in</Link></p>
            </motion.div>
          ) : (
            <motion.div key="details" className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <button onClick={() => { setStep("role"); setSelectedRole(null); }} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: DARK }}>Create your account</h1>
                <p className="text-gray-500 mt-1 text-sm">{selectedRole === "employer" ? "Employer account" : "Professional account"} · Takes less than 60 seconds</p>
              </div>

              <button onClick={handleGoogle} disabled={isGoogleLoading} className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all mb-4 shadow-sm disabled:opacity-60">
                {isGoogleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Continue with Google
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or with email</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">{selectedRole === "employer" ? "Company / Full Name" : "Full Name"}</label>
                  <Input placeholder={selectedRole === "employer" ? "Acme Corp or Your Name" : "Your full name"} value={name} onChange={(e) => setName(e.target.value)} className="h-12" autoFocus />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
                  <Input placeholder="name@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Password <span className="text-gray-400 font-normal">(min 6 characters)</span></label>
                  <div className="relative">
                    <Input placeholder="Create a password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <motion.button type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }}
                  className="w-full h-12 font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 text-base shadow-md"
                  style={{ backgroundColor: selectedRole === "job_seeker" ? GREEN : DARK }}
                >
                  {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
                </motion.button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: GREEN }}>Sign in</Link></p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
