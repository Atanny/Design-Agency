export const revalidate = 0;
import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import { BgDots, BgMeshGrid, BgGlowBlob, BgDiagonalLines, BgWatermark, BgCircles, BgHex } from "@/components/BgDecor";

export async function generateMetadata(): Promise<Metadata> {
  try { const s=createServerClient(); const{data}=await s.from("seo_settings").select("*").eq("page","services").single(); return{title:data?.meta_title||"Services",description:data?.meta_description||"Design services."}; }
  catch { return{title:"Services"}; }
}

interface DBService{id:string;title:string;description:string;features:string;icon:string;accent:string;bg_color:string;sort_order:number;active:boolean;}

const ICON_PATHS:Record<string,string>={
  monitor:"M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  palette:"M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  image:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  globe:"M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9",
  chat:"M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
  phone:"M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  lightning:"M13 10V3L4 14h7v7l9-11h-7z",
};

/*
  THEME RULES:
  - gradient tiles (coral/amber/espresso): always white text — safe on both modes
  - bento-card tiles: use explicit dark text classes (text-espresso-800) NOT text-body/text-page
    because in light mode bento-card is a warm cream and text-body could be too light
*/
const THEMES=[
  // tile 0: neutral card — explicitly dark text for light mode readability
  {
    tile:"bento-card",
    numC:"text-espresso-400/40 dark:text-faint",
    badgeC:"bg-coral-400/15 text-coral-600 dark:text-coral-400",
    subC:"text-espresso-700 dark:text-zinc-400",
    ctaC:"text-coral-600 dark:text-coral-400",
    borderC:"border-espresso-200 dark:border-zinc-800/60",
    decor:<BgDiagonalLines key="d0" opacity={0.3}/>
  },
  // tile 1: coral gradient — always white
  {
    tile:"tile-gradient-coral",
    numC:"text-white/20",
    badgeC:"bg-white/20 text-white",
    subC:"text-white/80",
    ctaC:"text-white",
    borderC:"border-white/20",
    decor:<BgDots key="d1" dark opacity={0.5}/>
  },
  // tile 2: neutral card — explicitly dark text
  {
    tile:"bento-card",
    numC:"text-espresso-400/40 dark:text-faint",
    badgeC:"bg-amber-500/15 text-amber-700 dark:text-amber-400",
    subC:"text-espresso-700 dark:text-zinc-400",
    ctaC:"text-amber-700 dark:text-amber-400",
    borderC:"border-espresso-200 dark:border-zinc-800/60",
    decor:<BgMeshGrid key="d2" opacity={0.3}/>
  },
  // tile 3: amber gradient — dark espresso text (always readable)
  {
    tile:"tile-gradient-amber",
    numC:"text-espresso-800/20",
    badgeC:"bg-espresso-800/15 text-espresso-800",
    subC:"text-espresso-800/80",
    ctaC:"text-espresso-800",
    borderC:"border-espresso-600/20",
    decor:<BgDiagonalLines key="d3" opacity={0.3}/>
  },
  // tile 4: neutral card — explicitly dark text
  {
    tile:"bento-card",
    numC:"text-espresso-400/40 dark:text-faint",
    badgeC:"bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    subC:"text-espresso-700 dark:text-zinc-400",
    ctaC:"text-emerald-700 dark:text-emerald-400",
    borderC:"border-espresso-200 dark:border-zinc-800/60",
    decor:<BgCircles key="d4" opacity={0.3}/>
  },
  // tile 5: dark espresso gradient — always white
  {
    tile:"tile-gradient-espresso",
    numC:"text-white/10",
    badgeC:"bg-coral-400/20 text-coral-300",
    subC:"text-zinc-300",
    ctaC:"text-coral-300",
    borderC:"border-white/10",
    decor:<BgHex key="d5" dark opacity={0.5}/>
  },
];

export default async function ServicesPage() {
  const supabase = createServerClient();
  const [pc,oc] = await Promise.all([getContent("services_page"),getContent("offer_card")]);
  const {data:dbServices} = await supabase.from("services").select("*").eq("active",true).order("sort_order",{ascending:true});
  const services = (dbServices as DBService[])||[];
  const bgImage = pc.bg_image||"";

  return (
    <div className="bg-page min-h-screen pt-5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* ── HERO ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3" style={{alignItems:"stretch"}}>
          <div className="md:col-span-8 rounded-2xl relative overflow-hidden flex flex-col justify-between p-8 md:p-10"
            style={{background:bgImage?undefined:"linear-gradient(160deg,#1a0f08 0%,#0c0804 100%)",minHeight:"260px"}}>
            {bgImage?<><img src={bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-[0.22]"/><div className="absolute inset-0 bg-black/68"/></> :<><BgDiagonalLines dark opacity={0.8}/><BgMeshGrid dark opacity={0.5}/></>}
            <BgGlowBlob color="coral" position="tr"/><BgWatermark text="SERVICES" className="text-white"/>
            <div className="relative z-10 flex items-center gap-3"><div className="h-px w-5 bg-coral-400"/><span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">{pc.badge||"Services"}</span></div>
            <div className="relative z-10">
              <h1 className="font-display font-black text-white leading-[0.88]" style={{fontSize:"clamp(2.8rem,7vw,5.5rem)"}}>{pc.headline||"What I Offer"}</h1>
              <p className="text-white/50 text-sm font-light mt-3 max-w-md leading-relaxed">{pc.subtext||"Focused design services delivered personally by me."}</p>
            </div>
          </div>
          <div className="md:col-span-4 tile-gradient-coral rounded-2xl relative overflow-hidden p-8 flex flex-col justify-between" style={{minHeight:"260px"}}>
            <BgDots dark opacity={0.5}/><BgGlowBlob color="amber" position="tl"/>
            <div className="relative z-10"><div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4"><svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg></div>
              <p className="text-white/85 text-sm leading-relaxed font-light">Every service delivered personally — no handoffs, no outsourcing.</p>
            </div>
            <div className="relative z-10"><Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-coral-600 text-sm font-semibold hover:bg-espresso-800 hover:text-white transition-all shadow-lg">Get a Quote →</Link></div>
          </div>
        </div>

        {/* ── SERVICE TILES ──
            gridAutoRows: "1fr" makes every ROW the same height.
            3 equal columns (4+4+4) ensures tiles line up in straight rows, not stairs.
            h-full + flex-col fills each cell completely.
        ── */}
        {services.length===0?(
          <div className="bento-card relative overflow-hidden rounded-2xl flex items-center justify-center p-16 text-center mb-3" style={{minHeight:"200px"}}>
            <BgDots opacity={0.3}/><p className="relative z-10 text-muted">No services yet. Add in Admin → Services.</p>
          </div>
        ):(
          <>
            <div
              className="grid gap-3 mb-3"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)", /* 3 equal columns — no stairs */
                gridAutoRows: "1fr",                   /* every row same height */
                alignItems: "stretch",
              }}>
              {services.map((service,idx)=>{
                const theme = THEMES[idx % THEMES.length];
                const features = service.features ? service.features.split("\n").map((f:string)=>f.trim()).filter(Boolean) : [];
                const slug = service.title.toLowerCase().replace(/[^a-z0-9]+/g,"-");

                return (
                  <div key={service.id} id={slug}
                    className={`${theme.tile} rounded-2xl relative overflow-hidden h-full flex flex-col scroll-mt-24`}>
                    {theme.decor}
                    <BgGlowBlob color="coral" position="br"/>

                    {/* TOP — badge + number */}
                    <div className="relative z-10 flex items-start justify-between p-7 pb-4 flex-shrink-0">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest ${theme.badgeC}`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ICON_PATHS[service.icon]||ICON_PATHS.monitor}/>
                        </svg>
                        {service.title}
                      </span>
                      <span className={`font-display font-black text-4xl leading-none select-none ml-2 flex-shrink-0 ${theme.numC}`}>
                        {String(idx+1).padStart(2,"0")}
                      </span>
                    </div>

                    {/* MIDDLE — grows to fill space */}
                    <div className="relative z-10 flex-1 flex flex-col px-7 pb-4">
                      <p className={`text-sm leading-relaxed font-light mb-4 ${theme.subC}`}>{service.description}</p>
                      {features.length>0&&(
                        <ul className="space-y-2">
                          {features.map((f:string)=>(
                            <li key={f} className={`flex items-start gap-2.5 text-xs leading-relaxed ${theme.subC}`}>
                              <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                              </svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* BOTTOM — pinned to tile bottom */}
                    <div className={`relative z-10 mt-auto px-7 py-5 border-t flex-shrink-0 ${theme.borderC}`}>
                      <Link href="/contact" className={`inline-flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity ${theme.ctaC}`}>
                        Inquire about this service
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quote CTA */}
            <div className="tile-gradient-dark rounded-2xl relative overflow-hidden mb-3 flex flex-col md:flex-row">
              <BgMeshGrid dark opacity={0.6}/><BgGlowBlob color="coral" position="tl"/><BgGlowBlob color="amber" position="br"/>
              <BgWatermark text="GET A QUOTE" className="text-white"/>
              <div className="relative z-10 flex-1 p-8 md:p-10 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4"><div className="h-px w-5 bg-coral-400/60"/><span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">Ready to start?</span></div>
                  <h3 className="font-display font-black text-white text-2xl md:text-3xl leading-tight mb-3">{oc.title||"Get a Custom Quote"}</h3>
                  <p className="text-white/55 text-sm leading-relaxed font-light max-w-lg">{oc.description||"Every project is different. Tell me what you need and I'll send a tailored proposal."}</p>
                </div>
                <ul className="grid grid-cols-2 gap-2">
                  {[oc.item1||"Free initial consultation",oc.item2||"Pricing tailored to scope",oc.item3||"Response within 24 hours",oc.item4||"No hidden fees, ever"].map(f=>(
                    <li key={f} className="flex items-center gap-2 text-white/65 text-sm font-light"><span className="w-1.5 h-1.5 rounded-full bg-coral-400/80 flex-shrink-0"/>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="relative z-10 flex items-center justify-center p-8 md:p-10 md:border-l border-white/10 md:min-w-[220px]">
                <Link href="/contact" className="inline-flex flex-col items-center gap-3 px-10 py-7 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all group w-full md:w-auto text-center">
                  <span className="font-display font-black text-xl">{oc.button_text||"Request a Quote"}</span>
                  <span className="text-white/60 text-xs font-light">No pressure · Free consult</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </>
        )}
        <div className="pb-14"/>
      </div>
    </div>
  );
}
