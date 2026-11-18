import type { ReactNode } from "react";

/** Shared outer shell of every content section below the hero. */
export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="page-container flex flex-col gap-12 pt-24 md:pt-32">
      {children}
    </section>
  );
}

export function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="reveal font-display m-0 text-[clamp(2rem,4vw,3rem)] leading-tight font-bold rtl:font-medium rtl:leading-snug">
      {title}
    </h2>
  );
}
