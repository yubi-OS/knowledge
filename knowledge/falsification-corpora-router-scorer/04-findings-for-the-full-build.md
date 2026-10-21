# 04. Findings (for the full build)

**Scope:** Findings (for the full build): detailed analysis grounded in yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/falsification-corpora-router-scorer-2026-10-06.md, no external web dig

## Four findings

The source lists 4 findings under "Findings (for the full build)." Each names a mechanism, the evidence, and what the full build must do about it.

## F1: /bands hides the operative pair-band clauses

**Mechanism.** `selectBand` matches pair bands against the policy's `all` clause arrays. The `/bands` surface drops those arrays. Anyone preregistering from `/bands` therefore sees band descriptions but not the clauses that actually decide selection.

**Evidence.** R11 (gasket-trefoil-1e-4) had detect_score 9999 but corrected-hierarchy did not fire. The source reasons that the operative clause set is not derivable from descriptions, and offers a hypothesis: an astig-above-threshold entry condition. R10 and R12 had astig |est| at or above 0.019 and fired; R11 had -0.0022 and did not.

**Full-build action.** Read `routing.bands[].all` from the policy doc (KV or git mirror), re-derive the corrected-hierarchy triggers, and decide whether "detection signal 9999 not gating band selection" is a router bug.

**Why it matters.** Without the clauses, corrected-hierarchy triggers cannot be pre-registered exactly, so every warped-gasket row carries prediction uncertainty that has nothing to do with the router's correctness.

## F2: spectral walk silently absent on 4/12 gold rows

**Mechanism.** The spectral walk produces d_w (spectral dimension) and n. On 4 rows (tri, shuffle-s42, pumpkin_ring, pumpkin_field), both came back null in the live response.

**Contract tension.** The contract says a failed walk never fails the measurement. That is reasonable for availability, but pair-band gating depends on d_w, so on those rows pair-band behavior is untestable. The failure is silent: the response looks successful.

**Full-build action.** Assert spectral presence per run, and investigate the walk's worker CPU cap as the likely cause.

## F3: scorer cross-axis bleed on assumption_set

**Evidence.** assumption_set was credited on 4 of 8 planted docs with p above 0.55. Those docs were designed to plant items for the inputs or composition axes, not assumption_set.

**Interpretation.** The extractor attributes evidence to an axis the doc was not written to exercise. Combined with the recall result (it under-recalls on target axes), the profile is: misses planted items on the intended axis, sometimes credits a neighboring axis. The source flags this as report-only, outside the preregistered gates.

## F4: transport

**Mechanism.** Sandbox egress to workers.dev is blocked (401 without proxy injection).

**Workaround used.** Large gold renders moved through the ubuntu shell bridge in **100 KB base64 chunks**, then POSTed through the run_script worker path. An earlier attempt with 380 KB chunks failed because Linux limits a single argument to 128 KB (MAX_ARG_STRLEN). Render transfer checksums were verified.

**Why record it.** It is an operational constraint every future corpus run will hit.

## The scorer recall result as a finding

The source places the scorer recall failure in the results section, but it functions as a finding too. The inputs family found 1 to 2 of 3 to 5 canonical items, recall gate 0/4, decision probability 0.01 to 0.04. The source states this quantifies the refs4 extraction-recall lesson on maximally canonical phrasing and rules out a heading-only-doc artifact. Composition recall was 11/14 = 0.786, above the 0.75 floor at item level but with 2 of 4 docs failing.

## How the findings map to the full build

| Finding | Full-build item |
|---|---|
| F1 | Item 1: read `routing.bands[].all` clauses |
| F2 | Item 2: spectral-presence assertion and CPU-cap investigation |
| F3, recall | Item 4: ~64-doc scorer corpus with paraphrase pairs and heading-only docs; extract the counting unit |
| F4 | Operational: 100 KB chunks through the shell bridge |

## What the findings say about the system

- The router's visible configuration surface is incomplete (F1).
- One measurement path can silently degrade (F2).
- The scorer is specific but not sensitive, with some axis leakage (recall result, F3).

None of these would have surfaced from unit tests on the components alone. They appeared because the corpus ran known artifacts end-to-end through live endpoints and compared outcomes with predictions written in advance.
