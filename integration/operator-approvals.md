# Operator approvals

ERC-7540 operator semantics as implemented in `EpochStagedERC7540Vault`.

## The functions

```text
function setOperator(address operator, bool approved) external returns (bool);
function isOperator(address controller, address operator) external view returns (bool status);
```

- `setOperator` sets **the caller** as `controller` (you approve someone to act for you) and emits `OperatorSet(controller, operator, approved)`.
- Approval is a flat boolean per `(controller, operator)` pair — no expiries, no per-request approvals.

## What an operator can do

| Action | Operator of `owner` | Operator of `controller` |
|---|---|---|
| `requestDeposit(assets, controller, owner)` | ✅ (`controller` must equal `owner`) | — (caller isn't `owner`; deposit pulls from `owner`) |
| `requestRedeem(shares, controller, owner)` | ✅ (`controller` must equal `owner`) | ✅ (share owner path) |
| `deposit/mint(…, controller)` / `withdraw/redeem(…, controller)` claims on the controller queue | ✅ via `_isAuthorized` | ✅ |

Precise checks (from `EpochStagedERC7540Vault.sol`):

- `requestDeposit`: caller must be `owner`, or `isOperator(owner, caller)` with `controller == owner`, or `owner` with `isOperator(controller, caller)`.
- `requestRedeem`: caller must be `owner` with `controller == owner` or `isOperator(controller, caller)`; otherwise (caller ≠ owner) `isOperator(owner, caller)` must hold and `controller` must equal `owner` — or the ERC-20 share allowance path is used and spent.
- Claim functions (`deposit/mint/withdraw/redeem` with explicit `controller`): `caller == controller || isOperator(controller, caller)`.

## What an operator cannot do

- Change or revoke other approvals.
- Bypass the controller scoping above (e.g. an operator of `owner` cannot route a deposit request to a third controller).
- Access user funds outside this vault's request/claim flow — approvals here are not ERC-20 allowances.

## UI guidance

- Show pending operator approvals per user (`isOperator` per candidate address; enumerate from the `OperatorSet` event via the [subgraph](subgraph.md) if you need a full list — note this deployment's subgraph does not index `OperatorSet`, so event logs on the vault address are the source).
- Warn clearly: approving an operator lets them commit your assets into deposit requests and act on your claim queues.
