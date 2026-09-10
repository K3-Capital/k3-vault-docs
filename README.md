# Introduction

K3 Capital builds simple, on-chain vaults. The **K3 cbBTC Vault** (`k3cbBTC`) is our first live vault, deployed on Ethereum mainnet. It lets you deposit and redeem **cbBTC** (Coinbase Wrapped BTC) through an asynchronous process that protects the vault's existing holders from one-off swings in price or liquidity at the moment of request.

The vault is built on industry-standard smart-contract standards (ERC-7540 for asynchronous deposits and redemptions, and ERC-4626 for tokenized vaults), so it works with the broader on-chain ecosystem while keeping the mechanics simple and auditable.

As a product, the K3 vault is deliberately straightforward:

- **Simple.** One clear flow: you request, K3 batches and prices requests, and you claim your shares or assets.
- **No protocol-level fees.** The vault itself does not charge fees.
- **Clear auditability.** Every settlement publishes its value and price on-chain, the vault's transfers and balances are observable on-chain, and independent security reviews cover the code. You can track on-chain where funds are held at each step of the deposit and redemption process.

This site documents:

- The **K3 cbBTC Vault** (`k3cbBTC`) — the first live deployment, on Ethereum mainnet.
- The underlying **epoch-staged vault infrastructure** that powers it.
- The **integration surface** for developers: contract entry points, view semantics, custom errors, and the companion subgraph for historical data.

## Who these docs are for

| Audience | Start here |
|---|---|
| Business readers (allocators, LPs, operators) | [Overview](introduction/overview.md), [How it works](introduction/how-it-works.md), [Your money & getting it back](introduction/money-flow.md), [The K3 cbBTC Vault](introduction/cbbtc-vault.md), [FAQ](introduction/faq.md) |
| Technical readers (diligence & audit teams) | [System design](architecture/system-design.md), [Security & trust assumptions](architecture/security-assumptions.md), [Security reviews & audits](architecture/security-reviews.md) |
| Frontend / API developers | [Quickstart](integration/quickstart.md), [Reading vault state](integration/reading-state.md), [Subgraph](integration/subgraph.md) |

## Scope & disclaimer

These pages describe **verifiable on-chain facts** only: deployed contracts, their interfaces, events, and observable behavior. They do not constitute investment advice, and they do not describe the off-chain strategy, fee model, or yield sources of the vault's smart account — see [Security & trust assumptions](architecture/security-assumptions.md).

For the full, canonical technical specification see [`ARCHITECTURE.md`](https://github.com/K3-Capital/k3-vault-contracts/blob/main/ARCHITECTURE.md) in the contracts repository, which remains the source of truth for protocol internals; these docs are a derived, condensed view.

## Building & Mermaid diagrams

The site is built with [HonKit](https://github.com/honkit/honkit) and published to **GitBook.com** (via GitBook Git Sync) and **GitHub Pages** (`.github/workflows/pages.yml`).

Mermaid diagrams are written as native ```` ```mermaid ```` fenced blocks in the Markdown:

- **GitBook.com** renders them natively — no extra configuration.
- **GitHub Pages** builds with HonKit. The `honkit-plugin-mermaid-hybrid` plugin is enabled in `book.json` (`plugin.embed: true`) so HonKit inlines a static `<svg>` for each Mermaid block during `honkit build` — the generated HTML literally contains the rendered diagram, no runtime JS required. `puppeteer-config.json` supplies the `--no-sandbox` launch args needed for mermaid-cli on the GitHub Actions runner.

To reproduce the Pages build locally:

```sh
npm ci
npx honkit build . _book
```

The rendered `_book/architecture/system-design.html` will contain inline `<svg>` diagrams in place of the ```` ```mermaid ```` code blocks.
