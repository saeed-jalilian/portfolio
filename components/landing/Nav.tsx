import type { Content } from "@/content/types";
import { LogoMark } from "../Logo";
import { ThemeToggle } from "../ThemeToggle";

export function Nav({ c }: { c: Content }) {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-nav-bg backdrop-blur-md">
      <nav className="page-container flex flex-wrap items-center justify-between gap-4 py-4">
        <a href="#top" className="flex items-center gap-3">
          <LogoMark size={40} title="" />
          <span className="text-[17px] font-extrabold">{c.name}</span>
        </a>
        <div className="flex flex-wrap items-center gap-6 text-[15px]">
          <div className="hidden items-center gap-6 md:flex">
            <a href="#work" className="text-muted">
              {c.nav.work}
            </a>
            <a href="#services" className="text-muted">
              {c.nav.services}
            </a>
            <a href="#process" className="text-muted">
              {c.nav.process}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={c.langSwitch.href}
              lang={c.langSwitch.lang}
              hrefLang={c.langSwitch.lang}
              aria-label={c.langSwitch.aria}
              className="inline-flex h-11 min-w-[52px] items-center justify-center rounded-xl border border-line2 bg-surface px-3.5 text-sm font-bold text-text"
            >
              {c.langSwitch.label}
            </a>
            <ThemeToggle toLight={c.theme.toLight} toDark={c.theme.toDark} />
            <a
              href="#contact"
              className="inline-flex h-11 items-center rounded-xl bg-cta-bg px-4 font-bold text-cta-fg sm:px-5"
            >
              {c.nav.cta}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
