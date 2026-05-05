import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2, Briefcase, User as UserIcon, ArrowLeft, CheckCircle2, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f9fc" }}>
      <div className="p-6">
        <Link href="/" className="flex flex-col gap-0.5 w-fit">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Bridgepath Africa" className="h-8 w-8 object-contain" />
            <span className="font-bold text-xl" style={{ color: DARK }}>
              Bridgepath<span style={{ color: GREEN }}>Network</span>
            </span>
          </div>
          <span className="text-xs italic text-gray-400 ml-10">Shaping People. Strengthening Institutions.</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
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
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-3" style={{ color: DARK }}>
                  Join Bridgepath Africa
                </h1>
                <p className="text-gray-500">Tell us who you are to get the right experience</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("job_seeker");
                    setStep("details");
                  }}
                  className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-green-400 transition-all text-left group shadow-sm hover:shadow-lg"
                >
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-200"
                    style={{ backgroundColor: `${GREEN}15` }}
                  >
                    <UserIcon className="h-7 w-7" style={{ color: GREEN }} />
                  </div>
                  <h2 className="text-xl font-bold mb-2" style={{ color: DARK }}>
                    I&apos;m a Professional
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    Find jobs across Africa and globally, get AI-powered CV review, and track your applications.
                  </p>
                  <ul className="space-y-2">
                    {["Browse 1,000+ African opportunities", "Free AI CV Analysis", "Apply with one click"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: GREEN }} /> {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: GREEN }}>
                    Get started <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("employer");
                    setStep("details");
                  }}
                  className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-400 transition-all text-left group shadow-sm hover:shadow-lg"
                >
                  <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 duration-200"
                    style={{ backgroundColor: `${DARK}12` }}
                  >
                    <Briefcase className="h-7 w-7" style={{ color: DARK }} />
                  </div>
                  <h2 className="text-xl font-bold mb-2" style={{ color: DARK }}>
                    I&apos;m an Employer
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    Post jobs, discover Africa&apos;s top talent, manage applications, and build your remote team.
                  </p>
                  <ul className="space-y-2">
                    {["Post unlimited job listings", "Access verified candidate profiles", "Start in Ghana and Kenya, then expand across Africa"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: DARK }} /> {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: DARK }}>
                    Get started <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-8">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: GREEN }}>
                  Sign in
                </Link>
              </p>
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
                  onClick={() => {
                    setStep("role");
                    setSelectedRole(null);
                    setRegistered(false);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}

              <div className="mb-6">
                <h1 className="text-2xl font-bold" style={{ color: DARK }}>
                  {registered ? "Check your inbox" : "Create your account"}
                </h1>
                {!registered && (
                  <p className="text-gray-500 mt-1 text-sm">
                    {selectedRole === "employer" ? "Employer account" : "Professional account"} · You&apos;ll confirm your email before signing in
                  </p>
                )}
              </div>

              {registered ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${GREEN}15` }}
                  >
                    <Mail className="h-7 w-7" style={{ color: GREEN }} />
                  </div>
                  <h2 className="text-base font-semibold text-gray-800 mb-1">Confirm your email</h2>
                  <p className="text-sm text-gray-500 mb-1">
                    We sent a confirmation email to
                  </p>
                  <p className="text-sm font-medium text-gray-800 mb-4">{email}</p>
                  <p className="text-xs text-gray-400 mb-5 leading-relaxed">
                    Click the link in the email to verify your account. Once confirmed, your profile will be saved and you can sign in with your email and password.
                  </p>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center h-10 px-5 rounded-lg text-white text-sm font-semibold"
                    style={{ backgroundColor: GREEN }}
                  >
                    Go to sign in
                  </Link>
                  <p className="text-xs text-gray-400 mt-4">
                    Didn&apos;t receive it? Check your spam folder.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">
                      {selectedRole === "employer" ? "Company / Full Name" : "Full Name"}
                    </label>
                    <Input
                      placeholder={selectedRole === "employer" ? "Acme Corp or Your Name" : "Your full name"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="At least 8 characters"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 pl-10 pr-10"
                        autoComplete="new-password"
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
                    <p className="text-xs text-gray-400 mt-1.5">Minimum 8 characters</p>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-12 font-semibold text-white rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 text-base shadow-md"
                    style={{ backgroundColor: selectedRole === "job_seeker" ? GREEN : DARK }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                      </>
                    ) : (
                      <>
                        Create account <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: GREEN }}>
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
