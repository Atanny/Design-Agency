"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CommissionBanner from "./CommissionBanner";

interface LayoutWrapperProps {
  children: React.ReactNode;
  navContent: Record<string, string>;
  footerContent: Record<string, string>;
}

export default function LayoutWrapper({ children, navContent, footerContent }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <CommissionBanner />
      <Navbar logoName={navContent.logo_name} ctaText={navContent.cta_button} logoImage={navContent.logo_image} />
      <main>{children}</main>
      <Footer content={footerContent} logoName={navContent.logo_name} logoImage={navContent.logo_image} />
    </>
  );
}
