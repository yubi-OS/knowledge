# Placement: normative documents versus receipts

**Scope:** Where different kinds of writing live in a corpus: ALL-CAPS normative documents in docs/, receipts and drift records in refs/, and why a drift check produces a dated record beside the document, never an appended paragraph inside it.

## The misplacement that started the rule

During rounds 10 and 11, results records were first written into docs/ and then moved to refs/ by directive, per the rounds 7 to 12 audit (wayfinder-rounds-7-12-audit-2026-09-18). The rule that settled out of that: docs/ holds ALL-CAPS normative documents only; receipts and drift records live in refs/. This is lesson 24 in the campaign's AGENT.md.

The distinction is not cosmetic. Normative language and informative language carry different obligation levels, and standards bodies encode the difference explicitly. RFC 2119 fixes the meaning of MUST, SHOULD, and MAY so that a normative sentence imposes a testable requirement (weight 0.94, https://www.rfc-editor.org/info/rfc2119/). Requirements-language work distinguishes normative from informative text precisely because mixing them makes the obligation level of any given sentence ambiguous (weight 0.81, https://language.foundation/Eliminating-Ambiguity-in-Requirements-What-Is-Normative-vs-Informative-Language). The IESG states the principle for references as well: normative references are documents a reader must consult to implement the specification, informative references are optional context (weight 0.96, https://www.ietf.org/about/groups/iesg/statements/normative-informative-references/; weight 0.88, https://www.rfc-editor.org/info/rfc3967/).

A receipt is the informative extreme: a dated, point-in-time record that an event happened. If a receipt sits inside a normative document, the document's normative claims and its point-in-time evidence are fused, and both get harder to maintain. The audit's placement rule separates them at the directory level.

## Drift addenda: the second placement violation

Round 11 appended a dated verification note to all 22 docs in the docs/ corpus. Round 12's directive banned drift checks as an edit class. The rule going forward, per the audit: a drift check produces a dated record in refs/, never an appended paragraph in the checked document. Lesson 23 covers the format contract for such records; lesson 24 covers placement.

The reason is the same normative-versus-informative split. An appended verification note changes the checked document's text, so the next drift check's diff includes the previous check's output, and the document grows a tail of past verifications that is not part of its normative content. A dated record in refs/ verifies the document without mutating it, so every later check runs against the same document bytes. Modality precision work makes the general point: testable statements should carry exactly one obligation level, and evidence about when a statement was last verified is not itself a requirement (weight 0.59, https://language.foundation/Modality-and-Requirements-Precision-MUST-vs-SHOULD-vs-MAY-for-Testable-Specs).

## What the docs/ corpus work looked like when placement held

Rounds 9 to 11 edited docs/ within the rules, and the audit records three distinct edit shapes:

1. Mojibake repairs: mechanical fixes restoring corrupted characters, no semantic change.
2. A judgment merge: two complementary sections of MITIGATE.md merged, a semantic edit made deliberately.
3. A refusal to guess: SPEC.md holds two complete spec versions; instead of silently picking one, the campaign flagged it in-file and left the choice to the maintainer.

That third shape is the placement discipline's payoff: when evidence was insufficient to make a normative change, the campaign recorded the ambiguity where the maintainer would see it, without inventing a resolution. Round 11 finished with every doc dated-verified and the corpus at 0 of 21 failing.

## The ADR parallel

The architecture-decision-record practice runs on the same separation: a decision record is append-only, dated, and status-labeled, and it sits beside the system's normative documentation rather than inside it (weight 0.75, https://github.com/architecture-decision-record/architecture-decision-record; weight 0.93, https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record; weight 0.73, https://adr.github.io/). The audit's refs/ ledger is an ADR-like layer for verification events.

## What to keep doing

1. Put normative documents in docs/, receipts and drift records in refs/ (lesson 24).
2. Never append verification output to the verified document; record the check as a dated entry beside it (rounds 7 to 12 audit).
3. When two complete versions of a normative document coexist, flag in-file and route the decision to the maintainer; do not guess.
4. Distinguish mechanical repairs (mojibake), semantic merges, and refusals to guess as separate edit classes in the round record.

## Source quality notes

Nine results scored at or above 0.5 (RFC 2119, RFC 3967, the IESG statement, two requirements-language references, and three ADR references) and back the claims above. Three results scored below 0.5 (aggregator ADR guides) and were not used.
