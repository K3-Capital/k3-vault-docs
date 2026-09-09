# Security reviews & audits

This page lists the independent security reviews covering the Solidity codebase
(the [`SmartAccountWrapper` / `EpochStagedERC7540Vault` contract suite](https://github.com/K3-Capital/erc7540-wrapper))
and the security processes behind the deployments documented in this book.

A security review narrows, but never eliminates, risk: any review is time-,
resource- and expertise-bound, and cannot prove the complete absence of
vulnerabilities. These pages report verifiable review facts (scope, findings,
and resolution) only, and do not make safety or assurance claims beyond what the
review records.

## K3 Security Review — Pashov Audit Group (2026-08)

| | |
|---|---|
| **Auditor** | Pashov Audit Group (BengalCatBalu, InfiniteSec, K42, merlinboii, shaka) |
| **Review window** | August 19 – 23, 2026 (3 focused audit days + 1 fixes-review day) |
| **Scope** | [`erc7540-wrapper`](https://github.com/K3-Capital/erc7540-wrapper) `src/` at commit [`f8a4e84a6ad19d08067bcc4825896cfb630d0d68`](https://github.com/K3-Capital/erc7540-wrapper/tree/f8a4e84a6ad19d08067bcc4825896cfb630d0d68/src) |
| **Findings** | 1 total — 1 Low severity (L-01, resolved) |
| **Status** | Finding acknowledged and fixed ([erc7540-wrapper#33](https://github.com/K3-Capital/erc7540-wrapper/pull/33)); fixes reviewed at commit `bb49d8e11b282ff48002bd123bee8ac4227cbdab` |

**Report (PDF):** [K3-security-review_2026-09-03.pdf](https://github.com/pashov/audits/blob/master/team/pdf/K3-security-review_2026-09-03.pdf)

The one finding, L-01 — *ERC-7540 Deposit events identify the operator instead
of the controller* — is a
standards-compliance and integration-integrity issue (a controller-aware claim
emitted the actual caller rather than the controller as the event's first
indexed address), not a balance-theft vector. Token accounting and authorization
remain correct. It was fixed and the fix reviewed.

## What this review means for integrators

The current on-chain deployment, [deployment registry](../reference/deployment-registry.md),
was verified against a committed implementation, and the [contracts README](https://github.com/K3-Capital/erc7540-wrapper/blob/main/README.md)
requires that any deployment intended for production use these prerequisites:

1. the deployed implementation **bytecode matches the current audited commit**;
2. the beacon points to that implementation;
3. the wrapper proxy is initialized with the intended owner, smart account, asset, name, and symbol;
4. the deployment has been verified on the target chain block explorer;
5. the deployment has gone through the **required security review for this code version**.

The [Security & trust assumptions](security-assumptions.md) page documents the
operational trust model these reviews sit alongside: in particular the owner and
settlement smart-account authorities, NAV/surplus-sweep control, upgradeability,
and operator risks, which remain material trust assumptions regardless of code
review status. Major accounting/control-flow changes to the contracts require a
fresh security review before production use.