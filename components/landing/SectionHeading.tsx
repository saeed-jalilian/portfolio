import type { ReactNode } from "react";

/** Shared outer shell of the Work, Services and Process sections. */
export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="page-container flex flex-col gap-12 pt-20 pb-10 md:pt-[120px]">
      {children}
    </section>
  );
}

/** The "01 / work" label above each section title. */
export function Eyebrow({ children }: { children: string }) {
  return (
    <span className="font-mono text-sm text-accent-text">
      <bdi dir="ltr" lang="en">{children}</bdi>
    </span>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-3.5">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="m-0 text-[clamp(2rem,3.6vw,3rem)] font-extrabold">{title}</h2>
    </div>
  );
}
