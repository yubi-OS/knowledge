# 02 - Evidence boundary and off-limits claims

Scope: what the planning document counts as real versus not-yet-real: the inventory of what exists, the list of what does not yet exist as verified business evidence, the warning that GitHub activity is not market evidence, and the claims the project has ruled off-limits.

## What exists

The source doc (yubi-OS/yubiOS docs/PLAN.md) lists five things that exist today (source doc):

- An LGPL-2.1-licensed public repository for a FIDO2-first, bootc-delivered immutable Linux OS.
- A differentiated owner-control thesis: PIV/PKCS#11 for signing, FIDO2 for disk and user workflows, signed UKIs, verified /usr, pinned inputs, SBOMs, provenance, and A/B recovery.
- ARM64 as the flagship route to an owner-provisioned platform chain, with x86-64 supported above an OEM-controlled firmware boundary.
- Public architecture decisions, threat modeling, security policy, blockers, and research notes.
- Active implementation and documentation work.

## What does not yet exist as verified business evidence

The source doc is explicit that the following are not yet real as business evidence (source doc):

- A production-supported release.
- A completed real-board ARM64 Path A proof.
- Production confidence from physical-YubiKey end-to-end validation.
- A published supported-hardware matrix and lifecycle commitment.
- Audited security, compliance certification, a staffed SLA, or a 24x7 response function.
- Disclosed paying customers, recurring revenue, renewals, customer ROI measurements, or a qualified sales pipeline.

## GitHub activity is not market evidence

The doc draws a hard line: GitHub activity is evidence of work, not evidence of product-market fit. Stars, commits, issues, and pull requests must not be used as substitutes for retained users, successful pilots, reference deployments, or renewals (source doc). This is the epistemic rule the whole plan runs on: commercial claims need customer evidence, and engineering claims need hardware evidence, and neither can be borrowed from repository metrics.

## Claims that remain off-limits

The source doc enumerates claim categories the project may not use until the underlying evidence exists (source doc):

- "Production-ready," "certified," "unbreakable," "zero trust anchors," "only," "first," or "most secure."
- An affiliation with, endorsement by, or certification from Yubico, Fedora, systemd, bootc, OpenSSF, or a hardware vendor without a signed agreement.
- Quantified breach reduction or compliance savings without customer-specific baseline data.
- Equal platform-root guarantees across ARM64 Path A, ARM64 Path B, and x86-64.

The last item matters for positioning: the plan treats ARM64 Path A as the flagship owner-root route and x86-64 as operating above an OEM-controlled firmware boundary, so marketing language must not flatten that difference (source doc).

## Why an evidence boundary is load-bearing for the rest of the plan

Every later section of the plan leans on this boundary. The pricing table in doc 05 attaches a launch gate to each offer; the gates in doc 06 are sequenced by evidence, not by calendar; the revenue model in doc 07 is labeled a planning assumption rather than a forecast precisely because no paying-customer evidence was supplied or found in the repository (source doc). The ROI model in the source doc carries the same discipline: its illustrative 100-node case "is a hypothesis to validate during a pilot, not a customer result," and the doc forbids publishing that illustration as a customer claim unless pilot measurements substantiate it (source doc).

## Recording convention

The evidence lists are dated by the document itself (as of 2026-07-17) and the doc carries a later drift-check note (2026-09-18, wayfinder round 11, cycle 6) recording that planning claims were re-anchored to round records. Anyone citing the evidence boundary should check whether the underlying blockers or gate statuses have moved since (source doc).

## Sources

- Primary: yubi-OS/yubiOS docs/PLAN.md (source doc), section "1. Current position and evidence boundary", plus the ROI-model caveats in section 7 and the drift-check note.
- No searXNG dig: internal-record subtopic. The claims inventory is a record about the yubiOS repository and its own evidence state; there is no external mechanism to research. The dig step was skipped deliberately and this is the recorded reason.
