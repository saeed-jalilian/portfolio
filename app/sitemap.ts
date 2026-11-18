import type { MetadataRoute } from "next";
import { localePaths } from "@/content/locales";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    fa: `${site.siteUrl}${localePaths.fa}`,
    en: `${site.siteUrl}${localePaths.en}`,
  };
  return Object.values(languages).map((url) => ({ url, alternates: { languages } }));
}
