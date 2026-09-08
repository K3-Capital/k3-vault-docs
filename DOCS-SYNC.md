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
  configuration. To build/preview locally without GitBook.com:
  `npx honkit build . _book` (HonKit is the maintained open-source GitBook
  runtime and was used to validate this content).

## Scope notes

- Connecting this repo to a GitBook space (space URL, visibility, sync
  direction) is a product-owned decision and is intentionally **not** configured
  in this repository — `gitbook-docs.yaml` only provides the content mapping that
  GitBook requests, ready for any space to sync against it as-is.