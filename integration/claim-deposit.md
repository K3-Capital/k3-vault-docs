# Claiming a deposit

After the epoch containing your request settles, the queued assets convert into vault shares. Claims are per-controller, oldest settled epoch first.

## Views

```text
function claimableDepositRequest(uint256 requestId, address controller)
    external view returns (uint256 claimableAssets);
```

Returns the assets from that epoch still awaiting claim (0 until the epoch is settled). Note it is expressed in **assets**; the share amount you will receive depends on the settlement math.

ERC-4626 helpers for the claim moment:

- `maxDeposit(controller)` → claimable assets of the oldest claimable epoch (0 when nothing is claimable).
- `maxMint(controller)` → the shares those assets convert to.
- `previewDeposit/previewMint` → **revert** (`SA__AsyncOnly`); this vault has no synchronous conversion.

## Claim functions

```text
function deposit(uint256 assets, address receiver) external returns (uint256 shares);
function deposit(uint256 assets, address receiver, address controller)
    external returns (uint256 shares);          // ERC-7540 form; caller must be authorized on controller
function mint(uint256 shares, address receiver) external returns (uint256 assets);
function mint(uint256 shares, address receiver, address controller) external returns (uint256 assets);
```

- Claims always act on the **oldest claimable epoch** of `controller` — you do not pass the `requestId` when claiming.
- `deposit(assets)` converts `assets ≤ claimable` to shares with floor rounding; `mint(shares)` takes shares and computes the assets consumed with ceil rounding.
- Shares arrive as ERC-20 transfers from the Staging contract to `receiver`.
- Emits the ERC-4626 `Deposit(sender, receiver, assets, shares)` event.

## Partial claims

Partial claiming is allowed with two sharp edges:

- `deposit(assets)` with `assets < claimable`: shares = floor of the pro-rata amount; the rest stays claimable. Fine.
- `mint(shares)` with `shares < maxMint`: the assets consumed are rounded **up**; if the rounded-up assets equal the entire remaining claim while `shares` is less than the remaining shares, the call reverts with `SA__PartialClaimConsumesAllInput`. In practice: **claim the full remaining output** when the claim is small, or use `deposit()` for partials.
- Any attempt exceeding the claimable amount reverts `SA__ExceedsClaimable(requested, claimable)`; claiming with nothing claimable reverts `SA__NoClaimableEpoch`.

## Example

```ts
const claimableAssets = BigInt(await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "claimableDepositRequest",
  args: [requestId, user],
}));
if (claimableAssets === 0n) return "not settled yet";

await walletClient.writeContract({
  address: VAULT, abi: vaultAbi, functionName: "deposit",
  args: [claimableAssets, receiver, user], // claim in full — simplest and avoids rounding edges
});
```
