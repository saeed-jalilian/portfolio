# Saeed Jalilian — Brand kit (logo A1)

## Folders

| Folder | What | Use it for |
|---|---|---|
| `svg/` | Vector logos (no font dependency) | Anywhere — site, print, Figma |
| `png/` | Raster logos 128–1024 px | Docs, invoices, quick uploads |
| `png/avatar-square-1024.png` | Square, no rounded corners | Telegram / GitHub / LinkedIn profile picture |
| `icons/` | favicon.ico, icon.svg, apple-icon, PWA icons | Browser tab, home screen |
| `nextjs/` | Drop-in files for your Next.js (App Router) project | See below |

### SVG variants
- `logo-mark.svg` — **primary**: terracotta tile, paper glyph
- `logo-mark-inverse.svg` — ink tile, light terracotta glyph (on light/busy backgrounds)
- `logo-mark-black.svg` / `logo-mark-white.svg` — one-color (stamps, print, watermarks)
- `logo-glyph.svg` — "sj/" alone, `currentColor` (inherits text color)
- `logo-mark-small.svg` — heavier glyph for ≤24 px

## Next.js setup
1. Copy `nextjs/app/*` → your `app/` folder (`favicon.ico`, `icon.svg`, `apple-icon.png`, `manifest.ts`, `opengraph-image.tsx`). Next.js wires them up automatically — no `<link>` tags needed.
2. Copy `nextjs/public/*` → `public/` (PWA icons used by the manifest).
3. Copy `nextjs/components/Logo.tsx` → `components/`.

```tsx
import { Logo, LogoMark } from "@/components/Logo";

<Logo lang="fa" size={40} />                       // header, Persian
<Logo lang="en" size={40} tagline="full-stack developer" />
<LogoMark size={20} />                              // footer / small badge
<LogoMark tone="inverse" />                         // on light surfaces
<span style={{ color: "#fff" }}><LogoMark tone="mono" /></span>  // one color
```

Footer link for client sites:
```tsx
<a href="https://saeed-jalilian.ir" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
  <LogoMark size={18} /> طراحی و توسعه: سعید جلیلیان
</a>
```

## Rules
- **Colors:** Terracotta `#B4492A` (`#E0714D` on dark) · Ink `#1C1A17` · Paper `#F4EFE6`.
- **Clear space:** at least ¼ of the tile width on every side.
- **Minimum size:** 16 px (use the small variant / favicon below 24 px).
- **Don't:** stretch, rotate, recolor the glyph outside the variants, add shadows or gradients.
- **Fonts for the wordmark:** Instrument Sans 600 (EN), Vazirmatn 700 (FA) via `next/font/google`.
