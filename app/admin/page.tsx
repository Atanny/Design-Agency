"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { DashboardStats } from "@/types";
import Link from "next/link";

function StatCard({
  label,
  value,
  icon,
  href,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  return (
    <Link href={href} className="group">
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
          {icon}
        </div>
        <p className="text-3xl font-bold text-white font-display">{value}</p>
        <p className="text-sm text-zinc-500 mt-1">{label}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    portfolioCount: 0,
    reviewsCount: 0,
    messagesCount: 0,
    blogCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [portfolio, reviews, messages, blog] = await Promise.all([
        supabase.from("portfolio").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        portfolioCount: portfolio.count || 0,
        reviewsCount: reviews.count || 0,
        messagesCount: messages.count || 0,
        blogCount: blog.count || 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Portfolio Items",
      value: stats.portfolioCount,
      href: "/admin/portfolio",
      color: "bg-blue-500/20 text-blue-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Client Reviews",
      value: stats.reviewsCount,
      href: "/admin/reviews",
      color: "bg-gold-500/20 text-gold-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      label: "Messages",
      value: stats.messagesCount,
      href: "/admin/messages",
      color: "bg-emerald-500/20 text-emerald-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Blog Posts",
      value: stats.blogCount,
      href: "/admin/blog",
      color: "bg-violet-500/20 text-violet-400",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold text-white">
          Dashboard
        </h1>
        <p className="text-zinc-500 mt-1">
          Welcome back. Here&apos;s an overview of your studio.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Upload Portfolio", href: "/admin/portfolio" },
            { label: "Write Blog Post", href: "/admin/blog" },
            { label: "Review Messages", href: "/admin/messages" },
            { label: "Approve Reviews", href: "/admin/reviews" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="p-4 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-medium hover:text-white hover:border-zinc-600 hover:bg-zinc-800/50 transition-all"
            >
              {action.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
