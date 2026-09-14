# For Protocols

K3-managed vaults can act as a distribution channel between customer capital and the venues where a vault's strategy is executed. A vault can aggregate requests, apply one valuation point per settlement cycle, and give a distribution partner a consistent interface while K3 manages allocation under a vault-specific mandate.

## How protocols fit into a vault

Depending on the mandate, K3 may allocate capital across lending markets, stablecoin products, credit strategies, or other eligible venues. The protocol or market supplies the strategy venue; K3 supplies portfolio construction, allocation, monitoring, and rebalancing; the vault supplies the customer-facing ownership, valuation, and request lifecycle.

This separation matters. A live K3 allocation to a protocol is not automatically an integration between that protocol and K3's proprietary vault contracts.

## Current operating evidence

K3 has live products or allocations with assets under management across the following examples:

- the Galaxy credit facility delivered through Accountable's vault infrastructure;
- the EtherFi EUR yield product delivered with Midas;
- a K3 strategy relationship with KernelDAO; and
- allocations or curated markets involving Euler, Morpho, and Ethena.

These examples span partner rails, partner products, strategy venues, and curated markets. They demonstrate live strategy activity, but not that every product uses the proprietary K3 vault stack. No AUM amounts or partner endorsements are implied here.

## Long-term direction

K3's direction is to make its vault infrastructure a reusable distribution layer for more K3-managed strategies. For protocols, that can create a route to capital governed by a documented mandate and continuous monitoring. Expansion to a new venue remains subject to vault-specific eligibility, risk limits, technical compatibility, and partner approval.

For the product proposition, see [Why K3 Vaults](why-k3-vaults.md). For current proprietary deployment evidence, see [Example: K3 cbBTC Vault](cbbtc-vault.md).
