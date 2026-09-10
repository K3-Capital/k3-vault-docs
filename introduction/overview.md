# Overview

The K3 cbBTC Vault is a **fully asynchronous** vault: neither deposits nor redemptions convert at the moment you request them. Instead, requests are collected into **epochs** (batches), and each batch is priced and settled on a cadence by K3's vault operator. This is what makes the vault simple and protects existing holders from short-term price or liquidity moves.

## The async epoch model in plain terms

1. **You request.** A depositor transfers cbBTC into the vault's custody, or a redeemer transfers vault shares into custody. Your request joins the batch (epoch) that is currently open.
2. **K3 batches (closes) the epoch.** When K3 closes the batch, the set of requests in it is frozen and a new batch opens for later requests.
3. **K3 prices and settles the epoch.** The batch is settled against a published account value (NAV snapshot), which determines how many shares incoming depositors receive and how many cbBTC outgoing redeemers receive.
4. **You claim.** Once your batch is settled, depositors claim vault shares and redeemers claim cbBTC — at the price that was set at settlement.

Because conversions happen only at settlement, the vault's share price is set deterministically per batch and the value each user receives is fixed when their batch settles.

## What this means for you

- **No trade-time slippage between existing holders.** Inflows and outflows are netted per batch and priced at a single account-value snapshot, so short-term price moves at the moment of request are not passed on to existing holders.
- **Deterministic, auditable pricing.** Every settlement publishes its account value, supply snapshot, the shares created, and the assets reserved — a complete, checkable price history on-chain.
- **Standard, well-understood surface.** The vault uses industry-standard tokenized-vault interfaces, and the code has been independently reviewed.
- **No protocol-level fees.** The vault itself does not charge fees.

## Who operates the vault

K3 Capital operates the vault. The operating authority is a dedicated smart account. For the specific controls and the security model behind them — including who can pause, upgrade, or set values — see [Security & trust assumptions](../architecture/security-assumptions.md).

Next: [How it works](how-it-works.md) for the end-to-end lifecycle, [Your money & getting it back](money-flow.md) for where funds are held and how they move, or the [integration guide](../integration/quickstart.md) for code.
