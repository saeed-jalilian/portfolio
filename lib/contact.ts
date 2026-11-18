import { site } from "@/content/site";
import type { ContactId } from "@/content/types";

export interface ContactLink {
  display: string;
  href: string;
  external: boolean;
}

/**
 * Values in content/site.ts wrapped in [brackets] are not filled in yet; those
 * return null so the page never shows a placeholder.
 */
export function getContactLink(id: ContactId): ContactLink | null {
  const v: string = site[id];
  if (v.startsWith("[")) return null;
  switch (id) {
    case "telegram":
      return { display: v, href: `https://t.me/${v.replace(/^@/, "")}`, external: true };
    case "email":
      return { display: v, href: `mailto:${v}`, external: false };
    case "phone":
      return { display: v, href: `tel:${v.replace(/[^\d+]/g, "")}`, external: false };
    case "whatsapp":
      return { display: v, href: `https://wa.me/${v.replace(/\D/g, "")}`, external: true };
    case "github":
      return { display: v.replace(/^https?:\/\//, ""), href: v, external: true };
  }
}
