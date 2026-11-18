import type { Content } from "@/content/types";

export function Hero({ c }: { c: Content }) {
  return (
    <section id="top" className="page-container pt-16 pb-4 md:pt-28">
      <p className="enter m-0 flex items-center gap-2.5 text-sm text-muted [--i:0]">
        <span className="relative size-2 rounded-full bg-accent" aria-hidden="true">
          <span className="ping absolute inset-0 rounded-full bg-accent" />
        </span>
        {c.status}
      </p>
      <h1 className="enter [--i:1] font-display m-0 mt-8 max-w-[22ch] text-[clamp(2.5rem,6.4vw,4.75rem)] leading-[1.08] font-bold rtl:font-medium rtl:max-w-[30ch] rtl:text-[clamp(2.25rem,5.2vw,4rem)] rtl:leading-[1.4]">
        {c.hero.before}
        <span className="text-accent-text italic rtl:not-italic">{c.hero.highlight}</span>
        {c.hero.after}
      </h1>
      <div className="mt-14 grid gap-12 border-t border-line pt-10 md:grid-cols-[3fr_2fr] md:gap-16">
        <div className="flex flex-col gap-8">
          <p className="enter m-0 max-w-[560px] text-lg leading-[1.85] text-muted [--i:2]">{c.hero.sub}</p>
          <div className="enter flex flex-wrap gap-3 [--i:3]">
            <a
              href="#work"
              className="inline-flex h-12 items-center rounded-lg bg-accent px-6 font-medium text-accent-fg press hover:opacity-90"
            >
              {c.hero.ctaWork}
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-lg border border-line2 px-6 font-medium press hover:border-text"
            >
              {c.hero.ctaContact}
            </a>
          </div>
        </div>
        <dl className="enter m-0 flex flex-col text-base [--i:4]">
          {c.hero.facts.map((f) => (
            <div key={f.label} className="flex flex-col gap-1 border-b border-line py-4 first:pt-0">
              <dt className="text-sm text-dim">{f.label}</dt>
              <dd className="m-0" dir="auto">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
