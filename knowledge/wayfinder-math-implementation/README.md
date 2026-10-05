# wayfinder-math-implementation

Knowledge corpus on implementing proved mathematics inside a wayfinder instrument: kernel-checked ledgers, actual-text candidate previews, and how math diagnostics wire into a placement pipeline without authorizing edits themselves. Minted from `yubi-OS/yubiOS refs/wayfinder-math-implementation-2026-09-10.md`.

## Documents

- [01-lean-kernel-theorems.md](01-lean-kernel-theorems.md): The eleven kernel-checked theorems in papers/data/lean/WayfinderBounds.lean on Lean 4.33.0: what stable_on, crossing_on_iff, add_isolation_delta, change_neighbour_ledger and their siblings certify as exact integer statements, and the explicit non-certifications (no semantic edit quality, no forecasting accuracy).
- [02-proof-artifact-gate.md](02-proof-artifact-gate.md): The proof artifact gate around the Lean proofs: a scope manifest mapping theorem statements to runtime predicates, a checker that parses the kernel's printed axiom sets, rejects missing declarations, unknown axioms and proof placeholders, and CI gating on the proof commit (Lean CI run 34567362278).
- [03-signed-margins-roundoff.md](03-signed-margins-roundoff.md): PM.projectionMargins signed margins: signed threshold clearance, axis norms shared once, per-input margins, the needs-roundoff-bound result without roundoff assumptions, undetermined near-threshold cases, caller-supplied optional roundoff_budget and perturbation_linf, and displaying stable state as conditional rather than certified.
- [04-isolation-ledgers.md](04-isolation-ledgers.md): PM.explainTransition exact local isolation ledgers: frame/instrument and full-precision point validation, the ADD isolation delta formula (indicator of new degree 0 minus previously isolated neighbours touched), CHANGE neighbour recompute (old degree minus old edge plus new edge), halt-before-persist on recount mismatch, not-applicable for multi-item changes and removals.
- [05-reduction-ratio.md](05-reduction-ratio.md): The reduction ratio diagnostic: observed over predicted isolation reduction exposed only for a strictly negative predicted delta, positive and zero predictions ineligible, framed as geometric model bookkeeping and never as calibrated confidence or task quality.
- [06-preview-endpoint.md](06-preview-endpoint.md): POST /api/map/preview actual-text candidate preview: saved text baseline plus full resulting texts/names and one target action add or change, SHA256 validation of all unchanged sources before model work and full points/bits verification after, explicit errors for stale inputs, mismatched settings and anchor drift, ephemeral map with no repository, D1 or Vectorize writes, content-hash embedding cache may populate, storage outage returns 503 rather than false missing-baseline.
- [08-verification-evidence-boundary.md](08-verification-evidence-boundary.md): Verification before publication and the evidence boundary: the seven test suites (57 numerical, 36 API, 10 archive, 71 new math with 38,172 exhaustive graph cases and all ten recorded transitions, 41 preview, 7 storage, 60 browser), fresh-context adversarial review that exposed a D1 row-size regression before PASS, the ten exact historical ledger replays staying retrospective, three zero outcomes from unchanged CHANGE points and three ADDs joining connected neighbours, and the historical 4/10 sign agreement never relabeled as 10/10 prediction.
- [09-guide-encoding-safeguards.md](09-guide-encoding-safeguards.md): Guide and encoding safeguards: the map's copyable prompt includes the actual-text preview step, the homepage Copy agent guide button fetching the authoritative /AGENT.md instead of a second hardcoded recipe, independence from iframe loading including mobile, error and link on fetch/copy failure with success shown only after clipboard success or a verified fallback, byte-for-byte copied-text comparisons, and preserved UTF-8 assets plus legacy endpoints.

## Research summary

- Results collected: 93 (all weighted, none unshipped)
- Weight split: 42 at weight >= 0.5 (primary/authoritative), 51 below 0.5 (weak backing, labeled as such in text)
- Jev requests: 20 (outline validation + noul weighting); usage 15902 input / 0 output tokens
- Dig redos: 0
- Skipped docs: none
- Subtopic 07 (storage-packing) was dropped at outline validation: jev score 0.32 with 0.75 padding probability. Its content remains covered inside 08 (storage suite) and 06 (packing round-trip in live verification).

Project-specific facts (theorems, API behavior, suite counts, live verification numbers) are cited to the source document's primary project artifacts: PR 231, Lean CI runs 34567362278 and 34570655611 and 34570898261, the Worker deployment receipt, and the `/AGENT.md` operational contract. General domain claims are cited to dig results with their jev noul weight recorded inline. Claims with weight below 0.5 are labeled as weakly backed in the text.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
