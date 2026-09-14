# User Journey

A K3-managed vault connects a customer's request, an actively managed portfolio, periodic valuation, and a final claim. The same high-level journey can support different assets and strategies, but the mandate and terms are defined separately for each vault.

## 1. Request a deposit

The customer sends the vault's accepted asset into a dedicated staging area. The request joins the currently open settlement cycle. It does not enter the managed portfolio immediately, and vault units are not issued at the moment of request.

## 2. Settle the deposit cycle

K3 closes the cycle and reports the portfolio's post-fee Net Asset Value (NAV). All requests settled in that cycle use the same NAV and supply snapshot. The contract records how many vault units each deposit can claim.

Settlement and NAV reporting are targeted for **Tuesdays and Fridays**. Timing is not guaranteed.

## 3. Manage the strategy

After settlement, capital above the amount reserved for withdrawals moves to the vault's operational account. K3 allocates and rebalances it under the vault-specific mandate.

The mandate may include permitted venues, assets, concentration limits, or other risk parameters. Unless a vault's materials explicitly state otherwise, these are **policy limits (monitored)** through K3's operating and permission controls; they are not enforced by the vault contract. K3 provides continuous automated monitoring with on-call response.

## 4. Report NAV

K3 operations values the portfolio and computes the post-fee NAV used for the next settlement cycle. The reported NAV is published on-chain with the supply snapshot and settlement results.

The record is observable, but the NAV is operator-computed and is not independently checked by an on-chain price feed. An incorrect NAV can misprice a settlement.

## 5. Request a withdrawal

The customer submits vault units into staging, where the request joins the open cycle. When that cycle is settled, the contract records the amount of the underlying asset reserved for the customer.

A withdrawal is not an instant conversion and has no guaranteed completion date. The customer can claim after operations closes, values, settles, and fully funds the cycle.

## 6. Claim

After settlement, depositors claim vault units and withdrawing customers claim the underlying asset. Requests are processed oldest-cycle-first and may be claimed in part or in full once available.

## What the contract guarantees

The on-chain process enforces several important settlement rules:

- one price applies to each settled cycle;
- settlement must be fully funded or it reverts;
- no more than one cycle can be frozen awaiting settlement; and
- staged deposits are excluded from the portfolio NAV.

Pausing blocks new requests. It does not block settlement or claims.

For contract-level detail, see [Epoch lifecycle & settlement](../architecture/settlement.md) and [Security & trust assumptions](../architecture/security-assumptions.md). For the first live deployment, see [Example: K3 cbBTC Vault](cbbtc-vault.md).
