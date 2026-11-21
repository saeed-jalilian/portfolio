import type { Content } from "@/content/types";
import { LogoMark } from "../Logo";
import { ThemeToggle } from "../ThemeToggle";

export function Nav({ c }: { c: Content }) {
  const links = [
    { href: "#work", label: c.nav.work },
    { href: "#services", label: c.nav.services },
    { href: "#about", label: c.nav.about },
    { href: "#process", label: c.nav.process },
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-nav-bg">
      <nav className="page-container flex flex-wrap items-center justify-between gap-4 py-3">
        <a href="#top" className="flex items-center gap-3">
          <LogoMark size={36} title="" />
          {/* Below sm the name would push the controls onto a second row of the sticky bar. */}
          <span className="sr-only font-medium sm:not-sr-only">{c.name}</span>
        </a>
        <div className="flex flex-wrap items-center gap-6 text-base">
          <div className="hidden items-center gap-6 lg:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-muted transition-colors hover:text-text">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={c.langSwitch.href}
              lang={c.langSwitch.lang}
              hrefLang={c.langSwitch.lang}
              aria-label={c.langSwitch.aria}
              className="inline-flex h-11 min-w-[52px] items-center justify-center rounded-lg border border-line2 px-3.5 text-sm font-medium press"
            >
              {c.langSwitch.label}
            </a>
            <ThemeToggle toLight={c.theme.toLight} toDark={c.theme.toDark} />
            <a
              href="#contact"
              className="inline-flex h-11 items-center rounded-lg bg-accent px-4 font-medium text-accent-fg press hover:opacity-90 sm:px-5"
            >
              {c.nav.cta}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
