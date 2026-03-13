export const revalidate = 0;
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";
import { createServerClient } from "@/lib/supabaseClient";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("page", "contact").single();
    return {
      title: data?.meta_title || "Contact | Lumis Studio",
      description: data?.meta_description || "Get in touch with Lumis Studio.",
    };
  } catch {
    return { title: "Contact | Lumis Studio" };
  }
}

export default async function ContactPage() {
  const c = await getContent("contact_page");

  const badge       = c.badge            || "Contact";
  const headline    = c.headline         || "Let's Work Together";
  const subtext     = c.subtext          || "Ready to start a project? Tell us about it. We'll review your inquiry and get back to you with a proposal.";
  const email       = c.email            || "hello@lumisstudio.com";
  const location    = c.location         || "Philippines";
  const response    = c.response         || "Within 24 hours";
  const discTitle   = c.discovery_title  || "Free Discovery Call";
  const discText    = c.discovery_text   || "Book a 30-minute free consultation to discuss your project before committing.";
  const formTitle   = c.form_title       || "Project Inquiry";

  const contactInfo = [
    {
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Response Time",
      value: response,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Location",
      value: location,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="pt-24">
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left — details */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-4">
                {badge}
              </p>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
                {headline}
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10">
                {subtext}
              </p>

              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-[#faf8f4] dark:bg-zinc-900">
                    <div className="w-10 h-10 rounded-xl bg-[#f0ede6] dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-medium text-zinc-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium text-zinc-900 dark:text-white">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800">
                <p className="text-white font-display text-xl font-bold mb-2">{discTitle}</p>
                <p className="text-zinc-400 text-sm">{discText}</p>
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-[#faf8f4] dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 md:p-10 shadow-xl shadow-zinc-100/50 dark:shadow-none">
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-8">
                {formTitle}
              </h2>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
