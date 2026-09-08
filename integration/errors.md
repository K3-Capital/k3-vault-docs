# Error reference

Every custom error thrown by the vault, mapped to a user-facing handling. Selector-checkable against the ABI; all are `SA__`-prefixed (source: `EpochStagedERC7540Vault.sol:80-96`, `SmartAccountWrapper.sol`).

## User / integration errors

| Error | Meaning | Suggested handling |
|---|---|---|
| `SA__AsyncOnly()` | A synchronous ERC-4626 preview was called (`previewDeposit/Mint/Withdraw/Redeem`). | Expected on this vault. Don't call previews; use `max*`/`claimable*` views and `previewSettlement`. |
| `SA__NotAuthorized()` | Caller is not permitted for this `(caller, controller, owner)` combination. | Check [operator rules](operator-approvals.md); prompt for the right wallet or an operator approval. |
| `SA__NotSmartAccount()` | `closeEpoch`/`settleEpoch` called by anyone but the smart account. | Integrators should never call these; ignore in user flows. |
| `SA__SmartAccountNotSet()` | Settlement authority unset (uninitialized vault). | Not a user-flow error. |
| `SA__ZeroAddress()` | A zero address was passed (controller/owner/token/etc.). | Validate addresses client-side. |
| `SA__ZeroAmount()` | Zero amount requested, claimed, or received (e.g. token transfer yielded 0). | Guard against 0-amount submits; check token approval succeeded. |
| `SA__InvalidRequestId(uint256 requestId)` | `requestId > type(uint40).max`. | Only with fabricated ids; event-derived ids are fine. |
| `SA__ReservedStagedToken(address token)` | `rescueStagedToken` on the vault asset or share token. | Owner-only path; not user-facing. |

## Epoch lifecycle errors (mostly settlement authority)

| Error | Meaning |
|---|---|
| `SA__FrozenEpochPending()` | `closeEpoch`/`setSmartAccount`/`rescue(asset)` while an epoch is frozen but unsettled. |
| `SA__NoFrozenEpoch()` | `settleEpoch` with nothing frozen. |
| `SA__WrongEpoch(uint256 expected, uint256 actual)` | `settleEpoch` for a non-frozen epoch. |
| `SA__EpochNotClosed(uint256 epochId)` | Settling an epoch that was never closed. |
| `SA__EpochAlreadySettled(uint256 epochId)` | Double settlement attempt. |
| `SA__InsufficientSettlementAssets()` | Vault lacks assets to back `redeemAssets` (or rescue exceeded surplus). |

## Claim errors

| Error | Meaning | Suggested handling |
|---|---|---|
| `SA__NoClaimableEpoch()` | Claim attempted with nothing settled in the controller's queue. | Check `claimable*Request` / `max*` before submitting; show "awaiting settlement". |
| `SA__ExceedsClaimable(uint256 requested, uint256 claimable)` | Claim amount above the remaining claim. | Clamp to `claimable` / `maxDeposit`/`maxMint`/`maxWithdraw`/`maxRedeem`. |
| `SA__PartialClaimConsumesAllInput()` | A partial `mint`/`withdraw` whose ceil-rounded counterpart consumes the entire remaining claim. | Retry claiming the full remaining amount. |
| `SA__InvalidNavSnapshot()` | Settlement preview given `nav == 0` with non-zero supply, or `redeemShares > supplySnapshot`. | Fix simulation inputs. |

## Standard errors also possible

- `EnforcedPause()` / `ExpectedPause()` — Pausable; requests blocked while paused.
- ERC-20/ERC-4626 reverts: `ERC20InsufficientAllowance`, `ERC20InsufficientBalance`, `ERC20InvalidApprover/Spender`, `ERC4626ExceededMax*` is **not** applicable (no sync caps), plus underlying cbBTC transfer reverts (e.g. allowance) surface from the token.

## Decoding

All errors are standard revert data (`bytes4(keccak256("ErrorSig(params)"))`); wagmi/viem decode them automatically into `name` + `args` when the ABI fragment is included.
