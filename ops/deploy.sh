#!/usr/bin/env bash
# Build a new release next to the live one, check it, switch, and undo on failure.
#
#   ops/deploy.sh [ref]      ref = branch, tag or commit (default: DEFAULT_REF, "main")
#   FORCE=true ops/deploy.sh rebuild the commit that is already live
#
# Run as the app user (not root) from /opt/portfolio-ops. The live release keeps serving
# during the whole build, so a failed install or build changes nothing. The switch is one
# atomic symlink swap; Caddy follows it on every request, so there is no gap.
set -Eeuo pipefail
umask 022
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
. "$HERE/lib/common.sh"
load_ops_env
require_app_user
require_cmd git pnpm node curl flock timeout tar
[ -d "$BASE/repo.git" ] || die "$BASE/repo.git is missing; run bootstrap-server.sh first."
with_lock

REF="${1:-$DEFAULT_REF}"
mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOG") 2>&1

PHASE="starting"
PREVIOUS="$(current_release)"
NEW=""
SWITCHED=false
CHECKED=false
on_exit() {
  local status=$?
  [ "$status" -eq 0 ] && return 0
  if [ "$SWITCHED" = true ] && [ "$CHECKED" = true ]; then   # live and healthy: only the tidy-up failed, never undo that
    warn "Deployed, but the clean-up step failed ($PHASE, exit $status). Log: $LOG"
    exit 0
  fi
  bad "Deploy failed during: $PHASE (exit $status). Log: $LOG"
  # A release that is already linked as `current` is never deleted.
  [ "$SWITCHED" = true ] || [ -z "$NEW" ] || rm -rf -- "${RELEASES_DIR:?}/$NEW"
}
trap on_exit EXIT

PHASE="fetching $REF"
step "Fetching $REF"
fetch_repo "$BASE/repo.git" || die "Could not fetch from GitHub after 4 tries. Nothing was changed; run the deploy again in a few minutes."
SHA="$(git --git-dir="$BASE/repo.git" rev-parse --verify "$REF^{commit}")"
NEW="$(date +%Y%m%d-%H%M%S)-${SHA:0:7}"
if [ -n "$PREVIOUS" ] && [ "${PREVIOUS##*-}" = "${SHA:0:7}" ] && [ "${FORCE:-false}" != true ]; then
  ok "$REF (${SHA:0:7}) is already live. FORCE=true to rebuild it."
  exit 0
fi
mkdir -p "$RELEASES_DIR/$NEW"
git --git-dir="$BASE/repo.git" archive "$SHA" | tar -x -C "$RELEASES_DIR/$NEW"
cd "$RELEASES_DIR/$NEW"
ok "release $NEW"

PHASE="installing dependencies"
step "$PHASE"
export CI=true NODE_OPTIONS="--max-old-space-size=$BUILD_HEAP_MB" NEXT_TELEMETRY_DISABLED=1
# Use the server's pnpm as it is: this server's pnpm belongs to mia-candle, and a version
# switch would download another one.
export npm_config_manage_package_manager_versions=false
[ -z "${NPM_REGISTRY:-}" ] || export npm_config_registry="$NPM_REGISTRY"
nice -n 10 pnpm install --frozen-lockfile

PHASE="building"
step "$PHASE"
nice -n 10 pnpm build
release_complete "$PWD" || die "The build did not produce a complete site"
# Caddy follows links, so a link inside out/ could publish files outside it.
[ -z "$(find out -type l -print -quit)" ] || die "The build contains symlinks in out/; refusing to publish it"
# Only the static files are needed from here on.
rm -rf node_modules .next
chmod -R a+rX out

PHASE="switching"
step "Switching to $NEW"
switch_release "$NEW"
SWITCHED=true
ok "current -> $NEW"

PHASE="checking"
step "Checking the live site"
code="$(site_status "https://$SITE_HOST/")"
case "$code" in
  200) CHECKED=true; ok "https://$SITE_HOST/ answers 200" ;;
  000) CHECKED=true; warn "No HTTPS answer from this server yet (DNS or the certificate is not ready). The release is live on disk; run doctor.sh once DNS points here." ;;
  *)
    bad "https://$SITE_HOST/ answered $code on the new release"
    if [ -n "$PREVIOUS" ] && [ -d "$RELEASES_DIR/$PREVIOUS" ]; then
      switch_release "$PREVIOUS"; warn "Went back to $PREVIOUS"
      SWITCHED=false; die "Deploy undone: the new release did not answer 200."
    fi
    die "The new release did not answer 200 and there is no earlier release to go back to."
    ;;
esac

PHASE="cleaning up"
mapfile -t ALL < <(list_releases)
total=${#ALL[@]}
if [ "$total" -gt "$KEEP_RELEASES" ]; then
  for old in "${ALL[@]:0:$((total - KEEP_RELEASES))}"; do
    [ "$old" = "$NEW" ] || [ "$old" = "$PREVIOUS" ] || { rm -rf -- "${RELEASES_DIR:?}/$old" && info "removed old release $old" || warn "could not remove $old"; }
  done
fi
find "$LOG_DIR" -name '*.log' -mtime +30 -delete 2>/dev/null || true

PHASE="done"
ok "Deployed $NEW (previous: ${PREVIOUS:-none}). Undo with: ops/rollback.sh"
