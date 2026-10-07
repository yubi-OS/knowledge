# 07 - The Inference Audit: the artifact that replaces upfront asking

Scope: the skill's required output. The 3-section format, the per-entry fields, and why a post-hoc review surface beats N upfront questions.

## The artifact

The source doc (yubi-OS/yubiOS skills/human-for-feasibility/SKILL.md, "The Output: The Inference Audit") requires that "for any non-trivial task that involved multiple decisions, [the agent ends] with an Inference Audit: a short list of the inferences you made and the asks you surfaced". The format has 3 sections:

### Inferred (proceeded without asking)
One entry per consequential inference, each carrying 4 fields (source doc):
- The decision.
- The source it was inferred from: convention, prior session, prior turn, memory, or workspace artifact.
- The default chosen.
- The cost if wrong (low, medium, or high) and the reversal path: how to undo it.

### Asked (surfaced to the user)
One entry per ask, carrying (source doc):
- The decision.
- Why it was asked: undocumented plus high cost, value-laden, or irreversible.
- The question actually asked.
- The user's answer, or "pending".

### Not surfaced (silent inferences on low-cost decisions)
One entry class for decisions that were trivial, reversible, or convention-following, which skipped the audit entry deliberately (source doc). This section is the honesty valve: it declares that silent inference happened and bounds what it covered.

The source doc closes with the rationale: "The audit is the user's review surface. They can scan it and correct any inference that was wrong. It's cheaper than asking all of them upfront."

## Why post-hoc beats upfront

The economics: N upfront questions cost N interruptions regardless of how many inferences were actually wrong. The audit costs 1 interruption-equivalent (a scan) and concentrates the user's attention on the decisions most likely to be wrong, because wrong inferences are flagged with their cost and reversal path. The design mirrors how the broader agent ecosystem treats decision transparency: decision-logging systems "capture why your AI agents make specific choices" with working implementation patterns (https://antigravitylab.net/en/articles/agents/antigravity-agent-decision-log-explainability-design, weight 0.25, weak backing, sub-0.5), and enterprise audit-trail guidance holds that AI agent audit trails support "compliance, explainability, and issue resolution" (https://www.miniorange.com/blog/ai-agent-audit-trail/, weight 0.13, weak backing, sub-0.5). Weak-backed, but both describe the same shape: record what was decided, why, and with what confidence, so a human can review after the fact.

The audit's entries are also structured for correction, not just review: each Inferred entry states its reversal path, so a user who disagrees can answer with "undo decision 2" instead of re-deriving the work. That maps to the explainability triad used in the literature: what was decided, why, and how trustworthy the decision is (https://medium.com/data-science-collective/can-we-trust-the-ai-agents-decision-explainability-through-audit-7f8526eb6d65, weight 0.15, weak backing, sub-0.5).

## What the audit enforces

The audit is load-bearing for 4 of the skill's anti-patterns (source doc):

- Silent high-cost inferences: "Inferring a decision that costs a lot to undo without flagging it in the audit. The audit exists to surface these."
- Infinite inference: "Inferring the same decision twice when the first inference was corrected. The audit catches this if you re-read it before re-deciding."
- Lazy inference: a high-cost decision with no documented evidence must appear in the Asked section, not vanish.
- Asking and inferring the answer: a vague answer recorded in the Asked section as pending or delegated, never as confirmation.

The Verification checklist makes the audit mandatory output: "Every inferred decision with a non-trivial cost was flagged in the Inference Audit" and "Inference Audit included at the end of the artifact (or referenced in chat)" (source doc).

## The red flag that polices it

"Producing an artifact without an Inference Audit at the end" is a named red flag (source doc). The audit is therefore not optional polish: an artifact produced under this skill without the audit section is, by the skill's own standard, incomplete. Not-surfaced is a legitimate entry; absence of the section is not.

## Placement

The source doc says the audit goes "at the end of the artifact (or referenced in chat)" (source doc, Verification). For a spec or design doc, it is a closing section. For chat-delivered work, it is the final message block. Either way it is addressed to the user, not to the log: it is a review surface, so it reads as prose a human can scan in under a minute.

## Takeaway

The Inference Audit converts the ask-vs-infer tradeoff from a per-decision interrupt into a single batched review. Every consequential inference gets a source, a default, a cost, and a reversal path; every ask gets its reason and its answer; every silent inference gets declared as out of scope. It is the mechanism that makes a default-to-inference posture safe.
