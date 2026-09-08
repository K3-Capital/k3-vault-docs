# Overview

K3 vaults are **fully async** ERC-7540 vaults: neither deposits nor redemptions convert at the moment of request.

## The async epoch model

1. A user **requests** a deposit (transferring assets into custody) or a redemption (transferring vault shares into custody). Both land in the epoch that is currently open.
2. When the operator closes the epoch, the set of requests in it is **frozen**. A new epoch opens immediately for subsequent requests.
3. The operator **settles** the frozen epoch against a NAV snapshot. Settlement math determines how many shares incoming depositors receive and how many assets outgoing redeemers receive.
4. Once settled, requests become **claimable**: depositors claim vault shares, redeemers claim underlying assets.

Because conversions happen only at settlement, `previewDeposit`/`previewMint`/`previewWithdraw`/`previewRedeem` intentionally revert ([details](../integration/reading-state.md#previews-revert)).

## Roles

| Role | Who | Powers |
|---|---|---|
| User / controller | Depositor or redeemer | `requestDeposit`, `claimableDepositRequest`-then-`deposit`/`mint`, `requestRedeem`, then `withdraw`/`redeem`, `setOperator` |
| Operator | Any address approved by a controller | Acts on the controller's behalf within ERC-7540 operator rules |
| Owner | `0x349bB895dB64f74AB9788693a16Ee03776195504` (K3 cbBTC Vault) | `setSmartAccount`, `pause`/`unpause`, `rescue*`, admin of the beacon (implementation upgrades) |
| Smart account | `0x034d1E094Efd47d4e738033d0157f31718820470` | `closeEpoch`, `settleEpoch` — runs the vault's off-chain strategy and NAV methodology |

## Value proposition

- **No instant-conversion risk for the vault**: inflows/outflows are netted per epoch and priced at a single NAV snapshot, so trade-time slippage is not passed to existing holders.
- **Deterministic, auditable pricing**: every settlement emits `EpochSettled` with the NAV, supply snapshot, minted shares, and reserved assets — a complete, queryable price history.
- **Standard surface**: ERC-7540 / ERC-7575 compliant interface plus a one-function settlement-preview interface (`IEpochSettlementPreview`) for off-chain simulation of settlement outcomes.

Next: [How it works](how-it-works.md) for the full lifecycle, or the [integration guide](../integration/quickstart.md) for code.
