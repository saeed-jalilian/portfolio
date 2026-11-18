import type { ReactNode } from "react";
import { locales } from "@/content/locales";
import type { Locale } from "@/content/types";
import { fontVariables } from "@/lib/fonts";
import { themeScript } from "@/lib/theme-script";
import "@/app/globals.css";

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const { dir, bodyFont } = locales[locale];
  return (
    <html
      lang={locale}
      dir={dir}
      data-theme="dark"
      className={`${fontVariables[locale]} antialiased`}
      suppressHydrationWarning
    >
      <body className={bodyFont}>
        {/* First in <body>: applies the stored theme before anything paints. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
