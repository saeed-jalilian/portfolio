// Saeed Jalilian logo mark ("sj/" terminal tile), from design/brand/.
// Pure SVG, so it has no font dependency.

export const BRAND = {
  accent: "#B4492A",
  paper: "#F4EFE6",
  ink: "#1C1A17",
  accentOnInk: "#E0714D",
} as const;

/** Glyph strokes in the 512x512 tile: "s", "j" and "/". */
export const GLYPH = {
  s: "M182 224 C174 213 163 208 150 208 C132 208 119 219 119 235 C119 252 134 256 150 260 C166 264 181 269 181 286 C181 302 168 312 150 312 C135 312 123 306 116 295",
  j: "M226 210 L258 210 L258 333 C258 354 246 366 226 366 L208 366",
  slash: "M308 350 L386 150",
} as const;

type Tone = "default" | "inverse";

/**
 * default: terracotta tile, paper glyph. inverse: ink tile, light terracotta glyph.
 * Pass `title=""` when a visible name sits next to the mark.
 */
export function LogoMark({
  size = 40,
  tone = "default",
  title = "Saeed Jalilian",
}: {
  size?: number;
  tone?: Tone;
  title?: string;
}) {
  // Small sizes get a heavier stroke so the glyph stays legible.
  const small = size <= 24;
  const sw = small ? 50 : 38;
  const scale = small ? 1.12 : 1;
  const tile = tone === "inverse" ? BRAND.ink : BRAND.accent;
  const fg = tone === "inverse" ? BRAND.accentOnInk : BRAND.paper;

  return (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className="shrink-0"
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
    >
      <rect width="512" height="512" rx="122" fill={tile} />
      <g transform={`translate(256 256) scale(${scale}) translate(-256 -256) translate(6 -4)`}>
        <g fill="none" stroke={fg} strokeWidth={sw} strokeLinejoin="round">
          <path d={GLYPH.s} />
          <path d={GLYPH.j} />
          <path d={GLYPH.slash} />
        </g>
        <circle cx={258} cy={158} r={(23 * sw) / 38} fill={fg} />
      </g>
    </svg>
  );
}
