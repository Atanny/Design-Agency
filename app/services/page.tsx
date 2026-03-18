export const revalidate = 0;
import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import { BgDots, BgMeshGrid, BgGlowBlob, BgDiagonalLines, BgWatermark, BgCircles, BgHex, BgCornerAccent } from "@/components/BgDecor";

export async function generateMetadata(): Promise<Metadata> {
  try{const s=createServerClient();const{data}=await s.from("seo_settings").select("*").eq("page","services").single();return{title:data?.meta_title||"Services",description:data?.meta_description||"Freelance design services."};}
  catch{return{title:"Services"};}
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

const THEMES=[
  {tile:"bento-card",num:"text-faint",badge:"bg-coral-400/10 text-coral-500",text:"text-page",sub:"text-body",cta:"text-coral-500",decor:<BgDiagonalLines key="d1" opacity={0.4}/>},
  {tile:"bg-coral-400",num:"text-coral-300/30",badge:"bg-white/20 text-white",text:"text-white",sub:"text-white/75",cta:"text-white",decor:<BgDots key="d2" dark opacity={0.5}/>},
  {tile:"bento-card",num:"text-faint",badge:"bg-amber-300/15 text-amber-600 dark:text-amber-400",text:"text-page",sub:"text-body",cta:"text-amber-600 dark:text-amber-400",decor:<BgMeshGrid key="d3" opacity={0.4}/>},
  {tile:"bg-amber-300",num:"text-amber-200/40",badge:"bg-espresso-800/15 text-espresso-700",text:"text-espresso-800",sub:"text-espresso-600",cta:"text-espresso-700",decor:<BgDiagonalLines key="d4" opacity={0.4}/>},
  {tile:"bento-card",num:"text-faint",badge:"bg-emerald-400/10 text-emerald-600",text:"text-page",sub:"text-body",cta:"text-emerald-600",decor:<BgCircles key="d5" opacity={0.4}/>},
  {tile:"bg-espresso-800",num:"text-espresso-700",badge:"bg-coral-400/20 text-coral-300",text:"text-white",sub:"text-zinc-400",cta:"text-coral-300",decor:<BgHex key="d6" dark opacity={0.5}/>},
];

export default async function ServicesPage() {
  const supabase=createServerClient();
  const [pc,oc]=await Promise.all([getContent("services_page"),getContent("offer_card")]);
  const{data:dbServices}=await supabase.from("services").select("*").eq("active",true).order("sort_order",{ascending:true});
  const services=(dbServices as DBService[])||[];
  const bgImage=pc.bg_image||"";

  return (
    <div className="bg-page min-h-screen pt-5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Hero tiles */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
          <div className="md:col-span-8 rounded-2xl relative overflow-hidden min-h-[240px] flex flex-col justify-between p-8 md:p-10"
            style={{background:bgImage?undefined:"linear-gradient(160deg,#1a0f08,#0c0804)"}}>
            {bgImage?<><img src={bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-22"/><div className="absolute inset-0 bg-black/68"/></>
              :<><BgDiagonalLines dark opacity={0.8}/><BgMeshGrid dark opacity={0.5}/></>}
            <BgGlowBlob color="coral" position="tr" />
            <BgWatermark text="SERVICES" className="text-white" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3"><div className="h-px w-5 bg-coral-400"/><span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">{pc.badge||"Services"}</span></div>
              <h1 className="font-display font-black text-white leading-[0.88]" style={{fontSize:"clamp(2.8rem,7vw,5.5rem)"}}>{pc.headline||"What I Offer"}</h1>
            </div>
            <div className="relative z-10"><p className="text-white/45 text-sm font-light max-w-md">{pc.subtext||"Focused design services delivered personally by me."}</p></div>
          </div>
          <div className="md:col-span-4 bento-card relative overflow-hidden p-8 flex flex-col justify-between min-h-[240px]">
            <BgCircles />
            <BgGlowBlob color="amber" position="br" />
            <div className="relative z-10">
              <p className="text-body text-sm leading-relaxed font-light mb-5">Every service delivered personally — no outsourcing, no templates.</p>
            </div>
            <div className="relative z-10">
              <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-coral-400/20">
                Get a Quote →
              </Link>
            </div>
          </div>
        </div>

        {/* Service tiles */}
        {services.length===0?(
          <div className="bento-card p-16 text-center text-muted mb-3 rounded-2xl relative overflow-hidden min-h-[200px] flex items-center justify-center">
            <BgDots opacity={0.3}/>
            <p className="relative z-10">No services configured yet.</p>
          </div>
        ):(
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-3">
            {services.map((service,idx)=>{
              const theme=THEMES[idx%THEMES.length];
              const features=service.features?service.features.split("\n").map((f:string)=>f.trim()).filter(Boolean):[];
              const slug=service.title.toLowerCase().replace(/[^a-z0-9]+/g,"-");
              const span=idx%3===0?"col-span-1 sm:col-span-2 lg:col-span-7":idx%3===1?"col-span-1 lg:col-span-5":"col-span-1 lg:col-span-4";
              return (
                <div key={service.id} id={slug} className={`${span} ${theme.tile} rounded-2xl relative overflow-hidden p-8 flex flex-col justify-between min-h-[300px] scroll-mt-24`}>
                  {theme.decor}
                  <BgGlowBlob color="coral" position="br" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest ${theme.badge}`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={ICON_PATHS[service.icon]||ICON_PATHS.monitor}/></svg>
                        {service.title}
                      </span>
                      <span className={`font-display font-black text-4xl leading-none ${theme.num}`}>{String(idx+1).padStart(2,"0")}</span>
                    </div>
                    <p className={`text-sm leading-relaxed mb-5 font-light ${theme.sub}`}>{service.description}</p>
                    {features.length>0&&(
                      <ul className="space-y-2">
                        {features.slice(0,4).map((f:string)=>(
                          <li key={f} className={`flex items-start gap-2 text-xs ${theme.sub}`}>
                            <svg className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Link href="/contact" className={`relative z-10 inline-flex items-center gap-2 mt-6 text-sm font-semibold hover:opacity-70 transition-opacity ${theme.cta}`}>
                    Inquire about this →
                  </Link>
                </div>
              );
            })}

            {/* Quote CTA tile */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-12 bento-card relative overflow-hidden p-8 md:p-10 min-h-[200px]">
              <BgMeshGrid opacity={0.4} />
              <BgGlowBlob color="coral" position="tr" />
              <BgWatermark text="GET A QUOTE" />
              <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2">
                  <h3 className="font-display font-black text-2xl md:text-3xl text-page mb-3">{oc.title||"Get a Custom Quote"}</h3>
                  <p className="text-body text-sm leading-relaxed font-light mb-5">{oc.description||"Every project is different. Tell me what you need and I'll send a tailored proposal."}</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {[oc.item1||"Free initial consultation",oc.item2||"Pricing tailored to your scope",oc.item3||"Response within 24 hours",oc.item4||"No hidden fees, ever"].map(f=>(
                      <li key={f} className="flex items-center gap-2 text-body text-sm font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-coral-400 flex-shrink-0"/>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-center md:justify-end">
                  <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-coral-400/20">
                    {oc.button_text||"Request a Quote"} ✦
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="pb-12"/>
      </div>
    </div>
  );
}
