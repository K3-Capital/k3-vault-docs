# Events

Events indexed by the [subgraph](../integration/subgraph.md) and/or emitted by the vault. ABI fragments in TypeScript tuple form for wagmi's `watchContractEvent`/`getLogs`.

## DepositRequest

```ts
{
  type: "event", name: "DepositRequest",
  inputs: [
    { name: "controller", type: "address", indexed: true },
    { name: "owner", type: "address", indexed: true },
    { name: "requestId", type: "uint256", indexed: true },
    { name: "sender", type: "address", indexed: false },
    { name: "assets", type: "uint256", indexed: false },
  ],
} as const
```

Emitted by `requestDeposit`. `assets` is the amount actually received into Staging. `requestId` = the epoch joined.

## RedeemRequest

```ts
{
  type: "event", name: "RedeemRequest",
  inputs: [
    { name: "controller", type: "address", indexed: true },
    { name: "owner", type: "address", indexed: true },
    { name: "requestId", type: "uint256", indexed: true },
    { name: "sender", type: "address", indexed: false },
    { name: "shares", type: "uint256", indexed: false },
  ],
} as const
```

Emitted by `requestRedeem`.

## OperatorSet

```ts
{
  type: "event", name: "OperatorSet",
  inputs: [
    { name: "controller", type: "address", indexed: true },
    { name: "operator", type: "address", indexed: true },
    { name: "approved", type: "bool", indexed: false },
  ],
} as const
```

**Not indexed by the current subgraph** — read logs from the vault address for approval history.

## EpochClosed

```ts
{
  type: "event", name: "EpochClosed",
  inputs: [
    { name: "epochId", type: "uint40", indexed: true },
    { name: "nextEpochId", type: "uint40", indexed: true },
    { name: "totalDepositAssets", type: "uint256", indexed: false },
    { name: "totalRedeemShares", type: "uint256", indexed: false },
  ],
} as const
```

The epoch's totals are final at this point; `nextEpochId` is now open for requests.

## EpochSettled

```ts
{
  type: "event", name: "EpochSettled",
  inputs: [
    { name: "epochId", type: "uint40", indexed: true },
    { name: "navSnapshot", type: "uint256", indexed: false },
    { name: "totalSupplySnapshot", type: "uint256", indexed: false },
    { name: "totalDepositAssets", type: "uint256", indexed: false },
    { name: "totalRedeemShares", type: "uint256", indexed: false },
    { name: "depositSharesMinted", type: "uint256", indexed: false },
    { name: "redeemAssetsReserved", type: "uint256", indexed: false },
  ],
} as const
```

The authoritative price record: `sharePrice = (navSnapshot + 1) / (totalSupplySnapshot + 1)`, exactly what the [subgraph](../integration/subgraph.md) stores in `EpochPrice`.

## SmartAccountSet

```ts
{
  type: "event", name: "SmartAccountSet",
  inputs: [{ name: "smartAccount", type: "address", indexed: false }],
} as const
```

Emitted at `initialize` and on `setSmartAccount` (owner, only when no frozen epoch).

## Standard ERC-4626/ERC-20 events

`Deposit(sender, receiver, assets, shares)` — emitted by deposit claims; `Withdraw(sender, receiver, controller, assets, shares)` — emitted by redeem claims; plus `Transfer`, `Approval`, `Paused`, `Unpaused`, `OwnershipTransferStarted/Transferred`, `RoleGranted/RoleRevoked` (OpenZeppelin signatures).

Note: `Deposit`/`Withdraw` here mean **claims**, not the request step — request-side activity is in `DepositRequest`/`RedeemRequest`.
