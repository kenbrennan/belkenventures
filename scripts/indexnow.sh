#!/usr/bin/env bash
# IndexNow ping for belken.ai
# Tells IndexNow-enabled engines (Bing, Yandex, and partners) which URLs changed.
# Run this AFTER a deploy, once the key file is live at:
#   https://belken.ai/34e2e178b4c12c4b1c7a2c27718f522f.txt
#
# Usage:
#   scripts/indexnow.sh                # submits the default URL list below
#   scripts/indexnow.sh url1 url2 ...  # submits the URLs you pass instead
#
# No dependencies beyond curl. Platform-agnostic (bash + curl).

set -euo pipefail

HOST="belken.ai"
KEY="34e2e178b4c12c4b1c7a2c27718f522f"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
ENDPOINT="https://api.indexnow.org/indexnow"

# Default list: the GEO-relevant public pages. Edit as the site grows,
# or pass URLs as arguments to override.
DEFAULT_URLS=(
  "https://belken.ai/"
  "https://belken.ai/aria"
  "https://belken.ai/aria/plumbing"
  "https://belken.ai/aria/hvac"
  "https://belken.ai/aria/roofing"
  "https://belken.ai/aria/electrical"
  "https://belken.ai/aria/law"
  "https://belken.ai/aria/medspa"
  "https://belken.ai/aria/real-estate"
  "https://belken.ai/studio"
  "https://belken.ai/openclaw"
  "https://belken.ai/audit"
  "https://belken.ai/audit/sample"
  "https://belken.ai/after-hours"
  "https://belken.ai/after-hours/plumbing"
  "https://belken.ai/after-hours/hvac"
  "https://belken.ai/after-hours/roofing"
)

if [ "$#" -gt 0 ]; then
  URLS=("$@")
else
  URLS=("${DEFAULT_URLS[@]}")
fi

# Build the JSON urlList array.
url_json=""
for u in "${URLS[@]}"; do
  if [ -z "$url_json" ]; then
    url_json="\"$u\""
  else
    url_json="$url_json,\"$u\""
  fi
done

payload=$(cat <<JSON
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${KEY_LOCATION}",
  "urlList": [${url_json}]
}
JSON
)

echo "Submitting ${#URLS[@]} URL(s) to IndexNow..."
http_code=$(curl -sS -o /tmp/indexnow_resp.txt -w "%{http_code}" \
  -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data "${payload}")

echo "HTTP ${http_code}"
echo "Response body:"
cat /tmp/indexnow_resp.txt 2>/dev/null || true
echo

# IndexNow returns 200 (accepted) or 202 (accepted, pending validation) on success.
case "$http_code" in
  200|202) echo "IndexNow accepted the submission." ;;
  *) echo "IndexNow submission may have failed (HTTP ${http_code}). Check the key file is live at ${KEY_LOCATION}." >&2; exit 1 ;;
esac
