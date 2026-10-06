# 04 - Reconcile: Classifying Findings

Scope: how the orchestrator folds reviewer findings back, the 4-class precedence order, and the discipline that prevents both rubber-stamping and reflexive deference. Internal-record subtopic, no dig. Grounding spine: `yubi-OS/yubiOS skills/doubt-driven-development/SKILL.md` (source doc, Step 4 and Red Flags).

## Reviewer output is data, not verdict

The source doc's Step 4 opens with the load-bearing sentence: "The reviewer's output is data, not verdict. You are still the orchestrator." Re-read the artifact text against each finding before classifying. Rubber-stamping the reviewer is the same failure mode as ignoring it (source doc).

This cuts both ways. The source doc's Guidelines state: "A fresh reviewer can be wrong because it lacks context. Don't defer just because it's 'fresh.'" Freshness is a property of the process, not evidence of correctness. And in the rationalization table, "The reviewer disagreed so I was wrong" is answered with: the reviewer lacks your context, disagreement is information, not verdict. Re-read the artifact, classify, then decide (source doc).

## The precedence order

For each finding, classify in this order; first matching class wins:

1. **Contract misread** - the reviewer flagged something specifically because the CONTRACT you provided was unclear or incomplete. Fix the contract first, re-classify on the next cycle. This class ranks first because a contract defect invalidates every downstream classification on the same artifact.
2. **Valid + actionable** - a real issue requiring a change to the artifact. Change it, re-loop.
3. **Valid trade-off** - the issue is real but the cost of fixing exceeds the cost of accepting. Document the trade-off explicitly so the user sees it.
4. **Noise** - the reviewer flagged something that is actually correct under context the reviewer did not have. Note it, move on, and ask: would adding that context to the contract have prevented the false flag?

(source doc, Step 4)

## The self-diagnosis loop built into noise

The noise class carries a hidden feedback mechanism. Each false flag prompts the question "would adding that context to the contract have prevented this?" If yes, the contract was the defect, and the next cycle's reviewer should receive the amended contract. This turns reviewer errors into contract improvements instead of discards.

## Related red flags

The source doc's Red Flags list the classification failure modes to watch for:

- Treating reviewer output as authoritative without re-reading the artifact text.
- Doubt theater: across 2 or more cycles where the reviewer surfaced substantive findings, zero findings were classified as actionable. You are validating, not doubting. Stop and escalate.
- Looping beyond 3 cycles without escalating to the user.
- Passing the CLAIM to the reviewer, which biases findings toward agreement and contaminates classification at the source.

## Why classification, not voting

The precedence order exists because the reviewer and the author hold different, incomplete information sets. The reviewer sees the artifact and contract cleanly but lacks runtime context; the author has the context but has demonstrated bias toward their own conclusion (documented in doc 01: anchoring weight 0.51 at https://link.springer.com/article/10.1007/s42001-025-00435-2, self-correction limits weight 0.68 at https://aclanthology.org/2024.tacl-1.78/). Neither party's raw judgment is authoritative; the classification step is where the two evidence sets are reconciled against the artifact text, which is the only shared ground truth.

## Worked classification example

Given a reviewer finding "the cache has no size bound; unbounded growth under sustained writes", the four classes resolve as follows. If the CONTRACT said "thread safety under the read-heavy workload" and never mentioned write growth, the finding is a contract misread (class 1): the reviewer flagged a real gap, but the fix is a better contract, and the next cycle re-reviews under it. If the contract did cover sustained writes, the finding is valid and actionable (class 2): add the bound and re-loop. If the contract scopes the artifact to a read-only replica where growth is impossible by construction, the finding is noise (class 4), and the follow-up question is whether the contract should have stated the read-only invariant explicitly to prevent the false flag. The valid trade-off class (class 3) covers the case where the bound is real but the workload makes unbounded growth unreachable and the fix would add eviction complexity the contract does not require: accept, and document why.

The example shows the precedence in motion: the same finding text lands in different classes depending only on the contract, which is why the source doc ranks contract misread first and why stripping the contract from the reviewer's input is a red flag (source doc, Red Flags).
