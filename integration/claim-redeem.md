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

The claim-time conversion factor is fixed by the epoch's settlement (`EpochSettled` event / `epochPrices` in the [subgraph](subgraph.md)): `assets = shares × nav / supply` at the snapshots. For a UI, compute the expected proceeds off-chain from those emitted snapshots rather than from live `totalAssets()/totalSupply()` — the vault's live conversion rate only reflects settled state and can change at the next settlement.

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
