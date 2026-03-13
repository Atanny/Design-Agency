import { MetadataRoute } from "next";
import { createServerClient } from "@/lib/supabaseClient";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://yourdesignagency.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic blog post pages
  try {
    const supabase = createServerClient();
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, created_at")
      .eq("published", true);

    const blogPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...blogPages];
  } catch {
    return staticPages;
  }
}
