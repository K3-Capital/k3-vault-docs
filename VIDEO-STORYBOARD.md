# K3 Vault product video brief

Use the prompt below with Claude Design in CLI/API mode to create a conceptual K3 Vault explainer. Final production should add approved K3 brand assets and a partner call to action.

## Claude Design prompt

Create a complete, self-contained 16:9 HTML motion storyboard for a 45–60 second K3 Capital product explainer. Use supplied K3 brand assets; do not invent logos, returns, balances, endorsements, integrations, response times, or fee savings. Include play/pause, a scene scrubber, keyboard controls, and reduced-motion mode.

Speak primarily to distribution partners and frame end users as eligible customers reached through those partners. Use ordinary financial language. The core message is: “K3 Capital has been deploying liquidity on-chain since 2021. Building on institutional-lender risk discipline and hands-on execution in on-chain markets, K3 is internalizing vault infrastructure so partners can deliver K3-managed strategies through a consistent integration.” Clearly label the one-stop, multi-network proposition as the long-term direction. Show the K3 cbBTC Vault on Ethereum as today's proprietary example, not as proof that every asset or network is supported.

Build seven scenes:

1. **Identity and partner entry.** Open with the 2021 chronology, then show a partner application offering access to the K3 cbBTC Vault. Caption: “K3-managed strategies, delivered through partner experiences.”
2. **Deposit.** An eligible customer requests to deposit cbBTC. Show it entering the vault's staged deposit area; do not imply immediate strategy entry or instant unit issuance.
3. **Managed strategy.** After settlement, show capital managed through K3's operational account under an illustrative vault-specific mandate. Display only illustrative parameters and label each “policy limit (monitored).” State that actual permitted assets, partner constraints, and K3 discretion are defined for each vault. Do not depict these limits as enforced by the vault contract.
4. **Continuous oversight.** Show automated alerts and an on-call operational response. Use the exact caption “Continuous automated monitoring with on-call response.” Do not name a monitoring vendor, expose escalation design, or show a response-time commitment. If showing pause, explain: “Pause blocks new requests; settlement and claims remain available.”
5. **NAV and one-cycle treatment.** Show operations computing post-fee NAV for the cycle. Animate all deposits and withdrawals in that cycle settling from the same NAV and supply snapshot. Caption: “One valuation point for requests settled in the same cycle.” Add: “NAV is operator-computed; incorrect NAV can misprice settlement.” Do not imply an oracle cross-check, maker-checker process, or independent verification.
6. **Settlement and claim.** Show requests becoming claimable only after operations closes and fully funds the cycle. Caption exactly: “Settlement and NAV reporting are targeted for Tuesdays and Fridays; timing is not guaranteed.” Do not call this a lockup, on-chain schedule, or service-level agreement. Do not show cancellation or a guaranteed completion date.
7. **Long-term close.** Zoom from the live cbBTC/Ethereum example to a restrained roadmap of additional eligible assets and EVM networks. Caption: “Live on Ethereum, designed to extend to additional EVM networks and eligible assets.” Close with “A one-stop strategy and infrastructure layer for distribution partners” and an approved partner call to action.

Add an accuracy panel that classifies every visible claim as **live capability**, **off-chain policy**, **partner-rail precedent**, or **roadmap**. Include these boundaries:

- The current proprietary example is cbBTC on Ethereum.
- Compatibility with any future asset depends on its behavior and the vault implementation; fee-on-transfer and rebasing assets are not assumed to work.
- The contract has no separate protocol-level fee. Default commercial settings are 0% management fee and 5% performance fee, subject to vault-specific terms.
- One price per cycle, fully funded settlement, at most one frozen cycle, and exclusion of staged deposits from NAV are on-chain rules.
- Do not claim a public SDK, hosted API, white-label interface, integration timeline, or quantified savings.
- The illustration is not an offer. Eligibility, terms, timing, availability, fees, and risk depend on the specific product and jurisdiction.

Use a calm institutional editorial style: restrained K3 purple (`#2f05ff`), warm neutral background, and high-contrast typography. Avoid crypto neon, coin rain, glassmorphism, fake dashboards, decorative metrics, and feature-card grids. Use motion only to explain state changes. Avoid ERC standard numbers, “epoch,” EVM, TVL, and APY in the main narration; technical terms may appear only in the accuracy panel.

Return one self-contained HTML file with embedded CSS and JavaScript and no external runtime dependencies, seven reviewable scenes, a plain-text voiceover, an on-screen-copy list, and an assumption register. Verify it at 1920×1080 and 390×844 with no console errors, keyboard operation, reduced-motion support, and no unapproved claims.
