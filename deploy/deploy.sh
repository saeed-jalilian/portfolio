#!/usr/bin/env bash
# Build the static site from a clean main branch and upload it to the server.
# Usage: DEPLOY_HOST=user@server pnpm deploy:server
set -euo pipefail

: "${DEPLOY_HOST:?Set DEPLOY_HOST, for example DEPLOY_HOST=user@your-server}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/saeed-jalilian.ir}"

# rsync --delete removes anything else in the target, so only allow a
# dedicated folder under /var/www.
if [[ ! "$DEPLOY_PATH" =~ ^/var/www/[^/]+/?$ ]]; then
  echo "Refusing to deploy to '$DEPLOY_PATH': expected /var/www/<site>" >&2
  exit 1
fi

# Production gets only committed code from main.
if [[ "$(git branch --show-current)" != "main" ]]; then
  echo "Refusing to deploy: switch to the main branch first." >&2
  exit 1
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Refusing to deploy: commit or stash your changes first." >&2
  exit 1
fi

pnpm build
# Upload everything first, then swap files in and delete old ones at the end,
# so visitors never get a page whose build files are missing.
rsync -az --delete-after --delay-updates out/ "$DEPLOY_HOST:${DEPLOY_PATH%/}/"
echo "Deployed to $DEPLOY_HOST:$DEPLOY_PATH"
