export const revalidate = 0;
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabaseClient";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Design insights, tips, and inspiration from our studio team.",
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false });
    return (data as BlogPost[]) || [];
  } catch { return []; }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="bg-[#0a0a0a] pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header bento */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          <div className="col-span-12 md:col-span-8 rounded-2xl bg-zinc-900 p-8 flex flex-col justify-between min-h-[180px]">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-coral-400" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-coral-400">Journal</span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-6xl text-white leading-[0.9]">Design Blog</h1>
          </div>
          <div className="col-span-12 md:col-span-4 rounded-2xl bg-coral-400 p-8 flex flex-col justify-end">
            <p className="text-white/80 text-sm leading-relaxed">Insights on design, brand strategy, and creative process from our studio.</p>
          </div>
        </div>

        {/* Posts bento */}
        {posts.length === 0 ? (
          <div className="rounded-2xl bg-zinc-900 p-16 text-center text-zinc-500 mb-12">
            <p className="text-lg">No posts published yet.</p>
            <p className="text-sm mt-2">Check back soon for design insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-3 pb-12 md:pb-16">
            {posts.map((post, i) => {
              const span = i === 0 ? "col-span-12 md:col-span-8" : i === 1 ? "col-span-12 md:col-span-4" : "col-span-12 md:col-span-4";
              const isLarge = i === 0;
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className={`group ${span} rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/50 hover:border-zinc-700 transition-colors flex flex-col`}>
                  {post.cover_image && (
                    <div className={`relative w-full overflow-hidden ${isLarge ? "aspect-[16/7]" : "aspect-[4/3]"}`}>
                      <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-2 flex-1">
                    {post.category && (
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-coral-400">{post.category}</span>
                    )}
                    <h2 className={`font-display font-black text-white leading-tight group-hover:text-coral-400 transition-colors ${isLarge ? "text-2xl md:text-3xl" : "text-lg"}`}>
                      {post.title}
                    </h2>
                    {post.excerpt && <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                      <span className="text-zinc-600 text-xs">
                        {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="text-coral-400 text-xs font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        Read more →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
