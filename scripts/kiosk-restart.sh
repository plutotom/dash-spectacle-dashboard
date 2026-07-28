#!/usr/bin/env bash
#
# Restart the wall-dashboard kiosk browser on the Pi.
#
# The dashboard page is opened once and never navigated away from, so Chromium
# never tears down the tab and nothing is reclaimed at the document level. Over
# days of uptime the renderer grows until the Pi starts swapping. Restarting the
# whole process nightly is the cheap fix.
#
# This is deliberately a process restart rather than an in-page `location.reload()`:
# when the tab is wedged, its JavaScript is exactly what is not running, so a
# client-side timer can't rescue it. Killing the process always works.
#
# Install on the Pi:
#   chmod +x scripts/kiosk-restart.sh
#   crontab -e
#   # then add (4am nightly):
#   0 4 * * * /home/pi/dash-spectacle-dashboard/scripts/kiosk-restart.sh
#
# Override the defaults with KIOSK_URL / KIOSK_BROWSER / DISPLAY if needed.

set -u

URL="${KIOSK_URL:-https://dash-spectacle-dashboard.vercel.app/dashboard}"
BROWSER="${KIOSK_BROWSER:-}"

if [ -z "$BROWSER" ]; then
  for candidate in chromium-browser chromium google-chrome; do
    if command -v "$candidate" >/dev/null 2>&1; then
      BROWSER="$candidate"
      break
    fi
  done
fi

if [ -z "$BROWSER" ]; then
  echo "kiosk-restart: no chromium binary on PATH (set KIOSK_BROWSER)" >&2
  exit 1
fi

# Stop the running kiosk, then give it a moment to release the profile lock in
# --user-data-dir before the replacement process claims it.
pkill -f "$BROWSER" || true
sleep 5

DISPLAY="${DISPLAY:-:0}" "$BROWSER" \
  --kiosk "$URL" \
  --remote-debugging-port=9222 \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --user-data-dir=/tmp/chrome-kiosk \
  >/tmp/chrome-kiosk.log 2>&1 &

echo "kiosk-restart: relaunched $BROWSER -> $URL"
