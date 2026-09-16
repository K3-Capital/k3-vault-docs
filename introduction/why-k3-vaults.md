# Vaults: managed products for on-chain markets

## What a vault is

The market's response to fragmented opportunities and operational hurdles has been the growth of managed products under the "vault" label: smart contracts that pool deposits in a single asset and delegate allocation to a manager. The depositor holds one token representing a pro-rata claim on the pool; the manager selects venues, sizes positions, and rebalances. Returns accrue to the value of that token rather than being collected venue by venue.

Vaults do for decentralized finance what collective investment vehicles have long done elsewhere: they convert a fragmented, specialist market into a product that a non-specialist can hold, understand, and account for. The depositor's relationship is with a single instrument and a single manager rather than with a dozen protocols.

## Three dominant families

**Lending vaults** take a single asset and distribute it across many isolated lending markets. Curated vaults that allocate stablecoins across Morpho markets, adjusting exposure to collateral types and rates as conditions change, are a canonical example.

**Spread vaults** use leverage to capture interest-rate differentials. The most common structure borrows against collateral on a lending market such as Aave at one rate and deploys the proceeds where the return is higher, retaining the difference.

**Specialized vaults** lend against real receivables, private credit, or crypto entities.

## Delta-neutral by design

K3 Vault strategies seek a return denominated in the asset the depositor already holds and are designed not to add directional exposure to another asset. A bitcoin depositor remains economically exposed to bitcoin; the strategy's objective is additional bitcoin, not a change in directional market exposure.

This property helps make such products suitable for broad distribution. The customer's economic position remains denominated in the deposited asset, the product can be explained clearly, and the return can be shown in the customer's own unit of account. Delta neutrality addresses market direction only; it does not eliminate the strategy's other risks covered in this documentation.

## How the vault market is organized, and who pays for it

Most managed vault products today divide the work between two independent parties.

**Vault infrastructure providers** build and operate the smart contracts, accounting, deposit and redemption rails, reporting, and integrations. They do not decide where the capital is deployed.

**Strategists**—also referred to as vault operators, managers, or curators—set the mandate, select venues, size positions, and execute day to day. They do not own the rails on which they operate.

The division has genuine merit. Each party specializes in what it does best. A capable strategist can launch on proven infrastructure without writing a vault from scratch, and an infrastructure provider can amortize its engineering and security investment across many strategists. K3 Capital has operated on exactly this basis: as strategist and day-to-day manager, it [runs live strategies today](https://app.k3.capital/earn) that are delivered through several partners' infrastructure.

The division also has a cost, and that cost falls on the end user. In a two-entity product the depositor is typically charged a management or platform fee by the infrastructure provider, plus a performance fee—and frequently a further management fee—by the strategist. Two fee schedules stack on the same capital. Two sets of terms govern the same product. Two teams must coordinate every change, and neither owns the customer journey end to end.

## Why K3 built its own infrastructure

### Removing the second layer

K3 Vaults exist to remove the second layer. By building and operating its own vault infrastructure, K3 brings the accounting, deposit and redemption processing, integration surface, and active management under one roof. There is no separate infrastructure fee because there is no separate infrastructure provider, and there is a single counterparty responsible for both the rails and the capital.

K3 Capital does not claim that this model always results in lower total fees than every alternative arrangement; any such comparison depends on the complete terms of the specific products being compared. The claim is narrower and structural: one fee schedule, one set of terms, and one accountable operator in place of two.

### For integrators

Exchanges, wallets, fintechs, and other distribution partners obtain one integration into K3-managed strategies. The deposit → report → withdraw journey is consistent across vaults, and a single counterparty is responsible for both the infrastructure and management of the capital. A partner that has integrated one K3 Vault can reuse the same integration pattern for subsequent supported vaults.

### For token issuers and protocols

Issuers of wrapped assets, pre-deposit vaults, yield-bearing stablecoins, or staking tokens that want a managed product built on their asset receive accounting, deposit and redemption logic, integrations, and an experienced manager as a single package, rather than assembling these components from multiple vendors and coordinating among them.

## What "one-stop" means in practice

A K3 Vault bundles the following in a single deployment:

- **Deposits and redemptions.** A consistent request → settle → claim pattern in both directions, with pending request assets and settled claim reserves held in a dedicated custody contract.
- **Accounting.** Every settlement cycle is priced from one net asset value (NAV) and one supply snapshot, recorded on-chain.
- **Integrations.** Standard tokenized-vault interfaces (ERC-7540, ERC-4626, and ERC-7575), a public subgraph for indexed data, and a permissionless settlement preview so anyone can check the arithmetic.
- **Active management.** K3 allocates and rebalances under the vault's mandate, with institutional key management, protocol- and action-level policy controls, and continuous automated monitoring backed by an on-call response team.
- **Tailored product design.** Vaults are designed to the requirements of networks, fintechs, neobanks, centralized exchanges, and other businesses operating Earn or yield programs. Currency, mandate, risk profile, ecosystem-development objectives, liquidity terms, and user type are configurable at the product level.

Continue to the [Product Overview](cbbtc-vault.md).
