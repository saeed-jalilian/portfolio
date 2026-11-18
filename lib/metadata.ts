import type { Metadata } from "next";
import { localePaths, locales } from "@/content/locales";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";

export function buildMetadata(locale: Locale): Metadata {
  const { content: c, path, ogLocale } = locales[locale];
  const other = locales[locale === "fa" ? "en" : "fa"];
  return {
    metadataBase: new URL(site.siteUrl),
    title: c.meta.title,
    description: c.hero.sub,
    alternates: {
      canonical: path,
      languages: { ...localePaths, "x-default": localePaths.fa },
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: c.name,
      title: c.meta.title,
      description: c.hero.sub,
      locale: ogLocale,
      alternateLocale: other.ogLocale,
    },
  };
}

/** schema.org Person, serialized safely for an inline <script>. */
export function personJsonLd(locale: Locale): string {
  const c = locales[locale].content;
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: c.name,
    jobTitle: c.jobTitle,
    url: site.siteUrl,
    sameAs: [site.github],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
