# 05 - Cost of being wrong: the reversibility tiers

Scope: Step 3 of the discipline. The 4 tiers from trivially reversible to irreversible, the verdict each tier earns, and the external grounding for the blast-radius framing.

## The 4 tiers

Step 3 of the source doc (yubi-OS/yubiOS skills/human-for-feasibility/SKILL.md, "Is the cost of being wrong low?") assigns each undocumented decision to one of 4 reversibility tiers, each with a fixed verdict:

1. Trivially reversible (rename, format, file move, one-line edit) -> infer without asking.
2. Reversible with low cost (add a dependency, choose a library, change a config) -> infer but flag.
3. Reversible with high cost (architectural decision, schema choice, API contract) -> ask if no other evidence.
4. Irreversible (production deploy, public API change, data migration, financial commitment) -> ask explicitly, even with prior evidence.

The gate logic: if cost is low, infer and proceed. If cost is high and Steps 1 to 2 did not surface an answer, continue to Step 4 (source doc).

Tier 4 is the sharpest rule in the skill: it overrides the documented-anywhere ladder. A prior session that approved a production deploy does not license the next deploy without asking. The ask is attached to the action class, not to the state of the evidence.

## The two-way-door grounding

The tier structure matches a well-known decision framework. Farnam Street's writeup on reversible and irreversible decisions describes most decisions as changeable, reversible "two-way doors": "If you've made a suboptimal Type 2 decision, you don't have to live with the consequences for that long", while one-way doors demand slow, deliberate treatment (https://fs.blog/reversible-irreversible-decisions/, weight 0.29, weak backing, sub-0.5). The source doc's tiers are a finer-grained version of the same axis: 4 bands instead of 2, with the ask-threshold sitting between "reversible with high cost" and "irreversible".

## Blast radius: why irreversibility is not binary

The production-operations literature adds the concept the tiers implicitly use: blast radius, "the set of systems, users, and business processes that an automated action can affect, directly or as a side effect, if the action turns out to be wrong: wrong target, wrong timing, wrong assumption" (https://www.algomox.com/blogs/safe-automation-approvals-rollbacks-and-blast-radius/, weight 0.16, weak backing, sub-0.5). A related practitioner piece on agent guardrails argues the production pattern is "one cost chokepoint, a no-shell tool allowlist, idempotent steps, and pre-execution denial" (https://omidsaffari.com/blog/production-ai-agent-guardrails-blast-radius-playbook, weight 0.28, weak backing, sub-0.5), and another survey warns that unguarded automation that deletes, resizes, or shuts down resources is "one bad rule away from an outage" (https://multicloudoptimization.com/blog/automation-guardrails-that-prevent-outages/, weight 0.12, weak backing, sub-0.5). All weak-backed, but the shared thesis is independent of the source doc: for irreversible-class actions, the control must fire before execution, not after. That is exactly why the source doc routes tier 4 to an explicit ask even when evidence exists.

## Reading the tiers in agent practice

The tiers translate directly into agent behavior:

- Tier 1 actions should never generate a question. A rename or reformat the user must approve is pure friction (source doc's "infer without asking").
- Tier 2 actions earn the "infer but flag" treatment: proceed, but record the choice in the Inference Audit with the reversal path (source doc, "The Output").
- Tier 3 actions are the honest gray zone. The source doc's "ask if no other evidence" is the exact seam between inference and asking: an architectural choice with a citable convention (Step 2) is inferable; one with no convention and high undo cost is not.
- Tier 4 actions ask, always, and the question should present the action, the cost, and the reversal position ("this is what I am about to do; it is not undoable").

## Failure modes at the seam

The source doc's anti-patterns name the 2 seam failures:

- Lazy inference: inferring a decision whose cost of being wrong is high AND no documented evidence exists. "This is overconfidence" (source doc).
- Silent high-cost inferences: inferring a decision that costs a lot to undo without flagging it in the audit. The audit exists to surface these (source doc).

Both red flags reappear in the Verification checklist: "No silent inferences on irreversible / high-cost / value-laden decisions" and "No lazy inference: high-cost decisions with no documented evidence were surfaced, not silently inferred".

## Takeaway

Classify every undocumented decision into the 4 tiers before deciding how to proceed. Trivial is silent, low-cost is flagged, high-cost is asked without other evidence, irreversible is asked always. The tiers convert a vague "should I check with the user?" into a lookup.
