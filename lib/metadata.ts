import type { Metadata, Viewport } from "next";
import { BRAND } from "@/components/Logo";
import { localePaths, locales, otherLocale } from "@/content/locales";
import { site } from "@/content/site";
import type { Locale } from "@/content/types";

export function buildMetadata(locale: Locale): Metadata {
  const { content: c, path, ogLocale } = locales[locale];
  const { title, description } = c.meta;
  return {
    metadataBase: new URL(site.siteUrl),
    title,
    description,
    applicationName: c.name,
    authors: [{ name: c.name, url: site.siteUrl }],
    alternates: {
      canonical: path,
      languages: { ...localePaths, "x-default": localePaths.fa },
    },
    // Indexing is the default; this only allows large previews and full snippets.
    robots: { googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
    // Stops iOS from turning digits (years, versions) into phone links.
    formatDetection: { telephone: false },
    openGraph: {
      type: "website",
      url: path,
      siteName: c.name,
      title,
      description,
      locale: ogLocale,
      alternateLocale: locales[otherLocale(locale)].ogLocale,
      // A page-level openGraph replaces the inherited one, so the image from
      // app/opengraph-image.tsx has to be listed here.
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND.paper },
    // Matches --bg under [data-theme="dark"] in app/globals.css.
    { media: "(prefers-color-scheme: dark)", color: "#16130f" },
  ],
};

/** schema.org WebSite + ProfilePage + Person, serialized safely for an inline <script>. */
export function personJsonLd(locale: Locale): string {
  const { content: c, path, langTag } = locales[locale];
  const pageUrl = `${site.siteUrl}${path}`;
  const websiteId = `${site.siteUrl}/#website`;
  const personId = `${site.siteUrl}/#person`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.siteUrl,
        name: site.name,
        alternateName: locales.fa.content.name,
        inLanguage: Object.values(locales).map((l) => l.langTag),
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profile`,
        url: pageUrl,
        name: c.meta.title,
        description: c.meta.description,
        inLanguage: langTag,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        // Same @id on both pages, so the names stay the same too.
        name: site.name,
        alternateName: locales.fa.content.name,
        jobTitle: c.jobTitle,
        url: site.siteUrl,
        email: `mailto:${site.email}`,
        knowsAbout: ["Next.js", "React", "Nest.js", "TypeScript", "Django", "FastAPI", "Web design"],
        knowsLanguage: Object.keys(locales),
        sameAs: [site.github],
      },
    ],
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
