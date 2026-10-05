# 06 How Gap-Finding Itself Fails

Scope: How gap-finding itself fails: gap-finding theater, analysis paralysis, false gaps from intentional scope, and same-blind-spot risk between mapper and author.

## The four named failure modes

Negative-skill-space names its own failure modes in advance, before they occur (source doc origin: yubiOS refs/negative-skill-space-2026-07-28.md):

1. **Gap-finding theater**. Producing a long gap list that is performative rather than actionable.
2. **Gap-finding paralysis**. Surfacing so many gaps that nothing ships.
3. **False gaps**. Flagging something as a gap when it is intentional scope.
4. **Confident wrong gaps**. The mapper's confidence in a gap does not make the gap real.

Each has an analogue in a mature discipline, and the analogues supply both evidence and mitigation.

## Theater: the checklist that changes nothing

The closest analogue is compliance theater. Practitioner security writing defines it precisely: compliance theater happens when organizations implement controls to satisfy auditors rather than to reduce actual risk, and the false sense of security from passing an audit is often more dangerous than acknowledged gaps (https://lorikeetsecurity.com/blog/compliance-checkbox-security-theater, weight 0.23, weak backing). A second practitioner account sharpens the diagnosis: an entire category of compliance tooling rests on the flawed assumption that documenting a control is the same as verifying it works (https://goblacksheep.io/blog/compliance-theater-vs-actual-security, weight 0.19, weak backing). Compliance and security are not the same thing, and building real control beyond the audit checklist is the differentiator (https://www.pivotpointsecurity.com/compliance-theater-vs-true-security/, weight 0.18, weak backing).

The transfer to gap-mapping is exact: a 40-item gap map satisfies the mapper's sense of diligence the way a 40-control audit satisfies the auditor. The mitigation the framework adopts is the triage filter (doc 04): performative and intentional-scope candidates are dropped before scoring, and every surviving gap must carry an extend/pair/accept disposition. A gap with no disposition is theater by definition.

## Paralysis: over-analysis that stops the work

The second failure mode is documented in decision psychology under the name analysis paralysis: a state in which excessive analysis causes forward motion or decision-making to become paralyzed, so no solution or course of action is produced (https://en.wikipedia.org/wiki/Analysis_paralysis, weight 0.15, weak backing). Clinical summaries describe the mechanism: overthinking a problem to the point that it becomes more difficult to make a decision, often when people are overwhelmed by choices or information (https://www.verywellmind.com/what-is-analysis-paralysis-5223790, weight 0.87). Cleveland Clinic's health guidance makes the same point for a general audience: having choices is good, but weighing too many possibilities mires you in overthinking (https://health.clevelandclinic.org/analysis-paralysis, weight 0.97).

Gap-mapping is structurally prone to this because the 12-axis sweep is generative: it reliably produces 20 or more candidates per artifact. The framework's defenses are the score-then-rank step (likelihood times severity, so effort flows to the top of a short list rather than being spread across a long one), the 2-screen filter (performative and intentional-scope candidates never reach scoring), and the bounded recursion rule (one self-application per map, then stop; see doc 05). The bound matters most: without it, mapping an artifact becomes an infinite regress of meta-maps, which is paralysis elevated to a methodology.

## False gaps: when the boundary was the point

The third failure mode has no single external analogue because it is specific to artifact mapping. A flagged gap can be wrong in a specific way: not because the artifact handles the concern, but because the author excluded it on purpose and the exclusion is correct. Deliberately narrow tools are common and useful; expanding them is a bug, not a fix.

The framework's fix is a pre-mapping check: before sweeping, ask "is this artifact intentionally narrow?" If yes, the mapper records the intent and only maps within the intended scope, and the narrowness itself is documented as an accept disposition rather than worked around. The framework's own recursive pass applied this against itself and found the check was missing, which is the pattern the check exists to catch (source doc origin).

## Confident wrong gaps and the same-blind-spot problem

The fourth failure mode is epistemic. A mapper lists a gap with confidence; confidence is not evidence. The framework requires a validation step: for each gap, what evidence supports it? An unsupported gap is downgraded to a hypothesis, not shipped as a finding.

Deeper than individual false positives is the same-blind-spot risk: the mapper and the author share cognitive biases, so the mapper may skip the same kinds of questions the author skipped. A gap invisible to the author is plausibly invisible to a mapper who resembles the author. The framework's mitigation is to recommend cross-model or external review for high-stakes artifacts: have a different mapper, ideally a different model or a human reviewer outside the authoring context, run the sweep independently and diff the two maps (source doc origin).

## The meta-check: is the framework itself theatrical?

The source doc closes the loop honestly: some of its claimed unknown-unknowns may be performative, known-unknowns presented as unknown to seem rigorous, and there is no internal way to tell. The external-validation recommendation covers the method as well as any artifact: the discipline is trustworthy exactly to the degree that independent mappers running the same sweep converge on the same gaps, and that convergence has not yet been measured. Until it is, negative-skill-space is a structured hypothesis generator with strong priors, not a validated instrument.
