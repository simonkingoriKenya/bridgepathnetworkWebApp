import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Loader2, Briefcase, User as UserIcon, ArrowLeft, CheckCircle2,
  ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles, Linkedin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CORAL = "#D94F20";
const GOLD = "#F0A820";
const TEAL = "#1F7A78";
const CHARCOAL = "#1C1917";

type Step = "role" | "details";

function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const label = score <= 1 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong";
  const color = score <= 1 ? "#ef4444" : score === 2 ? GOLD : score === 3 ? GOLD : TEAL;
  return { score, label, color };
}

function PasswordStrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = getPasswordStrength(password);
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < score ? color : "#e5e7eb" }} />
        ))}
      </div>
      <p className="text-xs font-semibold" style={{ color }}>
        {label} password
        {score <= 1 && " — add uppercase, numbers and symbols"}
        {score === 2 && " — add symbols or length to strengthen"}
        {score === 3 && " — good! Symbols will make it strong"}
        {score >= 4 && " — excellent!"}
      </p>
    </div>
  );
}

function OAuthButtons({ role }: { role: "job_seeker" | "employer" | null }) {
  const roleParam = role ?? "job_seeker";
  return (
    <div className="space-y-3">
      <a href={`/api/auth/google?role=${roleParam}`}
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
      <a href={`/api/auth/linkedin?role=${roleParam}`}
        className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white font-semibold text-sm transition-all hover:border-blue-400 hover:shadow-sm"
        style={{ color: CHARCOAL }}>
        <Linkedin className="h-5 w-5" style={{ color: "#0A66C2" }} />
        Continue with LinkedIn
      </a>
    </div>
  );
}

export default function Signup() {
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<"job_seeker" | "employer" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { signUpWithPassword } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    if (role === "employer" || role === "job_seeker") { setSelectedRole(role); setStep("details"); }
    const error = params.get("error");
    if (error) toast({ variant: "destructive", title: "Sign-in error", description: error });
  }, []);

  const pwStrength = getPasswordStrength(password);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast({ variant: "destructive", title: "Name required" }); return; }
    if (!email.trim() || !email.includes("@")) { toast({ variant: "destructive", title: "Invalid email" }); return; }
    if (!password) { toast({ variant: "destructive", title: "Password required" }); return; }
    if (pwStrength.score < 2) {
      toast({ variant: "destructive", title: "Password too weak", description: "Add uppercase letters, numbers, or symbols." });
      return;
    }
    if (!selectedRole) { toast({ variant: "destructive", title: "Choose account type" }); return; }

    setIsLoading(true);
    const result = await signUpWithPassword(email.trim(), password, name.trim(), selectedRole, linkedinUrl.trim() || undefined);
    setIsLoading(false);

    if (result.error) {
      toast({ variant: "destructive", title: "Could not create account", description: result.error });
      return;
    }
    setRegistered(true);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col">
        <img src="/photos/africa-office-team.webp" alt="Vibrant African professionals in a modern office"
          className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" decoding="async" />
        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CORAL }}>
              <img src="/logo-new.png" alt="Bridgepath Africa" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <div className="font-bold text-xl text-white tracking-tight" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>Bridgepath Africa</div>
              <div className="text-[10px] text-white italic" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>Shaping People. Strengthening Institutions.</div>
            </div>
          </Link>
          <div className="mt-auto">
            <div className="flex gap-2 mb-6">
              {["Free to join", "Ghana & Kenya", "20+ yrs expertise"].map((tag) => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-white"
                  style={{ backgroundColor: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }}>
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.65)" }}>
              Your career in Africa <span style={{ color: GOLD }}>starts here.</span>
            </h2>
            <p className="text-white text-base leading-relaxed max-w-md" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.65)", fontWeight: 500 }}>
              Join a platform built on 20 years of HR expertise — connecting Africa's brightest professionals with ambitious global employers.
            </p>
            <div className="mt-6 pt-6 border-t border-white/25 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[CORAL, "#3B82F6", TEAL, GOLD].map((c, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white/50 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                    {["A", "K", "E", "M"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-semibold" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}>Join professionals from across Africa</p>
                <p className="text-white text-xs" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>Ghana · Kenya · Nigeria · South Africa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[52%] flex flex-col bg-white">
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CORAL }}>
              <img src="/logo-new.png" alt="" className="h-7 w-7 object-contain" />
            </div>
            <div className="font-bold text-base" style={{ color: CHARCOAL }}>Bridgepath<span style={{ color: CORAL }}> Africa</span></div>
          </Link>
          <Link href="/auth/login" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
            Already have an account? <span style={{ color: CORAL }}>Sign in</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <AnimatePresence mode="wait">
            {step === "role" ? (
              <motion.div key="role" className="w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2" style={{ color: CHARCOAL }}>Join Bridgepath Africa</h1>
                  <p className="text-gray-500">Tell us who you are to get the right experience</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <button type="button" onClick={() => { setSelectedRole("job_seeker"); setStep("details"); }}
                    className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:shadow-xl transition-all text-left group"
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = CORAL + "60")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#f3f4f6")}>
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-200" style={{ backgroundColor: CORAL + "12" }}>
                      <UserIcon className="h-7 w-7" style={{ color: CORAL }} />
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: CHARCOAL }}>I'm a Professional</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">Find jobs across Africa and globally, get AI-powered CV feedback, and track every application.</p>
                    <ul className="space-y-2">
                      {["Browse vetted African opportunities", "Free AI CV analysis — instant results", "Apply with one click"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: CORAL }} /> {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center gap-2 text-sm font-bold" style={{ color: CORAL }}>
                      Get started <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>

                  <button type="button" onClick={() => { setSelectedRole("employer"); setStep("details"); }}
                    className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:shadow-xl transition-all text-left group"
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = CHARCOAL + "40")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#f3f4f6")}>
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-200" style={{ backgroundColor: CHARCOAL + "10" }}>
                      <Briefcase className="h-7 w-7" style={{ color: CHARCOAL }} />
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: CHARCOAL }}>I'm an Employer</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">Post roles, discover Africa's top talent, manage applications, and build your team.</p>
                    <ul className="space-y-2">
                      {["Post jobs and reach verified talent", "Access pre-screened candidate profiles", "Launch in Ghana and Kenya first"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: CHARCOAL }} /> {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center gap-2 text-sm font-bold" style={{ color: CHARCOAL }}>
                      Get started <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>

                {/* Quick OAuth on role screen */}
                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center"><span className="text-xs text-gray-400 bg-white px-3">or join instantly with</span></div>
                </div>
                <OAuthButtons role={null} />

                <div className="mt-6 p-4 rounded-xl text-sm text-gray-500 bg-gray-50 border border-gray-100">
                  <span className="font-semibold text-gray-700">For employers:</span> Pricing is customised to your needs. Our team will reach out after you sign up — no obligation.
                </div>
              </motion.div>

            ) : (
              <motion.div key="details" className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>

                {!registered && (
                  <button type="button" onClick={() => { setStep("role"); setSelectedRole(null); setRegistered(false); }}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to account type
                  </button>
                )}

                {!registered && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
                    style={{ backgroundColor: (selectedRole === "employer" ? CHARCOAL : CORAL) + "12", color: selectedRole === "employer" ? CHARCOAL : CORAL }}>
                    {selectedRole === "employer" ? <Briefcase className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
                    {selectedRole === "employer" ? "Employer Account" : "Professional Account"}
                  </div>
                )}

                <div className="mb-6">
                  <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>
                    {registered ? "Check your inbox" : "Create your account"}
                  </h1>
                  {!registered && <p className="text-gray-500 mt-1 text-sm">It's free to join.</p>}
                </div>

                {registered ? (
                  <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-7 text-center shadow-sm">
                    <div className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: CORAL + "15" }}>
                      <Mail className="h-7 w-7" style={{ color: CORAL }} />
                    </div>
                    <h2 className="text-base font-bold mb-1" style={{ color: CHARCOAL }}>Confirm your email</h2>
                    <p className="text-sm text-gray-500 mb-1">We sent a verification link to</p>
                    <p className="text-sm font-semibold text-gray-800 mb-4">{email}</p>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                      Click the link to activate your account. It expires in 24 hours.
                    </p>
                    <Link href="/auth/login"
                      className="inline-flex items-center justify-center h-11 px-6 rounded-xl text-white text-sm font-bold"
                      style={{ backgroundColor: CORAL }}>
                      Go to sign in <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                    <p className="text-xs text-gray-400 mt-4">
                      Didn't receive it? Check spam, or{" "}
                      <button type="button"
                        onClick={async () => {
                          await fetch("/api/auth/resend-verification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
                          toast({ title: "Sent!", description: "A new verification email has been sent." });
                        }}
                        className="underline font-medium" style={{ color: CORAL }}>
                        resend it
                      </button>
                    </p>
                  </div>
                ) : (
                  <>
                    <OAuthButtons role={selectedRole} />

                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                      <div className="relative flex justify-center"><span className="text-xs text-gray-400 bg-white px-3">or with email</span></div>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                          {selectedRole === "employer" ? "Company or Full Name" : "Full Name"}
                        </label>
                        <Input placeholder={selectedRole === "employer" ? "Acme Corp or Your Name" : "Your full name"}
                          value={name} onChange={(e) => setName(e.target.value)}
                          className="h-12 rounded-xl border-gray-200" autoFocus />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input placeholder="name@example.com" type="email" value={email}
                            onChange={(e) => setEmail(e.target.value)} className="h-12 pl-11 rounded-xl border-gray-200" />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input placeholder="At least 8 characters"
                            type={showPassword ? "text" : "password"} value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 pl-11 pr-11 rounded-xl border-gray-200" autoComplete="new-password" />
                          <button type="button" onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <PasswordStrengthMeter password={password} />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                          LinkedIn URL <span className="font-normal text-gray-400 text-xs">(optional)</span>
                        </label>
                        <div className="relative">
                          <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#0A66C2" }} />
                          <Input placeholder="https://linkedin.com/in/your-name"
                            type="url" value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            className="h-12 pl-11 rounded-xl border-gray-200" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Helps employers discover and verify your profile</p>
                      </div>

                      {selectedRole === "employer" && (
                        <div className="flex items-start gap-2.5 p-3.5 rounded-xl text-xs text-gray-600 bg-gray-50 border border-gray-100">
                          <Sparkles className="h-4 w-4 shrink-0 mt-0.5" style={{ color: CHARCOAL }} />
                          <span>Employer pricing is tailored to your needs. Our team will be in touch after sign-up — no commitment required.</span>
                        </div>
                      )}

                      <motion.button type="submit" disabled={isLoading} whileTap={{ scale: 0.98 }}
                        className="w-full h-12 font-bold text-white rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 text-base shadow-md"
                        style={{ backgroundColor: selectedRole === "job_seeker" ? CORAL : CHARCOAL }}>
                        {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</> : <>Create account <ArrowRight className="h-4 w-4" /></>}
                      </motion.button>

                      <p className="text-xs text-gray-400 text-center leading-relaxed">
                        By creating an account you agree to our{" "}
                        <Link href="/legal" className="underline hover:text-gray-600">Terms of Service</Link>{" "}and{" "}
                        <Link href="/legal" className="underline hover:text-gray-600">Privacy Policy</Link>.
                      </p>
                    </form>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
