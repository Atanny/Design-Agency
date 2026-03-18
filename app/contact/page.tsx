export const revalidate = 0;
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";
import { createServerClient } from "@/lib/supabaseClient";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("page","contact").single();
    return { title: data?.meta_title||"Contact", description: data?.meta_description||"Hire me for your next design project." };
  } catch { return { title: "Contact" }; }
}

export default async function ContactPage() {
  const c = await getContent("contact_page");
  const badge     = c.badge           || "Contact";
  const headline  = c.headline        || "Let's Work Together";
  const subtext   = c.subtext         || "I'm currently available for new projects. Tell me what you're building and let's see if we're a good fit.";
  const email     = c.email           || "";
  const location  = c.location        || "Philippines";
  const response  = c.response        || "Within 24 hours";
  const discTitle = c.discovery_title || "Free Discovery Call";
  const discText  = c.discovery_text  || "Not sure what you need yet? Book a free 30-minute call — no pressure, no commitment.";
  const bgImage   = c.bg_image        || "";

  return (
    <div className="bg-[#0a0a0a] pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Hero tiles */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          <div className="col-span-12 md:col-span-7 rounded-2xl overflow-hidden relative min-h-[240px] flex flex-col justify-end p-8"
            style={{ background: bgImage ? undefined : "linear-gradient(160deg,#161009,#0c0804)" }}>
            {bgImage && (
              <>
                <img src={bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-black/65" />
              </>
            )}
            {!bgImage && <div className="absolute inset-0 dot-pattern opacity-[0.1]" />}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-5 bg-coral-400" />
                <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-coral-400">{badge}</span>
              </div>
              <h1 className="font-display font-black text-4xl md:text-6xl text-white leading-[0.9] mb-3">{headline}</h1>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md font-light">{subtext}</p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 grid grid-rows-3 gap-3">
            {[
              { icon: "📬", label: "Email", value: email, href: email ? `mailto:${email}` : undefined },
              { icon: "⏱",  label: "I reply", value: response },
              { icon: "📍", label: "Based in", value: location },
            ].map(item => (
              <div key={item.label} className="rounded-2xl bg-zinc-900 border border-zinc-800/50 px-6 py-4 flex items-center gap-4">
                <span className="text-lg w-5 text-center flex-shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-white text-sm font-semibold hover:text-coral-400 transition-colors truncate block">{item.value || "—"}</a>
                  ) : (
                    <p className="text-white text-sm font-semibold">{item.value || "—"}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form + discovery tiles */}
        <div className="grid grid-cols-12 gap-3 pb-12 md:pb-16">
          <div className="col-span-12 md:col-span-8 rounded-2xl bg-zinc-900 p-7 md:p-8">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-coral-400 mb-6">Tell me about your project</p>
            <ContactForm />
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col gap-3">
            <div className="rounded-2xl bg-coral-400 p-7 flex-1 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-xl">📞</div>
              <div>
                <h3 className="font-display font-bold text-white text-xl mb-2">{discTitle}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{discText}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-espresso-800 p-6">
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                I work with startups, small businesses, and creatives who want design that actually means something.
              </p>
              <div className="flex flex-wrap gap-2">
                {["UI/UX","Branding","Print","Social"].map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-500 text-[11px] font-medium">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
