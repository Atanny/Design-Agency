import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServerClient } from "@/lib/supabaseClient";
import { getContent } from "@/lib/content";
import { unstable_noStore as noStore } from "next/cache";

export const revalidate = 0;

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

async function getHomeSEO() {
  noStore();
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("seo_settings")
      .select("*")
      .eq("page", "home")
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  noStore();
  const [seo, navContent] = await Promise.all([
    getHomeSEO(),
    getContent("navbar"),
  ]);

  const studioName = navContent.logo_name ? `${navContent.logo_name} Studio` : "--";
  const title = seo?.meta_title || `${studioName} — Design That Elevates Brands`;
  const description = seo?.meta_description || "Premium UI/UX, branding, and visual design services.";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lumisstudio.com"),
    title: { default: title, template: `%s | ${studioName}` },
    description,
    keywords: ["UI/UX Design", "Branding", "Poster Design", "Social Media Graphics", "Website Design", "Design Agency", "Philippines"],
    openGraph: {
      type: "website",
      siteName: studioName,
      title,
      description,
      images: seo?.og_image ? [seo.og_image] : [],
    },
    twitter: { card: "summary_large_image", title, description },
    icons: {
      icon: [{ url: "/api/favicon", type: "image/svg+xml" }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [navContent, footerContent] = await Promise.all([
    getContent("navbar"),
    getContent("footer"),
  ]);

  // Admin pages handle their own layout — skip shared Navbar/Footer for /admin routes
  // We use a client wrapper for that, so here we just pass content as data attributes
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/api/favicon" type="image/svg+xml" />
      </head>
      <body className={`${playfair.variable} ${dmSans.variable} font-body antialiased`}>
        <ThemeProvider>
          <DynamicTitle fallbackName={navContent.logo_name || ""} />
          <SiteShell navContent={navContent} footerContent={footerContent}>
            {children}
          </SiteShell>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "!bg-white dark:!bg-zinc-900 !text-zinc-900 dark:!text-white !border !border-zinc-200 dark:!border-zinc-700 !shadow-xl",
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

// Server component shell that conditionally renders Navbar/Footer
function SiteShell({
  children,
  navContent,
  footerContent,
}: {
  children: React.ReactNode;
  navContent: Record<string, string>;
  footerContent: Record<string, string>;
}) {
  return <LayoutWrapper navContent={navContent} footerContent={footerContent}>{children}</LayoutWrapper>;
}

// We need a client component to check pathname
import LayoutWrapper from "@/components/LayoutWrapper";
import DynamicTitle from "@/components/DynamicTitle";
