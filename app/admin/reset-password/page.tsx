"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValid(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setValid(true);
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
    if (error) { toast.error(error.message); } else {
      toast.success("Password updated! Redirecting...");
      setTimeout(() => router.replace("/admin"), 1500);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const strengthLabel = ["","Weak","Fair","Good","Strong"];
  const strengthColor = ["","bg-red-500","bg-amber-500","bg-blue-500","bg-emerald-500"];

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center text-white font-display font-black text-xl mx-auto mb-4">L</span>
          <h1 className="font-display text-2xl font-bold text-white mb-1">Set New Password</h1>
          <p className="text-zinc-500 text-sm">Choose a strong password for your account.</p>
        </div>

        {!valid ? (
          <div className="text-center text-zinc-500 text-sm">
            <p>This link is invalid or has expired.</p>
            <a href="/admin/login" className="text-gold-400 hover:text-gold-300 mt-2 inline-block">Back to login →</a>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">New Password</label>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Min. 8 characters" required
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"/>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map((i)=><div key={i} className={`flex-1 h-1 rounded-full transition-all ${i<=strength ? strengthColor[strength] : "bg-zinc-700"}`}/>)}
                  </div>
                  <p className={`text-[11px] ${strengthColor[strength].replace("bg-","text-")}`}>{strengthLabel[strength]}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm Password</label>
              <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Re-enter password" required
                className={`w-full px-4 py-3 rounded-xl border bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-colors ${
                  confirm.length > 0 ? (confirm === password ? "border-emerald-500/50" : "border-red-500/50") : "border-zinc-700"
                }`}/>
              {confirm.length > 0 && confirm !== password && <p className="text-[11px] text-red-400 mt-1">Passwords do not match</p>}
              {confirm.length > 0 && confirm === password && <p className="text-[11px] text-emerald-400 mt-1">✓ Passwords match</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gold-500 text-white font-semibold text-sm hover:bg-gold-600 disabled:opacity-60 transition-colors mt-2">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
