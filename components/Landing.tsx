import { locales } from "@/content/locales";
import type { Locale } from "@/content/types";
import { currentYear } from "@/lib/format";
import { personJsonLd } from "@/lib/metadata";
import { Contact } from "./landing/Contact";
import { Footer } from "./landing/Footer";
import { Hero } from "./landing/Hero";
import { Nav } from "./landing/Nav";
import { Process } from "./landing/Process";
import { Services } from "./landing/Services";
import { StackStrip } from "./landing/StackStrip";
import { Work } from "./landing/Work";

export function Landing({ locale }: { locale: Locale }) {
  const c = locales[locale].content;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personJsonLd(locale) }} />
      <Nav c={c} />
      <main>
        <Hero c={c} />
        <StackStrip label={c.stackLabel} />
        <Work c={c.work} />
        <Services c={c.services} />
        <Process c={c.process} />
        <Contact c={c.contact} />
      </main>
      <Footer text={c.footer(currentYear(locale))} />
    </>
  );
}
