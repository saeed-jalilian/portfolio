#!/usr/bin/env bash
# Read-only health report. Changes nothing. Exit code 1 when something FAILs.
#
#   sudo ops/doctor.sh
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
. "$HERE/lib/common.sh"
require_root
load_ops_env

PASS=0; WARN=0; FAIL=0
pass() { PASS=$((PASS + 1)); ok "$1"; }
wrn()  { WARN=$((WARN + 1)); warn "$1"; }
fl()   { FAIL=$((FAIL + 1)); bad "$1"; }

step "Services"
for u in caddy $([ "$FRONT_ROUTER" != haproxy ] || echo haproxy); do
  if systemctl is-active --quiet "$u"; then pass "$u is active"; else fl "$u is not active"; fi
done
if caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then pass "Caddy config is valid"; else fl "Caddy config is invalid"; fi
[ -f /etc/caddy/sites.d/portfolio.caddy ] && pass "Caddy site installed (/etc/caddy/sites.d/portfolio.caddy)" || fl "Caddy site missing; run bootstrap-server.sh"
if [ "$FRONT_ROUTER" = haproxy ]; then
  grep -qxF "$SITE_HOST" /etc/haproxy/extra-sni.lst 2>/dev/null && grep -qxF "host: $SITE_HOST" /etc/haproxy/extra-http.lst 2>/dev/null \
    && pass "HAProxy routes $SITE_HOST to Caddy" || fl "HAProxy does not list $SITE_HOST; run bootstrap-server.sh"
fi

step "Release"
NOW="$(current_release)"
if [ -z "$NOW" ]; then
  fl "no release is live yet; deploy: sudo -u $APP_USER $OPS_DIR/deploy.sh"
else
  pass "live release: $NOW"
  release_complete "$RELEASES_DIR/$NOW" && pass "release has all required pages" || fl "release $NOW is incomplete"
  # Caddy runs as its own user and must be able to read the files.
  sudo -u caddy test -r "$CURRENT/out/index.html" 2>/dev/null && pass "Caddy can read the files" || fl "the caddy user cannot read $CURRENT/out"
  [ "$(list_releases | wc -l)" -ge 2 ] && pass "an earlier release is kept for rollback" || wrn "no earlier release to roll back to yet"
fi

step "Public checks (served from this server, DNS not involved)"
code="$(site_status "https://$SITE_HOST/")"
if [ "$code" = 200 ]; then pass "https://$SITE_HOST/ answers 200"; else fl "https://$SITE_HOST/ answered $code (000 = no connection or certificate)"; fi
code="$(site_status "https://$SITE_HOST/en/")"; [ "$code" = 200 ] && pass "/en/ answers 200" || fl "/en/ answered $code"
code="$(site_status "https://$SITE_HOST/does-not-exist/")"; [ "$code" = 404 ] && pass "unknown path answers 404" || wrn "unknown path answered $code (expected 404)"
code="$(site_status "http://$SITE_HOST/")"; [ "$code" = 301 ] && pass "http redirects to https (301)" || fl "http answered $code (expected 301); port-80 routing is broken and certificate renewal depends on it"
curl -sk -D - -o /dev/null --max-time 10 --resolve "$SITE_HOST:443:127.0.0.1" "https://$SITE_HOST/" | grep -qi '^strict-transport-security' \
  && pass "HSTS header is set" || wrn "no HSTS header"

step "Server"
used="$(df --output=pcent / | tail -n 1 | tr -dc '0-9')"
if [ "$used" -ge 90 ]; then fl "disk is ${used}% full"; elif [ "$used" -ge 80 ]; then wrn "disk is ${used}% full"; else pass "disk ${used}% used"; fi
if command -v dig >/dev/null; then
  mine="$(curl -fsS --max-time 5 https://api.ipify.org 2>/dev/null || true)"
  dns="$(dig +short "$SITE_HOST" @1.1.1.1 2>/dev/null | head -n 1)"
  if [ -z "$dns" ]; then wrn "$SITE_HOST has no DNS A record yet"
  elif [ -n "$mine" ] && [ "$dns" != "$mine" ]; then wrn "$SITE_HOST resolves to $dns, this server is $mine (fine behind a CDN)"
  else pass "DNS: $SITE_HOST -> $dns"; fi
fi

echo
echo "$PASS passed, $WARN warnings, $FAIL failed"
[ "$FAIL" -eq 0 ]
