# 06 - The Bounded RSI Loop on the Archive

**Scope.** Stage 4: how the bounded recursive-self-improvement loop is applied to the archive itself, the cycle cap and override protocol, the four edit types, the fixpoint rule, and the single-action atom used for target-file RSI in Mode D.

This is an internal-record subtopic: every substantive fact comes from the source doc, `yubi-OS/yubiOS skills/repo-history-skill/SKILL.md`. No searXNG dig was run; the loop protocol is internal skill-family machinery. (Internal-record subtopic, no dig.)

## The loop, per cycle

The source doc defines each cycle as a fixed 7-step sequence (source doc):

1. Read the cached archive at session/repo-history-archive-<repo>-<date>.json.
2. Run the gap-map: the negative-skill-space 12-axis sweep over the archive's primitive coverage matrix.
3. Pick the top-1 gap and form a hypothesis-driven edit, one of four types: close, fix drift, sharpen, reposition.
4. Apply the edit to the archive. Concretely: if the gap is "PRs in corpus_as_pr lack has_linear_ref", the edit is to refetch the PR body and re-run the regex join.
5. Re-fit (Stage 1 plus Stage 2 plus Stage 3) and compare metrics.
6. Apply the fixpoint rule.
7. If fixpoint is not reached and cycle < 3 (or a user override was granted), continue.

The cycle cap is 3 as a soft-preference default, with the explicit user-override protocol inherited from the recursive-self-improvement skill's cycle 4 (source doc). Self-mode requires a fresh-context subagent for every cycle, because cycle 2 and later re-introduce author bias; doubt-driven-development is a per-hypothesis supplement, never a substitute (source doc, Interaction with Other Skills).

## The fixpoint rule

Three conditions decide whether the loop terminates (source doc):

1. No new substantive gaps opened.
2. Old gaps closed.
3. No new anti-patterns introduced.

All three must pass for a cycle to ship and the loop to stop. The source doc's cycle-2 and cycle-3 applications show the rule working: cycle 2 surfaced 5 gaps but recorded them as measured corpus facts, not invented ones, and passed all 3 conditions; cycle 3 reached full fixpoint and terminated the loop (source doc).

## The single-action atom (Mode D)

When one corpus item needs prioritized RSI without a full corpus fit, Mode D applies the single-action-curve-rsi atom to that single item: read the cached archive, isolate the target, compute (d_pre, d_post, delta), apply the edit if delta > 0, defer to the full corpus fit's Stage 3 if delta <= 0 (source doc). The composition rule inherited from the atom makes every cycle's edit one atomic action, with cumulative corpus delta monotone non-decreasing (source doc, Interaction with Other Skills).

## The measured run

The source doc records 4 cycles total, the last under explicit user override (source doc):

- Cycle 1 (2026-08-07): v1 established, gap-mapped; N=34, 3 of 9 primitives survived, PC1+PC2 0.7311, 0 sparse cells.
- Cycle 2: 3 regex fixes applied; N=248 (7.3x growth), 7 of 9 survived, PC1+PC2 0.7437, 3 sparse cells. Fixpoint not reached; continued.
- Cycle 3: 3 audit-gap edits applied (Linear creator field, since-filtered issues endpoint, spread-preserving Moebius loss); N=279, 7 of 9 survived, PC1+PC2 0.5721, 16 sparse cells. Fixpoint reached; loop terminated.
- Cycle 4 (user override): post-Mode-D re-fit; N=324, PC1+PC2 0.8534, top sparse cell Linear OMN-94 edited by appending the real API completedAt value 2026-07-25T10:10:35.427Z (not fabricated), bringing that item to 9 of 9 coverage.

## Carryover hypotheses

The source doc's post-fixpoint carryover list ranks future edits by cost (source doc): a semantic-similarity join (PR title to Linear title via embedding) as high cost to rescue has_linear_ref and has_cross_corpus_link on the PR-only sub-corpus; a Key Assumptions section in the SKILL.md body as medium; a regularized Moebius cross-ratio penalty as medium; pulling issues for the retired agent-skills mirror as low and already documented as a corpus fact.

The operative discipline for future runs: refresh first, one hypothesis-driven edit per cycle, measure before and after, apply the fixpoint rule honestly, and never extend the loop past the cap without an explicit user override.
