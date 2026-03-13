import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST() {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/contact");
  revalidatePath("/reviews");
  revalidatePath("/blog");
  return NextResponse.json({ revalidated: true });
}
