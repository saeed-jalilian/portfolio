import { site } from "@/content/site";
import type { Content } from "@/content/types";
import { ArrowIcon } from "./Icons";
import { WindowDots } from "./WindowDots";

const str = "text-accent";

function CodeCard() {
  return (
    <div
      dir="ltr"
      lang="en"
      className="max-w-[520px] min-w-0 flex-[1_1_400px] overflow-hidden rounded-[20px] border border-code-border bg-code-bg shadow-code"
    >
      <div className="flex items-center gap-2 border-b border-code-line px-[18px] py-3.5">
        <WindowDots className="size-[11px] bg-code-dot" />
        <span className="ms-3 font-mono text-[13px] text-code-muted">developer.ts</span>
      </div>
      <pre className="m-0 overflow-x-auto px-6 pt-[26px] pb-[30px] font-mono text-[14.5px] leading-[1.95] whitespace-pre-wrap text-code-text">
        <span className="text-code-keyword">const</span> saeed = {"{\n  "}name:{" "}
        <span className={str}>&quot;{site.name}&quot;</span>
        {",\n  "}role: <span className={str}>&quot;Full-Stack Developer&quot;</span>
        {",\n  "}stack: [<span className={str}>&quot;Next.js&quot;</span>,{" "}
        <span className={str}>&quot;Nest.js&quot;</span>
        {"],\n  "}shippedWith: [<span className={str}>&quot;Django&quot;</span>,{" "}
        <span className={str}>&quot;FastAPI&quot;</span>
        {"],\n  "}designsToo: <span className="text-warn">true</span>
        {",\n  "}available: <span className="text-warn">true</span>
        {",\n};\n\n"}
        <span className="text-code-muted">{"// let's build something great →"}</span>
        {"\n"}saeed.<span className="text-code-fn">contact</span>();
      </pre>
    </div>
  );
}

export function Hero({ c }: { c: Content }) {
  return (
    <section
      id="top"
      className="page-container flex flex-wrap items-center gap-16 pt-16 pb-14 md:pt-24 md:pb-[72px]"
    >
      <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
        <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-line2 px-4 py-2 text-sm text-muted">
          <span className="size-2 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-ring)]" />
          {c.status}
        </div>
        <h1 className="m-0 text-[clamp(2.5rem,5.2vw,4.6rem)] leading-[1.08] font-black tracking-[-2px] rtl:leading-[1.3] rtl:tracking-normal">
          {c.hero.before}
          <span className="text-accent-text">{c.hero.highlight}</span>
          {c.hero.after}
        </h1>
        <p className="m-0 max-w-[600px] text-[1.2rem] leading-[1.9] text-muted">{c.hero.sub}</p>
        <div className="flex flex-wrap gap-3.5 pt-2">
          <a
            href="#work"
            className="inline-flex h-[54px] items-center gap-2.5 rounded-[14px] bg-accent px-7 text-base font-extrabold text-ink"
          >
            {c.hero.ctaWork}
            <ArrowIcon />
          </a>
          <a
            href="#contact"
            className="inline-flex h-[54px] items-center rounded-[14px] border border-line2 px-7 text-base font-bold text-text"
          >
            {c.hero.ctaContact}
          </a>
        </div>
      </div>
      <CodeCard />
    </section>
  );
}
