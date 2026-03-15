"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

interface ContactFormProps {
  compact?: boolean;
}

export default function ContactForm({ compact = false }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("services")
      .select("title")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setServices([...data.map((s: { title: string }) => s.title), "Other"]);
        } else {
          setServices(["UI/UX Design", "Brand Identity Design", "Poster & Pubmats Design", "Social Media Graphics", "Website UI Design", "Product & App Design", "Other"]);
        }
      });
  }, []);

  const update = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);

    const { error } = await supabase.from("messages").insert([form]);
    if (error) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
      return;
    }

    try {
      const senderRes = await supabase
        .from("email_senders")
        .select("*")
        .eq("is_default", true)
        .single();

      if (senderRes.data) {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "auto_reply",
            toEmail: form.email,
            toName: form.name,
            service: form.service,
            fromName: senderRes.data.name,
            fromEmail: senderRes.data.email,
            contactEmail: senderRes.data.email,
          }),
        });
      }
    } catch { /* auto-reply failure shouldn't block submission */ }

    setLoading(false);
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", service: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
            placeholder="Your full name" required
            className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-[#faf8f4] dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-gold-500/60 transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
            placeholder="your@email.com" required
            className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-[#faf8f4] dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-gold-500/60 transition-all text-sm"
          />
        </div>
      </div>

      {!compact && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Service Needed
          </label>
          <select
            value={form.service} onChange={(e) => update("service", e.target.value)}
            className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-[#faf8f4] dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500/60 transition-all text-sm"
          >
            <option value="">Select a service</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.message} onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us about your project..."
          required rows={compact ? 4 : 6}
          className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-[#faf8f4] dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-gold-500/60 transition-all text-sm resize-none"
        />
      </div>

      <motion.button
        type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white disabled:opacity-60 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : "Send Message"}
      </motion.button>
    </form>
  );
}
