# GitBook sync notes

- **GitBook.com Git Sync configuration**: current GitBook Git Sync uses
  `.gitbook.yaml` (and optionally `gitbook-docs.yaml`) plus `SUMMARY.md` for the
  table of contents. This repo ships a standard `.gitbook.yaml` that pins the
  root layout (`./`) with `README.md` as the readme and `SUMMARY.md` as the
  summary. Content lives at the repository root (not a `src/` subdirectory),
  matching the layout GitBook.com's GitHub App sync expects.
- `book.toml` is **not** GitBook configuration. It is the config for the local
  open-source renderer (HonKit) used to build/preview this site; GitBook.com
  does not read it.
- Connecting this repo to a GitBook space (space URL, visibility, sync direction)
  is a product-owned decision and is intentionally NOT configured here.
- To build/preview locally without GitBook.com: `npx honkit build . _book`
  (HonKit is the maintained open-source GitBook runtime and was used to validate
  this content: 22 pages, all internal links resolve).