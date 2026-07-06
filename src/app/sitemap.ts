import type { MetadataRoute } from "next";
import { getSitemapRoutes } from "@/lib/cms";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://andyalbarracin.com").replace(/\/$/, "");
  return getSitemapRoutes().map((r) => ({
    url: r ? `${base}/${r}` : base,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
