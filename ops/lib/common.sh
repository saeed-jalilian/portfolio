#!/usr/bin/env bash
# Shared helpers for the ops scripts. Sourced, never executed.
# shellcheck shell=bash disable=SC2034,SC2154

if [ -t 1 ]; then
  C_RED=$'\033[0;31m'; C_GREEN=$'\033[0;32m'; C_YELLOW=$'\033[1;33m'
  C_BLUE=$'\033[0;34m'; C_CYAN=$'\033[0;36m'; C_OFF=$'\033[0m'
else
  C_RED=''; C_GREEN=''; C_YELLOW=''; C_BLUE=''; C_CYAN=''; C_OFF=''
fi

step() { printf '%s➜%s %s\n' "$C_BLUE" "$C_OFF" "$1"; }
ok()   { printf '  %s✓%s %s\n' "$C_GREEN" "$C_OFF" "$1"; }
info() { printf '  %sℹ%s %s\n' "$C_CYAN" "$C_OFF" "$1"; }
warn() { printf '  %s⚠%s %s\n' "$C_YELLOW" "$C_OFF" "$1" >&2; }
bad()  { printf '  %s✗%s %s\n' "$C_RED" "$C_OFF" "$1" >&2; }
die()  { bad "$1"; exit 1; }

DEPLOY_ENV="${DEPLOY_ENV:-/etc/portfolio/deploy.env}"

# load_ops_env — export every KEY=value of deploy.env that is not already set in the
# environment (so `KEEP_RELEASES=3 ops/deploy.sh` wins), then apply defaults. The file is
# parsed, never sourced.
load_ops_env() {
  local line key value
  if [ -r "$DEPLOY_ENV" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
      case "$line" in ''|'#'*) continue ;; esac
      key="${line%%=*}"; value="${line#*=}"
      [[ "$key" =~ ^[A-Z][A-Z0-9_]*$ ]] || continue
      value="${value%\"}"; value="${value#\"}"; value="${value%\'}"; value="${value#\'}"
      [ -n "${!key:-}" ] || export "$key=$value"
    done < "$DEPLOY_ENV"
  fi
  : "${BASE:=/srv/portfolio}"
  : "${APP_USER:=portfolio}"
  : "${SITE_HOST:=saeed-jalilian.ir}"
  : "${WWW_REDIRECT:=true}"
  : "${REPO_URL:=https://github.com/saeed-jalilian/portfolio.git}"
  : "${DEFAULT_REF:=main}"
  : "${KEEP_RELEASES:=5}"
  : "${BUILD_HEAP_MB:=1024}"
  : "${FRONT_ROUTER:=haproxy}"
  RELEASES_DIR="$BASE/releases"
  CURRENT="$BASE/current"
  LOG_DIR="$BASE/logs"
  OPS_DIR=/opt/portfolio-ops
}

require_app_user() { [ "$(id -u)" -ne 0 ] || die "Run this as $APP_USER, not root."; }
require_root() { [ "$(id -u)" -eq 0 ] || die "Run this as root (sudo)."; }

require_cmd() {
  local c
  for c in "$@"; do command -v "$c" >/dev/null 2>&1 || die "Missing command: $c"; done
}

# with_lock — one deploy or rollback at a time.
with_lock() {
  exec 9>>"$BASE/.ops.lock"
  flock -n 9 || die "Another deploy or rollback is running."
}

# Fetch every branch and tag, retrying a flaky link (a server in Iran reaches GitHub over an
# unreliable route, so each try is time-boxed). Fails after the last try.
fetch_repo() {
  local gitdir="$1" attempt
  for attempt in 1 2 3 4; do
    if timeout 120 git --git-dir="$gitdir" fetch --prune --force origin \
         '+refs/heads/*:refs/heads/*' '+refs/tags/*:refs/tags/*' >/dev/null; then
      return 0
    fi
    [ "$attempt" -lt 4 ] || break
    warn "Fetching from GitHub failed (try $attempt of 4); retrying in $((attempt * 10))s"
    sleep $((attempt * 10))
  done
  return 1
}

list_releases() { # oldest first
  [ -d "$RELEASES_DIR" ] || return 0
  find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort
}

current_release() { [ -e "$CURRENT" ] && basename "$(readlink -f "$CURRENT")" || true; }

# switch_release NAME — repoint `current` atomically. Caddy follows the link on every
# request, so there is no reload and no moment without a site.
switch_release() {
  ln -sfn "$RELEASES_DIR/$1" "$BASE/current.new"
  mv -T "$BASE/current.new" "$CURRENT"
}

# release_complete DIR — the pages every release must contain.
release_complete() {
  local f
  for f in index.html en/index.html 404.html robots.txt sitemap.xml manifest.webmanifest; do
    [ -s "$1/out/$f" ] || { bad "$1/out/$f is missing or empty"; return 1; }
  done
}

# site_status URL — HTTP status of a URL on this very server (000 = no connection / TLS).
# --resolve skips DNS, so it works before the domain points here; HAProxy and Caddy still run.
site_status() {
  local url="$1" host port
  host="${url#*://}"; host="${host%%/*}"
  case "$url" in https://*) port=443 ;; *) port=80 ;; esac
  curl -sk -o /dev/null -w '%{http_code}' --max-time 10 --resolve "$host:$port:127.0.0.1" "$url" || true
}
