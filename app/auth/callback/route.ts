import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code        = requestUrl.searchParams.get("code");
  const type        = requestUrl.searchParams.get("type");
  const token_hash  = requestUrl.searchParams.get("token_hash");
  const next        = requestUrl.searchParams.get("next") ?? "/admin";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  if (token_hash) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: (type as "email" | "recovery" | "invite" | "email_change") || "recovery",
    });

    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${siteUrl}/admin/reset-password`);
      }
      if (type === "email") {
        return NextResponse.redirect(`${siteUrl}/admin?confirmed=1`);
      }
      return NextResponse.redirect(`${siteUrl}${next}`);
    }

    return NextResponse.redirect(`${siteUrl}/admin/login?error=invalid_token`);
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${siteUrl}/admin/reset-password`);
      }
      return NextResponse.redirect(`${siteUrl}${next}`);
    }

    return NextResponse.redirect(`${siteUrl}/admin/login?error=invalid_code`);
  }

  return NextResponse.redirect(`${siteUrl}/admin/login`);
}
