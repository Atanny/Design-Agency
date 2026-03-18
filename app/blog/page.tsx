export const revalidate = 0;
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabaseClient";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Design insights, tips, and inspiration from our studio team.",
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return (data as BlogPost[]) || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <main className="pt-24">
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-coral-500 dark:text-coral-400 mb-4">
              Journal
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-espresso-800 dark:text-sand-50 tracking-tight mb-6">
              Design Blog
            </h1>
            <p className="text-lg text-espresso-500 dark:text-espresso-400">
              Insights on design, brand strategy, and creative process from our
              studio.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-32">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-espresso-400">
              <p className="text-lg">No posts published yet.</p>
              <p className="text-sm mt-2">Check back soon for design insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article>
                    {post.featured_image && (
                      <div className="relative aspect-[16/9] overflow-hidden mb-5 bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div>
                      <time className="text-xs font-medium text-espresso-400 uppercase tracking-wider">
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <h2 className="font-display text-xl font-bold text-espresso-800 dark:text-sand-50 mt-2 mb-3 group-hover:text-coral-500 dark:group-hover:text-coral-400 transition-colors leading-snug">
                        {post.title}
                      </h2>
                      {post.meta_description && (
                        <p className="text-sm text-espresso-500 dark:text-espresso-400 leading-relaxed line-clamp-2">
                          {post.meta_description}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-coral-500 dark:text-coral-400 group-hover:gap-2 transition-all">
                        Read More
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
