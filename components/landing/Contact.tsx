import type { Content } from "@/content/types";
import { getContactLink } from "@/lib/contact";
import { ContactGlyph } from "./Icons";

export function Contact({ c }: { c: Content["contact"] }) {
  const entries = c.entries.flatMap((e) => {
    const link = getContactLink(e.id);
    return link ? [{ ...e, link }] : [];
  });

  return (
    <section id="contact" className="page-container pt-24 pb-24 md:pt-32 md:pb-32">
      <div className="reveal grid grid-cols-1 gap-12 border-t border-line2 pt-12 md:grid-cols-[3fr_2fr] md:gap-16">
        <div className="flex flex-col gap-6">
          <h2 className="font-display m-0 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.1] font-bold rtl:font-medium rtl:leading-[1.35]">
            {c.before}
            <br />
            {c.highlight}
          </h2>
          <p className="m-0 max-w-[480px] text-lg leading-[1.85] text-muted">{c.sub}</p>
        </div>
        <ul className="m-0 flex list-none flex-col self-end p-0">
          {entries.map(({ id, label, link }) => (
            <li key={id} className="border-b border-line first:border-t">
              <a
                href={link.href}
                {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                className="flex min-h-14 items-center justify-between gap-4 py-3 transition-colors hover:text-accent-text"
              >
                <span className="flex items-center gap-3">
                  <ContactGlyph id={id} />
                  <span className="font-medium">{label}</span>
                </span>
                <span dir="ltr" className="min-w-0 truncate font-mono text-sm text-muted">
                  {link.display}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
