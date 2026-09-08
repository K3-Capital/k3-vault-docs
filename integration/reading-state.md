# Reading vault state

All views live on the vault proxy: `0x009c02a73706a68e0aE0209235408206E4F53709` (verified against `EpochStagedERC7540Vault.sol`).

## Epoch state

```text
function currentEpochId() external view returns (uint40);   // epoch that accepts new requests
function frozenEpochId() external view returns (uint40);    // closed but unsettled (0 if none)
function staging() external view returns (address);         // custody contract
```

A request with `requestId == N` is pending while epoch `N` is unsettled and claimable once settled.

## Pending / claimable

```text
function pendingDepositRequest(uint256 requestId, address controller) external view returns (uint256);
function claimableDepositRequest(uint256 requestId, address controller) external view returns (uint256);
function pendingRedeemRequest(uint256 requestId, address controller) external view returns (uint256);
function claimableRedeemRequest(uint256 requestId, address controller) external view returns (uint256);
```

- Pending views return 0 once the epoch settles; claimable views return 0 before settlement. Wire your UI to switch views on `epochPrice`/`EpochSettled` availability (see the [subgraph](subgraph.md)).
- `requestId` must be ≤ `type(uint40).max`, else `SA__InvalidRequestId` — in practice always true for event-derived ids.

## ERC-4626 surface — async semantics

```text
function totalAssets() external view returns (uint256);       // = activeAssets, settled state only
function asset() external view returns (address);             // cbBTC
function balanceOf(address) external view returns (uint256);  // k3cbBTC shares
function maxDeposit(address controller) external view returns (uint256);  // claimable assets (oldest settled epoch)
function maxMint(address controller) external view returns (uint256);     // shares those assets convert to
function maxWithdraw(address controller) external view returns (uint256);// assets for claimable shares
function maxRedeem(address controller) external view returns (uint256);  // claimable shares
function previewDeposit(uint256) external view returns (uint256); // ┐
function previewMint(uint256) external view returns (uint256);    // │ revert SA__AsyncOnly
function previewWithdraw(uint256) external view returns (uint256);// │ (async-only vault by design)
function previewRedeem(uint256) external view returns (uint256);  // ┘
function convertToAssets(uint256) / convertToShares(uint256)      // live settled-state rate; changes at each settlement
```

`max*` return 0 when nothing is claimable — they are **claim-capacity** views, not deposit caps (there is no deposit cap).

## Pause state

`paused()` (Pausable) — while paused, `requestDeposit` and `requestRedeem` revert `EnforcedPause`; claims and settlement still work.

## ERC-7575 discovery

```text
function share() external view returns (address);          // the vault itself (share token)
function vault(address asset_) external view returns (address); // the vault for cbBTC, else address(0)
```

## Settlement preview

```text
// IEpochSettlementPreview — advertised via ERC-165
function previewSettlement(
    uint256 navSnapshot,
    uint256 totalSupplySnapshot,
    uint256 totalDepositAssets,
    uint256 totalRedeemShares
) external view returns (uint256 depositShares, uint256 redeemAssets);
```

Permissionless; use with the snapshots from an `EpochSettled` event to reproduce exactly what a settlement did, or with hypothetical inputs to simulate one. Reverts `SA__InvalidNavSnapshot` on `nav == 0 && supply != 0` or `redeemShares > supply`.

## Surplus / reserves

```text
function assetSurplus() external view returns (uint256);        // vault's raw cbBTC balance (swept at settlement)
function redeemClaimReserves() external view returns (uint256); // reserved-but-unclaimed redemption assets
```

## Example: full status for a request

```ts
// `requestId` is already known (e.g. from a DepositRequest event or the epoch id).
// currentEpochId/frozenEpochId return uint40 — viem infers `number`; convert to
// bigint so they compare with a bigint requestId.
const current = BigInt(await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "currentEpochId",
}));
const frozen = BigInt(await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "frozenEpochId",
}));

// Classify by request id against the epoch state. `frozenEpochId` is 0 when no
// epoch is closed-but-unsettled — so compare against `currentEpochId` FIRST.
const state =
  requestId === current
    ? "open"                           // request in the epoch accepting new requests
    : frozen !== 0n && requestId === frozen
      ? "closed, awaiting settlement"  // frozen epoch, not yet settled
      : requestId < current
        ? "settled"                    // an older, already-settled epoch
        : "invalid/unknown";           // future id (requestId > current) — never valid

const claimable = await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "claimableDepositRequest",
  args: [requestId, user],
});
```
