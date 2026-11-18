#!/usr/bin/env bash
# Build the static site and upload it to the server.
# Usage: DEPLOY_HOST=user@server pnpm deploy:server
set -euo pipefail

: "${DEPLOY_HOST:?Set DEPLOY_HOST, for example DEPLOY_HOST=user@your-server}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/saeed-jalilian.ir}"

pnpm build
rsync -az --delete out/ "$DEPLOY_HOST:$DEPLOY_PATH/"
echo "Deployed to $DEPLOY_HOST:$DEPLOY_PATH"
