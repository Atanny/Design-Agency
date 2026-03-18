"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { PortfolioItem } from "@/types";

function ImageModal({ item, onClose }: { item:PortfolioItem; onClose:()=>void }) {
  const allImages = [item.image_url,...(item.image_urls||[])].filter(Boolean);
  const [current,setCurrent]=useState(0);
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{ if(e.key==="Escape")onClose(); if(e.key==="ArrowRight")setCurrent(i=>(i+1)%allImages.length); if(e.key==="ArrowLeft")setCurrent(i=>(i-1+allImages.length)%allImages.length); };
    document.addEventListener("keydown",h); document.body.style.overflow="hidden";
    return ()=>{ document.removeEventListener("keydown",h); document.body.style.overflow=""; };
  },[onClose,allImages.length]);
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md"/>
      <motion.div initial={{scale:0.94,opacity:0,y:12}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.94,opacity:0}} transition={{duration:0.25,ease:[0.16,1,0.3,1]}}
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden bg-page shadow-2xl flex flex-col max-h-[90vh]" onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-coral-400 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div className="relative w-full aspect-[16/10] flex-shrink-0 bg-section overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:0.25}} className="absolute inset-0">
              <Image src={allImages[current]} alt={item.title} fill className="object-cover" priority/>
            </motion.div>
          </AnimatePresence>
          {allImages.length>1&&(
            <>
              <button onClick={e=>{e.stopPropagation();setCurrent(i=>(i-1+allImages.length)%allImages.length)}} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-coral-400 flex items-center justify-center z-10">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={e=>{e.stopPropagation();setCurrent(i=>(i+1)%allImages.length)}} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-coral-400 flex items-center justify-center z-10">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {allImages.map((_,i)=>(<button key={i} onClick={e=>{e.stopPropagation();setCurrent(i)}} className={`transition-all rounded-full ${i===current?"w-5 h-1.5 bg-coral-400":"w-1.5 h-1.5 bg-white/50"}`}/>))}
              </div>
            </>
          )}
        </div>
        <div className="p-6 flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center gap-2"><div className="h-px w-4 bg-coral-400"/><span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-coral-500">{item.category}</span></div>
          <h3 className="font-display font-black text-xl text-page">{item.title}</h3>
          {item.description&&<p className="text-body text-sm leading-relaxed font-light">{item.description}</p>}
          {item.project_url&&(
            <a href={item.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-full bg-coral-400 text-white text-sm font-semibold hover:bg-coral-500 transition-colors self-start">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              View Live Project
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface PortfolioGridProps { limit?:number; showFilters?:boolean; showViewAll?:boolean; }

export default function PortfolioGrid({ limit, showFilters=true, showViewAll=false }: PortfolioGridProps) {
  const [items,setItems]=useState<PortfolioItem[]>([]);
  const [loading,setLoading]=useState(true);
  const [activeCategory,setActiveCategory]=useState("All");
  const [selected,setSelected]=useState<PortfolioItem|null>(null);
  const [categories,setCategories]=useState<string[]>(["All"]);

  useEffect(()=>{
    supabase.from("services").select("title").eq("active",true).order("sort_order",{ascending:true})
      .then(({data})=>{ setCategories(["All",...(data||[]).map((s:{title:string})=>s.title),"Other"]); });
  },[]);

  const fetchItems = useCallback(async ()=>{
    setLoading(true);
    let q=supabase.from("portfolio").select("*").order("created_at",{ascending:false});
    if(activeCategory!=="All") q=q.eq("category",activeCategory);
    if(limit) q=q.limit(limit);
    const{data,error}=await q;
    if(!error&&data) setItems(data as PortfolioItem[]);
    setLoading(false);
  },[activeCategory,limit]);

  useEffect(()=>{ fetchItems(); },[fetchItems]);

  const getSpan=(i:number)=>["col-span-1 sm:col-span-2 lg:col-span-8","col-span-1 lg:col-span-4","col-span-1 lg:col-span-4","col-span-1 lg:col-span-4","col-span-1 lg:col-span-4","col-span-1 sm:col-span-2 lg:col-span-6","col-span-1 sm:col-span-2 lg:col-span-6"][i%7];
  const getAspect=(i:number)=>["aspect-[16/8]","aspect-square","aspect-square","aspect-square","aspect-square","aspect-[4/3]","aspect-[4/3]"][i%7];

  return (
    <div>
      {showFilters&&(
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat=>(
            <button key={cat} onClick={()=>setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory===cat?"gradient-primary text-white shadow-md shadow-coral-400/20":"bento-card text-body hover:text-page"}`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {[...Array(limit||6)].map((_,i)=><div key={i} className={`${getSpan(i)} ${getAspect(i)} rounded-2xl bg-card animate-pulse`}/>)}
        </div>
      ) : items.length===0 ? (
        <div className="text-center py-20 text-muted"><p>No portfolio items yet.</p></div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <AnimatePresence mode="popLayout">
            {items.map((item,i)=>(
              <motion.div key={item.id} layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.95}} transition={{duration:0.3,delay:i*0.04}}
                className={`group cursor-pointer rounded-2xl overflow-hidden relative bg-card ${getSpan(i)} ${getAspect(i)}`}
                onClick={()=>setSelected(item)}>
                <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-coral-400 text-white text-[10px] font-semibold mb-2">{item.category}</span>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                </div>
                {(item.image_urls||[]).length>0&&(
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold">{(item.image_urls||[]).length+1} imgs</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {showViewAll&&(
        <div className="mt-6">
          <Link href="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bento-card text-body text-sm font-medium hover:text-page hover:shadow-md transition-all">
            View Full Portfolio <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </Link>
        </div>
      )}

      <AnimatePresence>{selected&&<ImageModal item={selected} onClose={()=>setSelected(null)}/>}</AnimatePresence>
    </div>
  );
}
