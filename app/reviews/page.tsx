export const revalidate = 0;
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "./ReviewForm";
import LiveRatingBadge from "./LiveRatingBadge";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import type { Review } from "@/types";
import { BgDots, BgMeshGrid, BgGlowBlob, BgDiagonalLines, BgWatermark, BgCircles, BgHex } from "@/components/BgDecor";

async function getReviews(): Promise<Review[]> {
  noStore();
  try { const s=createServerClient(); const{data}=await s.from("reviews").select("*").eq("approved",true).order("created_at",{ascending:false}); return(data as Review[])||[]; }
  catch { return []; }
}
export async function generateMetadata(): Promise<Metadata> {
  try{const s=createServerClient();const{data}=await s.from("seo_settings").select("*").eq("page","reviews").single();return{title:data?.meta_title||"Reviews"};}
  catch{return{title:"Reviews"};}
}

export default async function ReviewsPage() {
  const [reviews, rc] = await Promise.all([getReviews(), getContent("reviews_section")]);
  const avgRating = reviews.length>0 ? Math.round((reviews.reduce((a,r)=>a+r.rating,0)/reviews.length)*10)/10 : 0;

  return (
    <div className="bg-page min-h-screen pt-5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Header bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
          <div className="md:col-span-7 bento-card relative overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[220px]">
            <BgCircles />
            <BgWatermark text="REVIEWS" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3"><div className="h-px w-5 bg-coral-400"/><span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-500">{rc.badge||"Client Reviews"}</span></div>
              <h1 className="font-display font-black text-page leading-[0.88]" style={{fontSize:"clamp(2.8rem,7vw,5.5rem)"}}>{rc.headline||"Kind words"}</h1>
            </div>
            <div className="relative z-10">
              {rc.subtext&&<p className="text-body text-sm font-light leading-relaxed">{rc.subtext}</p>}
            </div>
          </div>

          <div className="md:col-span-5 grid grid-cols-2 gap-3">
            <div className="tile-gradient-coral rounded-2xl relative overflow-hidden p-6 flex flex-col justify-between min-h-[100px]">
              <BgDots dark opacity={0.5} />
              <p className="relative z-10 text-white/70 text-[10px] font-semibold uppercase tracking-widest">Avg Rating</p>
              <div className="relative z-10">
                <p className="font-display font-black text-5xl text-white leading-none">{avgRating||"—"}</p>
                <div className="flex gap-0.5 mt-1">{[1,2,3,4,5].map(s=><span key={s} className={`text-sm ${s<=Math.round(avgRating)?"text-white":"text-white/25"}`}>★</span>)}</div>
              </div>
            </div>
            <div className="rounded-2xl bg-amber-300 relative overflow-hidden p-6 flex flex-col justify-between min-h-[100px]">
              <BgDiagonalLines opacity={0.5} />
              <p className="relative z-10 text-espresso-700 text-[10px] font-semibold uppercase tracking-widest">Reviews</p>
              <p className="relative z-10 font-display font-black text-5xl text-espresso-800 leading-none">{reviews.length}</p>
            </div>
            <div className="col-span-2 bento-card relative overflow-hidden p-5 flex items-center justify-center rounded-2xl min-h-[80px]">
              <BgMeshGrid opacity={0.4} />
              <div className="relative z-10"><LiveRatingBadge initialAvg={avgRating} initialCount={reviews.length}/></div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        {reviews.length===0 ? (
          <div className="bento-card relative overflow-hidden p-16 text-center text-muted mb-3 rounded-2xl min-h-[200px] flex items-center justify-center">
            <BgDots opacity={0.3} />
            <p className="relative z-10">No reviews yet — be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 mb-3">
            {reviews.map((review,i)=>{
              const span=i%5===0?"lg:col-span-5":i%5===1?"lg:col-span-7":i%5===2?"lg:col-span-7":i%5===3?"lg:col-span-5":"lg:col-span-4";
              return(<div key={review.id} className={`col-span-1 ${span} h-full`}><ReviewCard review={review} index={i}/></div>);
            })}
          </div>
        )}

        {/* Leave a review */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pb-14">
          <div className="lg:col-span-5 tile-gradient-coral rounded-2xl relative overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[280px]">
            <BgDots dark opacity={0.5} />
            <BgHex dark opacity={0.4} />
            <span className="relative z-10 text-white/70 text-[10px] font-semibold uppercase tracking-widest">Share your experience</span>
            <div className="relative z-10">
              <h2 className="font-display font-black text-3xl text-white leading-tight mb-3">{rc.cta_title||"Leave a Review"}</h2>
              <p className="text-white/75 text-sm leading-relaxed font-light">{rc.cta_text||"Worked with me? I'd really appreciate your thoughts."}</p>
            </div>
          </div>
          <div className="lg:col-span-7 bento-card relative overflow-hidden p-8 md:p-10 min-h-[280px] flex flex-col">
            <BgMeshGrid opacity={0.4} />
            <BgGlowBlob color="amber" position="tr" />
            <div className="relative z-10 flex-1"><ReviewForm/></div>
          </div>
        </div>
      </div>
    </div>
  );
}
