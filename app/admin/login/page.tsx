"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const confirmed = searchParams?.get("confirmed") === "1";
  const linkError = searchParams?.get("error");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      router.replace("/admin");
    }
  };

  const handleForgot = async () => {
    if (!form.email) { toast.error("Enter your email first."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    if (error) { toast.error(error.message); } else {
      toast.success("Reset link sent! Check your email.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <span className="inline-flex w-12 h-12 rounded-2xl gradient-gold items-center justify-center text-white font-display font-bold text-xl mb-4">
            L
          </span>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Admin Login
          </h1>
          <p className="text-zinc-500 text-sm">
            Sign in to your dashboard
          </p>
        </div>

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 transition-all text-sm"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl gradient-gold text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
            <button type="button" onClick={handleForgot} className="w-full text-center text-xs text-zinc-500 hover:text-gold-400 transition-colors mt-3">
              Forgot password? Send reset link
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// Forgot password is handled via Supabase magic link — send from Supabase Auth dashboard
// or implement via supabase.auth.resetPasswordForEmail()
