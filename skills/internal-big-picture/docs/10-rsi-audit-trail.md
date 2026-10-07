# 10 - The skill's RSI history and attestation coverage

Scope: the source doc's own recursive-self-improvement cycle history (10 cycles plus ship on 2026-07-29, plus the 2026-08-06 attestation-cycle entries) and its attestation-coverage record inside the corpus RSI chain.

Ground source: yubi-OS/yubiOS skills/internal-big-picture/SKILL.md (source doc). This is an internal-record subtopic, no dig.

## The 10-cycle arc (2026-07-29)

The source doc records a complete bounded RSI run, one edit per cycle, each cycle's hypothesis and re-map result logged in the changelog (source doc):

1. **v1** established the skill from deep-research synthesis: 10-primitive spine, mapping table over roughly 50 skills plus key docs/refs, the synthesis template, and the operator-experience gap marker.
2. **Cycle 1** ran a fresh-context subagent gap-map; it surfaced 3 critical gaps at LxS 20 each, including the CISA ZTMM v1.0-vs-v2.0 drift and the unargued composition overlap with 0pointer-mastery. Fixpoint NOT reached.
3. **Cycle 2** closed the source-version staleness gap by adding the Source versions used block and updating CISA/HITRUST lines to v2.0 and v11.x facts. Result: PARTIAL fixpoint, 9 new gaps, top 4 at LxS 12.
4. **Cycle 3** added the Value-add vs 0pointer-mastery subsection, closing the composition-overlap gap at LxS 20 to 4. Result: FAIL fixpoint under the single-intent protocol.
5. **Cycle 4** added the How-to-validate-a-cell protocol and backfilled the cycle-2/3 changelog TBD markers. Result: PARTIAL fixpoint; the LxS 20 validation gap closed to 0.
6. **Cycle 5** added the Per-source vocabulary glossary with the 5 cross-source semantic traps. Result: substantively closed but with 6 new gaps, the top one being a changelog overclaim (the entry had claimed an anti-pattern and placement that were not actually added; corrected retroactively).
7. **Cycle 6** added the 3-question calibration gate plus its anti-pattern and red flag, closing the no-calibration-gate gap at LxS 16 to 0.
8. **Cycle 7** added the worked example (the remote attestation endpoint) demonstrating the template end to end.
9. **Cycle 8** replaced the blanket re-pin SLA with the per-source cadence table, closing the mixed-cadences gap at LxS 12 to 3.
10. **Cycle 9** pinned the version citations to specific values (CSF v11.7.0, no UDM v3 wildcard) and removed the inline honesty-note contradiction.
11. **Cycle 10** added recursive-self-improvement as step 0 of the loading order and aligned the verification checklist to the cycle 6-10 additions (10 bullets became 14).

## The ship record

After cycle 10 the requested cycle count was satisfied. Final status: 11 of 14 cycle-1 carryover gaps closed at LxS >= 6; 3 gaps at LxS 12 noted-but-deferred under the single-intent protocol; none at LxS >= 15 remaining open. The skill shipped local-only (not exported to yubi-OS/agent-skills or yubi-OS/yubiOS), per the user instruction "no repo export yet". Frontmatter validated via js-yaml: name matches ^[a-z0-9-]{1,64}$, description 953 characters (under the 1024 limit), closing --- intact. Final artifact: 510 lines, about 36 KB at ship time. The recorded recommendation: a v1 to v2 upgrade only after the next systemd stable release or a new ZTMM version, per the re-pin triggers (source doc).

## The audit-trail discipline visible in the history

Three process lessons are recorded in the changelog itself, and they are part of what the corpus preserves:

1. **Changelog overclaim is a defect class.** Cycles 5 and 6 both logged entries that claimed more than the edit delivered (a claimed anti-pattern and placement that were not added; a mis-attributed mapper). Both were corrected retroactively in the changelog rather than silently, which is the fixpoint-rule behavior the parent skill expects.
2. **Backfill is mandatory.** Cycle 2 and cycle 3 left "Result: TBD" markers; cycle 4 closed them as a named process gap, and cycle 10 backfilled cycles 7 through 10 inline.
3. **Single-intent protocol.** Every cycle edited one thing. This left 9+ Extend gaps unchanged across cycles 2 and 3 by design; the protocol trades breadth for verifiability per cycle.

## The 2026-08-06 attestation cycles

Three later audit-trail entries record that the skill already covers all 10 canonical primitives (cycle 5), all 6 movable corpus-priority primitives (cycle 6), and all 5 remaining movable primitives (cycle 7), so no primitive closure was needed in any of the 2026-08-06 rounds (source doc).

## The attestation-coverage entry

The source doc carries an attestation-coverage section from the curve-guided-rsi cycle-5 substantive edit: the skill's fit coordinate was (u=0.056, v=0.266) with PC1+PC2 = 0.4615 and holdout R-squared = +0.2244 on the expanded 69-skill corpus (63 existing plus 6 new from deep research). Its role in the attestation layer: this skill is the canonical 10-primitive reference, every other skill's primitive contribution is measured against this map, and downstream consumers that reason about attestation coverage (the yubiOS CI attestations gate per sigstore-rekor-v2, the audit-evidence rollup per audit-evidence-packaging, the 10-primitive map itself) credit this skill's contribution. Any change to the skill should be reviewed for impact on attestation coverage; attributable gaps are tracked in the cycle-5 run log at refs/curve-guided-rsi-v2-cycle5-deep-research-2026-08-04.md on yubi-OS/yubiOS (source doc).

## Why the corpus keeps this history

The history is the audit trail that makes the skill's other claims trustworthy: the mapping table's validation protocol (doc 05), the calibration gate (doc 07), and the version pins (doc 03) all exist because specific RSI cycles added and verified them. A reader who wants to know whether a section is load-bearing or incidental can trace it to its cycle entry in the source doc's changelog.
