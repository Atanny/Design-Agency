export const revalidate = 0;
import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("page","services").single();
    return { title: data?.meta_title||"Services | Lumis Studio", description: data?.meta_description||"Our design services." };
  } catch { return { title: "Services | Lumis Studio" }; }
}

interface DBService {
  id: string; title: string; description: string; features: string;
  icon: string; accent: string; bg_color: string; sort_order: number; active: boolean;
}

const ICON_PATHS: Record<string,string> = {
  monitor:   "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  palette:   "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  image:     "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  globe:     "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
  chat:      "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
  phone:     "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  star:      "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  lightning: "M13 10V3L4 14h7v7l9-11h-7z",
};

const accentToColor = (accent: string) => {
  if (accent.includes("blue"))    return { bg:"bg-blue-50 dark:bg-blue-900/20",    text:"text-blue-600 dark:text-blue-400",    badge:"bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" };
  if (accent.includes("gold") || accent.includes("amber")) return { bg:"bg-amber-50 dark:bg-amber-900/20", text:"text-amber-600 dark:text-amber-400", badge:"bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" };
  if (accent.includes("rose") || accent.includes("pink"))  return { bg:"bg-rose-50 dark:bg-rose-900/20",   text:"text-rose-600 dark:text-rose-400",   badge:"bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300" };
  if (accent.includes("violet") || accent.includes("purple")) return { bg:"bg-violet-50 dark:bg-violet-900/20", text:"text-violet-600 dark:text-violet-400", badge:"bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300" };
  if (accent.includes("emerald") || accent.includes("teal")) return { bg:"bg-emerald-50 dark:bg-emerald-900/20", text:"text-emerald-600 dark:text-emerald-400", badge:"bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" };
  if (accent.includes("cyan"))    return { bg:"bg-cyan-50 dark:bg-cyan-900/20",    text:"text-cyan-600 dark:text-cyan-400",    badge:"bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300" };
  return { bg:"bg-zinc-100 dark:bg-zinc-800", text:"text-zinc-600 dark:text-zinc-400", badge:"bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300" };
};

export default async function ServicesPage() {
  const supabase = createServerClient();
  const pageContent = await getContent("services_page");
  const offerCard  = await getContent("offer_card");

  const { data: dbServices } = await supabase
    .from("services").select("*").eq("active", true).order("sort_order", { ascending: true });

  const services = (dbServices as DBService[]) || [];

  return (
    <main className="pt-24">
      <section className="py-20 md:py-28 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-gold-500" />
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400">
              {pageContent.badge || "Services"}
            </span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-zinc-900 dark:text-white tracking-tight mb-6 leading-[0.95]">
            {pageContent.headline || "Design Services"}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
            {pageContent.subtext || "Premium design services tailored to grow your brand."}
          </p>
        </div>
      </section>

      {services.length === 0 ? (
        <div className="text-center py-20 text-zinc-500 max-w-md mx-auto px-6">
          <p className="text-lg mb-2">No services configured yet.</p>
          <p className="text-sm">Add services in Admin → Services to populate this page.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 pb-32 space-y-32">
          {services.map((service, idx) => {
            const colors = accentToColor(service.accent);
            const features = service.features
              ? service.features.split("\n").map(f => f.trim()).filter(Boolean)
              : [];
            const slug = service.title.toLowerCase().replace(/[^a-z0-9]+/g,"-");

            return (
              <section key={service.id} id={slug} className="scroll-mt-24">
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-start ${idx % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                  <div className={idx % 2 === 1 ? "lg:col-start-2" : ""}>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold mb-4 ${colors.badge}`}
                      style={{ clipPath:"polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}>
                      {service.title}
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-3 leading-[0.95]">
                      {(service as DBService & {subtitle?:string}).subtitle || service.title}
                    </h2>
                    {(service as DBService & {subtitle?:string}).subtitle && (
                      <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 font-light">
                        {service.description}
                      </p>
                    )}

                    {features.length > 0 && (
                      <>
                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-4 text-xs uppercase tracking-[0.15em]">
                          What&apos;s Included
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                          {features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                              <span className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                                <svg className={`w-2.5 h-2.5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                                </svg>
                              </span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <Link href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-bold hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all duration-300"
                      style={{ clipPath:"polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                      Start This Project
                    </Link>
                  </div>

                  <div className={idx % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                    <div className="border border-zinc-100 dark:border-zinc-800 bg-[#faf8f4] dark:bg-[#0c0c0c] flex flex-col items-center text-center gap-6 p-10 card-grain"
                      style={{ clipPath:"polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}>
                      <div className={`p-4 ${service.bg_color}`}
                        style={{ clipPath:"polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                        <svg className={`w-10 h-10 ${service.accent}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ICON_PATHS[service.icon]||ICON_PATHS.monitor}/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-black text-zinc-900 dark:text-white mb-2">
                          {offerCard.title || "Get a Custom Offer"}
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-xs font-light">
                          {offerCard.description || "Every project is unique. Tell us what you need and we'll send you a tailored quote — no obligation."}
                        </p>
                      </div>
                      <ul className="space-y-2 text-left w-full max-w-xs">
                        {[offerCard.item1||"Free consultation", offerCard.item2||"Custom pricing for your scope", offerCard.item3||"Response within 24 hours", offerCard.item4||"No hidden fees"].map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <svg className={`w-3.5 h-3.5 flex-shrink-0 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link href="/contact"
                        className="w-full py-3.5 text-sm font-bold text-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-gold-500 dark:hover:bg-gold-500 dark:hover:text-white transition-all duration-300"
                        style={{ clipPath:"polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
                        {offerCard.button_text || "Request an Offer"}
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
