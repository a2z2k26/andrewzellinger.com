import { ARTICLE_DETAILS } from "./article-content.js";
import { PROJECTS } from "./project-content.js";

export const CASE_STUDIES = PROJECTS;
export { ARTICLE_DETAILS };

export const DETAIL_ENTRIES = Object.freeze([...CASE_STUDIES, ...ARTICLE_DETAILS]);

export function collectionForKind(kind) {
  return kind === "project" ? CASE_STUDIES : ARTICLE_DETAILS;
}

export function detailFromPath(pathname) {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return DETAIL_ENTRIES.find((entry) => entry.path.replace(/\/$/, "") === normalized) ?? null;
}
