# GitBook sync notes

This repo ships three kinds of configuration. They are **not** interchangeable —
read the distinction carefully.

## GitBook Git Sync configuration (what GitBook.com's Git Sync reads)

- **`gitbook-docs.yaml`** — the GitBook **site** Git Sync configuration file.
  GitBook.com's Git Sync setup looks for this exact file at the repository root
  (the site's project directory). It maps the repository's content directories
  onto the site's navigation. This repo declares a single space whose content
  lives at the repository root; within that directory GitBook reads
  **`README.md`** as the readme/first page and **`SUMMARY.md`** as the table of
  contents by default. Schema: <https://api.gitbook.com/gitbook-docs.yaml>.
- **`SUMMARY.md`** — GitBook's table of contents for a space. It mirrors the
  site navigation; every page in the site must be listed here.

## Local renderer configuration (NOT read by GitBook.com)

- **`book.toml`** — configuration for the **local open-source renderer**
  (HonKit / MdBook) used to build and preview this site from the command line.
  GitBook.com does **not** read this file. It must not be mistaken for GitBook
  configuration.
- **`book.json`** — HonKit plugin configuration. Mermaid source blocks are kept
  in Markdown for GitBook and rendered as static SVG by
  `honkit-plugin-mermaid-hybrid` for the GitHub Pages build.
- **`puppeteer-config.json`** — Chromium launch settings used by the Mermaid
  renderer in CI.
- **`scripts/generate-llms.mjs`** — post-build step that generates the
  [llmstxt.org](https://llmstxt.org) files `llms.txt` (curated index) and
  `llms-full.txt` (full inlined content) into `_book/` for LLM consumers. It
  uses the maintained, zero-dependency
  [`@lacspace/llms-txt`](https://www.npmjs.com/package/@lacspace/llms-txt)
  library and derives the page list from `SUMMARY.md`, so the LLM-facing index
  always mirrors the published table of contents. Because `llms-full.txt`
  combines every page at the site root, the script rewrites each page's internal
  relative `.md` links to absolute published `.html` URLs (resolved against the
  source page's directory), while preserving fragments and external links. A
  deterministic build-time gate asserts that `llms.txt` validates and that
  `llms-full.txt` contains **zero** unresolved internal `.md` links — the build
  fails otherwise.

To reproduce the Pages build locally:

```sh
npm ci
npm run build
```

The build rewrites HonKit's default browser titles to
`K3 Vaults - <page title>` before publishing.

Inspect the generated pages under `_book/` to confirm diagrams are SVG output
rather than unprocessed Mermaid source.

## Scope notes

- Connecting this repo to a GitBook space (space URL, visibility, sync
  direction) is a product-owned decision and is intentionally **not** configured
  in this repository — `gitbook-docs.yaml` only provides the content mapping that
  GitBook requests, ready for any space to sync against it as-is.