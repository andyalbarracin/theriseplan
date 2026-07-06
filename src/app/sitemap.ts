import type { MetadataRoute } from "next";
import { getSitemapRoutesSSR } from "@/lib/cms/ssr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://andyalbarracin.com").replace(/\/$/, "");
  return (await getSitemapRoutesSSR()).map((r) => ({
    url: r ? `${base}/${r}` : base,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
