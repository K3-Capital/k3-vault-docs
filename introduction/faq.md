# FAQ

**Is a deposit or redemption instant?**
No. This is a fully async ERC-7540 vault. Requests queue into epochs; they become claimable only after the epoch is settled by the smart account. `previewDeposit`/`previewMint`/`previewWithdraw`/`previewRedeem` revert by design.

**When do I get my shares/assets?**
After the epoch containing your request is closed and settled. Check `claimableDepositRequest`/`claimableRedeemRequest` (and the [subgraph](../integration/subgraph.md) for history). Only the oldest settled epoch in your queue is claimable at a time.

**What price will I get?**
The price is fixed at settlement: deposit shares = `depositAssets × (supply+1) / (nav+1)` at the settlement snapshots (floor rounding, OZ virtual offset zero); redeem assets = `redeemShares × (nav+1) / (supply+1)` (floor rounding). Use the permissionless `previewSettlement(nav, supply, deposits, redeems)` to simulate. Historical prices: `epochPrices` in the subgraph.

**What is `requestId`?**
The id of the epoch the request joined — `requestId == epochId`. It is used in every pending/claimable view.

**Can someone else manage my requests?**
Yes, if you approve them with `setOperator(operator, approved)`. Operators can request deposits/claims on your behalf within the [ERC-7540 operator rules](../integration/operator-approvals.md). For redeem requests, an ERC-20 share allowance also suffices.

**Can the vault be paused?**
Yes. The owner or a `PAUSER_ROLE` holder can pause, which blocks `requestDeposit` and `requestRedeem` but not claims. There is no on-chain timelock or multisig gating this on the current cbBTC deployment — see [trust assumptions](../architecture/security-assumptions.md).

**Does the vault charge fees? How does the strategy earn yield?**
The smart account supplies the NAV snapshot at settlement, so post-fee value accrues into the published share price. The off-chain strategy, fee model, and yield sources are **not documented here**; these docs cover on-chain behavior only.

**Where is the full technical spec?**
[`ARCHITECTURE.md`](https://github.com/K3-Capital/k3-vault-contracts/blob/main/ARCHITECTURE.md) in the contracts repository is canonical for protocol internals; this site is a condensed, derived view.
