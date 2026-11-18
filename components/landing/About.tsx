import type { Content } from "@/content/types";
import { Section, SectionHeading } from "./SectionHeading";

/** Deliberately a different shape from the hairline lists around it: one narrow column, larger lead. */
export function About({ c }: { c: Content["about"] }) {
  const [lead, ...rest] = c.body;
  return (
    <Section id="about">
      <SectionHeading title={c.title} />
      <div className="reveal flex max-w-[680px] flex-col gap-6">
        <p className="m-0 text-2xl leading-[1.7] rtl:leading-[1.9]">{lead}</p>
        {rest.map((p) => (
          <p key={p} className="m-0 text-lg leading-[1.85] text-muted">
            {p}
          </p>
        ))}
      </div>
    </Section>
  );
}
