import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2, Briefcase, User as UserIcon, ArrowLeft, CheckCircle2, ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CORAL = "#D94F20";
const GOLD = "#F0A820";
const CHARCOAL = "#1C1917";

type Step = "role" | "details";

export default function Signup() {
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<"job_seeker" | "employer" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { signUpWithPassword, updateRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const role = new URLSearchParams(window.location.search).get("role");
    if (role === "employer" || role === "job_seeker") {
      setSelectedRole(role);
      setStep("details");
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ variant: "destructive", title: "Name required" });
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast({ variant: "destructive", title: "Invalid email" });
      return;
    }
    if (password.length < 8) {
      toast({ variant: "destructive", title: "Password too short", description: "Use at least 8 characters." });
      return;
    }
    if (!selectedRole) {
      toast({ variant: "destructive", title: "Choose account type", description: "Go back and pick Professional or Employer." });
      return;
    }
    setIsLoading(true);
    updateRole(selectedRole);
    const result = await signUpWithPassword(email.trim(), password, name.trim(), selectedRole);
    setIsLoading(false);
    if (result.error) {
      toast({ variant: "destructive", title: "Could not create account", description: result.error });
      return;
    }
    setRegistered(true);
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* Left panel — vibrant photo side */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col">
        {/* Background image */}
        <img src="/photos/africa-office-team.png" alt="Vibrant African professionals in a modern office"
          className="absolute inset-0 w-full h-full object-cover object-center" />
        {/* Dark gradient for text legibility */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(28,25,23,0.96) 0%, rgba(28,25,23,0.55) 40%, rgba(28,25,23,0.15) 100%)" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CORAL }}>
              <img src="/logo-new.png" alt="Bridgepath Africa" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <div className="font-bold text-xl text-white tracking-tight">Bridgepath Africa</div>
              <div className="text-[10px] text-white/50 italic">Shaping People. Strengthening Institutions.</div>
            </div>
          </Link>

          {/* Bottom promise */}
          <div className="mt-auto">
            <div className="flex gap-2 mb-6">
              {["Free to join", "Ghana & Kenya", "20+ yrs expertise"].map((tag) => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-white"
                  style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Your career in Africa <span style={{ color: GOLD }}>starts here.</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-md">
              Join a platform built on 20 years of HR expertise — connecting Africa's brightest professionals with ambitious global employers.
            </p>

            {/* Social proof */}
            <div className="mt-6 pt-6 border-t border-white/15 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[CORAL, "#3B82F6", "#10B981", GOLD].map((c, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                    {["A", "K", "E", "M"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Join professionals from across Africa</p>
                <p className="text-white/50 text-xs">Ghana · Kenya · Nigeria · South Africa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-[52%] flex flex-col bg-white">
        {/* Top bar */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 lg:hidden" style={{ backgroundColor: CORAL }}>
              <img src="/logo-new.png" alt="" className="h-7 w-7 object-contain" />
            </div>
            <div className="lg:hidden">
              <div className="font-bold text-base" style={{ color: CHARCOAL }}>Bridgepath<span style={{ color: CORAL }}> Africa</span></div>
            </div>
            <div className="hidden lg:flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CORAL }}>
                <img src="/logo-new.png" alt="" className="h-7 w-7 object-contain" />
              </div>
              <div className="font-bold text-base" style={{ color: CHARCOAL }}>Bridgepath<span style={{ color: CORAL }}> Africa</span></div>
            </div>
          </Link>
          <Link href="/auth/login" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
            Already have an account? <span style={{ color: CORAL }}>Sign in</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <AnimatePresence mode="wait">
            {step === "role" ? (
              <motion.div
                key="role"
                className="w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <h1 className="text-3xl font-bold mb-2" style={{ color: CHARCOAL }}>Join Bridgepath Africa</h1>
                  <p className="text-gray-500">Tell us who you are to get the right experience</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Job Seeker card */}
                  <button
                    type="button"
                    onClick={() => { setSelectedRole("job_seeker"); setStep("details"); }}
                    className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:shadow-xl transition-all text-left group"
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = CORAL + "60")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#f3f4f6")}
                  >
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-200"
                      style={{ backgroundColor: CORAL + "12" }}>
                      <UserIcon className="h-7 w-7" style={{ color: CORAL }} />
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: CHARCOAL }}>I'm a Professional</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">
                      Find jobs across Africa and globally, get AI-powered CV feedback, and track every application.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Browse vetted African opportunities",
                        "Free AI CV analysis — instant results",
                        "Apply with one click",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: CORAL }} /> {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center gap-2 text-sm font-bold" style={{ color: CORAL }}>
                      Get started <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>

                  {/* Employer card */}
                  <button
                    type="button"
                    onClick={() => { setSelectedRole("employer"); setStep("details"); }}
                    className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:shadow-xl transition-all text-left group"
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = CHARCOAL + "40")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#f3f4f6")}
                  >
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-200"
                      style={{ backgroundColor: CHARCOAL + "10" }}>
                      <Briefcase className="h-7 w-7" style={{ color: CHARCOAL }} />
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: CHARCOAL }}>I'm an Employer</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">
                      Post roles, discover Africa's top talent, manage applications, and build your team.
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Post jobs and reach verified talent",
                        "Access pre-screened candidate profiles",
                        "Launch in Ghana and Kenya first",
                      ].map((item) => (
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

                {/* Employer note */}
                <div className="mt-6 p-4 rounded-xl text-sm text-gray-500 bg-gray-50 border border-gray-100">
                  <span className="font-semibold text-gray-700">For employers:</span> Pricing is customised based on your services and requirements. Once you're registered, our team will reach out to discuss the right solution for you — at no obligation.
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {!registered && (
                  <button
                    type="button"
                    onClick={() => { setStep("role"); setSelectedRole(null); setRegistered(false); }}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to account type
                  </button>
                )}

                {/* Role badge */}
                {!registered && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
                    style={{ backgroundColor: (selectedRole === "employer" ? CHARCOAL : CORAL) + "12", color: selectedRole === "employer" ? CHARCOAL : CORAL }}>
                    {selectedRole === "employer" ? <Briefcase className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
                    {selectedRole === "employer" ? "Employer Account" : "Professional Account"}
                  </div>
                )}

                <div className="mb-7">
                  <h1 className="text-2xl font-bold" style={{ color: CHARCOAL }}>
                    {registered ? "Check your inbox" : "Create your account"}
                  </h1>
                  {!registered && (
                    <p className="text-gray-500 mt-1 text-sm">It's free to join. You'll confirm your email to activate.</p>
                  )}
                </div>

                {registered ? (
                  <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-7 text-center shadow-sm">
                    <div className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: CORAL + "15" }}>
                      <Mail className="h-7 w-7" style={{ color: CORAL }} />
                    </div>
                    <h2 className="text-base font-bold mb-1" style={{ color: CHARCOAL }}>Confirm your email</h2>
                    <p className="text-sm text-gray-500 mb-1">We sent a confirmation link to</p>
                    <p className="text-sm font-semibold text-gray-800 mb-4">{email}</p>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                      Click the link in the email to verify your account. Once confirmed, you can sign in and start exploring.
                    </p>
                    <Link href="/auth/login"
                      className="inline-flex items-center justify-center h-11 px-6 rounded-xl text-white text-sm font-bold"
                      style={{ backgroundColor: CORAL }}>
                      Go to sign in <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                    <p className="text-xs text-gray-400 mt-4">Didn't receive it? Check your spam folder.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                        {selectedRole === "employer" ? "Company or Full Name" : "Full Name"}
                      </label>
                      <Input
                        placeholder={selectedRole === "employer" ? "Acme Corp or Your Name" : "Your full name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 rounded-xl border-gray-200"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="name@example.com"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 pl-11 rounded-xl border-gray-200"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="At least 8 characters"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 pl-11 pr-11 rounded-xl border-gray-200"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">Minimum 8 characters</p>
                    </div>

                    {selectedRole === "employer" && (
                      <div className="flex items-start gap-2.5 p-3.5 rounded-xl text-xs text-gray-600 bg-gray-50 border border-gray-100">
                        <Sparkles className="h-4 w-4 shrink-0 mt-0.5" style={{ color: CHARCOAL }} />
                        <span>Employer pricing is tailored to your needs. After signing up, our team will be in touch to discuss services — no commitment required.</span>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-12 font-bold text-white rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 text-base shadow-md"
                      style={{ backgroundColor: selectedRole === "job_seeker" ? CORAL : CHARCOAL }}
                    >
                      {isLoading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
                      ) : (
                        <>Create account <ArrowRight className="h-4 w-4" /></>
                      )}
                    </motion.button>

                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      By creating an account you agree to our{" "}
                      <Link href="/legal" className="underline hover:text-gray-600">Terms of Service</Link>{" "}
                      and{" "}
                      <Link href="/legal" className="underline hover:text-gray-600">Privacy Policy</Link>.
                    </p>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
