# For Partners

K3 Vaults are designed for distribution partners that want to offer access to K3-managed strategies through their own customer experience.

A partner integration can cover one connected journey:

1. customers submit deposit or withdrawal requests;
2. K3 manages the portfolio under the vault-specific mandate;
3. K3 reports the portfolio's Net Asset Value (NAV) for each settlement cycle; and
4. the partner shows customers when their vault units or withdrawal assets are ready to claim.

## What the infrastructure provides

- **Consistent request handling.** Deposits and withdrawals follow the same request, settlement, and claim pattern.
- **A common valuation point.** Requests settled in the same cycle use the same NAV and supply snapshot.
- **Observable records.** Settlements, prices, balances, and transfers are recorded on-chain.
- **Integration standards.** The live contracts use established tokenized-vault interfaces, expose an identifiable settlement-preview capability, and are accompanied by deployment-verification evidence and operator tooling.
- **Flexible product design.** The mandate, eligible customers, permitted assets, monitored limits, fees, and operating terms are defined for each vault.

## Product boundary

The proprietary K3 implementation is live today through the K3 cbBTC Vault on Ethereum. It is designed to extend to additional eligible assets and EVM networks, subject to technical and product review.

K3 also operates products through partner rails. Those products demonstrate K3's strategy-management capability, but they are not evidence that the external rail is integrated into K3's proprietary vault contracts.

The current production evidence is the contract implementation, its request-and-claim model, the `previewSettlement` capability, the deployment registry, and the companion back-office application. These docs do not promise a public SDK, hosted API, white-label user interface, or fixed integration timeline.

## Starting a partnership

Product design begins with the partner's customers and requirements. K3 and the partner define the vault mandate, operating responsibilities, eligibility, disclosures, commercial terms, and integration scope before launch.

For the customer experience, see [For Investors](for-investors.md) and the [User Journey](user-journey.md). Developers can continue to the [Integration Guide](../integration/quickstart.md).
