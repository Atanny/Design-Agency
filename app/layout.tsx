import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import { unstable_noStore as noStore } from "next/cache";
import LayoutWrapper from "@/components/LayoutWrapper";
import DynamicTitle from "@/components/DynamicTitle";

export const revalidate = 0;

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400","500","600","700","800","900"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300","400","500","600","700","800","900"],
});

async function getHomeSEO() {
  noStore();
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from("seo_settings").select("*").eq("page","home").single();
    return data;
  } catch { return null; }
}

export async function generateMetadata(): Promise<Metadata> {
  noStore();
  const [seo, navContent] = await Promise.all([getHomeSEO(), getContent("navbar")]);
  const name = navContent.logo_name ? `${navContent.logo_name}` : "Freelance Designer";
  const title = seo?.meta_title || `${name} — Design That Elevates Brands`;
  const description = seo?.meta_description || "Freelance UI/UX, branding, and visual design services.";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yourstudio.com"),
    title: { default: title, template: `%s | ${name}` },
    description,
    openGraph: { type:"website", title, description, images: seo?.og_image ? [seo.og_image] : [] },
    twitter: { card:"summary_large_image", title, description },
    icons: { icon:[{ url:"/api/favicon", type:"image/svg+xml" }] },
    robots: { index:true, follow:true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [navContent, footerContent] = await Promise.all([
    getContent("navbar"),
    getContent("footer"),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/api/favicon" type="image/svg+xml" />
        {/* Prevent FOUC — apply dark class before paint */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var s=localStorage.getItem('theme');
            var d=window.matchMedia('(prefers-color-scheme:dark)').matches;
            var t=s||(d?'dark':'dark');
            if(t==='dark')document.documentElement.classList.add('dark');
          })();
        `}} />
      </head>
      <body className={`${playfair.variable} ${poppins.variable} antialiased`}>
        <ThemeProvider>
          <DynamicTitle fallbackName={navContent.logo_name || ""} />
          <LayoutWrapper navContent={navContent} footerContent={footerContent}>
            {children}
          </LayoutWrapper>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "!bg-card !text-page !border !border-card !shadow-xl",
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
