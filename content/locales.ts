import { en } from "./en";
import { fa } from "./fa";
import type { Content, Locale } from "./types";

interface LocaleConfig {
  content: Content;
  dir: "rtl" | "ltr";
  /** Route path, with the trailing slash the static export uses. */
  path: string;
  ogLocale: string;
  /** Intl tag for dates (Persian calendar and digits for fa). */
  intlTag: string;
  bodyFont: string;
}

/** Everything that differs per language, in one place. */
export const locales: Record<Locale, LocaleConfig> = {
  fa: {
    content: fa,
    dir: "rtl",
    path: "/",
    ogLocale: "fa_IR",
    intlTag: "fa-IR-u-ca-persian",
    bodyFont: "font-fa",
  },
  en: {
    content: en,
    dir: "ltr",
    path: "/en/",
    ogLocale: "en_US",
    intlTag: "en-US",
    bodyFont: "font-en",
  },
};

export const localePaths = { fa: locales.fa.path, en: locales.en.path };
