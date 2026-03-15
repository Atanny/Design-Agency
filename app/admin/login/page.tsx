"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    setLoading(false);
    if (error) { toast.error(error.message); } else { router.replace("/admin"); }
  };

  const handleForgot = async () => {
    if (!form.email) { toast.error("Enter your email first."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error) { toast.error(error.message); } else { toast.success("Reset link sent! Check your email."); }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative overflow-hidden">
      <svg className="absolute -top-20 -left-20 w-[400px] h-[400px] opacity-[0.06] pointer-events-none" viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="200" r="160" fill="url(#lg1)"/>
        <defs><radialGradient id="lg1"><stop offset="0%" stopColor="#e8bd5a"/><stop offset="100%" stopColor="#c8891a" stopOpacity="0"/></radialGradient></defs>
      </svg>
      <svg className="absolute -bottom-20 -right-20 w-[350px] h-[350px] opacity-[0.05] pointer-events-none" viewBox="0 0 350 350" fill="none">
        <polygon points="175,10 340,100 340,250 175,340 10,250 10,100" fill="url(#lg2)"/>
        <defs><radialGradient id="lg2"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#7c3aed" stopOpacity="0"/></radialGradient></defs>
      </svg>
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(200,137,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,137,26,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 gradient-gold flex items-center justify-center text-white font-display font-black text-xl mx-auto mb-6 shadow-2xl shadow-gold-500/30"
            style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
            A
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold-500/60" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-600">Admin Panel</span>
            <div className="h-px w-8 bg-gold-500/60" />
          </div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">Sign In</h1>
          <p className="text-zinc-600 text-sm mt-2">Sign in to your dashboard</p>
        </div>

        {confirmed && (
          <div className="mb-5 p-3 border border-emerald-500/20 bg-emerald-500/8 text-emerald-400 text-sm text-center font-semibold">
            ✓ Email confirmed! You can now sign in.
          </div>
        )}
        {linkError && (
          <div className="mb-5 p-3 border border-red-500/20 bg-red-500/8 text-red-400 text-sm text-center">
            This link is invalid or has expired.
          </div>
        )}

        <form onSubmit={handleLogin}
          className="bg-[#0c0c0c] border border-zinc-800/60 p-8 card-grain"
          style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}
        >
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com" required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-gold-500/50 transition-colors"/>
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••" required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-700 focus:outline-none focus:border-gold-500/50 transition-colors"/>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-white text-zinc-900 text-sm font-black tracking-wide hover:bg-gold-500 hover:text-white transition-all duration-300 disabled:opacity-50 mb-4"
            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Signing in...
              </span>
            ) : "Sign In"}
          </button>

          <button type="button" onClick={handleForgot}
            className="w-full text-center text-xs text-zinc-600 hover:text-gold-400 transition-colors">
            Forgot password? Send reset link
          </button>
        </form>

        <div className="absolute top-4 right-0 w-4 h-4 border-r border-t border-gold-400/20" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-gold-400/20" />
      </motion.div>
    </div>
  );
}
