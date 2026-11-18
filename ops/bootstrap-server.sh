#!/usr/bin/env bash
# One-time server setup, safe to run again (it also refreshes the scripts and the Caddy site).
#
#   sudo ops/bootstrap-server.sh             full setup
#   sudo ops/bootstrap-server.sh --ops-only  only refresh /opt/portfolio-ops and the Caddy site
#
# This server also runs mia-candle, which owns Caddy and HAProxy. The bootstrap never touches
# its files: it adds a drop-in site to /etc/caddy/sites.d/ and hostnames to HAProxy's
# extra-*.lst files. Both hooks come from mia-candle's ops (run its `remote.sh update-ops`
# once if the check below says they are missing).
set -Eeuo pipefail
umask 022
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
. "$HERE/lib/common.sh"
# shellcheck disable=SC2154
trap 'status=$?; bad "bootstrap-server.sh failed at line $LINENO (exit $status)"; exit $status' ERR
require_root

OPS_ONLY=false
[ "${1:-}" != "--ops-only" ] || OPS_ONLY=true

if [ ! -f "$DEPLOY_ENV" ]; then
  install -d -m 755 "$(dirname "$DEPLOY_ENV")"
  install -m 640 "$HERE/deploy.env.example" "$DEPLOY_ENV"
  info "Created $DEPLOY_ENV with the defaults (edit it to change the domain, then run this again)."
fi
load_ops_env
case "$FRONT_ROUTER" in none|haproxy) ;; *) die "FRONT_ROUTER must be none or haproxy (got '$FRONT_ROUTER')" ;; esac
[[ "$SITE_HOST" =~ ^[a-z0-9.-]+$ ]] || die "SITE_HOST '$SITE_HOST' must be lowercase letters, digits, dots and dashes"

step "Preflight"
require_cmd caddy git curl flock
node -v | grep -qE '^v(2[0-9]|[3-9][0-9])\.' || die "Node 20 or newer is required (found $(node -v 2>&1))"
command -v pnpm >/dev/null || die "pnpm is missing (mia-candle's bootstrap installs it, or: npm install -g pnpm)"
grep -q 'sites.d' /etc/caddy/Caddyfile \
  || die "/etc/caddy/Caddyfile does not import /etc/caddy/sites.d/*.caddy yet. Update mia-candle's server scripts first (its ops/remote.sh update-ops)."
if [ "$FRONT_ROUTER" = haproxy ]; then
  grep -q 'extra-sni.lst' /etc/haproxy/haproxy.cfg 2>/dev/null \
    || die "/etc/haproxy/haproxy.cfg has no extra-sni.lst hook yet. Update mia-candle's server scripts first (its ops/remote.sh update-ops)."
fi
ok "node $(node -v), pnpm $(pnpm -v), caddy and the drop-in hooks are there"

step "Installing the ops scripts to $OPS_DIR (root-owned)"
if [ "$HERE" -ef "$OPS_DIR" ]; then
  ok "already running from $OPS_DIR"
else
  # Copy aside and swap, so a failed copy never leaves the folder empty.
  new_ops="$(mktemp -d /opt/.portfolio-ops.XXXXXXXX)"
  cp -a "$HERE/." "$new_ops/"
  chown -R root:root "$new_ops"; chmod -R go-w "$new_ops"; chmod 755 "$new_ops"
  rm -rf "$OPS_DIR.old"; [ ! -e "$OPS_DIR" ] || mv "$OPS_DIR" "$OPS_DIR.old"
  mv "$new_ops" "$OPS_DIR"; rm -rf "$OPS_DIR.old"
  ok "installed"
fi

if [ "$OPS_ONLY" = false ]; then
  step "App user and folders"
  id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --home-dir "$BASE" --shell /bin/bash "$APP_USER"
  # Root must never follow a link the app user planted: refuse links, and only create
  # (never chown) a folder that is missing.
  for d in "$BASE" "$RELEASES_DIR" "$LOG_DIR"; do
    [ ! -L "$d" ] || die "$d is a symlink; remove it and run this again"
    [ -d "$d" ] || install -d -o "$APP_USER" -g "$APP_USER" -m 755 "$d"
  done
  chgrp "$APP_USER" "$DEPLOY_ENV"; chmod 640 "$DEPLOY_ENV"
  if [ ! -d "$BASE/repo.git" ]; then
    sudo -u "$APP_USER" git init -q --bare "$BASE/repo.git"
    sudo -u "$APP_USER" git --git-dir="$BASE/repo.git" remote add origin "$REPO_URL"
  fi
  ok "$BASE ready (repository mirror: $REPO_URL)"
fi

step "Caddy site for $SITE_HOST"
site_tmp="$(mktemp)"
render() { sed -e "s#__SITE_HOST__#$SITE_HOST#g" -e "s#__BASE__#$BASE#g" "$1"; }
render "$HERE/templates/portfolio.caddy" > "$site_tmp"
if [ "$WWW_REDIRECT" = true ]; then printf '\n' >> "$site_tmp"; render "$HERE/templates/portfolio-www.caddy" >> "$site_tmp"; fi
# Validate the whole server config with the new site before it goes live.
check_tmp="$(mktemp)"
cat /etc/caddy/Caddyfile > "$check_tmp"; printf '\n' >> "$check_tmp"; cat "$site_tmp" >> "$check_tmp"
# The live Caddyfile may already import sites.d (and so the old portfolio site): drop that line for the check.
sed -i '\#^import /etc/caddy/sites.d/#d' "$check_tmp"
out="$(caddy validate --config "$check_tmp" --adapter caddyfile 2>&1)" \
  || { printf '%s\n' "$out" | tail -5 >&2; rm -f "$site_tmp" "$check_tmp"; die "the Caddy site is invalid; nothing was changed"; }
rm -f "$check_tmp"
install -d -m 755 /etc/caddy/sites.d
previous=""
if [ -f /etc/caddy/sites.d/portfolio.caddy ]; then previous="$(mktemp)"; cp /etc/caddy/sites.d/portfolio.caddy "$previous"; fi
install -m 644 "$site_tmp" /etc/caddy/sites.d/portfolio.caddy; rm -f "$site_tmp"
if systemctl reload caddy; then
  ok "Caddy reloaded"
else
  # Put the old site back so mia-candle keeps working.
  if [ -n "$previous" ] && [ -s "$previous" ]; then install -m 644 "$previous" /etc/caddy/sites.d/portfolio.caddy; else rm -f /etc/caddy/sites.d/portfolio.caddy; fi
  systemctl reload caddy || true
  die "Caddy did not reload with the portfolio site; reverted it"
fi
[ -z "$previous" ] || rm -f "$previous"

if [ "$FRONT_ROUTER" = haproxy ]; then
  step "HAProxy hostname lists"
  hosts="$SITE_HOST"; [ "$WWW_REDIRECT" != true ] || hosts="$SITE_HOST www.$SITE_HOST"
  changed=false
  for h in $hosts; do
    grep -qxF "$h" /etc/haproxy/extra-sni.lst || { echo "$h" >> /etc/haproxy/extra-sni.lst; changed=true; }
    grep -qxF "host: $h" /etc/haproxy/extra-http.lst || { echo "host: $h" >> /etc/haproxy/extra-http.lst; changed=true; }
  done
  haproxy -c -f /etc/haproxy/haproxy.cfg >/dev/null || die "HAProxy rejected its config after adding $hosts; fix /etc/haproxy/extra-*.lst"
  if [ "$changed" = true ]; then systemctl reload haproxy; ok "added $hosts and reloaded HAProxy"; else ok "$hosts already listed"; fi
fi

echo
ok "Server is ready. Point the DNS A record of $SITE_HOST${WWW_REDIRECT:+ (and www)} at this server, then deploy: sudo -u $APP_USER $OPS_DIR/deploy.sh"
