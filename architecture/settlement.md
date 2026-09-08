# Epoch lifecycle & settlement

Condensed from `ARCHITECTURE.md` §8 (canonical). All formulas below are exactly what `previewSettlement` computes on-chain.

## NAV definition

At settlement the smart account submits a `navSnapshot`: the total value of the vault's assets underlying the share supply **after** the epoch's inflows/outflows are accounted for. There is no on-chain oracle or price feed — the smart account is the pricing authority (see [trust assumptions](security-assumptions.md)). `settleEpoch` reverts with `SA__InvalidNavSnapshot` if `nav == 0` while supply is non-zero, or if `redeemShares > totalSupplySnapshot`.

## Settlement math

With `S = totalSupplySnapshot`, `N = navSnapshot`, `D = epoch.totalDepositAssets`, `R = epoch.totalRedeemShares` (OZ virtual offset = 0):

```text
depositShares  = D × (S+1) / (N+1)   floor
redeemAssets   = R × (N+1) / (S+1)   floor
```

`_virtualMulDiv` computes this without overflow even for max-uint256 snapshots (special-casing numerator/denominator == `type(uint256).max` with the exact `floor(x·(n+1)/(d+1))` semantics including remainder carry).

Then:

1. If `D > 0`, all `D` deposit assets move Staging → vault.
2. If the vault's asset balance < `redeemAssets`, settlement reverts (`SA__InsufficientSettlementAssets`) — the NAV must be covered by real assets.
3. `redeemAssets` move vault → Staging as the redemption reserve; `redeemClaimReserves += redeemAssets`.
4. `R` shares are burned in Staging; `depositShares` minted in Staging.
5. `activeAssets = N − redeemAssets + D`; the epoch is marked settled; the frozen flag clears.
6. Any remaining asset balance on the vault (`assetSurplus()`) is swept to the smart account — this is where off-chain accounting differences and any fees surface on-chain.

`EpochSettled(epochId, navSnapshot, totalSupplySnapshot, totalDepositAssets, totalRedeemShares, depositSharesMinted, redeemAssetsReserved)` is emitted and indexed by the [subgraph](../integration/subgraph.md) as `epochPrices`.

## Settling with zero supply

For the first-ever settlement `S = 0` is allowed (only `N = 0` with non-zero supply is invalid): conversions collapse to the identity because `(0+1)` denominators keep the ratios well-defined — e.g. `D × (S+1)/(N+1)` with `S=0` gives `D/(N+1)`, and the offset guarantees `x=0` maps to 0 shares rather than reverting.

## Zero-share deposit outcomes

If `depositShares` computes to 0 (deposit dust relative to NAV), the depositor's claimable share amount is 0: `deposit()` reverts `SA__ZeroAmount` on the share side, and the assets remain claimable as `claimableDepositRequest = assets` until the epoch's claims drain. Integrators should surface `previewSettlement` results before users request deposits of tiny amounts.

## Previewing

`previewSettlement(navSnapshot, totalSupplySnapshot, totalDepositAssets, totalRedeemShares) → (depositShares, redeemAssets)` is permissionless, pure over its inputs, and advertised via ERC-165 (`IEpochSettlementPreview`). Anyone can verify a settlement's math before or after it happens — against the snapshots actually used, which are emitted in `EpochSettled`.
