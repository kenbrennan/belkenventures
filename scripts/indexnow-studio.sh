#!/usr/bin/env bash
# IndexNow ping for studio.belken.ai
# Tells IndexNow-enabled engines (Bing, Yandex, and partners) which URLs changed.
# Run this AFTER a Tower git pull that includes the IndexNow key file:
#   https://studio.belken.ai/34e2e178b4c12c4b1c7a2c27718f522f.txt
#
# Usage:
#   scripts/indexnow-studio.sh         # submits the default URL list below
#   scripts/indexnow-studio.sh url1 url2 ...  # submits the URLs you pass instead
#
# No dependencies beyond curl. Platform-agnostic (bash + curl).

set -euo pipefail

HOST="studio.belken.ai"
KEY="34e2e178b4c12c4b1c7a2c27718f522f"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
ENDPOINT="https://api.indexnow.org/indexnow"

# Verify key file is live before submitting.
http_key=$(curl -sS -o /dev/null -w "%{http_code}" "${KEY_LOCATION}")
if [ "$http_key" != "200" ]; then
  echo "ERROR: Key file not live yet at ${KEY_LOCATION} (HTTP ${http_key})." >&2
  echo "Run 'git pull' on the Tower (belken-studio-platform) and retry." >&2
  exit 1
fi

# Studio subdomain public pages (only pages without login walls).
DEFAULT_URLS=(
  "https://studio.belken.ai/"
  "https://studio.belken.ai/sitemap.xml"
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

echo "Submitting ${#URLS[@]} URL(s) to IndexNow for ${HOST}..."
http_code=$(curl -sS -o /tmp/indexnow_studio_resp.txt -w "%{http_code}" \
  -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data "${payload}")

echo "HTTP ${http_code}"
echo "Response body:"
cat /tmp/indexnow_studio_resp.txt 2>/dev/null || true
echo

case "$http_code" in
  200|202) echo "IndexNow accepted the submission for ${HOST}." ;;
  *) echo "IndexNow submission may have failed (HTTP ${http_code}). Check key file is live." >&2; exit 1 ;;
esac
