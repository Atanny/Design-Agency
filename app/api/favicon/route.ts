import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("site_content")
      .select("key,value")
      .eq("section","navbar")
      .in("key",["logo_name","logo_image"]);

    const map: Record<string,string> = {};
    (data||[]).forEach((r: {key:string;value:string}) => { map[r.key] = r.value; });

    if (map.logo_image) {
      return NextResponse.redirect(map.logo_image);
    }

    const letter = (map.logo_name || "L").charAt(0).toUpperCase();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c8891a"/>
      <stop offset="100%" stop-color="#e8bd5a"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="7" fill="url(#g)"/>
  <text x="16" y="22" font-family="Georgia, serif" font-size="18" font-weight="700" fill="white" text-anchor="middle">${letter}</text>
</svg>`;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#c8891a"/><text x="16" y="22" font-family="Georgia,serif" font-size="18" font-weight="700" fill="white" text-anchor="middle">L</text></svg>`;
    return new NextResponse(svg, { headers: { "Content-Type": "image/svg+xml" } });
  }
}
