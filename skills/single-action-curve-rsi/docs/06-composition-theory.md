# 06 - Composition Theory: Lemma 1, Theorem 1, and the Dispatch Rule

Scope: the formal guarantees that make the atom safe to compose: the atom invariant (Lemma 1), linear composition across a corpus (Theorem 1), monotone non-decrease over a sequence (Corollary 1), and the atom-based dispatch rule that replaces the parent's Stage 3.

This corpus explicates the skill documented at yubi-OS/yubiOS skills/single-action-curve-rsi/SKILL.md (source doc). The atom's value beyond its own file is that its guarantee composes: if every atomic action is non-regressing, any sum of atomic actions is non-regressing. The source doc states this in 3 formal results plus an operational rule.

## Lemma 1: the atom invariant

Lemma 1 states: for any file f and any single-primitive-flip action selected by the geodesic-only criterion, the delta d_pre minus d_post is greater than 0 (source doc). The proof given in the source doc is short. The criterion selects the action with argmin d_post over the candidate set. By construction every candidate flip sets exactly one missing primitive to 1 and leaves the others unchanged. The argmin is a strict minimum only if at least one candidate has d_post below d_pre. If all candidates had d_post at or above d_pre, the argmin would tie at d_pre and delta would equal 0, so a negative delta cannot be selected (source doc).

Note the precise strength of the claim: selection guarantees delta at least 0 in the degenerate all-tie case and delta greater than 0 in the strict case. The recorded experiment reinforces this: 0 negative deltas across 20 cycles, because the action space of single-primitive appends is intrinsically monotone on geodesic distance; no action removes coverage (source doc).

The empirical literature on monotone quantities supports the framing: a sum of non-negative terms is non-negative and its partial sums never decrease (Monotone convergence theorem, weight 0.58, https://en.wikipedia.org/wiki/Monotone_convergence_theorem; MIT 18.100B lecture on the monotone convergence theorem, weight 0.85, https://ocw.mit.edu/courses/18-100b-real-analysis-spring-2025/mit18_100b_s25_lec05.pdf; University of Waterloo slides on the same theorem, weight 0.76, https://www.math.uwaterloo.ca/~baforres/UCM138/Lectures/Chapter5/SLIDESMCT.pdf). Series with non-negative terms either converge or diverge to infinity; they never oscillate (Edinburgh course notes on convergence of non-negative series, weight 0.54, https://uoe-school-of-mathematics.github.io/MATH08081_IMA/Ch3.S4.html).

## Theorem 1: linear composition

Theorem 1 states: for a corpus C with N files, any multi-file action where each per-file component is an atomic action has corpus-level delta equal to the sum of the per-file deltas (source doc). If every atomic delta is at least 0, the corpus delta is at least 0, and it is strictly positive if at least one atomic delta is strictly positive.

The proof in the source doc: each atomic action operates on its own file independently; the per-file coverage matrix and S2 point are unchanged for all other files. The geodesic distance of a file is a function of that file's coverage alone. The linear sum of non-negative scalars is non-negative (source doc). This is the standard modularity argument: when subsystems are independent, a property verified per component transfers to the composition without re-verification, which is the core value proposition of compositional and modular verification approaches (Springer chapter on compositional and modular approaches to concurrency, weight 0.65, https://link.springer.com/chapter/10.1007/978-3-031-66676-6_2). Monotone here is used in its precise sense: a sequence that never decreases, a property stronger than convergence and easier to check (Merriam-Webster on monotone, weight 0.84, https://www.merriam-webster.com/dictionary/monotone).

## Corollary 1: monotone non-decrease

Corollary 1 extends Theorem 1 to sequences: for any sequence of K corpus actions where each is a tuple of atomic actions, the cumulative corpus delta is monotone non-decreasing, because partial sums of non-negative terms are non-decreasing (source doc).

## The atom-based dispatch rule

The operational form, for use in curve-guided-rsi Stage 3 and hyperspherical-harmonic-curve Stage 3 dispatch, is (source doc):

For each sparse_cell in the equal-area partition of S2 at resolution r: identify the file whose S2 point lies in the sparse cell; run one single-action atom cycle on that file, producing d_pre and d_post; accumulate the delta into the corpus total. Return the accumulated delta. Every parent dispatch becomes a sum of atomic dispatches, and the parent's Stage 5 verification metric (sparse-cell-count delta) inherits the only-positive-delta property by construction (source doc).

The source doc flags one anti-pattern for parent Stage 3: dispatching self-archaeology, a different protocol whose gap-map is not an atomic action and can produce negative delta on the corpus. The replacement is atom-based dispatch per this rule (source doc).

## What the theorem does not claim

The composition guarantee is linear in deltas, not in effort: 20 atomic cycles cost 20 edits even though their deltas simply add. It also does not claim convergence: monotone non-decrease allows infinite non-decreasing sequences that never reach a target, which is why the lifecycle adds a separate fixpoint detection rule rather than relying on the theorem (doc 09). And it presumes the independence premise: if an edit to one file somehow changed another file's coverage, the per-file delta sum would no longer describe the system. Within the atom's action space, single-primitive appends to one file, the premise holds by construction (source doc).
