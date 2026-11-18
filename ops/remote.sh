#!/usr/bin/env bash
# Run the server scripts from your laptop over SSH.
#
#   ops/remote.sh deploy [ref]       build and publish a branch, tag or commit (default: main)
#   ops/remote.sh rollback [release]
#   ops/remote.sh doctor             read-only health report
#   ops/remote.sh logs               the latest deploy log
#   ops/remote.sh update-ops         copy these scripts to the server and re-run the bootstrap
#   ops/remote.sh                    interactive menu
#
# The server is SERVER=user@host (or an ssh alias), else the one saved last time in
# ~/.config/portfolio-ops/server, else you are asked. The ssh user needs sudo, or be root.
# The server builds from GitHub, so push first: `deploy` refuses to publish a main that
# differs from origin/main. Deploys run detached on the server, so a dropped connection
# cannot kill a build half way.
set -Eeuo pipefail

APP_USER="${APP_USER:-portfolio}"
BASE="${BASE:-/srv/portfolio}"
OPS=/opt/portfolio-ops
CONF="$HOME/.config/portfolio-ops/server"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
usage() { awk 'NR > 1 && /^#/ { sub(/^# ?/, ""); print; next } NR > 1 { exit }' "$0"; }

SERVER="${SERVER:-${PORTFOLIO_SERVER:-}}"
SERVER_FROM_FILE=false
[ -n "$SERVER" ] || { [ ! -r "$CONF" ] || { SERVER="$(cat "$CONF")"; SERVER_FROM_FILE=true; }; }

SSH_OPTS=(-o ControlMaster=auto -o "ControlPath=/tmp/portfolio-ops-$(id -u)-%C" -o ControlPersist=10m -o ConnectTimeout=10)
ssh_() { ssh "${SSH_OPTS[@]}" "$@"; }
is_tty() { [ -t 0 ] && [ -t 1 ]; }
ask() { local a; read -r -p "$1${2:+ [$2]}: " a || a=""; printf '%s' "${a:-${2:-}}"; }
confirm() { local a; a="$(ask "$1 (y/N)" "")"; [ "$a" = y ] || [ "$a" = Y ]; }

choose_server() {
  SERVER="$(ask "Server (user@host or an ssh alias)" "$SERVER")"
  [ -n "$SERVER" ] || { echo "No server given." >&2; exit 1; }
  if confirm "Remember it for next time?"; then mkdir -p "$(dirname "$CONF")" && printf '%s\n' "$SERVER" > "$CONF"; fi
}
need_server() {
  if [ -z "$SERVER" ]; then
    is_tty || { echo "Set SERVER=user@host (or PORTFOLIO_SERVER)." >&2; exit 1; }
    choose_server
  elif [ "$SERVER_FROM_FILE" = true ] && is_tty && [ "${IN_MENU:-}" != true ]; then
    case "$(ask "Use the saved server $SERVER? (Y/n)" "y")" in y|Y) ;; *) choose_server ;; esac
  else
    echo "Server: $SERVER" >&2
  fi
}

qargs() { printf ' %q' "$@"; }
root_user() { [ "$(ssh_ "$SERVER" id -u)" = 0 ]; }
as_app() { ssh_ -t "$SERVER" "sudo -u $APP_USER -H $*"; }
sudo_()  { if root_user; then ssh_ -t "$SERVER" "$*"; else ssh_ -t "$SERVER" "sudo $*"; fi; }

# The server builds from GitHub: refuse to publish a ref that is not pushed.
check_pushed() {
  local ref="${1:-main}" local_sha remote_sha
  git -C "$HERE" rev-parse --git-dir >/dev/null 2>&1 || return 0
  git -C "$HERE" fetch -q origin || { echo "Could not reach GitHub to check that '$ref' is pushed." >&2; return 1; }
  if git -C "$HERE" rev-parse -q --verify "refs/remotes/origin/$ref" >/dev/null; then
    local_sha="$(git -C "$HERE" rev-parse -q --verify "refs/heads/$ref" 2>/dev/null || true)"
    remote_sha="$(git -C "$HERE" rev-parse "refs/remotes/origin/$ref")"
    if [ -n "$local_sha" ] && [ "$local_sha" != "$remote_sha" ]; then
      echo "Your local '$ref' differs from origin/$ref. Push (or pull) first: the server deploys what is on GitHub." >&2
      return 1
    fi
  fi
}

do_deploy() {
  check_pushed "${1:-main}" || return 1
  local log inner
  log="$BASE/logs/remote-$(date +%Y%m%d-%H%M%S).log"
  inner="mkdir -p $BASE/logs; setsid nohup $OPS/deploy.sh$(qargs "$@") > $log 2>&1 < /dev/null & echo \$! > $BASE/logs/deploy.pid"
  ssh_ -t "$SERVER" "sudo -u $APP_USER -H bash -c $(printf '%q' "$inner")" || return 1
  echo "Deploy started on ${SERVER#*@}; following $log (Ctrl-C only stops the viewing, not the deploy)"
  ssh_ -t "$SERVER" "sudo -u $APP_USER tail -n +1 -F $log --pid=\$(sudo -u $APP_USER cat $BASE/logs/deploy.pid)" || true
  ssh_ "$SERVER" "sudo -u $APP_USER tail -n 3 $log" | grep -qE 'Deployed [0-9]{8}|already live' \
    || { echo "Deploy did not report success (it may still be running); check: $log" >&2; return 1; }
}
do_rollback() { as_app "$OPS/rollback.sh$(qargs "$@")"; }
do_doctor()   { sudo_ "$OPS/doctor.sh$(qargs "$@")"; }
do_logs()     { ssh_ -t "$SERVER" "sudo -u $APP_USER bash -c 'tail -n 80 \"\$(ls -t $BASE/logs/*.log | head -n 1)\"'"; }
do_update_ops() {
  # mktemp -d makes a fresh 0700 directory owned by the ssh user: no predictable path
  # the app user could pre-create before root runs the script from it.
  local tmp
  tmp="$(ssh_ "$SERVER" 'mktemp -d /tmp/portfolio-ops.XXXXXXXX')" || return 1
  rsync -a --delete -e "ssh ${SSH_OPTS[*]}" "$HERE/" "$SERVER:$tmp/" || return 1
  sudo_ "bash $tmp/bootstrap-server.sh; rm -rf $tmp"
}

menu() {
  IN_MENU=true; need_server
  local choice ref
  while true; do
    echo; echo "Portfolio server — $SERVER"
    ssh_ "$SERVER" "echo \"Live release: \$(basename \"\$(readlink -f $BASE/current 2>/dev/null)\")\"" 2>/dev/null || true
    printf '  1) Deploy\n  2) Roll back\n  3) Health check (doctor)\n  4) Latest log\n  5) Update the ops scripts on the server\n  6) Change server\n  q) Quit\n'
    read -r -p "Choose: " choice || exit 0
    case "$choice" in
      1) ref="$(ask "Branch, tag or commit" "main")"; if confirm "Deploy '$ref' to ${SERVER#*@}?"; then do_deploy "$ref" || true; fi ;;
      2) ssh_ "$SERVER" "ls -1 $BASE/releases | sort" | sed 's/^/    /'; ref="$(ask "Release (Enter = the one before the current)" "")"; if [ -n "$ref" ]; then do_rollback "$ref" || true; else do_rollback || true; fi ;;
      3) do_doctor || true ;;
      4) do_logs || true ;;
      5) do_update_ops || true ;;
      6) choose_server ;;
      q|Q|"") exit 0 ;;
      *) echo "Unknown choice: $choice" ;;
    esac
  done
}

cmd="${1:-}"; shift || true
case "$cmd" in
  "")         is_tty || { usage; exit 1; }; menu ;;
  deploy)     need_server; do_deploy "$@" ;;
  rollback)   need_server; do_rollback "$@" ;;
  doctor)     need_server; do_doctor "$@" ;;
  logs)       need_server; do_logs ;;
  update-ops) need_server; do_update_ops ;;
  -h|--help|help) usage ;;
  *) echo "Unknown command: $cmd" >&2; usage >&2; exit 1 ;;
esac
