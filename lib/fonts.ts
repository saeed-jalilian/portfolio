import { Instrument_Sans, Instrument_Serif, JetBrains_Mono, Vazirmatn } from "next/font/google";
import type { Locale } from "@/content/types";

// Weights match what the components use: 400 body, 500 medium, 700 bold.
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-vazirmatn",
  display: "swap",
});

// English body and display. Both root layouts import this module, so without
// preload: false the Persian page would preload these too.
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
  preload: false,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Persian pages never use the English faces, so they don't apply them. English
// keeps Vazirmatn for the Persian language-switch label.
export const fontVariables: Record<Locale, string> = {
  fa: `${vazirmatn.variable} ${jetbrains.variable}`,
  en: `${instrumentSans.variable} ${instrumentSerif.variable} ${vazirmatn.variable} ${jetbrains.variable}`,
};
