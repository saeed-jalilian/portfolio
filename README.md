# Saeed Jalilian — portfolio

Bilingual (Persian at `/`, English at `/en`) personal portfolio landing page built with Next.js (App Router, static export) and Tailwind CSS v4.

## Development

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # static site written to out/
```

## Editing content

- `content/fa.ts` and `content/en.ts`: all copy, services, process steps and projects (same shape, typed in `content/types.ts`).
- `content/site.ts`: shared facts (name, domain, GitHub, email, phone, Telegram, WhatsApp). Values in `[brackets]` are placeholders; replace them and the contact links update automatically.
- `app/globals.css`: theme colors (dark and light palettes as CSS variables).

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `out/` to GitHub Pages. Set Pages source to "GitHub Actions" in the repository settings. With an Actions-based deploy GitHub ignores `public/CNAME` (kept only for reference), so set the custom domain `saeed-jalilian.ir` under Settings → Pages → Custom domain and tick "Enforce HTTPS". Until then the site is served from `/portfolio/` and its asset paths break.
