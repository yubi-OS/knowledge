# 08 - yubiOS touchpoints and related skills

Scope: where this corpus sits inside the yubiOS skill landscape, the boundaries with Fulcio and Rekor v1, and the adjacent skills that consume or extend it. Internal-record subtopic; grounded in the source doc only.

## Position in the corpus

This is an internal-record subtopic: no web dig was run. The source of record is the ground source doc (yubi-OS/yubiOS skills/sigstore-rekor-v2/SKILL.md); all claims below are source-doc claims.

The sigstore-rekor-v2 skill is the dedicated Rekor v2 reference for yubiOS. It was created in the deep-research Stream 3 exercise (upstream comparative), which ranked it as the top-pick highest-leverage corpus addition because Rekor v2 GA, the tile-backed model, and witness quorums are major upgrades over v1. The changelog records the initial v1 at the 2026-08-04 cycle 5 and a 2026-08-06 cycle 5 RSI edit that closed the `trust chain` primitive gap.

## Related skills

Two skills are named as direct companions in the source doc's references:

1. `slsa-provenance`: the SLSA L3 reference, including the Rekor v1 section. The migration path from v1 is documented there; this corpus covers v2. When a request concerns Rekor v1 or the generic SLSA build-requirements mapping, route there.
2. `audit-evidence-packaging`: builds cryptographically-signed evidence bundles and uses Rekor v2 as the transparency log for those bundles. When a request is about packaging audit evidence rather than publishing a single attestation, route there.

The yubiOS integration statement ties them together: SLSA L3 attestations (per `slsa-provenance`) and evidence bundles (per `audit-evidence-packaging`) target Rekor v2 as the transparency log, with the CI attestations gate consuming the Rekor v2 path (source doc).

## Primitive mapping

In the `internal-big-picture` 10-primitive model, this skill anchors two primitives (source doc):

1. P1 attestation (primary): the skill is where transparency-log publication and verification of attestations are specified.
2. P7 audit/evidence: the transparency log is the audit surface for artifact provenance.

The cycle 5 RSI closure note records the `trust chain` primitive gap being closed corpus-wide (count moved 23 to 24 of 70 skills), with this skill's contribution keywords `trust chain`, `PCR`, `UKI`, and `secure boot`. The cycle 6 and cycle 7 RSI entries record `declarative policy` and `least privilege` primitive coverage references. The corpus-fit coordinate from the cycle-5 hyperspherical run was (u=0.556, v=0.993), PC1+PC2 = 0.4615, holdout R-squared = +0.2244; the skill was also part of the cycle-4 matched-parameter ablation corpus on all 70 skills (R-squared +0.222 full-corpus, +0.618 on the 49-skill split, against flat Fourier baselines of -1.120 and -0.359). These numbers describe corpus measurement, not Rekor behavior.

## Boundaries

The source doc's "do NOT use" list defines the routing edges:

1. Fulcio: logging certificates is Fulcio's job. Fulcio v2 has its own log (certid-transparency) that is separate from Rekor. OIDC token issuance is also Fulcio, not Rekor.
2. Rekor v1: covered by `slsa-provenance`; this skill takes over from v2 onward.
3. No-transparency signing: private or ephemeral signing without a log entry uses the offline signing pattern of doc 07, not Rekor v2.

Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job (source doc).

## In-repo touchpoints

The source doc lists the sections this skill owns or extends: Overview, When to Use, Rekor v2 Architecture, and TUF SigningConfig. The boundary-case rule from the source doc: when a request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising.

## What this corpus adds over the source doc

The source doc remains the primary source of record. This corpus adds the external grounding the doc's mechanisms need: the rekor-tiles implementation identity and its CT-ecosystem lineage (doc 01), the cosign verification failure surface (doc 02), the live TUF CDN and root-signing repository (doc 03), weak-weight corroboration of the public witness deployment (doc 04), the GA announcement and dated-drift note on the GA timeline (doc 05), and the upstream cosign command documentation behind the integration path (doc 06).
