# Security & trust assumptions

Condensed from `ARCHITECTURE.md` §12. This page is written for **technical readers** (external diligence and audit teams) and states **verifiable on-chain facts only**; it makes no assurances about off-chain operations. For the independent security reviews covering this Solidity codebase, see [Security reviews & audits](security-reviews.md).

For a plain-English, business-oriented view of the vault and where funds are held, see [Your money & getting it back](../introduction/money-flow.md) and [Overview](../introduction/overview.md).

## On-chain addresses (K3 cbBTC Vault)

These are the deployed contract addresses. Integrators interact with the vault proxy.

| Contract | Address |
|---|---|
| Vault proxy (integrators use this) | [`0x009c02a73706a68e0aE0209235408206E4F53709`](https://etherscan.io/address/0x009c02a73706a68e0ae0209235408206e4f53709#code) |
| Beacon | [`0x7b80bdb8F0777F52A6054A0E48AFc15200b780B8`](https://etherscan.io/address/0x7b80bdb8f0777f52a6054a0e48afc15200b780b8#code) |
| Implementation (`SmartAccountWrapper`) | [`0xC768529098e20e089Efd28A32c6Afa1D569b831a`](https://etherscan.io/address/0xc768529098e20e089efd28a32c6afa1d569b831a#code) |
| Staging (custody) | [`0x21636C226e113d7Dd59dA2987eaA7dAbBE4159c7`](https://etherscan.io/address/0x21636c226e113d7dd59da2987eaa7dabbe4159c7#code) |

## On-chain permissions

| Authority | Holder (cbBTC vault, block 25682656) | Capabilities |
|---|---|---|
| Owner | [`0x349bB895dB64f74AB9788693a16Ee03776195504`](https://etherscan.io/address/0x349bb895db64f74ab9788693a16ee03776195504) — plain EOA (no on-chain multisig/timelock) | `setSmartAccount`, `pause`/`unpause`, `rescue` (non-asset tokens to owner; asset surplus to smart account), `rescueStagedToken`, beacon upgrade authority |
| Smart account | [`0x034d1E094Efd47d4e738033d0157f31718820470`](https://etherscan.io/address/0x034d1e094efd47d4e738033d0157f31718820470) — EIP-7702 delegated EOA | `closeEpoch`, `settleEpoch(epochId, navSnapshot)`; receives the settlement surplus sweep and `rescue`d asset amounts |
| `PAUSER_ROLE` | Grantable by owner | `pause` (blocks deposit/redeem requests, not claims) |

> **Security note for integrators** — these are the on-chain facts as observed. The owner is a plain EOA (no on-chain multisig or timelock controls it), and settlement authority is an EIP-7702 delegated EOA. **The smart account sets the NAV snapshot and settles each epoch; it cannot pause.** **The owner — or a `PAUSER_ROLE` holder it grants — can pause** (blocking new requests, not claims). These are separate authorities: NAV/settlement power and pause power must be assessed independently. Integrators should treat NAV-settlement and pause authority as trust assumptions before building on this vault.

## What the smart account controls

- **Pricing**: the `navSnapshot` passed to `settleEpoch` fully determines share issuance and redemption proceeds. There is no on-chain oracle cross-check; a manipulated or mistaken NAV directly sets the settlement price. Constraints enforced on-chain: NAV/supply sanity reverts and the requirement that the vault holds at least `redeemAssets` at settlement.
- **Timing**: epochs close and settle at the smart account's discretion — there is no on-chain cadence. Request liquidity can therefore remain pending for an unbounded period.
- **Surplus sweep**: after each settlement, the vault's entire residual asset balance (above the redemption reserve) transfers to the smart account.

## Upgradeability

The vault proxy is an `UpgradeableBeacon` proxy: the owner controls the beacon and can change the implementation for all proxies pointing at it. Deployment evidence (runtime bytecode hashes, proxy slots, Etherscan exact-match verification) is in the [deployment registry](../reference/deployment-registry.md).

## Donate / NAV-inflation properties

- Direct ERC-20 transfers of the vault asset to the vault are not added to `activeAssets`; they accumulate as `assetSurplus()` and are **swept to the smart account at the next settlement** — a donation does not accrue to shareholders.
- Because conversions use epoch snapshots rather than live balances, first-depositor share-price attacks of the ERC-4626 inflation kind are structurally mitigated; see `ARCHITECTURE.md` §12 for the full analysis and residual caveats.

## Pause & emergency

`pause()` blocks new `requestDeposit`/`requestRedeem` (claims and settlements continue). `unpause()` is owner-only. `rescue`/`rescueStagedToken` allow the owner to recover tokens; the vault asset can only be rescued out of the vault's own (surplus) balance, and Staging can never release the share token or the vault asset to anyone but the vault or entitled claimants.

## Operator risks for users

An approved operator can request deposits **from your wallet into the vault** and, once an epoch settles, can claim **your controller's queue** to any `receiver` they choose. The claim functions (`deposit`/`mint`/`withdraw`/`redeem`) authorize `caller == controller || isOperator(controller, caller)` and then let that authorized caller name an arbitrary destination address — the operator does **not** need to be you or an additional approver to redirect a claim. Approve operators deliberately; revoke with `setOperator(operator, false)`.
