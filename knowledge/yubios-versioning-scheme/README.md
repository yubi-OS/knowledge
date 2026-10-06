# yubios-versioning-scheme: knowledge corpus

Minted 2026-10-05 from yubi-OS/yubiOS refs/yubios-versioning-scheme-2026-08-04.md (the yubiOS versioning scheme decision: semver v-prefixed release tags, immutable commit-SHA OCI tags, bump triggers, Jenny-cuts-tags governance).

## Documents

| NN | doc | scope |
|---|---|---|
| 01 | 01-semver-spec-mechanics.md | What SemVer 2.0.0 mandates: MAJOR.MINOR.PATCH grammar, pre-release and build-metadata suffixes, and the v-prefix convention. |
| 02 | 02-tag-taxonomy-oci.md | The two-layer tag model: human-facing release tags versus immutable commit-SHA OCI image tags, plus registry immutability support. |
| 03 | 03-bump-triggers-policy.md | What triggers MAJOR, MINOR, or PATCH in an OS image project and the pre-1.0 0.y.z caveat. |
| 04 | 04-tag-cut-governance.md | Release authority (who may cut tags), the pre-tag checklist, and post-tag verification. |
| 05 | 05-release-series-boundaries.md | Minor-version boundaries as release series markers and milestone-aligned cadence. |
| 06 | 06-mutable-tag-ban.md | Forbidden tag patterns: latest in CI, floating branch tags, partial version tags, and why pinning matters. |
| 07 | 07-scheme-compliance-audit.md | Verifying a live release history against the codified scheme: tag-to-commit checks, artifact verification, drift audits. |

## Research summary

- Results collected: 120 (top 6 per query across 20 searXNG queries over 7 subtopics)
- Weight split: 32 authoritative (jev weight >= 0.5) / 88 weak (< 0.5)
- Jev requests: 27 (1 preflight probe + 1 outline validation + 25 noul weighting batches), usage 19798 input tokens / 0 output tokens
- Redos: 3 (docs 04, 05, 07; first-pass digs were thin, re-dug with different queries per the REDO rule)
- Skipped docs: none
- Gaps: none skipped. Doc 04 (tag-cut governance) carries mostly weak backing because public "who may tag" governance literature is thin; its project-specific checklist derives from the source decision.

Per-doc results kept (total / authoritative >= 0.5): 01: 12/3, 02: 12/5, 03: 12/2, 04: 24/2, 05: 24/7, 06: 12/6, 07: 24/7.

Preflight 2026-10-05: searXNG 42 results healthy; /api/decide (clef) 200.
