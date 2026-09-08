# Security & trust assumptions

Condensed from `ARCHITECTURE.md` §12. This page states **verifiable on-chain facts only**; it makes no assurances about off-chain operations.

## On-chain permissions

| Authority | Holder (cbBTC vault, block 25682656) | Capabilities |
|---|---|---|
| Owner | [`0x349bB895dB64f74AB9788693a16Ee03776195504`](https://etherscan.io/address/0x349bb895db64f74ab9788693a16ee03776195504) — plain EOA (no on-chain multisig/timelock) | `setSmartAccount`, `pause`/`unpause`, `rescue` (non-asset tokens to owner; asset surplus to smart account), `rescueStagedToken`, beacon upgrade authority |
| Smart account | [`0x034d1E094Efd47d4e738033d0157f31718820470`](https://etherscan.io/address/0x034d1e094efd47d4e738033d0157f31718820470) — EIP-7702 delegated EOA | `closeEpoch`, `settleEpoch(epochId, navSnapshot)`; receives the settlement surplus sweep and `rescue`d asset amounts |
| `PAUSER_ROLE` | Grantable by owner | `pause` (blocks deposit/redeem requests, not claims) |

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

An approved operator can request deposits **from your wallet into the vault** and can act on your controller queue within ERC-7540 rules, but cannot transfer your shares or claim to an arbitrary receiver unless they are also authorized on the relevant path. Approve operators deliberately.
