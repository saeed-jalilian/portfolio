import type { Content } from "@/content/types";
import { Section, SectionHeading } from "./SectionHeading";

export function Process({ c }: { c: Content["process"] }) {
  return (
    <Section id="process">
      <SectionHeading eyebrow="03 / process" title={c.title} />
      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-6 border-t border-line p-0">
        {c.steps.map((s, i) => (
          <li key={s.n} className="flex flex-col gap-3 py-[30px]">
            <span
              className={`text-[40px] font-black ${
                i === c.steps.length - 1 ? "text-accent-text" : "text-dim"
              }`}
            >
              {s.n}
            </span>
            <span className="text-[19px] font-extrabold">{s.title}</span>
            <span className="text-[15px] leading-[1.9] text-muted">{s.body}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
