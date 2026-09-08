# GitBook sync notes

- The documentation content in this repository is standard GitBook format:
  `SUMMARY.md` defines the table of contents, `book.toml` the configuration.
  Content lives at the repository root (not a `src/` subdirectory), matching
  the layout GitBook.com's GitHub App sync expects.
- Connecting this repo to a GitBook space (space URL, visibility, sync direction)
  is a product-owned decision and is intentionally NOT configured here.
- To build/preview locally without GitBook.com: `npx honkit build . _book`
  (HonKit is the maintained open-source GitBook runtime and was used to validate
  this content: 22 pages, all internal links resolve).
