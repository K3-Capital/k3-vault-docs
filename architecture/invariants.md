# Invariants

Key invariants from `ARCHITECTURE.md` §13 that hold for every settled epoch. These are enforced structurally by the contract code and covered by the on-chain verification report.

1. **Single frozen epoch** — at most one epoch is frozen (`frozenEpochId ≠ 0`) at any time; `closeEpoch` reverts otherwise.
2. **Settle the frozen epoch only** — `settleEpoch` must receive exactly the frozen epoch id, closed and not yet settled.
3. **NAV sanity** — settlement reverts if `nav == 0` while `totalSupplySnapshot ≠ 0`, or if `totalRedeemShares > totalSupplySnapshot`.
4. **Asset coverage** — a settlement reverts unless the vault holds at least `redeemAssets` after pulling in the epoch's deposit assets; redemptions are always backed by real assets in Staging afterwards.
5. **Reserve accounting** — `redeemClaimReserves()` equals reserved-but-unclaimed redemption assets; it decreases only via redeem claims and never goes negative.
6. **Conservation at settlement** — `activeAssets = navSnapshot − redeemAssetsReserved + totalDepositAssets`; all deposit assets move Staging → vault exactly once; all redeem reserves vault → Staging exactly once.
7. **No stranded dust** — the last unclaimed controller of an epoch absorbs all rounding remainders, so per-controller floor rounding cannot strand shares or assets in Staging or `redeemClaimReserves`.
8. **Claims drain oldest-first** — a controller's claims are served strictly from the oldest settled epoch in their queue; later epochs stay pending until it drains.
9. **Staging custody** — Staging releases tokens only to the vault or to entitled claimants; the vault asset and share token are excluded from `rescueStagedToken`.
10. **Request input integrity** — zero-amount and zero-address inputs revert; deposit requests credit the exact amount received (balance-delta measured), not the amount requested.
