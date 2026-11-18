import type { Content } from "@/content/types";
import { getContactLink } from "@/lib/contact";
import { ContactGlyph } from "./Icons";
import { Eyebrow } from "./SectionHeading";

export function Contact({ c }: { c: Content["contact"] }) {
  return (
    <section id="contact" className="page-container pt-20 pb-16 md:pt-[120px] md:pb-[100px]">
      <div className="flex flex-wrap items-start gap-14 rounded-[32px] border border-line bg-surface p-[clamp(24px,5vw,72px)]">
        <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-[22px]">
          <Eyebrow>04 / contact</Eyebrow>
          <h2 className="m-0 text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[1.3] font-black">
            {c.before}
            <br />
            <span className="text-accent-text">{c.highlight}</span>
          </h2>
          <p className="m-0 max-w-[480px] text-[17px] leading-[1.9] text-muted">{c.sub}</p>
        </div>
        <ul className="m-0 flex min-w-0 flex-[1_1_380px] list-none flex-col gap-3 p-0">
          {c.entries.map((e) => {
            const link = getContactLink(e.id);
            return (
              <li key={e.id}>
                <a
                  href={link.href}
                  {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-line2 bg-surface2 px-[22px] py-5"
                >
                  <span className="flex items-center gap-3.5">
                    <ContactGlyph id={e.id} />
                    <span className="font-bold">{e.label}</span>
                  </span>
                  <span dir="ltr" className="min-w-0 truncate font-mono text-sm text-muted">
                    {link.display}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
