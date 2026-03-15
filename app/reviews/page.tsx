export const revalidate = 0;
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { ReviewCard } from "@/components/ReviewCard";
import ReviewForm from "./ReviewForm";
import LiveRatingBadge from "./LiveRatingBadge";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import type { Review } from "@/types";


async function getReviews(): Promise<Review[]> {
  noStore();
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    if (error) console.error("Reviews error:", error.message);
    return (data as Review[]) || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("page", "reviews").single();
    return {
      title: data?.meta_title || "Reviews",
      description: data?.meta_description || "Client reviews and testimonials.",
    };
  } catch {
    return { title: "Reviews" };
  }
}

export default async function ReviewsPage() {
  const [reviews, reviewsContent] = await Promise.all([
    getReviews(),
    getContent("reviews_section"),
  ]);

  const avgRating = reviews.length > 0
    ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <>
      <main className="pt-24">
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold-600 dark:text-gold-400">
                {reviewsContent.badge || "Client Reviews"}
              </span>
              <div className="h-px w-8 bg-gold-500" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-4 leading-[0.95]">
              {reviewsContent.headline || "What Clients Say"}
            </h1>
            {reviewsContent.subtext && (
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 font-light">{reviewsContent.subtext}</p>
            )}
            <LiveRatingBadge initialAvg={avgRating} initialCount={reviews.length} />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-24">
          {reviews.length === 0 ? (
            <p className="text-center text-zinc-400 py-16">No reviews yet. Be the first to leave one below!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review, i) => <ReviewCard key={review.id} review={review} index={i} />)}
            </div>
          )}
        </section>

        <section className="py-20 bg-[#dedad2] dark:bg-zinc-900/50">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-3 leading-tight">
                {reviewsContent.cta_title || "Leave a Review"}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-light">
                {reviewsContent.cta_text || "Worked with us? Reviews are published within 24 hours after approval."}
              </p>
            </div>
            <div className="bg-[#faf8f4] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 shadow-lg"
              style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)" }}>
              <ReviewForm />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
