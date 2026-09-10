# The K3 cbBTC Vault

The **K3 cbBTC Vault** (`k3cbBTC`) is the first live K3 vault, deployed on Ethereum mainnet on 2026-08-04. It lets you deposit and redeem **cbBTC** (Coinbase Wrapped BTC) as described in [How it works](how-it-works.md). Deployment facts below are generated from the audited deployment registry in the [contracts repository](https://github.com/K3-Capital/k3-vault-contracts) (`deployments/1/0x009c02a73706a68e0aE0209235408206E4F53709/deployment.json`), which includes runtime-bytecode verification evidence.

## Vault identity

| Field | Value |
|---|---|
| Name / Symbol | K3 cbBTC Vault / `k3cbBTC` |
| Share token decimals | 8 (matches cbBTC) |
| Underlying asset | [cbBTC — Coinbase Wrapped BTC](https://etherscan.io/token/0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf) (`0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf`, 8 decimals) |
| Deployment | Deployed 2026-08-04 09:00:35 UTC, Ethereum mainnet (blocks 25680512–25680513) |
| Source verification | Etherscan "Exact Match" verification for the proxy, beacon, implementation, and vault custody contract |

The vault is an upgradeable deployment built on K3's epoch-staged vault infrastructure and uses the standard ERC-7540 / ERC-4626 tokenized-vault interfaces.

## Who runs the vault

K3 Capital operates the vault. The operating authority — which closes and settles batches and publishes the account value (NAV) used to price them — is a dedicated smart account. A separate owner authority controls administrative functions such as pause and upgrades.

The specific on-chain addresses of these privileged accounts, what each can do, and the full trust model are documented on the technical [Security & trust assumptions](../architecture/security-assumptions.md) page, which also holds the complete contract-address registry.

## Current state & history

- Mainnet smoke test passed pre-launch: 14 transactions covering all six operation types (`requestDeposit`, `deposit`, `requestRedeem`, `redeem`, `closeEpoch`, `settleEpoch`); evidence is in the [deployment registry](../reference/deployment-registry.md).
- A live, on-chain-indexed view of requests, batches, and per-batch prices is available through the [Subgraph](../integration/subgraph.md).
- Share-price history can be built from published batch prices (see [share price history](../integration/subgraph.md#share-price-history)).

For everything else — controller/operator roles, the exact custody and settlement flow, and the technical security controls — see the [Architecture](../architecture/system-design.md) and [Integration Guide](../integration/quickstart.md).
