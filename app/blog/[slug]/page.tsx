export const revalidate = 0;
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import type { BlogPost } from "@/types";

interface Props {
  params: { slug: string };
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return (data as BlogPost) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.meta_title || post.title,
    description: post.meta_description,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <main className="pt-24">
        <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <header className="mb-10">
            <time className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mt-3 mb-6 leading-tight">
              {post.title}
            </h1>
            {post.meta_description && (
              <p className="text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {post.meta_description}
              </p>
            )}
          </header>

          {post.featured_image && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-gold-600 dark:prose-a:text-gold-400"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>

        {/* CTA */}
        <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              Ready to start your project?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">
              Let&apos;s create something extraordinary together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Start a Project
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
