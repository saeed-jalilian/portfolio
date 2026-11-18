#!/usr/bin/env bash
# Move the site back to an earlier release (one atomic link swap, no gap).
#
#   ops/rollback.sh              switch to the release before the current one
#   ops/rollback.sh <release>    switch to a named release (see the list it prints)
#   ops/rollback.sh --yes ...    skip the confirmation
set -Eeuo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
. "$HERE/lib/common.sh"
load_ops_env
require_app_user
with_lock

ASSUME_YES=false; TARGET=""
for arg in "$@"; do
  case "$arg" in
    --yes) ASSUME_YES=true ;;
    -h|--help) sed -n '2,7p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*) die "Unknown option: $arg" ;;
    *) TARGET="$arg" ;;
  esac
done

NOW="$(current_release)"
mapfile -t ALL < <(list_releases)
step "Releases (newest last)"
for r in "${ALL[@]}"; do printf '    %s%s\n' "$r" "$([ "$r" = "$NOW" ] && echo '   <- current')"; done

if [ -z "$TARGET" ]; then
  for r in "${ALL[@]}"; do [ "$r" = "$NOW" ] && break; TARGET="$r"; done
  [ -n "$TARGET" ] || die "There is no release older than $NOW."
fi
[ -d "$RELEASES_DIR/$TARGET" ] || die "No such release: $TARGET"
[ "$TARGET" != "$NOW" ] || die "$TARGET is already the current release."
release_complete "$RELEASES_DIR/$TARGET" || die "$TARGET is incomplete"

if [ "$ASSUME_YES" = false ]; then
  read -r -p "Switch $NOW -> $TARGET ? [y/N] " answer
  [ "$answer" = y ] || [ "$answer" = Y ] || die "Cancelled."
fi
switch_release "$TARGET"
ok "Now running $TARGET"
