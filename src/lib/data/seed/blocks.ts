import type { ContentBlock, SEOFields } from "@/lib/types";

/* Content-block constructors — mirror the P/H/Q/… helpers in data.js so the
   seed content transcribes 1:1 and stays type-safe. */
export const P = (text: string): ContentBlock => ({ type: "paragraph", text });
export const H = (text: string, level = 2): ContentBlock => ({ type: "heading", text, level });
export const Q = (text: string, cite?: string): ContentBlock => ({ type: "quote", text, cite });
export const IMG = (url: string, caption?: string): ContentBlock => ({ type: "image", url, caption });
export const GAL = (urls: string[]): ContentBlock => ({ type: "gallery", urls });
export const VID = (url: string, caption?: string): ContentBlock => ({ type: "video", url, caption });
export const CALL = (text: string): ContentBlock => ({ type: "callout", text });
export const ROUTE = (from: string, to: string, meta?: Record<string, string>): ContentBlock => ({ type: "route", from, to, meta });
export const HR = (): ContentBlock => ({ type: "divider" });
export const HAND = (text: string): ContentBlock => ({ type: "handwritten", text });
export const FEATURE = (items: string[]): ContentBlock => ({ type: "feature", items });
export const METRIC = (label: string, value: string): ContentBlock => ({ type: "metric", label, value });
export const STACK = (items: string[]): ContentBlock => ({ type: "stack", items });
export const LINKS = (items: { label: string; url: string }[]): ContentBlock => ({ type: "links", items });

export const seo = (title: string, description: string, ogImage: string): SEOFields => ({
  title,
  description,
  ogImage,
  canonical: "",
  twitterImage: ogImage,
});
