#!/bin/bash
# Upload generated portfolio knowledge to Cloudflare KV
# Requires:
#   - wrangler CLI installed and authenticated
#   - wrangler.jsonc / wrangler.toml contains a KV binding named PORTFOLIO_KV
#
# Run:
#   1) wrangler login
#   2) node scripts/build-knowledge.js
#   3) ./scripts/upload-to-kv.sh

set -euo pipefail

# Repo-local generated knowledge & worker repo config & KV namespace
SITE_REPO_KNOWLEDGE="./assets/data/portfolio-knowledge.json"
WORKER_REPO_CONFIG="../portfolio-chat-worker/wrangler.jsonc"
KV_BINDING="PORTFOLIO_KV"

TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [ ! -f "$SITE_REPO_KNOWLEDGE" ]; then
  echo "Error: $SITE_REPO_KNOWLEDGE not found."
  echo "Run: node scripts/build-knowledge.js"
  exit 1
fi

if [ ! -f "$WORKER_REPO_CONFIG" ]; then
  echo "Error: worker config not found at $WORKER_REPO_CONFIG"
  exit 1
fi

echo "Knowledge file: $SITE_REPO_KNOWLEDGE"
echo "Worker config:  $WORKER_REPO_CONFIG"

node - "$SITE_REPO_KNOWLEDGE" "$TMP_DIR" <<'NODE'
const fs = require('fs');
const path = require('path');

const knowledgeFile = process.argv[2];
const tmpDir = process.argv[3];

const data = JSON.parse(fs.readFileSync(knowledgeFile, 'utf8'));

const identity = data.identity || [];
const chunks = data.chunks || [];
const meta = data.meta || {};

fs.writeFileSync(path.join(tmpDir, 'identity.json'), JSON.stringify(identity));
fs.writeFileSync(path.join(tmpDir, 'chunks.json'), JSON.stringify(chunks));
fs.writeFileSync(path.join(tmpDir, 'meta.json'), JSON.stringify(meta));

console.log(`Identity count: ${identity.length}`);
console.log(`Chunk count: ${chunks.length}`);
NODE

echo "Uploading identity..."
wrangler kv key put "identity" \
  --config="$WORKER_REPO_CONFIG" \
  --binding="$KV_BINDING" \
  --remote \
  --path="$TMP_DIR/identity.json"

echo "Uploading chunks..."
wrangler kv key put "chunks" \
  --config="$WORKER_REPO_CONFIG" \
  --binding="$KV_BINDING" \
  --remote \
  --path="$TMP_DIR/chunks.json"

echo "Uploading meta..."
wrangler kv key put "meta" \
  --config="$WORKER_REPO_CONFIG" \
  --binding="$KV_BINDING" \
  --remote \
  --path="$TMP_DIR/meta.json"

echo "✓ KV upload complete"