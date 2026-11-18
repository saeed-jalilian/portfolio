// Link-preview image (Telegram, WhatsApp, LinkedIn…) generated at build time.
import { ImageResponse } from "next/og";
import { BRAND, GLYPH } from "@/components/Logo";

export const dynamic = "force-static";

export const alt = "Saeed Jalilian — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BRAND.ink,
          color: BRAND.paper,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          gap: 40,
        }}
      >
        <svg width="140" height="140" viewBox="0 0 512 512">
          <rect width="512" height="512" rx="122" fill={BRAND.accent} />
          <g transform="translate(6 -4)" fill="none" stroke={BRAND.paper} strokeWidth="38" strokeLinejoin="round">
            <path d={GLYPH.s} />
            <path d={GLYPH.j} />
            <path d={GLYPH.slash} />
          </g>
          <circle cx="264" cy="154" r="23" fill={BRAND.paper} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2 }}>Saeed Jalilian</div>
          <div style={{ fontSize: 36, color: "#B3AA9B" }}>
            Full-stack developer · Next.js & Nest.js
          </div>
        </div>
        <div style={{ fontSize: 28, color: BRAND.accentOnInk }}>saeed-jalilian.ir</div>
      </div>
    ),
    size
  );
}
