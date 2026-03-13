import { createServerClient } from "@/lib/supabaseClient";

// Default fallback values for all sections
export const DEFAULTS: Record<string, Record<string, string>> = {
  navbar: {
    logo_name: "Lumis",
    logo_tagline: "Studio",
    cta_button: "Contact Us",
  },
  hero: {
    badge: "Premium Design Studio",
    headline_line1: "We Design",
    headline_accent: "Experiences",
    headline_line2: "That Elevate",
    headline_line3: "Your Brand",
    subheadline: "From brand identity to full digital experiences — we craft design that doesn't just look beautiful, it drives results.",
    cta_button: "Contact Us",
    stat1_value: "200+",
    stat1_label: "Projects Completed",
    stat2_value: "98%",
    stat2_label: "Client Satisfaction",
    stat3_value: "5★",
    stat3_label: "Average Rating",
  },
  services_section: {
    badge: "What We Do",
    headline: "Design Services",
    subtext: "From brand foundations to full digital products, we offer the complete design spectrum.",
  },
  portfolio_section: {
    badge: "Our Work",
    headline: "Recent Projects",
    view_all: "View All Work",
  },
  testimonials_section: {
    badge: "Testimonials",
    headline: "What Clients Say",
  },
  cta_section: {
    badge: "Ready?",
    headline: "Ready to bring your brand to life?",
    subtext: "Let's create something extraordinary together.",
    button_text: "Contact Us",
  },
  contact_section: {
    badge: "Get In Touch",
    headline: "Tell Us About Your Project",
    subtext: "Fill out the form below and we'll get back to you within 24 hours.",
  },
  contact_page: {
    headline: "Let's Work Together",
    subtext: "Ready to start a project? Tell us about it.",
    email: "hello@lumisstudio.com",
    location: "Philippines",
    response: "Within 24 hours",
    discovery_title: "Free Discovery Call",
    discovery_text: "Book a 30-minute free consultation to discuss your project before committing.",
  },
  footer: {
    tagline: "We craft premium digital experiences that elevate brands. Design is not just what it looks like — it's how it works.",
    copyright_suffix: "All rights reserved.",
    made_in: "Philippines",
  },
  services_page: {
    badge: "Services",
    headline: "Design Services",
    subtext: "Premium design services tailored to grow your brand.",
  },
};

// Server-side function to fetch content from Supabase with fallback to defaults
export async function getContent(section: string): Promise<Record<string, string>> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("site_content")
      .select("key, value")
      .eq("section", section);

    const defaults = DEFAULTS[section] || {};
    const fromDb: Record<string, string> = {};
    (data || []).forEach((r: { key: string; value: string }) => {
      fromDb[r.key] = r.value;
    });

    return { ...defaults, ...fromDb };
  } catch {
    return DEFAULTS[section] || {};
  }
}
