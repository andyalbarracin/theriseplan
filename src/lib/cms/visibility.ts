import type { Post, Project } from "@/lib/types";

/* The single public-visibility rule for the whole site. Drafts, private, hidden
   and sensitive content must never reach a public page. */
export const isPublicPost = (p: Post): boolean =>
  p.status === "published" && p.visibility === "public";

export const isPublicProject = (pr: Project): boolean =>
  pr.visibility === "public" && !pr.sensitive && pr.status !== "draft";
