# FAQ

**Is K3 Vault a standalone product today?**
K3's proprietary vault infrastructure is live through the K3 cbBTC Vault on Ethereum. The broader one-stop strategy and infrastructure proposition is the long-term direction. Other live K3 products may use partner infrastructure and should not be treated as deployments of the proprietary vault stack.

**Who are these vaults for?**
They are designed primarily for distribution partners and their eligible customers. Eligibility, availability, disclosures, and governing terms depend on the specific vault and jurisdiction. This documentation is not an offer or investment advice.

**Can a vault support any asset or network?**
No universal compatibility is claimed. The current proprietary deployment accepts cbBTC on Ethereum. The infrastructure is designed to extend to additional eligible assets and EVM networks, subject to technical, product, and risk review. Fee-on-transfer and rebasing assets are not assumed to work.

**Who defines the strategy mandate?**
Each mandate is vault-specific and designed around customer and partner needs. Its governing materials define permitted assets, partner constraints, monitored limits, and the scope of K3's discretion. These policy limits are not enforced by the vault contract unless a vault's specific documentation says otherwise.

**How is the portfolio monitored?**
K3 provides continuous automated monitoring with on-call response. This is an operating policy, not an on-chain guarantee or response-time commitment.

**When are deposits and withdrawals processed?**
Settlement and NAV reporting are targeted for Tuesdays and Fridays. This is an operational target, not a lockup, service-level agreement, on-chain schedule, or timing guarantee. Requests become claimable only after their cycle is closed, valued, settled, and fully funded.

**What price applies to my request?**
All deposits and withdrawals settled in the same cycle use one NAV and supply snapshot. The price is set at settlement, not when the request or claim is made.

**Who determines NAV?**
K3 operations computes the post-fee NAV and publishes it on-chain for settlement. The published record is observable, but the NAV is not independently checked by an on-chain price feed. An incorrect NAV can misprice the cycle.

**Does the vault charge fees?**
Default commercial settings are 0% management fee and 5% performance fee; vault-specific terms prevail. The contract adds no separate protocol-level fee. This does not mean a vault has no fees, costs, or product-specific performance-fee mechanics.

**What happens when the vault is paused?**
Pausing blocks new deposit and withdrawal requests. It does not block settlement or claims. The current cbBTC deployment's privileged roles and controls are documented in [Security & trust assumptions](../architecture/security-assumptions.md).

**Can someone act for me?**
An approved operator can submit requests and claims on a controller's behalf within the contract's operator rules. Approvals should be granted and revoked deliberately. See [Operator approvals](../integration/operator-approvals.md).

**Where can I verify the implementation?**
See [Example: K3 cbBTC Vault](cbbtc-vault.md), [Security reviews & audits](../architecture/security-reviews.md), [Security & trust assumptions](../architecture/security-assumptions.md), and the [Deployment registry](../reference/deployment-registry.md). The canonical protocol specification is [`ARCHITECTURE.md`](https://github.com/K3-Capital/k3-vault-contracts/blob/main/ARCHITECTURE.md).
