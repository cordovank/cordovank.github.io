#!/usr/bin/env node
// scripts/build-knowledge.js
// Run: node scripts/build-knowledge.js
//
// Reads markdown files from ./content and links from ./content/links.json
// Generates BOTH:
//   1) assets/js/portfolio-knowledge.js
//   2) assets/data/portfolio-knowledge.json
//
// Recommended content shape:
// - content/identity.md      -> the ONLY always_include chunk
// - content/about.md
// - content/experience.md
// - content/skills.md
// - content/contact.md
// - content/projects/*.md
// - content/links.json       -> links keyed by chunk id

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '../content');
const OUTPUT_JS_FILE = path.join(__dirname, '../assets/js/portfolio-knowledge.js');
const OUTPUT_JSON_FILE = path.join(__dirname, '../assets/data/portfolio-knowledge.json');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function parseScalar(value) {
  const trimmed = value.trim();

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.replace(/^['"]|['"]$/g, ''));
  }

  return trimmed.replace(/^['"]|['"]$/g, '');
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw.trim() };

  const meta = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1);
    meta[key] = parseScalar(value);
  }

  return { meta, body: match[2].trim() };
}

function collectFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, files);
    else if (entry.name.endsWith('.md')) files.push(full);
  }
  return files;
}

function loadLinks() {
  const linksPath = path.join(CONTENT_DIR, 'links.json');
  if (!fs.existsSync(linksPath)) return {};
  return JSON.parse(fs.readFileSync(linksPath, 'utf8'));
}

function normalizeChunk(file, linksById) {
  const raw = fs.readFileSync(file, 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const id = meta.id || path.basename(file, '.md');

  return {
    id,
    label: meta.label || id,
    section: meta.section || inferSectionFromPath(file),
    priority: meta.priority || 'normal',
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    links: linksById[id] || {},
    body,
  };
}

function inferSectionFromPath(filePath) {
  const rel = path.relative(CONTENT_DIR, filePath).replace(/\\/g, '/');
  if (rel.startsWith('projects/')) return 'projects';
  return path.basename(rel, '.md');
}

function buildKnowledge() {
  const files = collectFiles(CONTENT_DIR).sort();
  const linksById = loadLinks();

  const identity = [];
  const chunks = [];

  for (const file of files) {
    const chunk = normalizeChunk(file, linksById);

    if (chunk.priority === 'always_include') {
      identity.push(chunk);
    } else {
      chunks.push(chunk);
    }
  }

  return {
    generated_at: new Date().toISOString(),
    version: '1.0',
    identity,
    chunks,
  };
}

function generate() {
  const knowledge = buildKnowledge();

  ensureDir(OUTPUT_JS_FILE);
  ensureDir(OUTPUT_JSON_FILE);

  const jsOutput = `// assets/js/portfolio-knowledge.js
// AUTO-GENERATED — do not edit by hand.

// Source: content/
// Regenerate: node scripts/build-knowledge.js
// Generated: ${knowledge.generated_at}

const PORTFOLIO_KNOWLEDGE = ${JSON.stringify(knowledge, null, 2)};

const PORTFOLIO_IDENTITY = PORTFOLIO_KNOWLEDGE.identity;
const PORTFOLIO_CHUNKS = PORTFOLIO_KNOWLEDGE.chunks;
`;

  fs.writeFileSync(OUTPUT_JS_FILE, jsOutput, 'utf8');
  fs.writeFileSync(OUTPUT_JSON_FILE, JSON.stringify(knowledge, null, 2), 'utf8');

  console.log(`✓ Written: ${OUTPUT_JS_FILE}`);
  console.log(`✓ Written: ${OUTPUT_JSON_FILE}`);
  console.log(`  ${knowledge.identity.length} identity chunk(s), ${knowledge.chunks.length} content chunk(s)`);
}

generate();