# The Process and the Guidelines

Grounding spine: `yubi-OS/yubiOS skills/internal-nonlex-tokens/SKILL.md` (source doc). Web backing for the compare mechanics is decent here: an arXiv comparison of semantic similarity methods carries weight 0.58.

## Scope

The 5-step usage process and the 10 guidelines: how an agent actually applies the substrate, and the rules that keep it honest.

## The 5-step process

1. **Identify the binding constraint.** Is it token cost? Context bloat? Sensitivity? Pick the constraint. This is step 1 for a reason: everything downstream is derived from it.
2. **Choose the operation class.** Fingerprint (intake), compare (similarity), recall (opt-in reading), route (dispatch), transform (derive).
3. **Pick the token type.** Hash for byte content. Embedding for semantic content. Hybrid for mixed.
4. **Document the choice.** Every non-lexical operation in a session should log the constraint, the operation class, and the token type. This is the substrate's audit trail.
5. **Reconstruct only when needed.** Reading is opt-in. If the operation completes without `recall()`, document that fact.

The source doc is explicit that the substrate is not a runtime (yet): it is a discipline and an operational vocabulary. Phase 2 may add a runtime implementation; Phase 1 is the vocabulary that future code can implement.

## The 10 guidelines

1. **Verify the constraint is real.** "Save tokens" is not automatically a constraint. Is the content large, sensitive, or repeated? If the answer is no, read the content. The substrate is not a default.
2. **Pick the operation class from the constraint.** Context bloat maps to fingerprint + compare + opt-in recall. Sensitivity maps to fingerprint + compare (no recall). Scale maps to compare + selective recall. Audit maps to fingerprint + compare (no recall, no transform).
3. **Pick the token type from the content class.** Bytes, code, structured data: hash. Natural language: embedding. Mixed: hybrid, only when both identity and semantic matter.
4. **Document every operation.** Constraint, op class, token type, reconstruction path. The substrate is a discipline; the audit trail IS the discipline.
5. **Read only when `recall()` is called.** The no-lexical-decode invariant holds by default. Reading is opt-in, deliberate, and documented.
6. **Verify against the Integration section.** The substrate is one option among several; the canonical pairing list lives in the body of the source doc, not in the checklist.
7. **Skip the substrate for single-tool-call content.** If the content fits in a single tool call, the overhead exceeds the savings. Read it.
8. **Use `compare()`, not lexical diff, for semantic similarity.** Cosine distance on embeddings is the right tool for "are these two passages similar?" Lexical diff (diff, grep) is the right tool for "do these two strings match exactly?" Do not conflate them.
9. **Pair with `doubt-driven-development` per operation.** Is this constraint actually binding? Is this token type actually needed? Is `recall()` actually necessary? Cargo-cult application is the main anti-pattern.
10. **Run RSI cycles when drift is suspected.** The 10-cycle bounded loop in the source doc's changelog is the maintenance discipline. Re-run `negative-skill-space` if the substrate's claims feel stale.

## The compare mechanics behind guideline 8

Cosine similarity measures the angle between vectors and always falls in a fixed interval: proportional vectors score 1, orthogonal vectors score 0 (https://en.wikipedia.org/wiki/Cosine_similarity, weight 0.40, weak). A peer-reviewed comparison of semantic similarity methods covers cosine similarity, soft cosine similarity, and word-embedding-based measures, and notes that words like "cook" and "food" map to different points even when related in meaning, which is exactly the graded-similarity property the substrate's compare relies on (https://arxiv.org/pdf/1910.09129, weight 0.58, authoritative). Lexical diff has no analogue of this property: two byte strings either match or they do not, which is why the guideline forbids substituting one for the other.

## Constraint-to-operation mapping in practice

Guideline 2 deserves a worked expansion, since it is the decision table agents will actually consult:

- **Context bloat** (transcript past the window): fingerprint each chunk, compare against the stored token set, recall only the chunks needed for continuation. Source doc Example 1.
- **Sensitivity** (credentials, secrets, PII): fingerprint once, compare repeatedly, never recall. The hash commits without reveal. Source doc Example 2.
- **Scale** (months of transcripts, too much to read): compare for similarity ranking, recall selectively for the top matches. Source doc Example 3.
- **Audit** (integrity proof): fingerprint + compare, no recall, no transform. The token is the artifact.

Note what is absent: there is no constraint that maps to "read everything". If the answer is "read everything", the substrate is the wrong tool and this is Example 4's comprehension case.

## Audit discipline as the product

Guideline 4 is the pivot of the whole skill: the substrate's deliverable is not compression, it is the documented decision. A non-lexical operation that is not logged (constraint, op class, token type, reconstruction path) has no audit trail, and the source doc treats "skipping the audit trail" as an anti-pattern. Doc 08 turns this into the per-operation calibration log with three gates; doc 09 lists the failure signals.

## The skip rule and the overhead floor

Guideline 7 gives the substrate a concrete overhead floor: content that fits in a single tool call never justifies tokenization. This is the practical test that keeps the substrate from being cargo-culted onto every input. The red-flag list reinforces it: "the substrate used for content that fits in a single tool call (the cost exceeds the savings)".

## Pairing with doubt

Guideline 9 makes doubt-driven-development the per-operation counterweight. The three questions (constraint binding, token type needed, recall necessary) are asked per operation, not per session. That per-operation cadence is what the calibration section (doc 08) records; the two disciplines are two halves of the same gate: doubt decides, calibration records.
