import type { Content } from "@/content/types";
import { Section, SectionHeading } from "./SectionHeading";

export function Process({ c }: { c: Content["process"] }) {
  return (
    <Section id="process">
      <SectionHeading title={c.title} />
      {/* The step number comes from a CSS counter, so each language uses its own digits. */}
      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-8 gap-y-10 p-0 [counter-reset:step]">
        {c.steps.map((s) => (
          <li
            key={s.title}
            className="flex flex-col gap-2 border-t border-line2 pt-5 [counter-increment:step] before:font-display before:text-3xl before:leading-none before:text-accent-text before:content-[counter(step,decimal)] rtl:before:content-[counter(step,persian)]"
          >
            <h3 className="m-0 text-lg font-medium">{s.title}</h3>
            <p className="m-0 text-base leading-[1.85] text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
