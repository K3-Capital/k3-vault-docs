# Quickstart

Integrate the K3 cbBTC Vault (`k3cbBTC`, Ethereum mainnet) into a frontend in ~10 minutes. All addresses come from the [address reference](../reference/addresses.md); every snippet below uses the deployed proxy address.

```text
Vault proxy:      0x009c02a73706a68e0aE0209235408206E4F53709
Underlying cbBTC: 0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf
```

## 1. Add the contract ABI fragments

The full human-readable ABI is in [`reference/interfaces.md`](../reference/interfaces.md). Minimal fragments for a deposit flow:

```ts
import { createPublicClient, http, parseAbi } from "viem";
import { mainnet } from "viem/chains";

const VAULT = "0x009c02a73706a68e0aE0209235408206E4F53709";

export const vaultAbi = parseAbi([
  "function requestDeposit(uint256 assets, address controller, address owner) returns (uint256 requestId)",
  "function pendingDepositRequest(uint256 requestId, address controller) view returns (uint256)",
  "function claimableDepositRequest(uint256 requestId, address controller) view returns (uint256)",
  "function deposit(uint256 assets, address receiver, address controller) returns (uint256 shares)",
  "function requestRedeem(uint256 shares, address controller, address owner) returns (uint256 requestId)",
  "function claimableRedeemRequest(uint256 requestId, address controller) view returns (uint256)",
  "function redeem(uint256 shares, address receiver, address controller) returns (uint256 assets)",
  "function withdraw(uint256 assets, address receiver, address controller) returns (uint256 shares)",
  "function asset() view returns (address)",
  "function currentEpochId() view returns (uint40)",
]);

export const publicClient = createPublicClient({ chain: mainnet, transport: http() });
```

## 2. Deposit flow (deposit request → wait for settlement → claim)

```ts
// a. the request joins the currently open epoch — capture it before requesting
const requestId = await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "currentEpochId",
});

// b. request: transfers cbBTC into the Staging contract, queues in the open epoch
//    (writeContract returns the transaction hash, not the requestId)
const txHash = await walletClient.writeContract({
  address: VAULT, abi: vaultAbi, functionName: "requestDeposit",
  args: [parseUnits("0.1", 8), user, user], // cbBTC has 8 decimals
});
await publicClient.waitForTransactionReceipt({ hash: txHash });

// c. poll the claimable view (claimable only after the epoch settles)
const claimable = await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "claimableDepositRequest",
  args: [requestId, user],
});

// d. claim: mints/transfers vault shares to the receiver
if (claimable > 0n) {
  await walletClient.writeContract({
    address: VAULT, abi: vaultAbi, functionName: "deposit",
    args: [claimable, receiver, user],
  });
}
```

## 3. Redeem flow

```ts
// a. capture the open epoch — the request will join it (requestId == epochId)
let requestId = BigInt(await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "currentEpochId",
}));

// b. request: escrows vault shares in Staging (shareAmount = your k3cbBTC amount)
const shareAmount = await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "balanceOf", args: [user],
});
const txHash = await walletClient.writeContract({
  address: VAULT, abi: vaultAbi, functionName: "requestRedeem",
  args: [shareAmount, user, user],
});
await publicClient.waitForTransactionReceipt({ hash: txHash });

// c. after settlement, claim the assets
const claimable = await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "claimableRedeemRequest",
  args: [requestId, user],
});
// claim by asset amount (shares are implied) or by share amount:
await walletClient.writeContract({
  address: VAULT, abi: vaultAbi, functionName: "withdraw",
  args: [claimable, receiver, user],
});
```

`claimableRedeemRequest` returns **shares**, `withdraw(assets, ...)` takes **assets** — convert with the settlement price or use `redeem(shares, receiver, controller)` directly (see [claiming a redeem](claim-redeem.md)).

## 4. Watch settlement progress off-chain

Index data (epochs, prices, request history) is available from the public subgraph — see [Subgraph](subgraph.md):

```ts
const res = await fetch(SUBGRAPH_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `{ epochPrices(first: 5, orderBy: epochId, orderDirection: desc) {
      epochId navSnapshot totalSupplySnapshot sharePrice blockTimestamp } }`,
  }),
});
```

## 5. Handle the custom errors

All failures surface as `SA__*` custom errors — map them to user messages with the [error reference](errors.md).
