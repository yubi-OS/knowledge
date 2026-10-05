# knowledge/roadmap-promotion-gates

Knowledge corpus minted from yubi-OS/yubiOS `refs/roadmap-promotion-gates-2026-07-17.md`. Topic: roadmap promotion gates, the accepted planning guardrail defining required fields and evidence before FUTURE roadmap items move into active implementation.

## Docs

| NN | File | Scope |
|---|---|---|
| 01 | [01-owner-deployment-target.md](01-owner-deployment-target.md) | Naming the exact board, VM, workflow, or deployment class a change modifies before promotion |
| 02 | [02-trust-boundary.md](02-trust-boundary.md) | Decider vs enforcer vs explicit compromise tolerance, via the NIST SP 800-207 PDP/PEP model |
| 03 | [03-evidence-target.md](03-evidence-target.md) | Naming the log, test, hardware run, capture, artifact, or attestation that proves the claim |
| 04 | [04-recovery-baseline.md](04-recovery-baseline.md) | Recovery path documented before any lockout capable feature is enabled by default |
| 05 | [05-pins-upstream.md](05-pins-upstream.md) | Upstream docs, commits, digests, and action SHAs as part of the claim |
| 06 | [06-notification-retention.md](06-notification-retention.md) | What notification/evidence is stored, where, how long, and what is excluded |
| 07 | [07-prod-test-separation.md](07-prod-test-separation.md) | Declaring the artifact classes touched: production, dev/test, installer, firmware, lab only |
| 08 | [08-ci-hardware-boundary.md](08-ci-hardware-boundary.md) | Testable without main CI/hardware, or explicitly blocked on a named lane or board |
| 09 | [09-promotion-lifecycle.md](09-promotion-lifecycle.md) | FUTURE, planned, designed, implemented progression and the watch list |
| 10 | [10-applied-case-studies.md](10-applied-case-studies.md) | NASA lifecycle reviews and ADRs as published precedent, mapped to the source doc applications |

## Research summary

- Results collected: 141 (117 unique from the first dig pass plus 24 from 2 redo digs). All 141 weighted, none unresolvable.
- Weight split: 29 results at weight >= 0.5 (authoritative backing), 112 results below 0.5 (weak backing, labeled as such in the docs).
- Jev requests: 34 total to /api/decide via clef (1 outline score request with 10 questions, 24 noul weighting batches of 5, 2 redo weighting batches, 3 preflight probes). Usage: 24639 input tokens, 0 output tokens.
- Digs: 22 searXNG queries total (20 first pass, 4 across 2 redos), all returning HTTP 200.
- Redos: 2 (docs 07 and 09, whose first pass digs returned mostly sub 0.5 sources; each redone once with different queries per the redo rule).
- Skipped docs: none. All 10 subtopics validated as load bearing or marginal by the score metric and all digs came back authorable.

Preflight 2026-10-05: searXNG 66 results healthy; /api/decide (clef) 200.

## Notes

- The strongest sources per gate: GitHub Actions SHA pinning policy changelog (0.95), NIST SP 800-207 implementation pages (0.95), Dell TPM lockout recovery (0.94), NASA project lifecycle reviews (0.95), 2 CFR 200.517 and 17 CFR 210.2-06 retention rules (0.81/0.87), AWS ADR process (0.79).
- Docs 07 and 09 rest primarily on sub 0.5 sources even after redo; the affected claims are labeled weak backing in the text rather than presented as settled.
- The source doc itself is not copied into the corpus; its gate table, recovery baseline, and 5 recorded applications are cited inline as the topic document.
