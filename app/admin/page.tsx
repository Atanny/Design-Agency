"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Stats {
  portfolio: number; reviews: number; reviewsPending: number;
  messages: number; messagesNew: number; blog: number; blogPublished: number; services: number;
}
interface RecentMessage { id: string; name: string; service: string; created_at: string; status: string; }
interface RecentReview  { id: string; name: string; rating: number; approved: boolean; created_at: string; }
interface MonthlyMsg    { month: string; count: number; }

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
    const endAngle   = endPct   * 2 * Math.PI - Math.PI / 2;
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
      setRecent({ messages:(recentMsg.data||[]) as RecentMessage[], reviews:(recentRev.data||[]) as RecentReview[] });

      const monthCounts: Record<string,number> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthCounts[`${d.getFullYear()}-${d.getMonth()}`] = 0;
      }
      (allMsgs.data||[]).forEach((m: { created_at: string }) => {
        const d = new Date(m.created_at);
        const k = `${d.getFullYear()}-${d.getMonth()}`;
        if (k in monthCounts) monthCounts[k]++;
      });
      setMsgChart(Object.entries(monthCounts).map(([k,v]) => ({
        label: MONTHS[parseInt(k.split("-")[1])],
        value: v,
      })));

      const dist = [0,0,0,0,0];
      (allRevs.data||[]).forEach((r: { rating: number }) => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating-1]++; });
      setRatingDist(dist);
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label:"Portfolio", value:stats.portfolio, sub:null, href:"/admin/portfolio", color:"bg-blue-500/15 text-blue-400", icon:<path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/> },
    { label:"Messages", value:stats.messages, sub:stats.messagesNew>0?`${stats.messagesNew} new`:null, href:"/admin/messages", color:"bg-emerald-500/15 text-emerald-400", icon:<path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/> },
    { label:"Reviews", value:stats.reviews, sub:stats.reviewsPending>0?`${stats.reviewsPending} pending`:null, href:"/admin/reviews", color:"bg-gold-500/15 text-gold-400", icon:<path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/> },
    { label:"Blog Posts", value:stats.blog, sub:`${stats.blogPublished} published`, href:"/admin/blog", color:"bg-violet-500/15 text-violet-400", icon:<path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/> },
    { label:"Services", value:stats.services, sub:"active on site", href:"/admin/services", color:"bg-rose-500/15 text-rose-400", icon:<path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/> },
  ];

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Welcome back. Here's your studio at a glance.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_,i)=><div key={i} className="h-28 rounded-2xl bg-zinc-800 animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="group p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>{c.icon}</svg>
              </div>
              <p className="text-2xl font-black text-white font-display leading-none mb-1">{c.value}</p>
              <p className="text-xs text-zinc-500">{c.label}</p>
              {c.sub && <p className="text-[11px] text-gold-500 mt-0.5 font-semibold">{c.sub}</p>}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Messages (Last 6 Months)</h2>
          <p className="text-xs text-zinc-600 mb-5">Inquiries received per month</p>
          {loading ? <div className="h-16 rounded-lg bg-zinc-800 animate-pulse"/> : <MiniBar data={msgChart} color="bg-gold-500" />}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Rating Distribution</h2>
          <p className="text-xs text-zinc-600 mb-5">From approved reviews</p>
          {loading ? <div className="h-24 rounded-lg bg-zinc-800 animate-pulse"/> : <RatingDonut distribution={ratingDist} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">View all →</Link>
          </div>
          {loading ? <div className="p-5 space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="h-10 rounded-lg bg-zinc-800 animate-pulse"/>)}</div>
          : recent.messages.length === 0 ? <p className="p-5 text-zinc-600 text-sm">No messages yet.</p>
          : <div className="divide-y divide-zinc-800">
              {recent.messages.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-800/40 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{m.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{m.service || "General inquiry"}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    {m.status === "new" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>}
                    <span className="text-[11px] text-zinc-600">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Recent Reviews</h2>
            <Link href="/admin/reviews" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">View all →</Link>
          </div>
          {loading ? <div className="p-5 space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="h-10 rounded-lg bg-zinc-800 animate-pulse"/>)}</div>
          : recent.reviews.length === 0 ? <p className="p-5 text-zinc-600 text-sm">No reviews yet.</p>
          : <div className="divide-y divide-zinc-800">
              {recent.reviews.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-800/40 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{r.name}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map((s)=><svg key={s} className={`w-3 h-3 ${s<=r.rating?"text-gold-400":"text-zinc-700"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                    </div>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${r.approved?"bg-emerald-500/20 text-emerald-400":"bg-amber-500/20 text-amber-400"}`}>
                    {r.approved ? "Live" : "Pending"}
                  </span>
                </div>
              ))}
            </div>}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{label:"Upload Portfolio",href:"/admin/portfolio"},{label:"Write Blog Post",href:"/admin/blog"},{label:"Review Messages",href:"/admin/messages"},{label:"Approve Reviews",href:"/admin/reviews"}].map((a)=>(
            <Link key={a.label} href={a.href} className="p-4 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-medium hover:text-white hover:border-zinc-600 hover:bg-zinc-800/50 transition-all">
              {a.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
