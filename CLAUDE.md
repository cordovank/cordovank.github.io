# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Nellie Cordova's personal portfolio — a static single-page site served by GitHub Pages at `https://cordovank.github.io/`, plus a retrieval-backed chat widget whose backend lives in a **separate repo** (`portfolio-chat-worker`, a Cloudflare Worker expected as a sibling directory at `../portfolio-chat-worker`).

There is no bundler, no test suite, no linter, and no framework. `index.html` (~1060 lines) is the entire site.

## Commands

```bash
# Regenerate chat knowledge artifacts from content/ (the only build step)
npm run build:knowledge          # == node scripts/build-knowledge.js

# Publish generated knowledge to Cloudflare KV (identity / chunks / meta keys)
# Requires: wrangler login, and ../portfolio-chat-worker/wrangler.jsonc present
./scripts/upload-to-kv.sh

# Local preview — relative fetches (project overlays) need a server, not file://
python3 -m http.server 8000      # http://localhost:8000
```

## The two-tier chat architecture

GitHub Pages cannot hold API keys, so the browser is a thin client:

```
index.html (#pchat-* widget)
  → assets/js/portfolio-chat.js  POST { provider, message, history }
    → WORKER_URL (Cloudflare Worker, separate repo)
      → Cloudflare KV (identity, chunks) → retrieval + prompt assembly → LLM provider
        → { answer, sources? }
```

The frontend does **not** send portfolio knowledge. Retrieval, intent classification, prompt assembly, and provider routing all live in the Worker. To test against a local worker, change `WORKER_URL` at the top of [assets/js/portfolio-chat.js](assets/js/portfolio-chat.js) (`ollamaLocal` as a provider only works against a locally-run worker — a deployed Worker cannot reach `localhost:11434`).

Deeper background on the Worker side lives in [INTERNAL/REFERENCE_DOCS/](INTERNAL/REFERENCE_DOCS/) (note: those docs reference a `.github/copilot-instructions.md` and `_config.yml` that do not exist here).

## Knowledge pipeline — content is the source of truth

```
content/*.md + content/projects/*.md   (markdown + YAML-ish frontmatter)
content/links.json                     (public links, keyed by chunk id)
        ↓  scripts/build-knowledge.js
assets/js/portfolio-knowledge.js       ← AUTO-GENERATED, never hand-edit
assets/data/portfolio-knowledge.json   ← AUTO-GENERATED, never hand-edit
        ↓  scripts/upload-to-kv.sh
Cloudflare KV: identity | chunks | meta
```

Rules that the build enforces or depends on:

- A chunk's frontmatter `id` **must match** its key in `content/links.json` (e.g. `id: project_modular_rag` ↔ `"project_modular_rag"`). A mismatch silently yields `links: {}`.
- `priority: always_include` routes a chunk into `identity[]` instead of `chunks[]`. Only [content/identity.md](content/identity.md) uses it — it carries the assistant's behavioral rules (answer only from retrieved content, never invent employers/dates/metrics). Editing that file changes assistant behavior in production.
- `section` defaults from the path: anything under `content/projects/` becomes `projects`, otherwise the filename.
- The frontmatter parser is hand-rolled (`key: value`, plus `[a, b, c]` inline lists). Nested YAML, multiline values, and comments are not supported.
- Content edits are not live until both `npm run build:knowledge` **and** `./scripts/upload-to-kv.sh` have run — the site itself does not read these artifacts at runtime.

`assets/js/portfolio-knowledge.js` is still loaded by `index.html` but is currently **unused** by the widget (see the `TODO - remove after worker update` comments in `portfolio-chat.js`, left from the pre-Worker design where the full knowledge blob was sent as a system message).

## Project detail pages are content fragments, not pages

`assets/pages/project-details/*.html` are leftovers from an older BootstrapMade template. Their `<head>`, vendor `<script>` tags, and `assets/css/style.css` reference are **dead** — that stylesheet doesn't exist. [assets/js/main.js](assets/js/main.js) intercepts `a.portfolio-lightbox` clicks, fetches the page, and injects only the inner HTML of `#portfolio-details` into an on-page overlay (falling back to full navigation if the fetch fails).

So: when editing a detail page, only the markup inside `#portfolio-details` matters, and it must be styled by `assets/css/main.css`, not by anything the file itself links.

## Adding a project touches four independent naming systems

They do not share names — don't assume they line up:

1. `content/projects/<slug>.md` with `id: project_<snake_case>` (chat knowledge)
2. `content/links.json` entry under that same `id`
3. `assets/img/project/<short>.webp` + `assets/pages/project-details/<short>.html` (e.g. `modrag`, not `modular-rag`)
4. A `.portfolio-item` card in `index.html`, whose `filter-*` classes must be one of the Isotope filters declared in the portfolio section (`filter-ai`, `filter-dl`, `filter-nlp`, `filter-ux`, `filter-systems`)

Then rebuild + re-upload knowledge (see above).

## Frontend conventions

- **Vendored, not managed.** Everything in `assets/vendor/` is a pinned copy (Bootstrap 5, AOS, GLightbox, Isotope, Swiper, Typed.js, Waypoints, PureCounter, …). `package.json` exists only for the knowledge build script — do not introduce a package manager for site dependencies.
- **`main.js` is template code plus custom additions.** The BootstrapMade SnapFolio base handles nav, preloader, AOS, Isotope, scrollspy; the custom parts are the AJAX portfolio overlay and the mobile-nav focus trap / outside-click / ESC handling. Both custom paths manage their own listener cleanup and focus restoration — preserve that when touching them.
- **`main.css` is dark-first.** Colors come from `:root` custom properties (`--background-color`, `--surface-color`, `--accent-color: #FF9364`, …); `.dark-background` / `.light-background` re-declare them per section. Add colors as variables, not literals.
- **Chat widget DOM contract:** `portfolio-chat.js` binds by id to `#pchat-toggle`, `#pchat-panel`, `#pchat-close`, `#pchat-messages`, `#pchat-input`, `#pchat-send`, and `.pchat-suggestion` in `index.html`. Message text is escaped via `escapeHtml()` before injection — keep it that way.

## Repo facts worth knowing

- **This working copy is not a git repository** (it's the OneDrive-synced folder). Git operations will fail here; deployment happens by pushing `main` in the actual GitHub repo, which GitHub Pages auto-deploys.
- **`INTERNAL/` is not part of the site.** It holds CV source material, reference docs, code guides, and unused/superseded assets. Nothing there is served, and nothing in it should be linked from `index.html`.
- **Public contact details and profile links are intentionally in the repo** (`content/links.json`, `content/contact.md`) — they're published on the live site.
