import type { Content } from "@/content/types";
import { ServiceGlyph } from "./Icons";
import { Section, SectionHeading } from "./SectionHeading";

export function Services({ c }: { c: Content["services"] }) {
  return (
    <Section id="services">
      <SectionHeading eyebrow="02 / services" title={c.title} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-5">
        {c.items.map((s) => (
          <div
            key={s.title}
            className="flex flex-col gap-4 rounded-[22px] border border-line bg-surface px-[30px] py-[34px]"
          >
            <ServiceGlyph icon={s.icon} />
            <h3 className="m-0 text-[21px] font-extrabold">{s.title}</h3>
            <p className="m-0 text-[15.5px] leading-[1.9] text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
