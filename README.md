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

## Deploy (Ubuntu server + nginx)

The site is plain static files in `out/`, served by nginx on `saeed-jalilian.ir`. No Node.js is needed on the server.

One-time server setup (run on the server):

```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx rsync
sudo mkdir -p /var/www/saeed-jalilian.ir
sudo chown "$USER": /var/www/saeed-jalilian.ir
```

Copy `deploy/nginx.conf` to `/etc/nginx/sites-available/saeed-jalilian.ir`, then:

```bash
sudo ln -s /etc/nginx/sites-available/saeed-jalilian.ir /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Point the domain's DNS `A` records (`@` and `www`) at the server's IP. Once DNS resolves, add HTTPS:

```bash
sudo certbot --nginx -d saeed-jalilian.ir -d www.saeed-jalilian.ir
```

Each deploy (run locally; needs SSH access to the server and rsync installed locally):

```bash
DEPLOY_HOST=user@your-server pnpm deploy:server
```

This builds the site and syncs `out/` to `/var/www/saeed-jalilian.ir` (override with `DEPLOY_PATH`).
