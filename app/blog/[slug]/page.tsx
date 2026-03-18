export const revalidate = 0;
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createServerClient } from "@/lib/supabaseClient";
import type { BlogPost } from "@/types";
import { BgDots, BgMeshGrid, BgGlowBlob, BgDiagonalLines, BgCircles } from "@/components/BgDecor";

interface Props { params: { slug:string }; }

async function getPost(slug:string): Promise<BlogPost|null> {
  try{const s=createServerClient();const{data}=await s.from("blog_posts").select("*").eq("slug",slug).eq("published",true).single();return(data as BlogPost)||null;}
  catch{return null;}
}

export async function generateMetadata({ params }:Props): Promise<Metadata> {
  const post=await getPost(params.slug);
  if(!post) return{title:"Post Not Found"};
  return{title:post.meta_title||post.title,description:post.meta_description,openGraph:{title:post.meta_title||post.title,description:post.meta_description,images:post.featured_image?[post.featured_image]:[]}};
}

export default async function BlogPostPage({ params }:Props) {
  const post=await getPost(params.slug);
  if(!post) notFound();

  return (
    <div className="bg-page min-h-screen pt-5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
          {post.featured_image&&(
            <div className="md:col-span-5 rounded-2xl overflow-hidden relative aspect-[4/3] md:aspect-auto md:min-h-[280px]">
              <Image src={post.featured_image} alt={post.title} fill className="object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
            </div>
          )}
          <div className={`${post.featured_image?"md:col-span-7":"md:col-span-12"} bento-card relative overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[280px]`}>
            <BgCircles />
            <BgGlowBlob color="coral" position="tr" />
            <Link href="/blog" className="relative z-10 inline-flex items-center gap-2 text-muted hover:text-page text-sm transition-colors self-start mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              Back to Blog
            </Link>
            <div className="relative z-10">
              <time className="text-muted text-xs font-semibold uppercase tracking-widest block mb-3">
                {new Date(post.created_at).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}
              </time>
              <h1 className="font-display font-black text-page leading-[0.9]" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)"}}>{post.title}</h1>
              {post.meta_description&&<p className="text-body text-base mt-4 leading-relaxed font-light">{post.meta_description}</p>}
            </div>
          </div>
        </div>

        {/* Content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pb-14">
          <div className="lg:col-span-8 bento-card relative overflow-hidden p-8 md:p-12 min-h-[400px]">
            <BgMeshGrid opacity={0.3}/>
            <div className="relative z-10 prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-black prose-a:text-coral-500 prose-code:text-coral-500"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}/>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="rounded-2xl bg-coral-400 relative overflow-hidden p-8 flex flex-col justify-between min-h-[200px]">
              <BgDots dark opacity={0.5}/>
              <span className="relative z-10 text-white/70 text-[10px] font-semibold uppercase tracking-widest">Ready to create?</span>
              <div className="relative z-10">
                <h3 className="font-display font-black text-white text-xl leading-tight mb-4">Start your project today</h3>
                <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-coral-500 text-sm font-semibold hover:bg-espresso-800 hover:text-white transition-all">
                  Get in touch →
                </Link>
              </div>
            </div>
            <div className="bento-card relative overflow-hidden p-7 min-h-[160px] flex flex-col justify-between">
              <BgDiagonalLines opacity={0.4}/>
              <BgGlowBlob color="amber" position="bl"/>
              <p className="relative z-10 text-muted text-[10px] font-semibold uppercase tracking-widest mb-3">More posts</p>
              <div className="relative z-10">
                <Link href="/blog" className="text-body hover:text-coral-500 text-sm font-semibold transition-colors flex items-center gap-2">
                  View all articles
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
