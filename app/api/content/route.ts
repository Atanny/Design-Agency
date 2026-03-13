import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { updates } = await req.json();

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabase = createServerClient();

    const upserts = updates.map((u: { section: string; key: string; value: string }) => ({
      section: u.section,
      key: u.key,
      value: u.value,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("site_content")
      .upsert(upserts, { onConflict: "section,key" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate all public pages so changes show immediately
    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/portfolio");
    revalidatePath("/contact");
    revalidatePath("/reviews");
    revalidatePath("/blog");

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
