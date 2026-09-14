# K3 Vaults

K3 Capital has been deploying liquidity on-chain since 2021. The team originated as the internal decentralized-finance department of a large retail crypto lending platform and became a standalone company in 2024. That lineage shapes how K3 works today: institutional credit and risk discipline combined with hands-on execution in on-chain markets.

K3 is internalizing vault infrastructure so distribution partners can offer access to actively managed strategies through a consistent customer journey. The infrastructure collects deposit and withdrawal requests, records ownership, and applies a common valuation point to each settlement cycle. K3 manages the underlying portfolio under a vault-specific mandate and provides continuous automated monitoring with on-call response.

## The proposition

- **For distribution partners:** one reusable route across deposits, portfolio reporting, and withdrawals.
- **For their eligible customers:** access to an actively managed, vault-specific mandate with requests in the same settlement cycle priced from one Net Asset Value (NAV) and supply snapshot.
- **For protocols and strategy venues:** a potential distribution channel for capital managed under defined operating policies.

The long-term direction is a one-stop strategy and infrastructure layer across additional eligible assets and EVM networks. That is a roadmap, not a claim that every K3 strategy already uses this technology or that every asset and network is supported.

## Live today

The **K3 cbBTC Vault** (`k3cbBTC`) is the first live deployment of K3's proprietary vault infrastructure. It runs on Ethereum and accepts cbBTC. K3 also manages live products and allocations delivered through partner infrastructure and external strategy venues; those should not be confused with the proprietary vault deployment.

## Where to start

| Audience | Start here |
|---|---|
| Distribution and product partners | [Why K3 Vaults](introduction/why-k3-vaults.md), [For Partners](introduction/for-partners.md), [User Journey](introduction/user-journey.md) |
| Eligible customers and allocators | [For Investors](introduction/for-investors.md), [User Journey](introduction/user-journey.md), [Example: K3 cbBTC Vault](introduction/cbbtc-vault.md), [FAQ](introduction/faq.md) |
| Protocols and strategy venues | [For Protocols](introduction/for-protocols.md), [Why K3 Vaults](introduction/why-k3-vaults.md) |
| Technical diligence teams | [System design](architecture/system-design.md), [Security & trust assumptions](architecture/security-assumptions.md), [Security reviews & audits](architecture/security-reviews.md) |
| Developers | [Integration Guide](integration/quickstart.md), [Reading vault state](integration/reading-state.md), [Reference](reference/addresses.md) |

## Important boundaries

Each vault has its own mandate, eligibility rules, supported assets, fees, operating policy, and governing terms. Settlement and NAV reporting are targeted for **Tuesdays and Fridays**, but timing is not guaranteed. NAV is operator-computed and published on-chain; it is not independently verified by an on-chain price feed.

These docs describe product infrastructure and technical behavior. They do not constitute investment advice or an offer. The canonical protocol specification remains [`ARCHITECTURE.md`](https://github.com/K3-Capital/k3-vault-contracts/blob/main/ARCHITECTURE.md) in the contracts repository.
