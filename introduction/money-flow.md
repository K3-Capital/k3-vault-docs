# Your money & getting it back

This page explains, in plain terms, how money moves into and out of the K3 cbBTC Vault and when you can get it back. It intentionally avoids contract-level detail so it reads well for a business audience; the technical mechanics live in the [Architecture](../architecture/system-design.md) section and the [Integration Guide](../integration/quickstart.md).

## Depositing: how your cbBTC becomes vault shares

When you deposit, your cbBTC follows a simple path:

1. **You request a deposit.** Your cbBTC moves into the vault's custody — a dedicated holding contract called the *Staging* contract. It is now held by the vault, out of your wallet.
2. **Your request joins a batch (epoch).** Requests are grouped in batches so they can be priced together.
3. **K3 closes and settles the batch.** The whole batch is valued and priced at once. Based on that price, the system works out how many vault shares your cbBTC is worth and records that for you.
4. **You claim your shares.** Once the batch is settled, you call the claim step and your vault shares are transferred to you.

In short: your cbBTC sits in the vault's custody while it waits to be priced, and your shares become available after your batch settles.

## Redeeming: how your shares become cbBTC again

Redemption mirrors the deposit flow:

1. **You request a redemption.** Your vault shares move into the same *Staging* custody contract.
2. **Your request joins a batch** and is frozen with it.
3. **K3 closes and settles the batch.** The batch is priced, and the system reserves the cbBTC your shares are worth.
4. **You claim your cbBTC.** Once the batch is settled, you call the claim step and the cbBTC is transferred back to you.

## Where your money is at each step

| Stage | What happens to your money |
|---|---|
| While you request | Moved from your wallet into the vault's *Staging* custody contract. Still yours, held by the vault. |
| While the batch is open/being priced | Held in *Staging*, waiting to be priced with the rest of its batch. |
| After the batch is settled but before you claim | Priced and recorded as claimable — depositors are owed shares, redeemers are owed cbBTC (the reserved cbBTC sits in *Staging* until claimed). |
| After you claim | Delivered to your wallet as vault shares (deposit) or cbBTC (redeem). |

At each step from request to claim, your pending assets or shares — and the cbBTC reserved for a redeemer — sit in the vault's *Staging* custody contract until settlement and claim. On top of that closed reserve, the vault's residual balance above the redemption reserve is transferred to the vault's smart account after each settlement; that owned-and-operated capital and what it is worth is managed off-chain.

You can observe on-chain where funds are held at each step, because the vault's transfers and balances are recorded on-chain, and each settlement publishes its value and price on-chain. That published value is set by the operator who runs the smart account — there is no on-chain price feed cross-checking it — so it is an operator-published NAV rather than an independently verified one. What is independently verifiable is the price you are given: it is fixed and recorded on-chain when your batch settles.

## When you get your money back

- **Not instant.** This is the key property of the vault: no deposit or redemption converts the moment you request it.
- **After your batch settles.** Your shares (on deposit) or cbBTC (on redeem) become claimable once the batch your request joined has been closed and settled by K3.
- **Set at settlement.** The price you receive is fixed and published when your batch is settled, not when you requested and not when you claim.

For the technical details of custody, the exact settlement formula, and the security controls around it, see [System design](../architecture/system-design.md), [Epoch lifecycle & settlement](../architecture/settlement.md), and [Security & trust assumptions](../architecture/security-assumptions.md).
