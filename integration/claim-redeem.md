# Claiming a redeem

After settlement, escrowed redemption shares convert into underlying assets, reserved in Staging. Claims are per-controller, oldest settled epoch first.

## Views

```text
function claimableRedeemRequest(uint256 requestId, address controller)
    external view returns (uint256 claimableShares);
```

Returns the **shares** from that epoch still awaiting claim (0 until settled). ERC-4626 helpers at claim time:

- `maxRedeem(controller)` → claimable shares.
- `maxWithdraw(controller)` → the assets those shares convert to.
- `previewWithdraw/previewRedeem` → **revert** (`SA__AsyncOnly`).

## Claim functions

```text
function redeem(uint256 shares, address receiver) external returns (uint256 assets);
function redeem(uint256 shares, address receiver, address controller)
    external returns (uint256 assets);           // ERC-7540 form
function withdraw(uint256 assets, address receiver) external returns (uint256 shares);
function withdraw(uint256 assets, address receiver, address controller) external returns (uint256 shares);
```

- Claims always act on the **oldest claimable epoch** of `controller`.
- `redeem(shares)` → assets with floor rounding. `withdraw(assets)` → shares with **ceil** rounding.
- Assets are paid out from the Staging contract to `receiver`; the epoch's `redeemClaimReserves` decreases accordingly.
- Emits the ERC-4626 `Withdraw(sender, receiver, controller, assets, shares)` event.

## Partial claims

- `redeem(shares)` with `shares < maxRedeem` is safe (floor rounding keeps the remainder claimable).
- `withdraw(assets)` with `assets < maxWithdraw` rounds the implied shares **up**; if the implied shares equal the whole remaining claim while `assets` is less than the remaining assets, the call reverts `SA__PartialClaimConsumesAllInput`. Prefer `redeem()` for partial claims, or claim in full.
- Exceeding the claimable amount reverts `SA__ExceedsClaimable`; nothing claimable reverts `SA__NoClaimableEpoch`.

## Converting between shares and assets

The **per-controller** claim conversion is pro-rata from the epoch's `redeemAssetsReserved` (not directly `nav/supply`). The settlement reserves a total of `redeemAssetsReserved = floor(R × (N+1)/(S+1))`; each controller's share of that reserve is `floor(theirRedeemShares × redeemAssetsReserved / totalRedeemShares)` (`_remainingRedeemAssets`, `EpochStagedERC7540Vault.sol:690-709`). The controller that claims the epoch's **last** unclaimed redeem shares receives the entire remaining reserve — the floor-rounding residual — so per-controller proceeds are claim-order dependent at the edge.

For a UI, get the authoritative numbers from the epoch's emitted `EpochSettled`/`epochPrices` snapshots via the [subgraph](subgraph.md): per-controller assets ≈ `shares × redeemAssetsReserved / totalRedeemShares`, and `maxWithdraw(controller)` gives the exact claimable asset amount for the oldest claimable epoch. Either is more accurate than `shares × nav / supply` on live `totalAssets()/totalSupply()`, which only reflects settled state and can change at the next settlement.

## Example

```ts
const claimableShares = BigInt(await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "claimableRedeemRequest",
  args: [requestId, user],
}));
if (claimableShares === 0n) return "not settled yet";

await walletClient.writeContract({
  address: VAULT, abi: vaultAbi, functionName: "redeem",
  args: [claimableShares, receiver, user], // full claim — no rounding edge cases
});
```
