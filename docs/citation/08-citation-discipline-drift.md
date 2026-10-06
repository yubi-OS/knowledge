# 08 - Citation discipline and drift checks

Scope: the citation doc's own enforcement layer: the least-privilege, declarative-policy, and continuous-monitoring coverage notes, and the 2026-09-18 drift-check entries that tie the document to citation-integrity commit audits. Internal-record subtopic, no dig; every claim here is sourced to the source doc.

## The coverage notes

Near the end, the source doc carries 3 integration notes that tie the citation work to the rest of the yubiOS hardening surface [source doc: yubi-OS/yubiOS docs/CITATION.md]:

1. Least-privilege coverage: the document applies least-privilege hardening including Linux capabilities (drop plus ambient), ProtectSystem and ProtectHome, rootless execution, dynamic user, RBAC, and PrivilegeBoundary; sandbox or jail idioms (bwrap, nsjail, landlock, seccomp) are used where isolation greater than container is required.
2. Declarative policy coverage: the document integrates with the yubiOS declarative-policy substrate, meaning OPA and Rego policy files, signing-config JSON, and policy-as-code workflows; policy gates are named at the integration point and policy evaluation is the gate, not an afterthought.
3. Continuous and adaptive coverage: the document supports the yubiOS continuous-monitoring layer, meaning runtime detection with falco, tracee, tetragon, and kubeArmor, adaptive policy, and real-time monitoring; the document is observable from the runtime-detect surface, and alerts and metrics feed into the audit-evidence rollup.

These notes sit below the reference index and read as boilerplate integration tags applied across the yubiOS docs corpus. For the citation doc specifically they assert that citation maintenance itself is subject to the same policy gates and monitoring surfaces as code changes.

## Drift check 1: wayfinder round 10, cycle 14

The source doc records a drift check dated September 18, 2026, for wayfinder round 10, cycle 14 [source doc: yubi-OS/yubiOS docs/CITATION.md]. Its text: the citation-discipline doc, this round's citation-integrity audits (refs-side, cycles 14/34-35) are the doc's own rule applied to the round's records; note additive.

Two things follow from that entry. First, the citation-integrity audits exist and run refs-side at a per-cycle cadence, with cycles 14, 34, and 35 named. Second, the doc explicitly classifies the audit relationship as "note additive": the audits apply the doc's rule to new records without changing the rule itself. This is a self-application pattern: the document about citing sources is audited by applying its own standard to the records it and its neighbors produce.

## Drift check 2: wayfinder round 11, cycle 20

A second drift check is dated the same day, September 18, 2026, for wayfinder round 11, cycle 20 [source doc: yubi-OS/yubiOS docs/CITATION.md]. Its text: CITATION.md (round-9 cycle-4 repaired): the citation discipline's rule is what the round's commit audits operationalize; note additive.

This entry adds 2 facts. The document itself was repaired in round 9, cycle 4, meaning the citation doc has its own repair history inside the audit chain. And the commit audits of round 11 operationalize the citation discipline's rule: the audits are the enforcement mechanism, not a parallel process. Both drift checks end with "note additive", the doc's way of saying the audits extend coverage without modifying the standard.

## What the drift checks imply about the discipline

Reading the 2 entries together, the source doc's citation discipline is a loop with 3 parts [source doc: yubi-OS/yubiOS docs/CITATION.md]:

1. The rule, stated once in the maintenance section: prefer primary upstream documentation, release notes, standards, and source repositories when updating architectural claims.
2. The audits, run per cycle on the records each round produces: citation-integrity audits refs-side, and commit audits that operationalize the rule.
3. The repair path: when the doc itself drifts, it is repaired (round 9, cycle 4, in the record), and the repair is noted in the doc so the audit chain stays self-describing.

The 2026-07-11 last-reviewed stamp in the maintenance section and the 2026-09-18 drift-check dates show the same document carrying its review cadence in-band: reviewers can read both the standard and the audit trail in 1 file. This is also why the corpus treats this subtopic as internal-record with no dig: the drift checks reference yubiOS's own wayfinder rounds and audit cycles, not external standards, and a web dig could only add noise to a claim whose entire source is the project's own audit log.

## Boundary

All content above is from the source doc. No external verification was attempted for the audit-cycle numbering (rounds 9 through 11, cycles 4, 14, 20, 34, 35) or for the coverage-note tool names; those are internal-record facts, and the doc at https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/CITATION.md remains the primary source of record for them.
