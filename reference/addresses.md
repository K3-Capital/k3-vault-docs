# Addresses

Canonical registry: [`deployments/` in the K3 vault contracts repository](https://github.com/K3-Capital/k3-vault-contracts/tree/main/deployments). This page is generated from `deployments/1/0x009c02a73706a68e0aE0209235408206E4F53709/deployment.json` — do not hand-edit addresses here.

## Ethereum Mainnet (chainId 1)

### K3 cbBTC Vault — `k3cbBTC` (active, deployed 2026-08-04)

| Contract | Address |
|---|---|
| Vault proxy (integrator entrypoint) | `0x009c02a73706a68e0aE0209235408206E4F53709` |
| Beacon (`UpgradeableBeacon`) | `0x7b80bdb8F0777F52A6054A0E48AFc15200b780B8` |
| Implementation (`SmartAccountWrapper`) | `0xC768529098e20e089Efd28A32c6Afa1D569b831a` |
| Staging | `0x21636C226e113d7Dd59dA2987eaA7dAbBE4159c7` |
| Underlying asset (cbBTC, 8 decimals) | `0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf` |

### Privileged accounts (snapshot block 25682656)

| Role | Address | Type |
|---|---|---|
| Owner | `0x349bB895dB64f74AB9788693a16Ee03776195504` | EOA |
| Smart account (`closeEpoch`/`settleEpoch`) | `0x034d1E094Efd47d4e738033d0157f31718820470` | EIP-7702 delegated EOA (target `Simple7702Account` `0xe6Cae83BdE06E4c305530e199D7217f42808555B`) |

### Off-chain

| Service | Endpoint |
|---|---|
| Subgraph (public, versioned) | `https://api.goldsky.com/api/public/project_cmr0amyn6hg6t01yg8uf1cgrv/subgraphs/erc7540-mainnet/1.0.0/gn` |

Explorer links for every address are in the deployment JSON (`contracts.*.explorerUrl`).
