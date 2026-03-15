"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const NAV = [
  { href: "/admin",           label: "Overview",  icon: "grid",     badge: null },
  { href: "/admin/content",   label: "Content",   icon: "edit2",    badge: null },
  { href: "/admin/services",  label: "Services",  icon: "layers",   badge: "services" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "image",    badge: "portfolio" },
  { href: "/admin/messages",  label: "Messages",  icon: "mail",     badge: "messages" },
  { href: "/admin/reviews",   label: "Reviews",   icon: "star",     badge: "reviews" },
  { href: "/admin/blog",      label: "Blog",      icon: "edit",     badge: "blog" },
  { href: "/admin/users",     label: "Users",     icon: "users",    badge: null },
  { href: "/admin/seo",       label: "SEO",       icon: "search",   badge: null },
  { href: "/admin/settings",   label: "Settings",   icon: "settings",    badge: null },
  { href: "/admin/commission",  label: "Commission",  icon: "commission",  badge: null },
];

const ICONS: Record<string, React.ReactNode> = {
  grid:     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  edit2:    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
  image:    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  mail:     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  star:     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  edit:     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  search:   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  layers:   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
  users:    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  commission: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  settings: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [logoName, setLogoName] = useState("");
  const [logoImage, setLogoImage] = useState<string|null>(null);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !isLoginPage) router.replace("/admin/login");
      else if (session) setUserEmail(session.user.email || "");
      setChecking(false);
    });
    const fetchLogo = () => {
      supabase.from("site_content").select("key,value").eq("section","navbar")
        .in("key",["logo_name","logo_image"]).then(({ data }) => {
          if (data) {
            const map: Record<string,string> = {};
            data.forEach((r: {key:string;value:string}) => { map[r.key] = r.value; });
            if (map.logo_name) setLogoName(map.logo_name);
            setLogoImage(map.logo_image || null);
          }
        });
    };
    fetchLogo();

    const channel = supabase
      .channel("admin-logo-watch")
      .on("postgres_changes", { event:"*", schema:"public", table:"site_content", filter:"section=eq.navbar" }, fetchLogo)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [router, isLoginPage]);

  useEffect(() => {
    if (isLoginPage) return;
    Promise.all([
      supabase.from("portfolio").select("id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("approved", false),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("services").select("id", { count: "exact", head: true }),
    ]).then(([portfolio, messages, reviews, blog, services]) => {
      setCounts({
        portfolio: portfolio.count || 0,
        messages:  messages.count  || 0,
        reviews:   reviews.count   || 0,
        blog:      blog.count      || 0,
        services:  services.count  || 0,
      });
    });
  }, [isLoginPage]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (checking) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <aside className="w-60 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-5 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2">
            {logoImage ? (
                <img src={logoImage} alt={logoName} className="w-7 h-7 rounded-lg object-contain"/>
              ) : (
                <span className="w-7 h-7 rounded-lg gradient-gold flex items-center justify-center text-white font-display font-bold text-sm">
                  {logoName ? logoName.charAt(0).toUpperCase() : "--"}
                </span>
              )}
            <div>
              <span className="font-display text-white font-semibold text-sm block leading-none">{logoName ? `${logoName} Studio` : "--"}</span>
              <span className="text-xs text-zinc-500">Dashboard</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const count = item.badge ? counts[item.badge] : 0;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={active ? "text-gold-400" : ""}>{ICONS[item.icon]}</span>
                <span className="flex-1">{item.label}</span>
                {count > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-gold-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full gradient-gold flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs text-zinc-400 truncate min-w-0">{userEmail}</p>
          </div>
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-60 min-h-screen">{children}</main>
    </div>
  );
}
