import { createServerClient } from "./supabaseClient";

const DEFAULTS: Record<string, Record<string, string>> = {
  navbar: {
    logo_name: "",
    logo_image: "",
    cta_button: "Hire Me",
    social_facebook: "#",
    social_instagram: "#",
    social_tiktok: "#",
    social_behance: "#",
  },
  hero: {
    badge: "Open for Freelance",
    headline_line1: "I Design",
    headline_accent: "Brands",
    headline_line2: "That People",
    headline_line3: "Remember",
    subheadline: "Freelance designer crafting brand identities, UI/UX, and visual experiences that make your business impossible to ignore.",
    cta_button: "Hire Me",
    stat1_value: "",
    stat1_label: "Projects Delivered",
    stat2_label: "Client Satisfaction",
    stat3_label: "Average Rating",
    bg_image: "",
  },
  services_section: {
    badge: "What I Do",
    headline: "My Services",
    subtext: "From brand foundations to polished digital products — I offer end-to-end design that works.",
  },
  portfolio_section: {
    badge: "My Work",
    headline: "Selected Projects",
    view_all: "See All Projects",
    bg_image: "",
  },
  process_section: {
    badge: "How I Work",
    headline_line1: "Simple process,",
    headline_line2: "extraordinary",
    headline_line3: "results",
    subtext: "I keep things clear and collaborative. You'll know exactly what's happening at every stage.",
    step1_num: "01", step1_title: "We Talk",     step1_desc: "Tell me about your project, goals, and timeline. I'll ask the right questions to understand exactly what you need.",
    step2_num: "02", step2_title: "I Design",    step2_desc: "I create focused concepts tailored to your brand. You review, give feedback, and I refine until it's perfect.",
    step3_num: "03", step3_title: "You Launch",  step3_desc: "You get print-ready or screen-ready files, properly organised. No extra fees, no surprises.",
    bg_image: "",
  },
  why_us_section: {
    badge: "Why Work With Me",
    headline: "Personal attention",
    headline_italic: "every project",
    card1_title: "Fast Turnaround",      card1_desc: "Most projects delivered within 3–7 days. I respect your deadlines like they're my own.",
    card2_title: "Direct Communication", card2_desc: "You work directly with me — no account managers, no handoffs, no miscommunication.",
    card3_title: "Unlimited Revisions",  card3_desc: "I refine until you're genuinely happy. Your satisfaction is the only milestone that matters.",
    bg_image: "",
  },
  testimonials_section: {
    badge: "Client Words",
    headline: "What clients say",
  },
  cta_section: {
    badge: "Let's Work Together",
    headline: "Got a project in mind?",
    subtext: "I'd love to hear about it. Let's create something you're proud to show off.",
    button_text: "Start a Conversation",
    bg_image: "",
  },
  contact_section: {
    badge: "Get In Touch",
    headline: "Let's talk about your project",
    subtext: "Drop me a message and I'll get back to you within 24 hours.",
  },
  contact_page: {
    badge: "Contact",
    headline: "Let's Work Together",
    subtext: "I'm currently available for new projects. Tell me what you're building and let's see if we're a good fit.",
    email: "",
    location: "Philippines",
    response: "Within 24 hours",
    discovery_title: "Free Discovery Call",
    discovery_text: "Not sure what you need yet? Book a free 30-minute call — no pressure, no commitment.",
    form_title: "Project Inquiry",
    bg_image: "",
  },
  reviews_section: {
    badge: "Client Reviews",
    headline: "Kind words",
    subtext: "Real feedback from real clients. I'm proud of every project here.",
    cta_title: "Leave a Review",
    cta_text: "Worked with me? I'd really appreciate hearing your thoughts. Reviews go live within 24 hours.",
  },
  offer_card: {
    title: "Get a Custom Quote",
    description: "Every project is different. Tell me what you need and I'll send a tailored proposal — no obligation, no pressure.",
    item1: "Free initial consultation",
    item2: "Pricing tailored to your scope",
    item3: "Response within 24 hours",
    item4: "No hidden fees, ever",
    button_text: "Request a Quote",
  },
  footer: {
    tagline: "Freelance designer crafting brands, interfaces, and visual experiences that get noticed.",
    copyright_suffix: "All rights reserved.",
    made_in: "Philippines",
  },
  services_page: {
    badge: "Services",
    headline: "What I Offer",
    subtext: "Focused design services delivered personally by me — not outsourced, not templated.",
    bg_image: "",
  },
};

type ContentMap = Record<string, string>;

export async function getContent(section: string): Promise<ContentMap> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("site_content").select("key, value").eq("section", section);
    const base = DEFAULTS[section] || {};
    if (!data || data.length === 0) return base;
    const fromDb: ContentMap = {};
    data.forEach((row: { key: string; value: string }) => { fromDb[row.key] = row.value; });
    return { ...base, ...fromDb };
  } catch {
    return DEFAULTS[section] || {};
  }
}

export async function getAllContent(): Promise<Record<string, Record<string, string>>> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("site_content").select("section, key, value");
    const result: Record<string, Record<string, string>> = JSON.parse(JSON.stringify(DEFAULTS));
    if (data) {
      data.forEach((row: { section: string; key: string; value: string }) => {
        if (!result[row.section]) result[row.section] = {};
        result[row.section][row.key] = row.value;
      });
    }
    return result;
  } catch { return DEFAULTS; }
}

export { DEFAULTS };
