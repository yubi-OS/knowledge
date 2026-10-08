# 08 Anti-Patterns, Red Flags, and the Verification Checklist

Scope: the 10 anti-patterns, the 9 red flags, and the post-run verification checklist, all internal-record from the source doc. This is an internal-record subtopic, no dig: yubi-OS/yubiOS skills/repo-refs-skill/SKILL.md is the sole source.

## Anti-patterns (source doc)

1. Reading refs/ docs via the list endpoint's truncated fields. The list returns name, size, sha only; the 9-D coverage regexes need the full body via GET /contents/refs/{name} or GET /raw/refs/{name}.
2. Joining via file name alone. Names are short and noisy: rsi-five-skill-pass-2026-07-29.md and repo-history-skill-cycle-2-2026-08-07.md both contain "rsi". Always join on body content.
3. Joining via fuzzy date matching. The source doc records that refs/*-2026-08-04.md covers 7 distinct topics (bootc, fractalrabbit, package-floor, release-gate, slsa-l3, validate-input-shape, workflow-*). Date alone is not a topic.
4. Treating size: 0 as missing. Empty files exist in refs/ (cycle stubs awaiting fill); their coverage is the zero vector and sparse-cell detection surfaces them correctly.
5. Running RSI on the cached archive without first refreshing. The cache is a snapshot; the cycle's first step is always refresh.
6. Forgetting the /tmp wipe rule. Every push to the repos runs in a single bash tool call, per PROJECT_RULES.md.
7. Skipping the cycle-1 NSS re-map. Without it the primitive basis is uninformed by the corpus's actual coverage distribution.
8. Pushing deep-research output to session/ only. The canonical landing zone is yubi-OS/yubiOS refs/<topic>-YYYY-MM-DD.md; session-only outputs do not survive the session (per parallel-deep-research and PROJECT_RULES.md line 38).
9. Fitting on agent-skills refs/ instead of yubiOS refs/. The mirror was sparse by design (3 files vs 129) and a fit on it would degenerate at N < 20. The mirror is retired 2026-09-24; yubiOS is the single target.
10. Treating cache invalidation as silent. If the cache is older than 7 days the skill must WARN, not just re-fetch, because the cached last_run_timestamp might miss squash-merged refs/ additions.

## Red flags (source doc)

- PC1+PC2 below 0.40: the curve-fit quality gate failed. Either the corpus has insufficient variation (N < 20, no decomposition) or the primitive basis is wrong; the cycle-1 NSS re-map flags which primitives are near-constant so they can be dropped.
- Norm different from 1.0 within 1e-6: the S2 lift has a numerical bug. Chordal distance is bounded by 2.0 (antipodes); a norm above 1.0 means re-derive the lift.
- Negative delta for the geodesic winner: the geodesic-only criterion is mis-applied. Either flip sign and pick the smallest d_post, or surface the failure.
- All candidates negative delta: the corpus is at a local geodesic minimum; defer to Stage 3 of the full corpus fit.
- Sparse-cell count above 50% of corpus: the primitive basis is wrong (too many near-constant primitives); re-derive via NSS.
- Mobius refinement train R^2 at or below 0: the basis cannot be improved by reparameterization; freeze phi_theta at identity and skip future refinements.
- Cache file over 7 days old AND refresh fails: the cache is the only honest state; surface the failure to the user, do not silently fall back to partial refresh.
- A deep-research topic that produces no new sparse cell: the synthesized output was redundant with existing refs/ docs; drop the dispatch or dispatch under a more specific sub-topic.
- last_run_timestamp skips a date (cache says 2026-08-04 but a refs/*-2026-08-04.md doc was added in the window): the incremental refresh missed it; force a full refresh.

## Verification checklist (source doc)

After applying the skill, check:

1. Cache file written at session/repo-refs-archive-<repo>-<date>.json.
2. Fit metrics written at session/repo-refs-fit-<repo>-<date>.json.
3. Human-readable summary pushed to refs/repo-refs-coverage-map-<repo>-<date>.md on the target repo.
4. last_run_timestamp updated in the cache.
5. Norm 1.0 within 1e-6 (unit norm assert).
6. PC1+PC2 at least 0.40 (curve-fit quality gate).
7. 0 <= c.sum() <= 9 (valid binary coverage).
8. Mobius identity cross-ratio preserved on 100 held-out 4-tuples when phi_theta is fit.
9. Sparse-cell count finite and below corpus size.
10. At least 3 of 9 primitives survived the near-constant filter (above 10% and below 90% coverage).
11. All 129 (or actual count) refs/ files attempted in the fit.
12. Deep-research cycle: 3 to N parallel subagents dispatched per parallel-deep-research with outputs in session/subagent-<id>/.
13. Deep-research cycle: synthesized output pushed to yubi-OS/yubiOS refs/<topic>-YYYY-MM-DD.md.
14. RSI cycle: bounded recursive-self-improvement loop applied with cycle cap 3 or an explicit user override.
15. Push made in a single bash call per the /tmp wipe rule.
16. yubi-OS/yubiOS received the skill or the coverage map.
17. No fabricated file names, OMN IDs, or PR numbers, per PROJECT_RULES.md "PR diff verification, always read the patch, not the message".

## The cycle-2 and cycle-3 evidence

The source doc's changelog shows the gates working live. Cycle 2: PC1+PC2 0.4604 (gate pass, up from cycle 1's 0.4447), sparse cells 57/130 = 43.8%, down from 50.8%, closing the red flag. Cycle 3: PC1+PC2 0.4686, sparse cells 49/130 = 37.7%, all 3 fixpoint conditions pass, and the RSI loop terminated at the 3-cycle cap with has_verification_plan and has_evidence at zero candidates (fully covered across the corpus).
