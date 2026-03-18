"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DynamicTitle({ fallbackName }: { fallbackName: string }) {
  useEffect(() => {
    const updateTitle = (name: string) => {
      const studioName = name ? `${name} Studio` : (fallbackName ? `${fallbackName} Studio` : 'Design Studio');
      const current = document.title;
      if (current.includes(" | ")) {
        const pagePart = current.split(" | ")[0];
        document.title = `${pagePart} | ${studioName}`;
      } else {
        document.title = `${studioName} — Design That Elevates Brands`;
      }
    };

    supabase
      .from("site_content")
      .select("value")
      .eq("section", "navbar")
      .eq("key", "logo_name")
      .single()
      .then(({ data }) => {
        if (data?.value) updateTitle(data.value);
      });

    const channel = supabase
      .channel("title-watch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_content", filter: "section=eq.navbar" },
        ({ new: row }) => {
          if ((row as { key?: string; value?: string })?.key === "logo_name") {
            updateTitle((row as { value?: string }).value || "");
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fallbackName]);

  return null;
}
