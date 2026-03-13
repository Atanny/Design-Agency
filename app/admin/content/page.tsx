"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { DEFAULTS } from "@/lib/content";

type ContentRow = { id?: string; section: string; key: string; value: string; label?: string; type?: string };

const SECTIONS = [
  { key: "navbar",               label: "Navigation Bar" },
  { key: "hero",                 label: "Hero Section" },
  { key: "services_section",     label: "Services Section" },
  { key: "portfolio_section",    label: "Portfolio Section" },
  { key: "testimonials_section", label: "Testimonials Section" },
  { key: "cta_section",          label: "CTA Section" },
  { key: "contact_section",      label: "Contact (Homepage)" },
  { key: "contact_page",         label: "Contact Page" },
  { key: "footer",               label: "Footer" },
  { key: "services_page",        label: "Services Page" },
];

const LABELS: Record<string, Record<string, string>> = {
  navbar: { logo_name: "Logo Name", logo_tagline: "Logo Tagline", cta_button: "CTA Button Text" },
  hero: {
    badge: "Badge Text", headline_line1: "Headline Line 1", headline_accent: "Headline Accent",
    headline_line2: "Headline Line 2", headline_line3: "Headline Line 3",
    subheadline: "Subheadline", cta_button: "CTA Button",
    stat1_value: "Stat 1 Value", stat1_label: "Stat 1 Label",
    stat2_value: "Stat 2 Value", stat2_label: "Stat 2 Label",
    stat3_value: "Stat 3 Value", stat3_label: "Stat 3 Label",
  },
  services_section: { badge: "Badge", headline: "Headline", subtext: "Subtext" },
  portfolio_section: { badge: "Badge", headline: "Headline", view_all: "View All Button" },
  testimonials_section: { badge: "Badge", headline: "Headline" },
  cta_section: { badge: "Badge", headline: "Headline", subtext: "Subtext", button_text: "Button Text" },
  contact_section: { badge: "Badge", headline: "Headline", subtext: "Subtext" },
  contact_page: {
    headline: "Page Headline", subtext: "Page Subtext", email: "Contact Email",
    location: "Location", response: "Response Time",
    discovery_title: "Discovery Box Title", discovery_text: "Discovery Box Text",
  },
  footer: { tagline: "Tagline", copyright_suffix: "Copyright Suffix", made_in: "Made In Location" },
  services_page: { badge: "Page Badge", headline: "Page Headline", subtext: "Page Subtext" },
};

const TEXTAREA_KEYS = ["subheadline", "subtext", "tagline", "discovery_text", "description"];

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState("hero");
  const [data, setData] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSection = async (section: string) => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("site_content")
      .select("key, value")
      .eq("section", section);

    const defaults = DEFAULTS[section] || {};
    const fromDb: Record<string, string> = {};
    (rows || []).forEach((r: { key: string; value: string }) => { fromDb[r.key] = r.value; });
    const merged = { ...defaults, ...fromDb };
    setData(merged);
    setOriginal(merged);
    setLoading(false);
  };

  useEffect(() => { fetchSection(activeSection); }, [activeSection]);

  const handleSave = async () => {
    setSaving(true);
    // Find changed keys
    const changed = Object.entries(data)
      .filter(([k, v]) => v !== original[k])
      .map(([key, value]) => ({ section: activeSection, key, value }));

    if (changed.length === 0) {
      toast("No changes to save.");
      setSaving(false);
      return;
    }

    const res = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates: changed }),
    });

    setSaving(false);
    if (res.ok) {
      setOriginal({ ...data });
      toast.success(`${changed.length} field${changed.length > 1 ? "s" : ""} saved!`);
    } else {
      toast.error("Failed to save. Please try again.");
    }
  };

  const keys = Object.keys(DEFAULTS[activeSection] || {});
  const labels = LABELS[activeSection] || {};
  const hasChanges = JSON.stringify(data) !== JSON.stringify(original);

  return (
    <div className="p-8 w-full max-w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Content Editor</h1>
          <p className="text-zinc-500 mt-1">Edit all visible text across your website</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Preview Site
        </a>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Section tabs */}
        <div className="space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === s.key
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="col-span-3">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold">
                {SECTIONS.find((s) => s.key === activeSection)?.label}
              </h2>
              {hasChanges && (
                <span className="text-xs text-amber-400 font-medium">● Unsaved changes</span>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-12 rounded-lg bg-zinc-800 animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-5">
                {keys.map((key) => {
                  const isTextarea = TEXTAREA_KEYS.some((t) => key.includes(t)) || (data[key] || "").length > 80;
                  return (
                    <div key={key}>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5 capitalize">
                        {labels[key] || key.replace(/_/g, " ")}
                      </label>
                      {isTextarea ? (
                        <textarea
                          value={data[key] || ""}
                          onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 resize-none transition-all"
                        />
                      ) : (
                        <input
                          type="text"
                          value={data[key] || ""}
                          onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-3 mt-8 pt-6 border-t border-zinc-800">
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="px-6 py-2.5 rounded-xl bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setData({ ...original })}
                disabled={!hasChanges}
                className="px-6 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:text-white disabled:opacity-40 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
