"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

interface EmailSender {
  id: string;
  name: string;
  email: string;
  is_default: boolean;
  created_at: string;
}

export default function AdminSettings() {
  const [senders, setSenders] = useState<EmailSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [addForm, setAddForm] = useState({ name: "", email: "" });
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchSenders = async () => {
    const { data } = await supabase.from("email_senders").select("*").order("is_default", { ascending: false });
    setSenders((data as EmailSender[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSenders(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email) { toast.error("Name and email required."); return; }
    setAdding(true);
    const isFirst = senders.length === 0;
    const { error } = await supabase.from("email_senders").insert([{ ...addForm, is_default: isFirst }]);
    setAdding(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Email sender added!");
      setAddForm({ name: "", email: "" });
      setShowAddForm(false);
      fetchSenders();
    }
  };

  const setDefault = async (id: string) => {
    await supabase.from("email_senders").update({ is_default: false }).neq("id", id);
    await supabase.from("email_senders").update({ is_default: true }).eq("id", id);
    setSenders((prev) => prev.map((s) => ({ ...s, is_default: s.id === id })));
    toast.success("Default sender updated.");
  };

  const deleteSender = async (id: string) => {
    if (!confirm("Delete this sender?")) return;
    await supabase.from("email_senders").delete().eq("id", id);
    setSenders((prev) => prev.filter((s) => s.id !== id));
    toast.success("Sender removed.");
  };

  return (
    <div className="p-8 w-full max-w-full">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-500 mt-1">Email configuration and sender management.</p>
      </div>

      {/* Resend setup guide */}
      <div className="p-6 rounded-2xl border border-amber-800/30 bg-amber-900/10 mb-8">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-amber-300 font-semibold mb-2">Email Setup Required (Resend)</h3>
            <ol className="text-amber-200/70 text-sm space-y-1 list-decimal list-inside">
              <li>Sign up free at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline text-amber-300">resend.com</a></li>
              <li>Go to Domains → Add Domain → verify your domain (e.g. lumisstudio.com)</li>
              <li>Go to API Keys → Create API Key</li>
              <li>Add to Vercel: <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">RESEND_API_KEY = re_xxxxxxxxx</code></li>
              <li>Use <strong>verified domain emails</strong> as your "From" address below</li>
            </ol>
            <p className="text-amber-200/50 text-xs mt-3">
              Free tier: 100 emails/day, 3,000/month. No credit card required.
            </p>
          </div>
        </div>
      </div>

      {/* Email Senders */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold">Email Senders</h2>
            <p className="text-zinc-500 text-xs mt-0.5">
              These appear in the "From" dropdown when replying to messages.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-500/20 text-gold-400 text-sm font-medium hover:bg-gold-500/30 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Sender
          </button>
        </div>

        {/* Add form */}
        {showAddForm && (
          <form onSubmit={handleAdd} className="mb-5 p-4 rounded-xl bg-zinc-800 border border-zinc-700">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Lumis Studio"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="hello@yourdomain.com"
                  className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>
            <p className="text-xs text-zinc-600 mb-3">
              ⚠️ This email must be on a verified domain in Resend, or emails will fail.
            </p>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={adding}
                className="px-4 py-2 rounded-lg bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 disabled:opacity-60 transition-colors"
              >
                {adding ? "Adding..." : "Add Sender"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="space-y-2">{[...Array(2)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-zinc-800 animate-pulse" />)}</div>
        ) : senders.length === 0 ? (
          <p className="text-center py-8 text-zinc-600 text-sm">
            No senders added yet. Add one above to enable in-app email replies.
          </p>
        ) : (
          <div className="space-y-2">
            {senders.map((sender) => (
              <div
                key={sender.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  sender.is_default
                    ? "border-gold-700/40 bg-gold-900/10"
                    : "border-zinc-800 bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    sender.is_default ? "gradient-gold text-white" : "bg-zinc-700 text-zinc-400"
                  }`}>
                    {sender.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{sender.name}</p>
                    <p className="text-zinc-400 text-xs">{sender.email}</p>
                  </div>
                  {sender.is_default && (
                    <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 text-xs font-medium">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!sender.is_default && (
                    <button
                      onClick={() => setDefault(sender.id)}
                      className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 text-xs hover:text-white transition-colors"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => deleteSender(sender.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Env var checklist */}
      <div className="mt-6 p-5 rounded-2xl border border-zinc-800 bg-zinc-900">
        <h3 className="text-white font-semibold mb-4">Required Environment Variables</h3>
        <div className="space-y-2">
          {[
            { key: "NEXT_PUBLIC_SUPABASE_URL", desc: "Supabase project URL" },
            { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", desc: "Supabase anon/public key" },
            { key: "SUPABASE_SERVICE_ROLE_KEY", desc: "Supabase service role key (server only)" },
            { key: "RESEND_API_KEY", desc: "Resend API key for sending emails" },
            { key: "NEXT_PUBLIC_SITE_URL", desc: "Your live site URL (for SEO)" },
          ].map((env) => (
            <div key={env.key} className="flex items-center gap-3 py-2">
              <code className="text-xs bg-zinc-800 text-gold-300 px-2 py-1 rounded font-mono">{env.key}</code>
              <span className="text-zinc-500 text-xs">{env.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
