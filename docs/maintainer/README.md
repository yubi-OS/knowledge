# yubiOS Maintainer Guide Corpus

Knowledge corpus explicating `yubi-OS/yubiOS docs/MAINTAINER.md` (the maintainer playbook): maintainer responsibilities, review standards, merge and release discipline, and the governance the doc records. The source doc is the primary source of record; every doc below cites it for its grounding spine and adds dig-backed external detail where the doc names external mechanisms.

## Docs

1. [01-branch-and-pr-policy.md](01-branch-and-pr-policy.md) - `docs/research` planning lane, work-named implementation branches, no routine branch deletion, and the summary/validation/known-inconsistencies PR bar with maintainer-merge discipline.
2. [02-source-of-truth-map.md](02-source-of-truth-map.md) - The one-topic-one-file authority hierarchy (PINNED, ADR, SPEC, MITIGATE, FUTURE, BLOCKERS, TODO, refs/) and the historical-fragment override rule.
3. [03-research-cycle-checklist.md](03-research-cycle-checklist.md) - The 7-step cycle from scoped reading through primary-source verification, dated refs/ records, propagation, inconsistency flagging, and PR-plus-issue closure.
4. [04-consistency-flags.md](04-consistency-flags.md) - The 4 standing corrections, including the systemd directive pair (`RestrictFileSystems=` existing BPF-LSM limiter versus the v261 `RestrictFileSystemAccess=` addition), dig-backed.
5. [05-ci-triage-rules.md](05-ci-triage-rules.md) - Retry only likely-transient failures, deterministic failures become fixes or blockers, old-sha reruns do not validate main, narrow trigger edits, outcomes in the motivating issue/PR.
6. [06-release-hygiene.md](06-release-hygiene.md) - Release provenance citations (branch, commit, workflow run, artifact/tag), digest bumps update PINNED.md with floor evidence, classification before publication.
7. [07-security-primitive-coverage.md](07-security-primitive-coverage.md) - The 5 primitive coverage sections (attestation, trust chain, least privilege, continuous detection, cryptographic identity) with Keylime dig-backed strong and framework comparisons labeled weak.
8. [08-drift-check-governance.md](08-drift-check-governance.md) - The dated drift-check entries, additive classification, and the Jenny-merges discipline verified across rounds 9 through 11.

## Research summary

- Results collected: 24 (4 searXNG queries, 2 per web-shaped subtopic; 6 internal-record subtopics skipped digs by design).
- Weight split: 12 results at weight >= 0.5 (authoritative backing), 12 below 0.5 (labeled weak where cited).
- Jev: 3 requests (1 outline validation of 8 score questions, 2 noul weighting batches of 12), usage 3532 input / 612 output tokens, via https://api.defapi.org/api/v1/decisions direct (per 2026-10-06 speed optimization), model typesafe/jev-1.13.
- Redo counts: 0 (both digs returned strong results on the first attempt; the 12 weak results are aggregator or marketing class sources scored honestly rather than rescored).
- Skipped docs: none. All 8 outline subtopics kept (no score-0 subtopics; the two marginal subtopics, 04 and 07, kept under the dig-strength rule).
- Gaps: the in-toto/SLSA/Sigstore comparative relationship in doc 07 rests on weakly backed sources (0.12 to 0.31); the doc labels these claims weak and defers to the source doc. No primary-upstream re-verification of the systemd v261 directive addition beyond release coverage was attempted within dig budget.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide via https://api.defapi.org/api/v1/decisions (typesafe/jev-1.13), agent-side probe skipped for speed per mint brief.
