import { JetBrains_Mono, Manrope, Vazirmatn } from "next/font/google";
import type { Locale } from "@/content/types";

// Weights match what the components use: 400 body, 700 bold, 800 extrabold, 900 black.
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
  // Both root layouts import this module, so without this the Persian page
  // would preload Manrope too.
  preload: false,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Persian pages never use Manrope, so they don't apply it. English keeps
// Vazirmatn for the Persian language-switch label.
export const fontVariables: Record<Locale, string> = {
  fa: `${vazirmatn.variable} ${jetbrains.variable}`,
  en: `${manrope.variable} ${vazirmatn.variable} ${jetbrains.variable}`,
};
