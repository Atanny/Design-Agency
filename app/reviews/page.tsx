import { Metadata } from "next";
export const revalidate = 0;
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReviewCard } from "@/components/ReviewCard";
import ReviewForm from "./ReviewForm";
import { createServerClient } from "@/lib/supabaseClient";
import type { Review } from "@/types";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Read genuine client reviews for Lumis Studio. See what our clients say about our design services.",
};

async function getReviews(): Promise<Review[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    return (data as Review[]) || [];
  } catch {
    return [];
  }
}

export default async function ReviewsPage() {
  const reviews = await getReviews();
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400 mb-4">
              Client Reviews
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
              What Clients Say
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
                {avgRating}
              </span>
              <span className="text-zinc-500">({reviews.length} reviews)</span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400">
              All reviews are verified and approved before publishing.
            </p>
          </div>
        </section>

        {/* Reviews grid */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          {reviews.length === 0 ? (
            <p className="text-center text-zinc-400 py-16">No reviews yet. Be the first to leave one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Submit review */}
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-2xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-3">
                Leave a Review
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Worked with us? We&apos;d love to hear your feedback. Reviews are
                reviewed and published within 24 hours.
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-lg shadow-zinc-100/50 dark:shadow-none">
              <ReviewForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
