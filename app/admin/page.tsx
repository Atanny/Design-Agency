"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Stats {
  portfolio: number;
  reviews: number;
  reviewsPending: number;
  messages: number;
  messagesNew: number;
  blog: number;
  blogPublished: number;
  services: number;
}

interface RecentMessage {
  id: string; name: string; service: string; created_at: string; status: string;
}
interface RecentReview {
  id: string; name: string; rating: number; approved: boolean; created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ portfolio:0, reviews:0, reviewsPending:0, messages:0, messagesNew:0, blog:0, blogPublished:0, services:0 });
  const [recent, setRecent] = useState<{ messages: RecentMessage[]; reviews: RecentReview[] }>({ messages: [], reviews: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [port, rev, revPend, msg, msgNew, blog, blogPub, svc, recentMsg, recentRev] = await Promise.all([
        supabase.from("portfolio").select("id",  { count:"exact", head:true }),
        supabase.from("reviews").select("id",    { count:"exact", head:true }),
        supabase.from("reviews").select("id",    { count:"exact", head:true }).eq("approved", false),
        supabase.from("messages").select("id",   { count:"exact", head:true }),
        supabase.from("messages").select("id",   { count:"exact", head:true }).eq("status","new"),
        supabase.from("blog_posts").select("id", { count:"exact", head:true }),
        supabase.from("blog_posts").select("id", { count:"exact", head:true }).eq("published", true),
        supabase.from("services").select("id",   { count:"exact", head:true }),
        supabase.from("messages").select("id,name,service,created_at,status").order("created_at",{ascending:false}).limit(5),
        supabase.from("reviews").select("id,name,rating,approved,created_at").order("created_at",{ascending:false}).limit(5),
      ]);
      setStats({
        portfolio: port.count||0, reviews: rev.count||0, reviewsPending: revPend.count||0,
        messages: msg.count||0, messagesNew: msgNew.count||0,
        blog: blog.count||0, blogPublished: blogPub.count||0, services: svc.count||0,
      });
      setRecent({ messages: (recentMsg.data||[]) as RecentMessage[], reviews: (recentRev.data||[]) as RecentReview[] });
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label:"Portfolio Items",  value:stats.portfolio,  sub:null,                            href:"/admin/portfolio", color:"bg-blue-500/15 text-blue-400",    icon:<path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/> },
    { label:"Messages",         value:stats.messages,   sub:stats.messagesNew>0?`${stats.messagesNew} new`:null,       href:"/admin/messages", color:"bg-emerald-500/15 text-emerald-400", icon:<path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/> },
    { label:"Reviews",          value:stats.reviews,    sub:stats.reviewsPending>0?`${stats.reviewsPending} pending`:null, href:"/admin/reviews",  color:"bg-gold-500/15 text-gold-400",     icon:<path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/> },
    { label:"Blog Posts",       value:stats.blog,       sub:`${stats.blogPublished} published`,                         href:"/admin/blog",     color:"bg-violet-500/15 text-violet-400", icon:<path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/> },
    { label:"Services",         value:stats.services,   sub:"active on site",                                          href:"/admin/services", color:"bg-rose-500/15 text-rose-400",     icon:<path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/> },
  ];

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Welcome back. Here's your studio at a glance.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_,i) => <div key={i} className="h-32 rounded-2xl bg-zinc-800 animate-pulse"/>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="group p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>{c.icon}</svg>
              </div>
              <p className="text-2xl font-black text-white font-display leading-none mb-1">{c.value}</p>
              <p className="text-xs text-zinc-500">{c.label}</p>
              {c.sub && <p className="text-[11px] text-gold-500 mt-1 font-semibold">{c.sub}</p>}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">View all →</Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="h-10 rounded-lg bg-zinc-800 animate-pulse"/>)}</div>
          ) : recent.messages.length === 0 ? (
            <p className="p-5 text-zinc-600 text-sm">No messages yet.</p>
          ) : (
            <div className="divide-y divide-zinc-800">
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
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Recent Reviews</h2>
            <Link href="/admin/reviews" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">View all →</Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[...Array(4)].map((_,i)=><div key={i} className="h-10 rounded-lg bg-zinc-800 animate-pulse"/>)}</div>
          ) : recent.reviews.length === 0 ? (
            <p className="p-5 text-zinc-600 text-sm">No reviews yet.</p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {recent.reviews.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-800/40 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{r.name}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} className={`w-3 h-3 ${s<=r.rating?"text-gold-400":"text-zinc-700"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${r.approved ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                    {r.approved ? "Approved" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label:"Upload Portfolio", href:"/admin/portfolio" },
            { label:"Write Blog Post",  href:"/admin/blog" },
            { label:"Review Messages",  href:"/admin/messages" },
            { label:"Approve Reviews",  href:"/admin/reviews" },
          ].map((a) => (
            <Link key={a.label} href={a.href}
              className="p-4 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-medium hover:text-white hover:border-zinc-600 hover:bg-zinc-800/50 transition-all"
            >
              {a.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
