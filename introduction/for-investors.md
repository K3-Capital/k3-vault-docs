# For Investors

K3-managed vaults are intended to be offered to eligible customers through distribution partners. Availability, eligibility, risks, fees, and governing terms depend on the specific vault and jurisdiction.

## What a vault can offer

- **A defined mandate.** Each vault is designed around customer and partner requirements. Its materials define the permitted assets, monitored limits, partner constraints, and the scope of K3's discretion.
- **Active management.** K3 allocates and rebalances the portfolio under that mandate.
- **Continuous oversight.** K3 provides continuous automated monitoring with on-call response.
- **Consistent cycle pricing.** Deposits and withdrawals settled in the same cycle use one NAV and supply snapshot.
- **A visible history.** Settlement prices and request outcomes are recorded on-chain and can be checked after publication.

## What these statements do not mean

The vault contract does not enforce the investment mandate or independently verify portfolio valuation. Mandate limits are operating policies monitored outside the contract unless a vault's specific materials say otherwise. K3 operations computes the post-fee NAV used for a cycle; an incorrect NAV can misprice that settlement.

Settlement and NAV reporting are targeted for **Tuesdays and Fridays**. This is an operational target, not a lockup period, service-level agreement, on-chain schedule, or timing guarantee. A request becomes claimable only after its cycle has been closed, valued, settled, and fully funded.

Pausing the contract blocks new deposit and withdrawal requests. It does not freeze settlement or claims that are otherwise available.

## Fees and terms

Default commercial settings are **0% management fee and 5% performance fee**, but vault-specific terms prevail. The contract has no separate protocol-level fee. Other product costs and complete performance-fee mechanics must be read from the governing terms for the relevant vault.

This documentation describes product infrastructure and is not investment advice or an offer. Review the governing documents supplied by the distribution partner before participating.

Next: follow the [User Journey](user-journey.md) or view the live [K3 cbBTC Vault example](cbbtc-vault.md).
