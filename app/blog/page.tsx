export const revalidate = 0;
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabaseClient";
import type { BlogPost } from "@/types";
import { BgDots, BgMeshGrid, BgGlowBlob, BgDiagonalLines, BgWatermark, BgCircles } from "@/components/BgDecor";

export const metadata: Metadata = { title:"Blog", description:"Design insights and creative process." };

async function getPosts(): Promise<BlogPost[]> {
  try{const s=createServerClient();const{data}=await s.from("blog_posts").select("*").eq("published",true).order("created_at",{ascending:false});return(data as BlogPost[])||[];}
  catch{return[];}
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div className="bg-page min-h-screen pt-5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
          <div className="md:col-span-8 bento-card relative overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[220px]">
            <BgCircles />
            <BgWatermark text="JOURNAL" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3"><div className="h-px w-5 bg-coral-400"/><span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-500">Journal</span></div>
              <h1 className="font-display font-black text-page leading-[0.88]" style={{fontSize:"clamp(2.8rem,7vw,5.5rem)"}}>Design Blog</h1>
            </div>
            <div className="relative z-10"><p className="text-body text-sm font-light">Insights on design, brand strategy, and creative process.</p></div>
          </div>
          <div className="md:col-span-4 tile-gradient-coral rounded-2xl relative overflow-hidden p-8 flex flex-col justify-between min-h-[220px]">
            <BgDots dark opacity={0.5} />
            <div className="relative z-10"><span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">From my desk</span></div>
            <div className="relative z-10">
              <p className="font-display font-black text-white text-xl leading-tight mb-2">Thoughts on design that actually matters.</p>
              <p className="text-white/70 text-sm font-light">No fluff, no filler — just real design thinking.</p>
            </div>
          </div>
        </div>

        {posts.length===0?(
          <div className="bento-card relative overflow-hidden p-16 text-center mb-14 rounded-2xl min-h-[200px] flex items-center justify-center">
            <BgMeshGrid opacity={0.4}/><p className="relative z-10 text-muted">No posts yet. Check back soon!</p>
          </div>
        ):(
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pb-14">
            {posts.map((post,i)=>{
              const span=i===0?"col-span-1 sm:col-span-2 lg:col-span-8":i===1?"lg:col-span-4":"lg:col-span-4";
              const isLarge=i===0;
              return (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className={`group col-span-1 ${span} bento-card relative overflow-hidden flex flex-col hover:shadow-xl transition-all duration-200 min-h-[280px]`}>
                  <BgDiagonalLines opacity={0.3}/>
                  {post.featured_image&&(
                    <div className={`relative w-full overflow-hidden flex-shrink-0 ${isLarge?"aspect-[16/7]":"aspect-[4/3]"}`}>
                      <Image src={post.featured_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
                    </div>
                  )}
                  <div className="relative z-10 p-6 md:p-8 flex flex-col gap-3 flex-1">
                    <h2 className={`font-display font-black text-page leading-tight group-hover:text-coral-500 transition-colors ${isLarge?"text-2xl md:text-3xl":"text-xl"}`}>{post.title}</h2>
                    {post.meta_description&&<p className="text-body text-sm leading-relaxed line-clamp-2 font-light flex-1">{post.meta_description}</p>}
                    <div className="flex items-center justify-between pt-4 border-t border-card mt-auto">
                      <span className="text-muted text-xs">{new Date(post.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>
                      <span className="text-coral-500 text-xs font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Read more <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
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
