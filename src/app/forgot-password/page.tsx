"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Shield,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex bg-surface-50">
      {/* Left Panel — Branding (matching login) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800"
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                SaaS OS
              </span>
            </div>
            <p className="text-brand-200 text-sm ml-[52px]">
              SaaS Operating System
            </p>
          </div>

          {/* Hero */}
          <div className="my-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Shield className="w-12 h-12 text-brand-300 mb-6" />
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Secure Account
                <br />
                Recovery
              </h1>
              <p className="text-brand-200 text-lg max-w-md leading-relaxed">
                Your executive dashboard is protected with enterprise-grade
                security. We&apos;ll help you regain access quickly and safely.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-10 space-y-4"
            >
              {[
                "Password reset link sent via secure email",
                "Link expires after 15 minutes for safety",
                "Multi-factor authentication supported",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                  <span className="text-brand-200 text-sm">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="text-brand-400 text-xs">
            Enterprise security &middot; SOC 2 Compliant &middot; SSO Ready
          </div>
        </div>
      </motion.div>

      {/* Right Panel — Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex items-center justify-center p-6 sm:p-12"
      >
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-surface-900 tracking-tight">
                SaaS OS
              </span>
              <p className="text-xs text-surface-500">
                SaaS Operating System
              </p>
            </div>
          </div>

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex justify-center mb-5"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                </motion.div>
                <h2 className="text-xl font-bold text-surface-900 mb-2">
                  Check your email
                </h2>
                <p className="text-surface-500 text-sm leading-relaxed max-w-sm mx-auto mb-2">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-medium text-surface-700">{email}</span>.
                  Click the link in the email to reset your password.
                </p>
                <p className="text-surface-400 text-xs mb-8">
                  The link will expire in 15 minutes. Check your spam folder if
                  you don&apos;t see it.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setEmail("");
                    }}
                    className="btn-secondary w-full text-sm"
                  >
                    Try a different email
                  </button>
                  <Link
                    href="/"
                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                  >
                    Return to sign in
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-surface-900">
                    Reset your password
                  </h2>
                  <p className="text-surface-500 mt-1.5">
                    Enter the email associated with your account and we&apos;ll
                    send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field pl-11"
                        placeholder="you@company.com"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-base"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-surface-400 mt-8">
            Protected by enterprise-grade security &middot; SOC 2 Compliant
          </p>
        </div>
      </motion.div>
    </div>
  );
}
