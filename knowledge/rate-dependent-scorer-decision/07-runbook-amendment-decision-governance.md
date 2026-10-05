# 07: Runbook amendment and decision governance

Scope: how the option B decision ships: runbook amendment not code, the re-evaluation trigger, and the jev qualification record.

## The qualification record

The decision was qualified through the worker decision API before adoption (source: yubiOS refs decision doc "Rate-dependent scorer decision", 2026-10-02, internal; jev qualification ran on worker /api/decide, task taef8923-2bee-40f4-856b-21477e86ea68). Three numbers carry it:

1. scorer_option: B at 0.94 confidence, with A at 0.06 and C at 0.00.
2. b_no_new_noise: 0.67. B's bounded noise dimension is usable but not certain not to interfere; the pass-spread reporting requirement is named as the safeguard.
3. Interpretation: adopt B as the round protocol and re-evaluate after one round's pass-spread data.

The low-confidence companion score is the honest part of the record: the model was nearly certain about the option (0.94) and only moderately certain B introduces no new noise (0.67), so the decision carries an explicit safeguard rather than an assumed clean bill.

## Runbook amendment, not code

The recommendation ships as a runbook amendment, not code: rounds re-grade each edited row with 2 independent passes, feed both passes to /visco/persistence, and report the pass spread with the round (source: yubiOS refs decision doc, 2026-10-02, internal). The distinction matters operationally. A runbook is a documented process to achieve a specific outcome, consisting of a series of steps someone follows to get something done (source: https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/ops_ready_to_support_use_runbooks.html, jev weight 0.955). The protocol change alters what each round does, not what the worker computes: the persistence endpoint already accepts the multi-pass shape and already reports per-pass statistics (doc 02), so zero code change is the testable claim behind the amendment.

Because the change is procedural, the re-evaluation trigger is also procedural: if pass spread stays near zero across a full round, revisit option C with a wider effect to measure (internal). A code-level change would have made that revisit a migration; a runbook amendment makes it a paragraph edit.

## Decision-record form

The source decision follows the architecture decision record shape: a short document capturing a single decision with the decision, the context for making it, and significant results or consequences (source: https://martinfowler.com/bliki/ArchitectureDecisionRecord.html, jev weight 0.872). Microsoft's guidance frames the same artifact as recording decisions, justifications, and implications in the design process (source: https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record, jev weight 0.947), and the ADR community site collects the format's conventions (source: https://adr.github.io/, jev weight 0.783). The 2026-10-02 refs doc maps onto that structure directly: question, 3 options with costs, recommendation, qualification numbers, revisit condition. Lower-weight dig results in this space (the GitHub ADR repository at jev weight 0.360, the lightweight-ADR template repo at 0.430, a Medium essay at 0.102) are background only and are not used substantively here.

## What the governance loop closes

The full loop the decision closes (internal, assembling docs 01 through 05):

1. A deterministic single pass collapses R to a constant, so the rate dimension is unmeasured (doc 01).
2. The viscoelastic framing says recovery is characterized across repetitions, and the persistence endpoint was already built to consume repetitions (doc 02).
3. K = 2 or more independent passes supply those repetitions at minutes of cost, with pass spread as the reported statistic (doc 03).
4. The noise accounting justifies not going further: a 0.64 dBc effect inside a 5.77 dBc pass band rules out adding stochastic noise now (docs 04, 05).
5. The safeguard and the revisit condition keep the decision falsifiable: after one round of pass-spread data, either the rate dimension is live or the protocol reopens.

The governance property worth keeping is that the weakest number in the record (b_no_new_noise at 0.67) is bound to a concrete reporting duty, not to optimism. That is the pattern this corpus recommends: low-confidence assumptions get instrumented.
