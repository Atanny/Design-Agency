export const revalidate = 0;
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import type { BlogPost } from "@/types";

interface Props { params: { slug: string }; }

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single();
    return (data as BlogPost) || null;
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.meta_title || post.title,
    description: post.meta_description,
    openGraph: { title: post.meta_title || post.title, description: post.meta_description, images: post.featured_image ? [post.featured_image] : [] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="bg-[#0a0a0a] pt-6 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header bento */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          {post.featured_image && (
            <div className="col-span-12 md:col-span-5 rounded-2xl overflow-hidden relative aspect-[4/3]">
              <Image src={post.featured_image} alt={post.title} fill className="object-cover" priority />
            </div>
          )}
          <div className={`${post.featured_image ? "col-span-12 md:col-span-7" : "col-span-12"} rounded-2xl bg-zinc-900 p-8 flex flex-col justify-between`}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors self-start">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              Back to Blog
            </Link>
            <div>
              <time className="text-zinc-600 text-xs font-bold uppercase tracking-widest block mb-3">
                {new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
              <h1 className="font-display font-black text-3xl md:text-5xl text-white leading-tight">
                {post.title}
              </h1>
              {post.meta_description && (
                <p className="text-zinc-400 mt-4 text-base leading-relaxed">{post.meta_description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content tile */}
        <div className="grid grid-cols-12 gap-3 mb-3">
          <div className="col-span-12 md:col-span-8 rounded-2xl bg-zinc-900 p-8 md:p-12">
            <div
              className="prose prose-invert prose-zinc prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-a:text-coral-400 prose-code:text-coral-300"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col gap-3">
            <div className="rounded-2xl bg-coral-400 p-8 flex flex-col justify-between flex-1">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Ready to create?</p>
              <div>
                <h3 className="font-display font-black text-white text-2xl leading-tight mb-4">Start your project today</h3>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-coral-500 text-sm font-bold hover:bg-espresso-800 hover:text-white transition-all">
                  Get in touch →
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6">
              <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-3">More posts</p>
              <Link href="/blog" className="text-zinc-400 hover:text-coral-400 text-sm font-semibold transition-colors flex items-center gap-2">
                View all articles →
              </Link>
            </div>
          </div>
        </div>

        <div className="pb-12" />
      </div>
    </div>
  );
}
