export const revalidate = 0;
import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("page","services").single();
    return { title: data?.meta_title||"Services", description: data?.meta_description||"Our design services." };
  } catch { return { title: "Services" }; }
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

// Tile accent colors cycle
const TILE_ACCENTS = [
  { tile:"bg-zinc-900 border border-zinc-800/50", num:"text-zinc-800", badge:"bg-coral-400/10 text-coral-400" },
  { tile:"bg-coral-400", num:"text-coral-300/30", badge:"bg-white/20 text-white" },
  { tile:"bg-zinc-900 border border-zinc-800/50", num:"text-zinc-800", badge:"bg-amber-300/10 text-amber-300" },
  { tile:"bg-amber-300", num:"text-amber-200/30", badge:"bg-espresso-800/20 text-espresso-800" },
  { tile:"bg-zinc-900 border border-zinc-800/50", num:"text-zinc-800", badge:"bg-emerald-400/10 text-emerald-400" },
  { tile:"bg-espresso-800", num:"text-espresso-700", badge:"bg-coral-400/20 text-coral-300" },
];

export default async function ServicesPage() {
  const supabase = createServerClient();
  const [pageContent, offerCard] = await Promise.all([
    getContent("services_page"),
    getContent("offer_card"),
  ]);
  const { data: dbServices } = await supabase.from("services").select("*").eq("active",true).order("sort_order",{ascending:true});
  const services = (dbServices as DBService[]) || [];
  const bgImage = pageContent.bg_image || "";

  return (
    <div className="bg-[#0a0a0a] pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero bento */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          <div className="col-span-12 md:col-span-8 rounded-2xl overflow-hidden relative min-h-[220px] flex items-end p-8"
            style={{ background: bgImage ? undefined : "linear-gradient(145deg,#1a1009,#0f0a06)" }}>
            {bgImage && (
              <>
                <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-black/60" />
              </>
            )}
            {!bgImage && <div className="absolute inset-0 dot-pattern opacity-20" />}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-6 bg-coral-400" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">{pageContent.badge||"Services"}</span>
              </div>
              <h1 className="font-display font-black text-4xl md:text-6xl text-white leading-[0.9]">
                {pageContent.headline||"Design Services"}
              </h1>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 rounded-2xl bg-zinc-900 p-8 flex flex-col justify-between">
            <p className="text-zinc-500 text-sm leading-relaxed">{pageContent.subtext||"Premium design services tailored to grow your brand."}</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral-400 text-white text-sm font-bold hover:bg-coral-500 transition-all mt-4 self-start">
              Get a Quote →
            </Link>
          </div>
        </div>

        {/* Services bento grid */}
        {services.length === 0 ? (
          <div className="rounded-2xl bg-zinc-900 p-16 text-center text-zinc-500 mb-12">
            <p>No services configured yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-3 mb-3">
            {services.map((service, idx) => {
              const theme = TILE_ACCENTS[idx % TILE_ACCENTS.length];
              const features = service.features ? service.features.split("\n").map((f:string) => f.trim()).filter(Boolean) : [];
              const slug = service.title.toLowerCase().replace(/[^a-z0-9]+/g,"-");
              const isLight = theme.tile.includes("amber-300");
              const textColor = isLight ? "text-espresso-800" : theme.tile.includes("coral-400") ? "text-white" : theme.tile.includes("espresso") ? "text-white" : "text-white";
              const subColor = isLight ? "text-espresso-600" : theme.tile.includes("zinc-900") ? "text-zinc-500" : "text-white/70";
              const span = idx % 3 === 0 ? "col-span-12 md:col-span-7" : idx % 3 === 1 ? "col-span-12 md:col-span-5" : "col-span-12 md:col-span-4";

              return (
                <div key={service.id} id={slug}
                  className={`${span} ${theme.tile} rounded-2xl p-8 flex flex-col justify-between min-h-[300px] scroll-mt-24`}>
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${theme.badge}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ICON_PATHS[service.icon]||ICON_PATHS.monitor}/>
                        </svg>
                        {service.title}
                      </span>
                      <span className={`font-display font-black text-4xl ${theme.num}`}>{String(idx+1).padStart(2,"0")}</span>
                    </div>
                    <p className={`text-sm leading-relaxed mb-5 ${subColor}`}>{service.description}</p>
                    {features.length > 0 && (
                      <ul className="space-y-2">
                        {features.slice(0,4).map((f:string) => (
                          <li key={f} className={`flex items-center gap-2 text-xs ${subColor}`}>
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Link href="/contact"
                    className={`inline-flex items-center gap-2 mt-6 text-sm font-bold ${textColor} hover:opacity-70 transition-opacity`}>
                    Start This Project →
                  </Link>
                </div>
              );
            })}

            {/* Offer card tile */}
            <div className="col-span-12 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2">
                  <h3 className="font-display font-black text-2xl text-white mb-3">{offerCard.title||"Get a Custom Offer"}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-5">{offerCard.description||"Every project is unique. Tell us what you need and we'll send you a tailored quote — no obligation."}</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {[offerCard.item1||"Free consultation",offerCard.item2||"Custom pricing",offerCard.item3||"24hr response",offerCard.item4||"No hidden fees"].map(f=>(
                      <li key={f} className="flex items-center gap-2 text-zinc-400 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-coral-400 flex-shrink-0"/>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-center md:justify-end">
                  <Link href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-coral-400 text-white font-bold hover:bg-coral-500 transition-all shadow-lg shadow-coral-400/20">
                    {offerCard.button_text||"Request an Offer"} ✦
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pb-12" />
      </div>
    </div>
  );
}
