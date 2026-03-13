import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdesignagency.com"),
  title: {
    default: "Lumis Studio — Design That Elevates Brands",
    template: "%s | Lumis Studio",
  },
  description:
    "Premium UI/UX, branding, and visual design services. We create experiences that elevate your brand to the next level.",
  keywords: [
    "UI/UX Design",
    "Branding",
    "Poster Design",
    "Social Media Graphics",
    "Website Design",
    "Design Agency",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdesignagency.com",
    siteName: "Lumis Studio",
    title: "Lumis Studio — Design That Elevates Brands",
    description:
      "Premium UI/UX, branding, and visual design services. We create experiences that elevate your brand to the next level.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumis Studio — Design That Elevates Brands",
    description: "Premium UI/UX, branding, and visual design services.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${dmSans.variable} font-body antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className:
                "!bg-white dark:!bg-zinc-900 !text-zinc-900 dark:!text-white !border !border-zinc-200 dark:!border-zinc-700 !shadow-xl",
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
