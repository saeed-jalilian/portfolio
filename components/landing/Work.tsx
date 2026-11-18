import type { Content, Project } from "@/content/types";
import { ArrowIcon, ImageIcon } from "./Icons";
import { Section, SectionHeading } from "./SectionHeading";
import { WindowDots } from "./WindowDots";

function ProjectCard({ p, c }: { p: Project; c: Content["work"] }) {
  return (
    <article className="flex flex-wrap overflow-hidden rounded-[28px] border border-line bg-surface">
      <div className="flex min-w-0 flex-[999_1_560px] items-center justify-center bg-surface2 p-4 sm:p-8">
        <div className="w-full overflow-hidden rounded-[14px] border border-line2 bg-bg">
          <div dir="ltr" className="flex items-center gap-[7px] bg-chrome px-3.5 py-[11px]">
            <WindowDots className="size-[9px] bg-dot" />
            <span className="ms-2.5 min-w-0 flex-1 truncate rounded-md bg-bg px-3 py-[5px] font-mono text-xs text-dim">
              {p.domain}
            </span>
          </div>
          <div className="bg-stripes flex h-[340px] flex-col items-center justify-center gap-2.5 text-[15px] text-dim">
            <ImageIcon />
            {c.shot}
          </div>
        </div>
      </div>
      <div className="flex min-w-0 flex-[1_1_380px] flex-col justify-center gap-[22px] px-6 py-8 sm:px-9 sm:py-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-warn-border bg-warn-bg px-3 py-1.5 text-[13px] font-bold text-warn-text">
            <span className="size-[7px] rounded-full bg-warn" />
            {c.inProgress}
          </span>
          <span className="text-[13px] text-dim">{p.year}</span>
        </div>
        <h3 className="m-0 text-[30px] leading-[1.4] font-extrabold">{p.name}</h3>
        <p className="m-0 text-base leading-[1.9] text-muted">{p.description}</p>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0 font-mono text-[13px]">
          {p.tags.map((t) => (
            <li key={t} dir="ltr" lang="en" className="rounded-lg bg-surface2 px-3 py-1.5 text-text">
              {t}
            </li>
          ))}
        </ul>
        <dl className="m-0 flex flex-col gap-3 border-t border-line pt-[22px] text-[15px]">
          <div className="flex justify-between gap-3">
            <dt className="text-dim">{c.roleLabel}</dt>
            <dd className="m-0">{p.role}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-dim">{c.statusLabel}</dt>
            <dd className="m-0">{p.statusValue}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export function Work({ c: w }: { c: Content["work"] }) {
  return (
    <Section id="work">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <SectionHeading eyebrow="01 / work" title={w.title} />
        <p className="m-0 max-w-[440px] text-base leading-[1.9] text-muted">{w.sub}</p>
      </div>
      {w.projects.map((p) => (
        <ProjectCard key={p.name} p={p} c={w} />
      ))}
      <a
        href="#contact"
        className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] border-[1.5px] border-dashed border-line2 px-6 py-10 text-text sm:px-9 sm:py-11"
      >
        <div className="flex flex-col gap-2.5">
          <span className="text-[26px] font-extrabold">{w.nextTitle}</span>
          <span className="text-base leading-[1.9] text-muted">{w.nextSub}</span>
        </div>
        <span className="inline-flex min-h-11 items-center gap-2.5 text-base font-bold text-accent-text">
          {w.nextCta}
          <ArrowIcon />
        </span>
      </a>
    </Section>
  );
}
