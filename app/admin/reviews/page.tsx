"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";
import type { Review } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s=>(
        <svg key={s} className={`w-3.5 h-3.5 ${s<=rating?"text-amber-400":"text-zinc-700"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [confirmState, setConfirmState] = useState<{type:"delete"|"toggle";id:string;approved?:boolean}|null>(null);
  const router = useRouter();

  const fetchReviews = async () => {
    const {data} = await supabase.from("reviews").select("*").order("created_at",{ascending:false});
    setReviews((data as Review[])||[]);
    setLoading(false);
  };
  useEffect(()=>{fetchReviews();},[]);

  const toggleApproval = async (id:string, approved:boolean) => {
    const {error} = await supabase.from("reviews").update({approved:!approved}).eq("id",id);
    if(error){toast.error(error.message);}
    else{setReviews(p=>p.map(r=>r.id===id?{...r,approved:!approved}:r));toast.success(`Review ${!approved?"approved":"unpublished"}!`);router.refresh();}
  };
  const deleteReview = async (id:string) => {
    const {error} = await supabase.from("reviews").delete().eq("id",id);
    if(error){toast.error(error.message);}else{setReviews(p=>p.filter(r=>r.id!==id));toast.success("Review deleted.");}
  };

  const filtered = filter==="all"?reviews:filter==="approved"?reviews.filter(r=>r.approved):reviews.filter(r=>!r.approved);
  const pendingCount = reviews.filter(r=>!r.approved).length;

  return (
    <div className="p-6 w-full">
      {/* Bento header */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
        <div className="sm:col-span-8 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6 flex flex-col justify-between min-h-[110px]">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-coral-400">Admin</p>
          <div>
            <h1 className="font-display text-3xl font-black text-white leading-none">Reviews</h1>
            <p className="text-zinc-500 text-sm mt-1 font-light">{pendingCount>0?<span className="text-amber-400 font-medium">{pendingCount} pending approval</span>:"All reviews processed"}</p>
          </div>
        </div>
        <div className="sm:col-span-4 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-5 flex flex-col justify-center gap-2">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-600">Filter</p>
          <div className="flex flex-wrap gap-2">
            {[{key:"pending",label:`Pending${pendingCount>0?` (${pendingCount})`:""}`},{key:"approved",label:"Approved"},{key:"all",label:"All"}].map(f=>(
              <button key={f.key} onClick={()=>setFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter===f.key?"gradient-primary text-white":"border border-zinc-800/60 text-zinc-500 hover:text-white hover:border-zinc-700"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl bg-blue-900/10 border border-blue-800/30 p-4 mb-4 flex items-start gap-3">
        <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p className="text-blue-300 text-sm">Approved reviews appear instantly on the public Reviews page and homepage.</p>
      </div>

      {loading?(
        <div className="grid grid-cols-1 gap-3">{[...Array(4)].map((_,i)=><div key={i} className="h-24 rounded-2xl bg-zinc-900 animate-pulse"/>)}</div>
      ):filtered.length===0?(
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-16 text-center text-zinc-600">No reviews in this filter.</div>
      ):(
        <div className="grid grid-cols-1 gap-3">
          {filtered.map(review=>(
            <div key={review.id} className={`rounded-2xl border p-5 flex items-start justify-between gap-4 transition-all ${review.approved?"bg-zinc-900 border-zinc-800/50":"bg-amber-900/5 border-amber-800/25"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{review.name}</p>
                    <Stars rating={review.rating}/>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${review.approved?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":"bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                    {review.approved?"Live":"Pending"}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed pl-11">{review.message}</p>
                <p className="text-zinc-700 text-xs mt-2 pl-11">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={()=>setConfirmState({type:"toggle",id:review.id,approved:review.approved})}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${review.approved?"border border-zinc-800/60 text-zinc-400 hover:text-white":"bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25"}`}>
                  {review.approved?"Unpublish":"Approve"}
                </button>
                <button onClick={()=>setConfirmState({type:"delete",id:review.id})}
                  className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        open={!!confirmState}
        title={confirmState?.type==="delete"?"Delete Review":confirmState?.approved?"Unpublish Review":"Approve Review"}
        message={confirmState?.type==="delete"?"This will permanently delete the review.":confirmState?.approved?"This review will be removed from the public page.":"This review will be visible to all visitors."}
        confirmLabel={confirmState?.type==="delete"?"Yes, Delete":confirmState?.approved?"Unpublish":"Approve"}
        variant={confirmState?.type==="delete"?"danger":confirmState?.approved?"warning":"success"}
        onConfirm={()=>{if(!confirmState)return;if(confirmState.type==="delete")deleteReview(confirmState.id);else toggleApproval(confirmState.id,confirmState.approved!);setConfirmState(null);}}
        onCancel={()=>setConfirmState(null)}
      />
    </div>
  );
}
