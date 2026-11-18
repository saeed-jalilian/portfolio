import { site } from "@/content/site";

export function Footer({ text }: { text: string }) {
  return (
    <footer className="border-t border-line">
      <div className="page-container flex flex-wrap items-center justify-between gap-3 py-7 text-sm text-dim">
        <span>{text}</span>
        <span dir="ltr" className="font-mono">
          {site.domain}
        </span>
      </div>
    </footer>
  );
}
