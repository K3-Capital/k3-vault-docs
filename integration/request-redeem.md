# Requesting a redeem

## `requestRedeem`

```text
function requestRedeem(uint256 shares, address controller, address owner)
    external returns (uint256 requestId);
```

- **Moves funds**: escrows `shares` of the vault token (`k3cbBTC`) from `owner` into Staging via `_transfer`. Approving the vault as ERC-20 spender is **not** required when `owner` calls for themselves; it *is* required for an allowance-based caller (below).
- **Queues** the shares under `controller` in the open epoch; returns `requestId == currentEpochId()`.
- Emits `RedeemRequest(controller, owner, requestId, sender, shares)`.
- Reverts: `SA__ZeroAmount`, `SA__ZeroAddress`, `SA__NotAuthorized`. Blocked while paused (`whenNotPaused`).

## Authorization paths

| Caller | Requirement |
|---|---|
| `owner == controller` | none (direct) |
| `owner` acting for another `controller` | `isOperator(controller, caller)` |
| Third party acting for `owner` | `isOperator(owner, caller)` **or** spend the ERC-20 share allowance (`_spendAllowance(owner, caller, shares)`) |

The allowance path means a plain ERC-4626-style flow works: approve the vault for `k3cbBTC`, then have anyone call `requestRedeem(shares, owner, owner)`... note `controller` must then equal `owner` (or the caller must be that controller's operator).

## Notes for integrators

- The redeem request is denominated in **shares**, not assets. The assets you eventually receive depend on the settlement NAV.
- `pendingRedeemRequest(requestId, controller)` returns the queued shares (0 after settlement); `claimableRedeemRequest` takes over after settlement.
- Requests cannot be cancelled on-chain; shares stay escrowed in Staging until settlement and claim.
- While an epoch is frozen-but-unsettled, new requests land in the next epoch (it is already open).

## Example

```ts
// a. capture the open epoch — the request will join it (requestId == epochId).
//    currentEpochId returns uint40 (viem infers `number`); claim views take
//    uint256, so wrap in BigInt to keep the requestId a `bigint`.
const requestId = BigInt(await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "currentEpochId",
}));

// b. request: escrows vault shares in Staging
const balance = await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "balanceOf", args: [user],
});
const txHash = await walletClient.writeContract({
  address: VAULT, abi: vaultAbi, functionName: "requestRedeem",
  args: [balance / 2n, user, user],
});
await publicClient.waitForTransactionReceipt({ hash: txHash });

// c. settlement pending? check pending vs claimable
const pending = await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "pendingRedeemRequest",
  args: [requestId, user],
});
```
