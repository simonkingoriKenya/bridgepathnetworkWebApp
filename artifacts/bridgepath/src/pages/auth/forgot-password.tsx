import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";

const GREEN = "#8CC63F";
const DARK = "#1a2340";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

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
          Reset your password
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Contact our support team to reset your password.
        </p>

        {sent ? (
          <div className="text-center py-4">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${GREEN}15` }}
            >
              <Mail className="h-7 w-7" style={{ color: GREEN }} />
            </div>
            <p className="text-sm text-gray-700 font-medium mb-1">Request sent</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Our team will get back to you at <strong>{email}</strong> shortly.
            </p>
            <Link href="/auth/login" className="text-sm font-semibold underline" style={{ color: GREEN }}>
              Return to sign in
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) setSent(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-11 font-semibold text-white rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: GREEN }}
            >
              Send reset request
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
