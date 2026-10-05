# libvfio-user-bundle-decision

Knowledge corpus minted 2026-10-05 from the yubi-OS/yubiOS refs record `refs_corpus/libvfio-user-bundle-decision-2026-07-30.md` (Linear OMN-100): build strategy decisions for libvfio-user, bundling versus per-runner installation for a userspace VFIO library, with the decision rationale and rejected alternatives.

## Docs

| Doc | Slug | Scope |
|---|---|---|
| 01 | libvfio-user-fundamentals | What libvfio-user is, userspace VFIO device emulation over a UNIX socket, upstream homes and maturity, and why vendor-pinning fits. |
| 02 | per-runner-build-status-quo | The per-runner meson/ninja build from PR #137 (commit a53332e), its staging layout at /opt/libvfio-user/<commit>, and its repeat-build cost profile. |
| 03 | decision-framework-variation-scoring | Five variations scored 4-20 across five lenses, finalists V1 and V4, and the two-step adoption ordering rationale. |
| 04 | actions-cache-near-term | Step 1 (V4): the actions/cache edit, cache key over commit SHA + base image digest + runner OS, hit/miss observability, and GitHub cache limits. |
| 05 | oci-artifact-bundle | Step 2 (V1): the docker-bake target producing 0mniteck/yubios:libvfio-user-<sha>, scratch-rootfs content model, publish gating, and digest pulls. |
| 06 | rejected-alternatives | Why V2, V3, V5, forking, production-image bundling, and build-system replacement were all rejected. |
| 07 | open-questions-artifact-governance | OQ1-OQ3: dedicated tag versus piggyback, per-use tag refresh by the bumping contributor, and workflow-side smoke check sufficiency. |
| 08 | vfio-vgpu-ci-context | Why libvfio-user exists in CI: vGPU/vfio-user VM testing, socket-based device emulation, SPDK example, and the ADR-022 per-artifact scheme. |

## Research summary

- Results collected: 120 searXNG results across 20 queries (16 original + 4 redo).
- Weight split: 43 results at weight >= 0.5 (primary/authoritative backing), 77 results below 0.5 (weak backing; cited only where the page genuinely supports the claim and labeled in text).
- Jev (/api/decide, clef) requests: 27 total, usage 20327 input tokens, 0 output tokens. Breakdown: 1 preflight probe, 1 outline validation (8 questions, score metric), 20 noul weighting batches (first pass), 5 noul weighting batches (redo pass). One 429 was hit and retried after a 30s sleep per the redo protocol.
- Redo counts: 2 docs redone. 06-rejected-alternatives and 07-open-questions-artifact-governance had thin first-pass digs (too few usable high-weight sources) and were redone once each with different queries per the redo rule.
- Skipped docs: none. All 8 subtopics passed outline validation and were authored.

## Source policy

Every factual claim in the docs carries its source URL and the jev weight that backed it. yubiOS-internal facts (PR numbers, commit SHAs, ADR references, workflow paths, scoring tables) are attributed to the source decision record, since they are internal history and have no public web source. Claims backed at weight below 0.5 are explicitly labeled as weakly backed in the doc text. One high-weighted result (a bank homepage scoring 0.73) was judged off-topic for its query and is recorded in the archive but is not cited in any doc.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
