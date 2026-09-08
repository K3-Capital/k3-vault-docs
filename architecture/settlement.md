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

For the first-ever settlement `S = 0` is allowed (only `N = 0` with non-zero supply is invalid). The `+1` virtual offsets keep the ratios well-defined: with `S = 0`, `depositShares = D × 1 / (N+1) = D/(N+1)` — **not** an identity conversion. Only the additional condition `N + 1 == D + 1` (i.e. `N == D`) would make `D/(N+1)` equal 1 share per asset. In general, depositors into a zero-supply epoch receive `floor(D/(N+1))` shares, which can be well below their `D` assets when the first NAV is large.

## Zero-share deposit outcomes (dust is lost, not reverted)

If `depositShares` computes to 0 for an epoch (deposit dust relative to the NAV/supply snapshots), the minted share total is 0. In that case claiming is **consume-and-lose**: a full `deposit(assets, receiver, controller)` validates the **asset** amount, not the output share amount, then advances the claim and pays out **zero shares** — it does **not** revert. From `EpochStagedERC7540Vault.sol:525-565`, `_consumeDepositClaim` rejects `assets == 0` but accepts `shares == 0`, transfers nothing, and advances the claim when the full asset amount is consumed.

Concretely, with `depositSharesMinted = 0`:

- `claimableDepositRequest` returns the queued **assets** (they remain claimable as assets).
- `deposit(assets, …)` with those assets returns `0` shares and advances the claim — the deposited assets convert to zero shares and the claim is consumed.
- `mint(0, …)` reverts `SA__ZeroAmount` (it validates its `shares` input), but calling it does not help recover the dust.

Integrators should surface `previewSettlement` results **before** users send deposits of tiny amounts relative to the epoch NAV, and warn that a floor-to-zero conversion is a total loss rather than a refund.

## Previewing

`previewSettlement(navSnapshot, totalSupplySnapshot, totalDepositAssets, totalRedeemShares) → (depositShares, redeemAssets)` is permissionless, pure over its inputs, and advertised via ERC-165 (`IEpochSettlementPreview`). Anyone can verify a settlement's math before or after it happens — against the snapshots actually used, which are emitted in `EpochSettled`.
