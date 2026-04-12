import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

/** Same as sign-in: resend a magic link for existing accounts. */
export default function ForgotPassword() {
  const { sendSignInMagicLink } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast({ variant: "destructive", title: "Enter a valid email" });
      return;
    }
    setLoading(true);
    const res = await sendSignInMagicLink(email.trim());
    setLoading(false);
    if (res.error) {
      toast({ variant: "destructive", title: "Request failed", description: res.error });
      return;
    }
    setSent(true);
    toast({ title: "Check your email", description: "If this address is registered, we sent a new sign-in link." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f8f9fc" }}>
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/auth/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
        <h1 className="text-2xl font-bold mb-1" style={{ color: DARK }}>
          Resend sign-in link
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter the email you use with Bridgepath. We&apos;ll send another magic link (existing accounts only).
        </p>

        {sent ? (
          <p className="text-sm text-gray-600 leading-relaxed">
            If an account exists for <strong>{email}</strong>, you will receive an email shortly. You can close this tab or{" "}
            <Link href="/auth/login" className="font-semibold underline" style={{ color: GREEN }}>
              return to sign in
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 font-semibold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: GREEN }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send sign-in link"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
