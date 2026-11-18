import type { Content } from "@/content/types";
import { Section, SectionHeading } from "./SectionHeading";

export function Services({ c }: { c: Content["services"] }) {
  return (
    <Section id="services">
      <SectionHeading title={c.title} />
      <ul className="m-0 flex list-none flex-col border-t border-line p-0">
        {c.items.map((s) => (
          <li
            key={s.title}
            className="reveal grid gap-3 border-b border-line py-8 md:grid-cols-[2fr_3fr] md:gap-16"
          >
            <h3 className="m-0 text-xl leading-snug font-medium">{s.title}</h3>
            <p className="m-0 max-w-[560px] text-base leading-[1.85] text-muted">{s.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
