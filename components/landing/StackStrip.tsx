import { site } from "@/content/site";

export function StackStrip({ label }: { label: string }) {
  return (
    <section className="border-y border-line">
      <div className="page-container flex flex-wrap items-center justify-between gap-6 py-8">
        <span className="text-[15px] text-dim">{label}</span>
        <ul className="m-0 flex list-none flex-wrap gap-3 p-0 font-mono text-[15px]">
          {site.stack.map((s) => (
            <li
              key={s.name}
              dir="ltr"
              lang="en"
              className={`rounded-[10px] border bg-surface px-[18px] py-2.5 ${
                s.primary ? "border-accent text-text" : "border-line2 text-muted"
              }`}
            >
              {s.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
