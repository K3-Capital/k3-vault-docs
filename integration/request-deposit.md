# Requesting a deposit

## `requestDeposit`

```text
function requestDeposit(uint256 assets, address controller, address owner)
    external returns (uint256 requestId);
```

- **Moves funds**: pulls exactly `assets` cbBTC from `owner` into the Staging contract via `safeTransferFrom` — approve the vault for the underlying token first. The credited amount is the **balance delta actually received**, so fee-on-transfer tokens would credit net amounts (the cbBTC vault uses a plain token).
- **Queues** the assets under `controller` in the currently open epoch and returns `requestId == currentEpochId()`.
- Emits `DepositRequest(controller, owner, requestId, sender, received)`.
- Reverts: `SA__ZeroAmount` (assets == 0 or 0 received), `SA__ZeroAddress`, `SA__NotAuthorized` (see below), and `EnforcedPause` while the wrapper is paused (`whenNotPaused`). Note: a **frozen** epoch does **not** block deposit requests — requests land in the newly opened epoch (`currentEpochId`) even while another epoch is closed-but-unsettled. `SA__FrozenEpochPending` is raised by `closeEpoch`, `setSmartAccount`, and asset `rescue` — not by request submission.
- Guarded by `nonReentrant`.

## Authorization matrix

| Caller | Condition |
|---|---|
| `owner` with `controller == owner` | always |
| Approved operator of `owner` (`isOperator(owner, caller)`) | `controller` must equal `owner` |
| `owner` acting on a different `controller` | allowed only if `isOperator(controller, caller)` |

## Notes for integrators

- **`requestId` is the epoch id.** Use it in `pendingDepositRequest(requestId, controller)` and `claimableDepositRequest(requestId, controller)`. Subsequent requests in later epochs get different ids; requests to the same epoch aggregate per controller.
- While an epoch is open, `pendingDepositRequest` returns the controller's queued total for that epoch (0 after settlement); after settlement the same request moves to `claimableDepositRequest`.
- You cannot cancel a request on-chain; the assets are committed until settlement and claim.
- There is no cap on deposit size per epoch; the NAV math is size-independent.

## wagmi example

```ts
import { useWriteContract, useReadContract } from "wagmi";

const VAULT = "0x009c02a73706a68e0aE0209235408206E4F53709" as const;

export function useRequestDeposit() {
  const { writeContractAsync } = useWriteContract();
  return (assets: bigint, user: `0x${string}`) =>
    writeContractAsync({
      address: VAULT,
      abi: [ // fragment; full ABI in reference/interfaces.md
        {
          type: "function", name: "requestDeposit", stateMutability: "nonpayable",
          inputs: [
            { name: "assets", type: "uint256" },
            { name: "controller", type: "address" },
            { name: "owner", type: "address" },
          ],
          outputs: [{ name: "requestId", type: "uint256" }],
        },
      ],
      functionName: "requestDeposit",
      args: [assets, user, user],
    });
}

export function usePendingDeposit(requestId: bigint, controller: `0x${string}`) {
  return useReadContract({
    address: VAULT,
    abi: [{
      type: "function", name: "pendingDepositRequest", stateMutability: "view",
      inputs: [{ name: "requestId", type: "uint256" }, { name: "controller", type: "address" }],
      outputs: [{ type: "uint256" }],
    }],
    functionName: "pendingDepositRequest",
    args: [requestId, controller],
  });
}
```
