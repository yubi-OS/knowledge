# 08 - Cycle-9 provenance: how this skill entered the corpus

Scope: the cycle-9 corpus-enrichment provenance of the source skill: why it was created, the 8 attestation closure cells it anchors, the 70-to-75 corpus growth below the 25 percent re-fit trigger, and where attestation gaps are tracked. Internal-record subtopic, no dig: everything here traces to the source doc's own changelog.

## Creation record

The source doc's changelog states the skill was created 2026-08-06 in cycle 9 as initial v1: "New skill created per deep-research Stream 1 section 4.3 (corpus enrichment for the 8-cell attestation residual post-cycle-8)." Its body covers the canonical 4-component evidence shape (quote / measurement / evidence bundle / Rekor v2 anchor) shared across Keylime, in-toto, and confidential-containers, mapped to the 10-primitive axes: P0 attestation (primary), P3 declarative policy, P6 audit/evidence. The frontmatter was validated by `js-yaml`. The changelog frames it as "the corpus-enrichment addition that closes the 8 attestation closure cells structurally."

The provenance number behind that residual: the cycle-8 coverage data recorded attestation at 62 of 70 cells, leaving 8 open. The source doc is careful about the status of that number: it cites `session/cycle8-coverage.json`, explicitly noting it is a session artifact, not repo-truth.

## The cycle-9 run context

Per the source doc, cycle 9 of `curve-guided-rsi` was run on the enriched 75-skill corpus: 70 existing skills plus 5 corpus-enrichment additions from deep research. The 5 additions were `runtime-attestation-keylime`, `least-privilege-pod-security-standards`, `continuous-runtime-detection-falco`, and 2 prior corpus-additions from cycle 7 and earlier.

The fit discipline matters as much as the additions. Per `hyperspherical-harmonic-curve` section Lifecycle, corpus growth triggers a re-fit at 25 percent; the 70 to 75 growth is 7.1 percent, below the trigger, so the Phase H fit holds Phase G's K_kept = 2. The cycle-9 fit result was therefore "the expected null per Task-Centric theory (3 to 5 RSI iterations to saturation)," citing the prior-art stream 2 document `curve-guided-rsi-corpus-enrichment-prior-art-stream-2-2026-08-05.md` section 2.

A second changelog entry, also dated 2026-08-06, records the cycle-9 RSI corpus-enrichment substantive entry: this skill was added as one of the 3 corpus-enrichment skills closing the 17 residual cells post-cycle-8 (from PR #179), and it is "the corpus-additive anchor for the attestation primitive in the 10-primitive spine (per `internal-big-picture`)."

The changelog also records what did not happen: a cycle-8 RSI audit-only entry noting that the cycle-8 audit ran on the pre-enrichment 70-skill corpus, so this skill's fit contribution was not in scope for cycle 8.

## The 8 attestation closure cells

The source doc lists the 8 skills whose cells this skill closes, with the attestation facet each carries:

1. `ci-cd-and-automation`: CI attestation generation.
2. `composefs-kernel-floors`: signed catalog attestation.
3. `incremental-implementation`: test-first discipline producing verification evidence.
4. `performance-optimization`: measurement-based optimization evidence.
5. `planning-and-task-breakdown`: acceptance criteria as attestation.
6. `recursive-self-improvement`: gap-map audit trail.
7. `shipping-and-launch`: production monitoring evidence.
8. `the-cult`: follower check-in attestation.

The source doc states this skill "is the corpus-additive anchor that ensures all 8 are well-served." Reading the list, the closure mechanism is structural rather than editorial: these cells were open because no skill owned the *shape* of attestation evidence that those activities produce. CI attestations, signed catalogs, verification evidence, acceptance criteria, audit trails, monitoring evidence, and check-ins are all things that become attestations once they are carried in the 4-component shape, which is what this skill supplies.

## Where gaps are tracked

The source doc directs that gaps in attestation attributable to this skill are tracked in the cycle-9 run log at `refs/curve-guided-rsi-v2-cycle9-corpus-enrichment-2026-08-06.md` on `yubi-OS/yubiOS`. That path, not this corpus, is the live ledger; this doc records the provenance, not the current gap state.

Internal-record note: no web dig was run for this subtopic. The corpus does not fetch or verify the referenced session artifacts, run logs, or PR #179; all claims are source-doc attributions and are labeled as such.
