# Frequently asked questions

## The product

**What is a K3 Vault, in one sentence?**

A smart contract that pools a single asset, places it under K3's management within a defined mandate, and prices every deposit and withdrawal at one common value in each settlement cycle.

**Why did K3 build its own infrastructure rather than use an existing provider?**

To remove a fee layer and a coordination layer. In the conventional two-entity model the depositor pays the infrastructure platform and the strategist separately. K3 Vaults place accounting, deposits and redemptions, integrations, and management under one roof, with one fee schedule and one accountable operator. Complete fees remain vault-specific.

**Is this a standalone product today?**

The proprietary infrastructure is live through the K3 cbBTC Vault on Ethereum. The broader one-stop layer across additional assets and networks is the direction of travel, not a present-day claim. Other live K3 products may run on partner infrastructure and should not be treated as deployments of this stack.

**Who is it for?**

Primarily distribution partners and their eligible customers, standalone users where available, and protocols or token issuers that want a managed product built on their asset. Eligibility, availability, disclosures, and terms depend on the vault and jurisdiction. This documentation is not an offer and does not constitute investment advice.

**Can a vault support any asset or network?**

No universal compatibility is claimed. The live vault accepts cbBTC on Ethereum. Extension to additional EVM networks and assets is subject to technical, product, and risk review. Fee-on-transfer and rebasing tokens are not assumed to work.

## Deposits, withdrawals, and pricing

**When are deposits and withdrawals processed?**

Settlement and NAV reporting for `k3cbBTC` are targeted for Mondays and Fridays. This is an operating target, not a lockup, service-level agreement, on-chain schedule, or guarantee. A request becomes claimable only once its cycle has been closed, valued, settled, and fully funded. Different operating cadences may be available for other products.

**What price will my request receive?**

The price of the settlement cycle in which the request is settled. Everyone in that cycle shares one NAV and one supply snapshot. The price is set at settlement, not at request time or claim time.

**Can I cancel a request?**

No. Once submitted, assets or shares remain in the custody contract until the cycle settles and the claim is made.

**Why did a deposit convert to zero shares?**

This can occur for amounts of a few base units relative to the share price. Such dust is consumed, not refunded. Partner interfaces should prevent deposits of this size and use the permissionless settlement preview to surface the outcome.

**Who determines the NAV?**

K3 Capital's operations team computes the post-fee NAV and publishes it on-chain at settlement. The record is public and the arithmetic is reproducible, but no on-chain oracle independently verifies the NAV by default.

**Does the vault charge fees?**

Default settings are 0% management fee and a variable performance fee; the K3 cbBTC Vault's documented default performance fee is 5%. Vault-specific terms prevail. The contract adds no separate protocol-level fee. This does not mean a vault has no fees or costs; read the governing documents of the relevant vault.

## Control and safety

**What can K3 do with the vault?**

The settlement authority sets the NAV and settles cycles. The owner can pause new requests, upgrade the implementation, change the settlement authority, and rescue eligible stray tokens. The two powers are held separately. Staging cannot release the vault asset or share token except through the vault's claim and settlement paths.

**What happens if the vault is paused?**

New deposit and withdrawal requests are blocked. Settlement and available claims continue.

**Is the mandate enforced on-chain?**

No, unless a specific vault's materials state otherwise. Mandate limits are operating policies monitored by K3 through its key-management and permission controls.

**Can someone act on my behalf?**

Yes. An approved operator can submit requests and claim your settled queue, including to a destination of its choosing. Approve deliberately and revoke with `setOperator(operator, false)`.

**Has the code been audited?**

Pashov Audit Group reviewed the contract suite in August 2026: one Low-severity finding, fixed and re-reviewed. See [Security reviews & audits](../architecture/security-reviews.md) for the review scope and evidence.
