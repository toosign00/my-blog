#!/usr/bin/env bash
# Cloudflare R2 버킷의 특정 폴더(prefix) 안에 있는 파일들의 URL 목록을 출력한다.
#
# 사용법:
#   ./scripts/r2-list-urls.sh <prefix> [output_file]
#
# 인자:
#   prefix       - R2 버킷 안의 폴더 경로. 끝에 / 포함 (예: image/filmlog-01/)
#   output_file  - (선택) 결과를 저장할 파일명. 생략하면 터미널에만 출력
#
# 예시:
#   ./scripts/r2-list-urls.sh image/filmlog-01/
#   ./scripts/r2-list-urls.sh image/filmlog-01/ urls.txt

set -euo pipefail

BUCKET="toosign"
BASE_URL="https://files.toosign.me"
WRANGLER_CONFIG="${HOME}/Library/Preferences/.wrangler/config/default.toml"

if [[ $# -lt 1 ]]; then
  echo "사용법: $0 <prefix> [output_file]"
  echo "예시:   $0 image/filmlog-01/"
  echo "예시:   $0 image/filmlog-02/ urls.txt"
  exit 1
fi

PREFIX="$1"
OUTPUT_FILE="${2:-}"

if [[ ! -f "$WRANGLER_CONFIG" ]]; then
  echo "오류: wrangler 로그인이 필요합니다: wrangler login"
  exit 1
fi

TOKEN=$(grep 'oauth_token' "$WRANGLER_CONFIG" | sed 's/oauth_token = "\(.*\)"/\1/' | tr -d ' ')
if [[ -z "$TOKEN" ]]; then
  echo "오류: wrangler 토큰을 찾을 수 없습니다. wrangler login을 다시 실행하세요."
  exit 1
fi

ACCOUNT_ID=$(wrangler whoami 2>/dev/null | grep -oE '[0-9a-f]{32}' | head -1)
if [[ -z "$ACCOUNT_ID" ]]; then
  echo "오류: Account ID를 가져올 수 없습니다."
  exit 1
fi

ENCODED_PREFIX=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${PREFIX}', safe=''))")

URLS=$(curl -sf \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects?prefix=${ENCODED_PREFIX}&per_page=1000" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if not data.get('success'):
    print('API 오류:', data.get('errors'), file=sys.stderr)
    sys.exit(1)
objects = data.get('result', [])
base = '${BASE_URL}'
urls = [base + '/' + obj['key'] for obj in objects if not obj['key'].endswith('/')]
print('\n'.join(urls))
")

COUNT=$(echo "$URLS" | grep -c 'http' || true)

echo "$URLS"
echo ""
echo "── 총 ${COUNT}개 URL ──"

if [[ -n "$OUTPUT_FILE" ]]; then
  echo "$URLS" > "$OUTPUT_FILE"
  echo "저장됨: ${OUTPUT_FILE}"
fi
