# How it works

Here is the full journey of a deposit and a redemption, in plain language. The lifecycle is the same for both: **you request → K3 batches and prices → you claim.** (Developers: the exact contract calls and the mathematical formulas live in the [Architecture](../architecture/settlement.md) and [Integration Guide](../integration/quickstart.md) sections.)

## 1. Request

You ask the vault to either deposit or redeem, and your assets or shares move into the vault's custody.

- **To deposit**, you send some cbBTC to the vault. It enters the vault's custody and your request is queued in the batch (epoch) that is currently open.
- **To redeem**, you send some vault shares to the vault. They enter custody and your request is queued in the open batch too.

Your request joins the batch that is open at the time you make it.

## 2. K3 batches (closes) the epoch

Periodically, K3 closes the currently open batch. Once a batch is closed, no new requests can join it — a fresh batch opens immediately for anyone requesting after that. The set of requests in the closed batch is now frozen and will be priced together.

## 3. K3 prices and settles the epoch

K3 settles the frozen batch against a published account value (NAV snapshot). This settlement:

- works out how many vault shares each depositor in the batch receives, and
- works out how much cbBTC is reserved for each redeemer in the batch.

Every settlement publishes its account value, the supply snapshot, the shares created, and the assets reserved — so the batch's price is recorded on-chain and can be checked by anyone, including external audit teams.

## 4. Claim

Once your batch is settled, your request becomes claimable:

- **Depositors** claim their vault shares.
- **Redeemers** claim their cbBTC.

Claims are processed for each user oldest-batch-first, and you can claim in part or in full once your (oldest) settled batch becomes available.

## The state a batch goes through

Every batch moves through the same three states, one at a time:

1. **Open** — new requests land in it.
2. **Closed / frozen** — no new requests; waiting to be priced.
3. **Settled** — priced; requests in it are now claimable.

At any time, at most one batch is frozen and awaiting settlement, and only one is open. This is what keeps the vault's pricing simple and auditable.

Next: [Your money & getting it back](money-flow.md) to see where funds are held at each step, or [the vault](cbbtc-vault.md) for the live deployment.
