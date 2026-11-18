import type { Content, Project } from "@/content/types";
import { ArrowIcon } from "./Icons";
import { Section, SectionHeading } from "./SectionHeading";

function ProjectCard({ p, c }: { p: Project; c: Content["work"] }) {
  return (
    <article className="flex flex-col gap-10">
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        className="block overflow-hidden rounded-2xl border border-line"
      >
        {/* A fixed-size static asset: next/image would add nothing in a static export. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.image.src}
          width={p.image.width}
          height={p.image.height}
          alt={p.image.alt}
          decoding="async"
          className="block h-auto w-full"
        />
      </a>
      <div className="grid gap-10 md:grid-cols-[3fr_2fr] md:gap-16">
        <div className="flex flex-col gap-4">
          <h3 className="font-display m-0 text-[clamp(1.75rem,3vw,2.25rem)] leading-tight font-bold rtl:font-medium rtl:leading-snug">
            {p.name}
          </h3>
          <p className="m-0 max-w-[560px] text-base leading-[1.85] text-muted">{p.description}</p>
        </div>
        <div className="flex flex-col gap-6">
          <dl className="m-0 flex flex-col text-base">
            <div className="flex justify-between gap-4 border-b border-line py-3 first:pt-0">
              <dt className="text-dim">{c.roleLabel}</dt>
              <dd className="m-0 text-end">{p.role}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line py-3">
              <dt className="text-dim">{c.statusLabel}</dt>
              <dd className="m-0">{p.statusValue}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line py-3">
              <dt className="text-dim">{c.stackLabel}</dt>
              <dd dir="ltr" lang="en" className="m-0 text-end">
                {p.tags.join(", ")}
              </dd>
            </div>
          </dl>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2.5 self-start font-medium text-accent-text underline-offset-4 hover:underline"
          >
            {c.visit}
            <bdi dir="ltr" lang="en" className="font-mono text-sm">
              {p.domain}
            </bdi>
            <ArrowIcon />
          </a>
        </div>
      </div>
    </article>
  );
}

export function Work({ c: w }: { c: Content["work"] }) {
  return (
    <Section id="work">
      <SectionHeading title={w.title} />
      {w.projects.map((p) => (
        <ProjectCard key={p.name} p={p} c={w} />
      ))}
    </Section>
  );
}
