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
| `deposit/mint(…, controller)` / `withdraw/redeem(…, controller)` claims on the controller queue | ⚠️ only when `controller` *is* `owner` (see below) | ✅ |

**The claim column needs care.** The claim functions check `_isAuthorized(caller, controller)` — i.e. `caller == controller || isOperator(controller, caller)`. They do **not** consult the owner at all. So being an operator of `owner` authorizes you to claim a queue only when that queue's `controller` *is* `owner` (or you are that controller's separately-approved operator). It does **not** let an owner-operator claim some unrelated controller's queue. If you approve an operator, they act on *your* controller queues, not anyone else's.

Precise checks (from `EpochStagedERC7540Vault.sol`):

- `requestDeposit`: caller must be `owner`, or `isOperator(owner, caller)` with `controller == owner`, or `owner` with `isOperator(controller, caller)`.
- `requestRedeem`: caller must be `owner` with `controller == owner` or `isOperator(controller, caller)`; otherwise (caller ≠ owner) `isOperator(owner, caller)` must hold and `controller` must equal `owner` — or the ERC-20 share allowance path is used and spent.
- Claim functions (`deposit/mint/withdraw/redeem` with explicit `controller`): `caller == controller || isOperator(controller, caller)`.

## Receiver redirection (claims can be redirected)

For all four claim functions, once the caller is authorized on a controller queue, the contract lets them name **any** `receiver` address — including one the controller never approved:

```text
deposit(assets, receiver, controller)   → mints/transfers shares to `receiver`
mint(shares, receiver, controller)      → mints/transfers to `receiver`
withdraw(assets, receiver, controller)  → releases assets to `receiver`
redeem(shares, receiver, controller)    → releases assets to `receiver`
```

`EpochStagedERC7540Vault.sol:478-597` verifies `_isAuthorized(_msgSender(), controller)` only; the `receiver` argument is passed straight through to the Staging transfer. **A controller-approved operator can therefore redirect the claim proceeds of your queue to any address.** There is no on-chain whitelist or additional approval for the destination. This is by design (the claim "owner" for ERC-7540 is the caller) — build your UI and risk model around it, and keep operator approvals tight.

## What an operator cannot do

- Change or revoke other approvals (`setOperator` operates on the caller's own controller).
- Bypass the controller scoping above (e.g. an operator of `owner` cannot route a deposit request to a third controller, and cannot claim an unrelated controller's queue).
- Access user funds outside this vault's request/claim flow — approvals here are not ERC-20 allowances.

## UI guidance

- Show pending operator approvals per user (`isOperator` per candidate address; enumerate from the `OperatorSet` event via the [subgraph](subgraph.md) if you need a full list — note this deployment's subgraph does not index `OperatorSet`, so event logs on the vault address are the source).
- Warn clearly: approving an operator lets them commit your assets into deposit requests and act on your claim queues.
