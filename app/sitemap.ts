import type { MetadataRoute } from "next";
import { localePaths } from "@/content/locales";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fa = `${site.siteUrl}${localePaths.fa}`;
  const en = `${site.siteUrl}${localePaths.en}`;
  const languages = { fa, en, "x-default": fa };
  return [fa, en].map((url) => ({ url, alternates: { languages } }));
}
