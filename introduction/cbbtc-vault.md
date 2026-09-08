# The K3 cbBTC Vault

The first live K3 vault, deployed on Ethereum mainnet on 2026-08-04. Facts below are generated from the audited deployment registry in the [contracts repository](https://github.com/K3-Capital/k3-vault-contracts) (`deployments/1/0x009c02a73706a68e0aE0209235408206E4F53709/deployment.json`), which includes runtime-bytecode verification evidence.

## Vault identity

| Field | Value |
|---|---|
| Name / Symbol | K3 cbBTC Vault / `k3cbBTC` |
| Share token decimals | 8 (matches cbBTC) |
| Underlying asset | [cbBTC — Coinbase Wrapped BTC](https://etherscan.io/token/0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf) (`0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf`, 8 decimals) |
| Architecture | ERC-1967 BeaconProxy |
| Deployment | Blocks 25680512–25680513, completed 2026-08-04 09:00:35 UTC |
| Source verification | Etherscan "Exact Match" for proxy, beacon, implementation, and Staging |

## Contract addresses

| Contract | Address |
|---|---|
| Vault proxy (integrators use this) | [`0x009c02a73706a68e0aE0209235408206E4F53709`](https://etherscan.io/address/0x009c02a73706a68e0ae0209235408206e4f53709#code) |
| Beacon | [`0x7b80bdb8F0777F52A6054A0E48AFc15200b780B8`](https://etherscan.io/address/0x7b80bdb8f0777f52a6054a0e48afc15200b780b8#code) |
| Implementation (`SmartAccountWrapper`) | [`0xC768529098e20e089Efd28A32c6Afa1D569b831a`](https://etherscan.io/address/0xc768529098e20e089efd28a32c6afa1d569b831a#code) |
| Staging | [`0x21636C226e113d7Dd59dA2987eaA7dAbBE4159c7`](https://etherscan.io/address/0x21636c226e113d7dd59da2987eaa7dabbe4159c7#code) |

## Privileged accounts (observed at block 25682656)

| Account | Address | Type | Authorities |
|---|---|---|---|
| Owner | [`0x349bB895dB64f74AB9788693a16Ee03776195504`](https://etherscan.io/address/0x349bb895db64f74ab9788693a16ee03776195504) | EOA | wrapper ownership/administration, beacon upgrades |
| Smart account | [`0x034d1E094Efd47d4e738033d0157f31718820470`](https://etherscan.io/address/0x034d1e094efd47d4e738033d0157f31718820470) | EIP-7702 delegated EOA (delegation target: [`Simple7702Account`](https://etherscan.io/address/0xe6cae83bde06e4c305530e199d7217f42808555b#code) `0xe6Cae83BdE06E4c305530e199D7217f42808555B`) | `closeEpoch`, `settleEpoch` |

> **Note for integrators** — these are the on-chain facts as observed. The owner is a plain EOA (no on-chain multisig or timelock controls it), and settlement authority is an EIP-7702 delegated EOA. These accounts set the NAV snapshot each epoch and can pause the vault. Integrators should treat NAV-settlement and pause authority as trust assumptions and read [Security & trust assumptions](../architecture/security-assumptions.md) before building on this vault.

## Current state & history

- Mainnet smoke test passed pre-launch: 14 transactions covering all six operation types (`requestDeposit`, `deposit`, `requestRedeem`, `redeem`, `closeEpoch`, `settleEpoch`); evidence in the [deployment registry](../reference/deployment-registry.md).
- Live off-chain index of requests, epochs, and per-epoch prices: see the [Subgraph](../integration/subgraph.md).
- Share-price history can be built from `epochPrices` (see [share price history](../integration/subgraph.md#share-price-history)).
