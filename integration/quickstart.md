# Quickstart

Integrate the K3 cbBTC Vault (`k3cbBTC`, Ethereum mainnet) into a frontend in ~10 minutes. All addresses come from the [address reference](../reference/addresses.md); every snippet below uses the deployed proxy address.

```text
Vault proxy:      0x009c02a73706a68e0aE0209235408206E4F53709
Underlying cbBTC: 0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf
```

## 1. Add the contract ABI fragments

The full human-readable ABI is in [`reference/interfaces.md`](../reference/interfaces.md). Minimal fragments for a deposit flow:

```ts
import { createPublicClient, createWalletClient, custom, http, parseAbi, parseUnits } from "viem";
import { mainnet } from "viem/chains";

const VAULT = "0x009c02a73706a68e0aE0209235408206E4F53709";

export const vaultAbi = parseAbi([
  "function requestDeposit(uint256 assets, address controller, address owner) returns (uint256 requestId)",
  "function pendingDepositRequest(uint256 requestId, address controller) view returns (uint256)",
  "function claimableDepositRequest(uint256 requestId, address controller) view returns (uint256)",
  "function deposit(uint256 assets, address receiver, address controller) returns (uint256 shares)",
  "function requestRedeem(uint256 shares, address controller, address owner) returns (uint256 requestId)",
  "function pendingRedeemRequest(uint256 requestId, address controller) view returns (uint256)",
  "function claimableRedeemRequest(uint256 requestId, address controller) view returns (uint256)",
  "function redeem(uint256 shares, address receiver, address controller) returns (uint256 assets)",
  "function withdraw(uint256 assets, address receiver, address controller) returns (uint256 shares)",
  "function asset() view returns (address)",
  "function balanceOf(address account) view returns (uint256)",
  "function currentEpochId() view returns (uint40)",
  "function frozenEpochId() view returns (uint40)",
]);

export const publicClient = createPublicClient({ chain: mainnet, transport: http() });

// Wallet client from the browser's injected provider (e.g. MetaMask et al.) —
// no private key is ever embedded in browser code. The signer is resolved from
// the connected wallet at call time. (`window.ethereum` is the EIP-1193 provider;
// in a wagmi/React app use the connector instead: const walletClient = useWalletClient().data.)
export const walletClient = createWalletClient({ chain: mainnet, transport: custom((window as any).ethereum) });
// `user` (the signer) and `receiver` come from your connected wallet — e.g. from
// wagmi's useAccount().address — NOT a private key. Replace the placeholders below:
const user: `0x${string}` = "0x...";          // the connected signer's address
const receiver: `0x${string}` = "0x...";      // whoever receives claims (default: user)
```

## 2. Deposit flow (deposit request → wait for settlement → claim)

```ts
// a. the request joins the currently open epoch — capture it before requesting.
//    currentEpochId returns uint40 (viem infers `number`); claim views take
//    uint256, so wrap in BigInt to keep the requestId a `bigint`.
const requestId = BigInt(await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "currentEpochId",
}));

// b. request: transfers cbBTC into the Staging contract, queues in the open epoch
//    (writeContract returns the transaction hash, not the requestId)
const txHash = await walletClient.writeContract({
  account: user, // connected signer (injected provider; no key in code)
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
    account: user, // connected signer (injected provider; no key in code)
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
  account: user, // connected signer (injected provider; no key in code)
  address: VAULT, abi: vaultAbi, functionName: "requestRedeem",
  args: [shareAmount, user, user],
});
await publicClient.waitForTransactionReceipt({ hash: txHash });

// c. after settlement, claim the assets
const claimableShares = BigInt(await publicClient.readContract({
  address: VAULT, abi: vaultAbi, functionName: "claimableRedeemRequest",
  args: [requestId, user],
}));
// claimableRedeemRequest returns SHARES; redeem(amount, ...)) takes shares.
//(Do NOT pass shares to withdraw, whose first argument is assets.)
// claimableShares > 0th only after the epoch settles; before settlement it is
// zero, and redeem(0, ...) would revert SA__ZeroAmount — guard/poll first.
// (wave watchers for the EpochSettled event or poll this view until it is non-zero.)
if (claimableShares > 0n) {
  await walletClient.writeContract({
    account: user, // connected signer (injected provider; no key in code)
    address: VAULT, abi: vaultAbi, functionName: "redeem",
    args: [claimableShares, receiver, user],
  });
}
```

## 4. Watch settlement progress off-chain

Index data (epochs, prices, request history) is available from the public subgraph — see [Subgraph](subgraph.md):

```ts
// SUBGRAPH_URL: public endpoint documented on the Subgraph page
const SUBGRAPH_URL = "https://api.goldsky.com/api/public/project_cmr0amyn6hg6t01yg8uf1cgrv/subgraphs/erc7540-mainnet/1.0.0/gn";
const res = await fetch(SUBGRAPH_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `{ epochPrices(first: 5, orderBy: epochId, orderDirection: desc) {
      epochId navSnapshot totalSupplySnapshot sharePrice blockTimestamp } }`,
  }),
});
```

## 5. Handle the errors

Vault-specific failures surface as `SA__*` custom errors; standard OpenZeppelin/token errors (`EnforcedPause`, `ERC20InsufficientAllowance`, `ERC20InsufficientBalance`, underlying cbBTC transfer reverts) are also possible. Map them to user messages with the [error reference](errors.md).
