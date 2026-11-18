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
- `design/brand/`: the brand kit (SVG/PNG logos and usage rules). The site uses `components/Logo.tsx`, the icons in `app/` and `public/`, and `app/opengraph-image.tsx` for link previews.

## Deploy (shared Ubuntu server, Caddy)

The site is plain static files, built on the server from GitHub and served by Caddy on `saeed-jalilian.ir`. It shares the server with mia-candle, which owns Caddy and HAProxy on ports 80/443; the portfolio only adds a drop-in site and its hostnames, and never edits mia-candle's files. The scripts live in `ops/` and follow mia-candle's layout (see its `ops/README.md`):

```
ops/
  bootstrap-server.sh   one-time install, safe to repeat; --ops-only refreshes scripts and the Caddy site
  deploy.sh [ref]       build a new release beside the live one, check it, switch the link
  rollback.sh [name]    point `current` back at an earlier release
  doctor.sh             read-only health report (exit 1 on any failure)
  remote.sh             run the above from your laptop over SSH (no arguments = menu)
  deploy.env.example    -> /etc/portfolio/deploy.env (domain, repo, build; all optional)
  templates/            the Caddy site
```

Server layout: `/opt/portfolio-ops` (root-owned scripts), `/etc/portfolio/deploy.env`, `/srv/portfolio/{repo.git,releases/<time>-<sha>,current,logs}` (user `portfolio`), `/etc/caddy/sites.d/portfolio.caddy`, and the hostnames in `/etc/haproxy/extra-{sni,http}.lst`. Only `out/` is kept per release (last 5).

### First install

1. mia-candle's scripts must have the two hooks (`/etc/caddy/sites.d/*.caddy` import and the HAProxy `extra-*.lst` lists). From the mia-candle checkout run `ops/remote.sh update-ops` once; the bootstrap here refuses to continue without them.
2. DNS: `A` records for `saeed-jalilian.ir` and `www` to the server (DNS only, so Caddy can get certificates).
3. Copy the scripts and bootstrap: `SERVER=<ssh alias> ops/remote.sh update-ops` (runs `bootstrap-server.sh` as root).
4. `SERVER=<ssh alias> ops/remote.sh deploy`, then `ops/remote.sh doctor`.

### Every deploy

```bash
git push origin main
ops/remote.sh deploy          # or: ops/remote.sh deploy v1.2   (branch, tag or commit)
```

`SERVER` is an ssh alias or `user@host`; it is remembered in `~/.config/portfolio-ops/server`. `deploy` refuses when local `main` differs from `origin/main`, because the server builds from GitHub. The live site keeps serving during the build and switches with one atomic link swap; if the new release does not answer 200 it goes back by itself. `ops/remote.sh rollback` undoes a deploy, `ops/remote.sh logs` shows the last log.

### Changing the domain

Edit `SITE_HOST` in `/etc/portfolio/deploy.env`, run `ops/remote.sh update-ops`, and remove the old name from `/etc/haproxy/extra-*.lst` by hand.

If mia-candle's `update-ops` is ever run from an old checkout without the hooks, the portfolio site goes offline until its bootstrap is run again; keep both repos' `ops/` current.
