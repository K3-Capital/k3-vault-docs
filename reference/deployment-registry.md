# Deployment registry

Source of truth for deployed instances lives in the contracts repository:

```text
https://github.com/K3-Capital/k3-vault-contracts/tree/main/deployments
```

Per deployment (one directory per chain/vault, keyed by proxy address):

| File | Content |
|---|---|
| `deployment.json` | Full manifest: network, vault identity, contract addresses, privileged accounts (with on-chain account-type evidence), compiler/toolchain, CREATE3 derivation, transaction receipts, verification results |
| `verification.md` | Human verification report (runtime bytecode hashes, proxy slots, Etherscan exact-match results) |
| `smoke-test.json` | Post-deployment mainnet smoke-test evidence |

The [addresses page](addresses.md) in this book is generated from that registry. To add or update a documented deployment, extend the registry in the contracts repo and regenerate this book's address tables — never hand-edit them here.
