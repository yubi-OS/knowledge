# 04: Advisor review before build

**Scope:** Independent advisor review of generator and gate design before anything is built: catching structural confounds and ill-posed windows while they are cheap to fix, and logging falsifiable advisor predictions including their failures.

Grounding spine: the source doc `yubi-OS/yubiOS skills/falsification-corpus/SKILL.md`, plus searXNG digs weighted by jev noul.

## The advisor's job

The source doc's step 4 is short but strict: route the generator design and gate through an independent advisor before building anything. The advisor's job is to catch structural confounds (the source doc points at anti-pattern 6) and ill-posed windows while they are still cheap to fix. After build, both become expensive: a generator rewrite invalidates renders, and an ill-posed window discovered post-run makes the gate unfalsifiable.

The word "independent" is doing the work. Merriam-Webster defines independent as not influenced by other people or things (jev weight 0.87, https://www.merriam-webster.com/dictionary/independent). The advisor must not be the author of the design being reviewed, or the review degrades into a second opinion from the same blind spot.

## The adversarial stance

The review is adversarial in the technical sense: its purpose is to attack the design, not to approve it. Merriam-Webster defines adversarial as involving opposition (jev weight 0.81, https://www.merriam-webster.com/dictionary/adversarial); Cambridge defines it as involving arguing, or being likely to argue, against something (jev weight 0.73, https://dictionary.cambridge.org/dictionary/english/adversarial). A review that starts from the assumption the design is fine only finds failures that announce themselves. The falsification-corpus advisor is looking for the failures that stay quiet: a gate window that has no realization on the lattice, a class pair that cannot be distinguished once extent is controlled.

A weak-backed dig describes the same pattern in software governance: an independent pre-implementation design review where a fresh reviewer who did not author the design re-derives it, verifies its load-bearing claims empirically, and rules on the open design forks, with implementation proceeding only on the ratified design (jev weight 0.19, weak backing, https://davisjam.github.io/model-based-agentic-software-engineering/agent/governance-doc-controls/independent-design-review.html). The mechanism matches the skill's: fresh reviewer, empirical verification of load-bearing claims, a decision point before build.

## Logging advisor predictions

The source doc's distinctive move is that the advisor's predictions are logged too. They are falsifiable, and recording their failures keeps future reviews honest. The measured case: two advisor bias models predicted the wrong sign of render bias. The advisor is not treated as an oracle whose verdict closes the question; the advisor is another instrument under test, and the corpus falsifies its predictions the same way it falsifies the measurement instrument.

This closes the loop that makes the review durable. A reviewer who was wrong in the log is a reviewer whose next review carries a track record. A reviewer whose wrong predictions vanish teaches future sessions to over-trust reviews.

## What the advisor must catch

Two failure classes are named in the source doc:

1. **Structural confounds.** The example is anti-pattern 6: a near-degeneracy prediction without matched-extent controls. If the corpus predicts two classes read nearly equal but the classes also differ in extent, the prediction is untestable and the advisor should reject the design until a matched-extent control exists.
2. **Ill-posed windows.** The example is anti-pattern 3: a gate window written against imagined scales. "s ~ 16-64" is ill-posed when the lattice is [4,6,9,13,20,29,43,64] because no two-octave span exists there. The advisor should enumerate the lattice and check the window before the design is built.

Both are cheap to fix at design time and ruinous to discover at evaluation time, which is the entire economics of step 4.

## Placement in the pipeline

Advisor review sits after generator and gate design and before build. The order encodes a claim: the designs are complete enough to attack, and nothing has been rendered yet, so every attack that lands can be fixed by editing text rather than by re-running anything. Steps 5 through 7 (L-convergence calibration, live-route parity, real-data pass) then operate on a design that an independent reviewer already failed to break.
