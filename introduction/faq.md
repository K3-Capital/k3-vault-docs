# FAQ

**Is a deposit or redemption instant?**
No. This is a fully asynchronous vault: requests queue into batches (epochs) and only become claimable after K3 settles the batch containing them. Nothing converts at the moment you request.

**When do I get my shares (on deposit) or cbBTC (on redeem)?**
After the batch your request joined is closed and settled. You can then claim once your request becomes claimable; requests are processed oldest-batch-first. See [Your money & getting it back](money-flow.md) for the full picture.

**What price will I get?**
The price is set when your batch is settled — not when you requested and not when you claim. K3 publishes the account value (NAV snapshot) used at settlement, so the price is recorded on-chain and checkable. For the exact calculation and how to simulate it, see [Epoch lifecycle & settlement](../architecture/settlement.md).

**Can someone else manage my requests on my behalf?**
Yes, if you approve them as an operator. An approved operator can request deposits or redemptions and claim on your behalf within the standard operator rules. Approve operators deliberately, and revoke them the same way. Details: [Operator approvals](../integration/operator-approvals.md).

**Can the vault be paused?**
Yes. The owner (or a holder of the pause role) can pause the vault, which blocks new deposit and redemption requests but does not block claims on already-settled batches. There is no on-chain multisig or timelock gating this on the current cbBTC deployment — see [Security & trust assumptions](../architecture/security-assumptions.md).

**Does the vault charge fees? How does it earn yield?**
The vault itself charges no protocol-level fees. The vault's own account value at settlement determines the published share price. The off-chain strategy, fee model, and yield sources are **not documented here**; these docs cover on-chain behavior only.

**Where can I verify the security of the contract code?**
The code has been reviewed by an independent security firm; see [Security reviews & audits](../architecture/security-reviews.md). The full on-chain trust model and the deployed addresses are in [Security & trust assumptions](../architecture/security-assumptions.md).

**Where is the full technical spec?**
[`ARCHITECTURE.md`](https://github.com/K3-Capital/k3-vault-contracts/blob/main/ARCHITECTURE.md) in the contracts repository is canonical for protocol internals; this site is a condensed, derived view.
