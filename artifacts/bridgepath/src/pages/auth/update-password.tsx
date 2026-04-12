import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

export default function UpdatePassword() {
  const [, setLocation] = useLocation();
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(!!session);
      }
    });

    const t = window.setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setReady(true);
      else setLocation("/auth/forgot-password");
    }, 150);

    return () => {
      subscription.unsubscribe();
      window.clearTimeout(t);
    };
  }, [setLocation]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Password too short", description: "Use at least 6 characters." });
      return;
    }
    if (password !== confirm) {
      toast({ variant: "destructive", title: "Passwords do not match" });
      return;
    }
    setLoading(true);
    const res = await updatePassword(password);
    setLoading(false);
    if (res.error) {
      toast({ variant: "destructive", title: "Could not update password", description: res.error });
      return;
    }
    toast({ title: "Password updated" });
    setLocation("/auth/login");
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: GREEN }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f8f9fc" }}>
      <motion.div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: DARK }}>New password</h1>
        <p className="text-gray-500 text-sm mb-8">Choose a strong password for your account.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">New password</label>
            <div className="relative">
              <Input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pr-10" autoComplete="new-password" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShow(!show)}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Confirm password</label>
            <Input type={show ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="h-11" autoComplete="new-password" />
          </div>
          <button type="submit" disabled={loading} className="w-full h-11 font-semibold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60" style={{ backgroundColor: GREEN }}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save password"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/auth/login" className="font-semibold" style={{ color: GREEN }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
