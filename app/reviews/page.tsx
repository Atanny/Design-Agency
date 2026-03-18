export const revalidate = 0;
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "./ReviewForm";
import LiveRatingBadge from "./LiveRatingBadge";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import type { Review } from "@/types";

async function getReviews(): Promise<Review[]> {
  noStore();
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("reviews").select("*").eq("approved", true)
      .order("created_at", { ascending: false });
    if (error) console.error("Reviews error:", error.message);
    return (data as Review[]) || [];
  } catch (e) { console.error(e); return []; }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("page","reviews").single();
    return { title: data?.meta_title||"Reviews", description: data?.meta_description||"Client reviews." };
  } catch { return { title: "Reviews" }; }
}

export default async function ReviewsPage() {
  const [reviews, reviewsContent] = await Promise.all([getReviews(), getContent("reviews_section")]);
  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10) / 10 : 0;

  return (
    <div className="bg-[#0a0a0a] pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header bento */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          <div className="col-span-12 md:col-span-7 rounded-2xl bg-zinc-900 p-8 flex flex-col justify-between min-h-[200px]">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-coral-400" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">{reviewsContent.badge||"Client Reviews"}</span>
            </div>
            <div>
              <h1 className="font-display font-black text-4xl md:text-6xl text-white leading-[0.9] mb-3">
                {reviewsContent.headline||"What Clients Say"}
              </h1>
              {reviewsContent.subtext && <p className="text-zinc-500 font-light text-sm">{reviewsContent.subtext}</p>}
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-coral-400 p-6 flex flex-col justify-between">
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Avg Rating</p>
              <div>
                <p className="font-display font-black text-5xl text-white leading-none">{avgRating || "—"}</p>
                <div className="flex gap-0.5 mt-2">
                  {[1,2,3,4,5].map(s=><span key={s} className={`text-sm ${s<=Math.round(avgRating)?"text-white":"text-white/30"}`}>★</span>)}
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-amber-300 p-6 flex flex-col justify-between">
              <p className="text-espresso-700 text-[10px] font-bold uppercase tracking-widest">Total Reviews</p>
              <p className="font-display font-black text-5xl text-espresso-800 leading-none">{reviews.length}</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-espresso-800 p-5 flex items-center justify-center">
              <LiveRatingBadge initialAvg={avgRating} initialCount={reviews.length} />
            </div>
          </div>
        </div>

        {/* Reviews bento grid */}
        {reviews.length === 0 ? (
          <div className="rounded-2xl bg-zinc-900 p-16 text-center text-zinc-500 mb-3">
            <p>No reviews yet. Be the first to leave one below!</p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-3 mb-3">
            {reviews.map((review, i) => {
              // Vary sizes for visual interest
              const span = i % 5 === 0 ? "col-span-12 md:col-span-5"
                : i % 5 === 1 ? "col-span-12 md:col-span-7"
                : i % 5 === 2 ? "col-span-12 md:col-span-7"
                : i % 5 === 3 ? "col-span-12 md:col-span-5"
                : "col-span-12 md:col-span-4";
              return (
                <div key={review.id} className={span}>
                  <ReviewCard review={review} index={i} />
                </div>
              );
            })}
          </div>
        )}

        {/* Leave a review bento */}
        <div className="grid grid-cols-12 gap-3 pb-12 md:pb-16">
          <div className="col-span-12 md:col-span-5 rounded-2xl bg-coral-400 p-8 flex flex-col justify-between">
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Share your experience</span>
            <div>
              <h2 className="font-display font-black text-3xl text-white leading-tight mb-3">
                {reviewsContent.cta_title||"Leave a Review"}
              </h2>
              <p className="text-white/80 text-sm leading-relaxed">
                {reviewsContent.cta_text||"Worked with us? Your review helps others. Published within 24 hours after approval."}
              </p>
            </div>
          </div>
          <div className="col-span-12 md:col-span-7 rounded-2xl bg-zinc-900 p-8">
            <ReviewForm />
          </div>
        </div>
      </div>
    </div>
  );
}
