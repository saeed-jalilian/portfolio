import { site } from "@/content/site";
import type { ContactId } from "@/content/types";

export interface ContactLink {
  display: string;
  href: string;
  external: boolean;
}

/** Values in content/site.ts wrapped in [brackets] are not filled in yet. */
const isPlaceholder = (v: string) => v.startsWith("[");

export function getContactLink(id: ContactId): ContactLink {
  const v: string = site[id];
  if (isPlaceholder(v)) return { display: v, href: "#contact", external: false };
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
