import { locales } from "@/content/locales";
import type { Locale } from "@/content/types";

/** Current year, evaluated at build time (Persian calendar and digits for fa). */
export function currentYear(locale: Locale): string {
  return new Intl.DateTimeFormat(locales[locale].intlTag, { year: "numeric" }).format(new Date());
}
