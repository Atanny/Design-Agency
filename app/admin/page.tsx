"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Stats {
 portfolio: number; reviews: number; reviewsPending: number;
 messages: number; messagesNew: number; blog: number; blogPublished: number; services: number;
}
interface RecentMessage { id: string; name: string; service: string; created_at: string; status: string; }
interface RecentReview { id: string; name: string; rating: number; approved: boolean; created_at: string; }
interface MonthlyMsg { month: string; count: number; }

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function MiniBar({ data, color }: { data: { label: string; value: number }[]; color: string }) {
 const max = Math.max(...data.map(d => d.value), 1);
 return (
 <div className="flex items-end gap-1 h-16">
 {data.map((d) => (
 <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group relative">
 <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
 {d.value}
 </div>
 <div className={`w-full rounded-t-sm transition-all duration-500 ${color}`}
 style={{ height: `${Math.max((d.value / max) * 56, d.value > 0 ? 4 : 1)}px` }} />
 <span className="text-[9px] text-zinc-600">{d.label}</span>
 </div>
 ))}
 </div>
 );
}

function RatingDonut({ distribution }: { distribution: number[] }) {
 const total = distribution.reduce((a, b) => a + b, 0) || 1;
 const avg = distribution.reduce((a, v, i) => a + v * (i + 1), 0) / total;
 const colors = ["#ef4444","#f97316","#eab308","#84cc16","#c8891a"];
 let cumulative = 0;
 const slices = distribution.map((count, i) => {
 const pct = count / total;
 const start = cumulative;
 cumulative += pct;
 return { pct, start, color: colors[i], label: `${i+1}★` };
 }).filter(s => s.pct > 0);

 const describeArc = (startPct: number, endPct: number) => {
 const r = 40; const cx = 50; const cy = 50;
 const startAngle = startPct * 2 * Math.PI - Math.PI / 2;
 const endAngle = endPct * 2 * Math.PI - Math.PI / 2;
 const x1 = cx + r * Math.cos(startAngle);
 const y1 = cy + r * Math.sin(startAngle);
 const x2 = cx + r * Math.cos(endAngle);
 const y2 = cy + r * Math.sin(endAngle);
 const largeArc = (endPct - startPct) > 0.5 ? 1 : 0;
 return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
 };

 return (
 <div className="flex items-center gap-6">
 <div className="relative w-24 h-24 flex-shrink-0">
 <svg viewBox="0 0 100 100" className="w-full h-full -rotate-0">
 {total === 0 ? (
 <circle cx="50" cy="50" r="40" fill="#27272a" />
 ) : (
 slices.map((s, i) => (
 <path key={i} d={describeArc(s.start, s.start + s.pct)} fill={s.color} opacity="0.85" />
 ))
 )}
 <circle cx="50" cy="50" r="26" fill="#18181b" />
 </svg>
 <div className="absolute inset-0 flex flex-col items-center justify-center">
 <span className="text-lg font-black text-white font-display leading-none">{avg.toFixed(1)}</span>
 <span className="text-[9px] text-zinc-500">avg</span>
 </div>
 </div>
 <div className="space-y-1 flex-1">
 {[5,4,3,2,1].map((star) => {
 const count = distribution[star-1] || 0;
 const pct = total > 0 ? (count/total)*100 : 0;
 return (
 <div key={star} className="flex items-center gap-2">
 <span className="text-[10px] text-zinc-500 w-5">{star}★</span>
 <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
 <div className="h-full bg-gold-500 rounded-full transition-all duration-700"
 style={{ width: `${pct}%` }} />
 </div>
 <span className="text-[10px] text-zinc-600 w-4">{count}</span>
 </div>
 );
 })}
 </div>
 </div>
 );
}

export default function AdminDashboard() {
 const [stats, setStats] = useState<Stats>({ portfolio:0,reviews:0,reviewsPending:0,messages:0,messagesNew:0,blog:0,blogPublished:0,services:0 });
 const [recent, setRecent] = useState<{ messages: RecentMessage[]; reviews: RecentReview[] }>({ messages:[], reviews:[] });
 const [msgChart, setMsgChart] = useState<{ label:string; value:number }[]>([]);
 const [ratingDist, setRatingDist] = useState<number[]>([0,0,0,0,0]);
 const [loading, setLoading] = useState(true);
 const [commissionOpen, setCommissionOpen] = useState<boolean | null>(null);

 useEffect(() => {
 async function load() {
 const now = new Date();
 const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();

 const [port,rev,revPend,msg,msgNew,blog,blogPub,svc,recentMsg,recentRev,allMsgs,allRevs] = await Promise.all([
 supabase.from("portfolio").select("id",{count:"exact",head:true}),
 supabase.from("reviews").select("id",{count:"exact",head:true}),
 supabase.from("reviews").select("id",{count:"exact",head:true}).eq("approved",false),
 supabase.from("messages").select("id",{count:"exact",head:true}),
 supabase.from("messages").select("id",{count:"exact",head:true}).eq("status","new"),
 supabase.from("blog_posts").select("id",{count:"exact",head:true}),
 supabase.from("blog_posts").select("id",{count:"exact",head:true}).eq("published",true),
 supabase.from("services").select("id",{count:"exact",head:true}),
 supabase.from("messages").select("id,name,service,created_at,status").order("created_at",{ascending:false}).limit(5),
 supabase.from("reviews").select("id,name,rating,approved,created_at").order("created_at",{ascending:false}).limit(5),
 supabase.from("messages").select("created_at").gte("created_at", sixMonthsAgo),
 supabase.from("reviews").select("rating").eq("approved",true),
 ]);

 setStats({
 portfolio:port.count||0, reviews:rev.count||0, reviewsPending:revPend.count||0,
 messages:msg.count||0, messagesNew:msgNew.count||0,
 blog:blog.count||0, blogPublished:blogPub.count||0, services:svc.count||0,
 });

  return (
    <div className="p-6 w-full max-w-full">
      {/* ── Header ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3">
        <div className="sm:col-span-8 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6 flex flex-col justify-between min-h-[110px]">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-gold-500">Admin Dashboard</p>
          <div>
            <h1 className="font-display text-3xl font-black text-white leading-none">Overview</h1>
            <p className="text-zinc-500 text-sm mt-1 font-light">Welcome back — here's your site at a glance.</p>
          </div>
        </div>
        <a href="/admin/commission"
          className={`sm:col-span-4 rounded-2xl p-6 flex flex-col justify-between min-h-[110px] transition-all ${
            commissionOpen === false
              ? "bg-red-500/10 border border-red-500/20 hover:bg-red-500/15"
              : "bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15"
          }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${commissionOpen===false?"bg-red-500":"bg-emerald-400 animate-pulse"}`}/>
            <span className={`text-[10px] font-semibold uppercase tracking-widest ${commissionOpen===false?"text-red-400":"text-emerald-400"}`}>
              {commissionOpen===false ? "Commissions Closed" : "Available for Work"}
            </span>
          </div>
          <p className={`text-sm font-medium ${commissionOpen===false?"text-red-300":"text-emerald-300"}`}>
            {commissionOpen===false ? "Click to re-open commissions" : "Click to manage availability"}
          </p>
        </a>
      </div>

      {/* ── Stat cards bento ── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
          {[...Array(5)].map((_,i)=><div key={i} className="h-28 rounded-2xl bg-zinc-900 animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
          {cards.map((c,i) => (
            <Link key={c.label} href={c.href}
              className={`group rounded-2xl p-5 border border-zinc-800/50 hover:border-zinc-700 transition-all flex flex-col justify-between min-h-[110px] ${
                i===0 ? "bg-zinc-900" : i===1 ? "bg-zinc-900" : i===2 ? "bg-zinc-900" : "bg-zinc-900"
              }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>{c.icon}</svg>
              </div>
              <div>
                <p className="text-2xl font-black text-white font-display leading-none mb-0.5">{c.value}</p>
                <p className="text-xs text-zinc-500">{c.label}</p>
                {c.sub && <p className="text-[11px] text-gold-400 mt-0.5 font-semibold">{c.sub}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        <div className="lg:col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px w-4 bg-gold-500/50"/>
            <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-500">Messages</h2>
          </div>
          <p className="text-xs text-zinc-600 mb-5 font-light">Inquiries received — last 6 months</p>
          {loading ? <div className="h-16 rounded-xl bg-zinc-800 animate-pulse"/> : <MiniBar data={msgChart} color="bg-gold-500"/>}
        </div>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px w-4 bg-gold-500/50"/>
            <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-500">Ratings</h2>
          </div>
          <p className="text-xs text-zinc-600 mb-5 font-light">From approved reviews</p>
          {loading ? <div className="h-24 rounded-xl bg-zinc-800 animate-pulse"/> : <RatingDonut distribution={ratingDist}/>}
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        {/* Messages */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/40">
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-gold-500/40"/>
              <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400">Recent Messages</h2>
            </div>
            <Link href="/admin/messages" className="text-xs text-gold-400 hover:text-gold-300 transition-colors font-medium">View all →</Link>
          </div>
          {loading
            ? <div className="p-5 space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="h-10 rounded-xl bg-zinc-800 animate-pulse"/>)}</div>
            : recent.messages.length===0
              ? <p className="p-5 text-zinc-600 text-sm font-light">No messages yet.</p>
              : <div className="divide-y divide-zinc-800/30">
                  {recent.messages.map((m)=>(
                    <div key={m.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-zinc-800/30 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{m.name}</p>
                        <p className="text-xs text-zinc-500 truncate font-light">{m.service||"General inquiry"}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        {m.status==="new"&&<span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>}
                        <span className="text-[11px] text-zinc-600">{new Date(m.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
          }
        </div>

        {/* Reviews */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800/50 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/40">
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-gold-500/40"/>
              <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-400">Recent Reviews</h2>
            </div>
            <Link href="/admin/reviews" className="text-xs text-gold-400 hover:text-gold-300 transition-colors font-medium">View all →</Link>
          </div>
          {loading
            ? <div className="p-5 space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="h-10 rounded-xl bg-zinc-800 animate-pulse"/>)}</div>
            : recent.reviews.length===0
              ? <p className="p-5 text-zinc-600 text-sm font-light">No reviews yet.</p>
              : <div className="divide-y divide-zinc-800/30">
                  {recent.reviews.map((r)=>(
                    <div key={r.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-zinc-800/30 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{r.name}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1,2,3,4,5].map((s)=><svg key={s} className={`w-3 h-3 ${s<=r.rating?"text-gold-400":"text-zinc-700"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                        </div>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${r.approved?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":"bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                        {r.approved ? "Live" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
          }
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div>
        <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-zinc-600 mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {label:"Upload Portfolio", href:"/admin/portfolio", color:"bg-blue-500/10 text-blue-400 border-blue-500/20"},
            {label:"Write Blog Post",  href:"/admin/blog",      color:"bg-violet-500/10 text-violet-400 border-violet-500/20"},
            {label:"View Messages",    href:"/admin/messages",  color:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20"},
            {label:"Approve Reviews",  href:"/admin/reviews",   color:"bg-gold-500/10 text-gold-400 border-gold-500/20"},
          ].map((a)=>(
            <Link key={a.label} href={a.href}
              className={`rounded-2xl p-5 border text-sm font-medium transition-all hover:scale-[1.02] ${a.color}`}>
              {a.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
