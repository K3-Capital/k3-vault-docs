# Introduction

K3 vaults are async deposit and redemption vehicles built on the **ERC-7540** (Tokenized Vaults with async flows) and **ERC-4626** standards. Instead of instant mint/redeem conversions, user requests are collected into **epochs** that are closed and settled off-cycle by the vault's smart account, with each settlement publishing an on-chain NAV snapshot and share price.

This site documents:

- The **K3 cbBTC Vault** (`k3cbBTC`) — the first live deployment, on Ethereum mainnet.
- The underlying **epoch-staged vault infrastructure** (the `SmartAccountWrapper` / `EpochStagedERC7540Vault` contract suite).
- The **integration surface**: contract entry points, view semantics, custom errors, and the companion subgraph for historical data.

## Who these docs are for

| Audience | Start here |
|---|---|
| Business readers | [Overview](introduction/overview.md), [How it works](introduction/how-it-works.md), [The K3 cbBTC Vault](introduction/cbbtc-vault.md) |
| Frontend / API developers | [Quickstart](integration/quickstart.md), [Reading vault state](integration/reading-state.md), [Subgraph](integration/subgraph.md) |

## Scope & disclaimer

These pages describe **verifiable on-chain facts** only: deployed contracts, their interfaces, events, and observable behavior. They do not constitute investment advice, and they do not describe the off-chain strategy, fee model, or yield sources of the vault's smart account — see [Security & trust assumptions](architecture/security-assumptions.md).

For the full, canonical technical specification see [`ARCHITECTURE.md`](https://github.com/K3-Capital/k3-vault-contracts/blob/main/ARCHITECTURE.md) in the contracts repository, which remains the source of truth for protocol internals; these docs are a derived, condensed view.

## Building & Mermaid diagrams

The site is built with [HonKit](https://github.com/honkit/honkit) and published to **GitBook.com** (via GitBook Git Sync) and **GitHub Pages** (`.github/workflows/pages.yml`).

Mermaid diagrams are written as native ```` ```mermaid ```` fenced blocks in the Markdown:

- **GitBook.com** renders them natively — no extra configuration.
- **GitHub Pages** uses plain HonKit, which has no Mermaid renderer. The Pages workflow therefore runs `scripts/inline-mermaid.mjs` after `honkit build`; it replaces each Mermaid code block in the generated HTML with its rendered `<svg>` (via `@mermaid-js/mermaid-cli`). The Markdown sources are untouched, so GitBook output is unaffected.

To reproduce the Pages build locally:

```sh
npm install --no-save @mermaid-js/mermaid-cli@11.17.0
npx --yes honkit@6.2.2 build . _book
PUPPETEER_CONFIG_FILE=<path-to-puppeteer-config-with-executablePath> node scripts/inline-mermaid.mjs
```
