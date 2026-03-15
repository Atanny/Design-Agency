"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setSessionReady(true);
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (password !== confirm) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      await supabase.auth.signOut();
      setTimeout(() => router.replace("/admin/login"), 1500);
    }
  };

  const strength = password.length === 0 ? 0
    : password.length < 8 ? 1
    : password.length < 12 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];
  const strengthText  = ["", "text-red-400", "text-amber-400", "text-blue-400", "text-emerald-400"];

  if (checking) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center text-white font-display font-black text-xl mx-auto mb-4 shadow-lg shadow-gold-500/25">L</span>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Set New Password</h1>
          <p className="text-zinc-500 text-sm">Choose a strong new password for your account.</p>
        </div>

        {!sessionReady ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p className="text-white font-semibold mb-2">Link Expired or Invalid</p>
            <p className="text-zinc-500 text-sm mb-6">This password reset link has expired or already been used. Request a new one.</p>
            <a href="/admin/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-white text-sm font-semibold rounded-xl hover:bg-gold-600 transition-colors">
              Back to Login
            </a>
          </div>
        ) : (
          <form onSubmit={handleReset} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-2">
              <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-emerald-400 text-xs font-semibold">Identity verified — you can now set a new password.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters" required autoFocus
                className="w-full px-4 py-3 border border-zinc-800 bg-zinc-900 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"/>
              {password.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex gap-1 mb-1.5">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : "bg-zinc-700"}`} />
                    ))}
                  </div>
                  <p className={`text-[11px] font-semibold ${strengthText[strength]}`}>{strengthLabel[strength]} password</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password" required
                className={`w-full px-4 py-3 rounded-xl border bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all ${
                  confirm.length > 0
                    ? confirm === password ? "border-emerald-500/60" : "border-red-500/50"
                    : "border-zinc-700"
                }`}/>
              {confirm.length > 0 && (
                <p className={`text-[11px] mt-1.5 font-semibold ${confirm === password ? "text-emerald-400" : "text-red-400"}`}>
                  {confirm === password ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading || password !== confirm || password.length < 8}
              className="w-full py-3.5 rounded-xl bg-gold-500 text-white font-semibold text-sm hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Updating...
                </span>
              ) : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
