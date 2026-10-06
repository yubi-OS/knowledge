# 06 - Readiness gates and sales motion

Scope: the four-gate ladder (Gate 0 through Gate 3) that defines what evidence must exist before each commercial step is allowed, and the proof-first sales motion that turns published proofs into paid pilots and annual subscriptions.

## Gate 0 - Current groundwork

Allowed at Gate 0: public development, grants, sponsored research with public deliverables, customer interviews, and clearly non-production advisory work (source doc).

Required before leaving Gate 0 (source doc):

- Resolve the active VM, real-FIDO2, runtime-hardening, pin-refresh, and release-evidence blockers relevant to the pilot platform.
- Obtain trademark/name clearance and explicitly address possible confusion with YubiKey/Yubico.
- Review LGPL-2.1 suitability, copyright provenance, third-party redistribution duties, and cryptography/export requirements with qualified counsel.
- Publish the operating covenant, support boundaries, privacy position, contribution policy, and commercial conflict policy.
- Define one bounded pilot platform rather than promising the full future hardware matrix.

## Gate 1 - Technical Preview

Required evidence (source doc):

- A repeatable physical-YubiKey enrollment, unlock, signing, SSH/PAM, loss, replacement, and recovery demonstration on disposable hardware.
- Green update/rollback and VM evidence for the chosen pilot image.
- Reproducible release identifiers, signed verification material, SBOM, provenance, and production/dev separation.
- One published recovery exercise and one externally reviewed threat/control correction.

Allowed: paid pilots with non-production terms, 25 to 50 disposable or non-critical devices, fixed scope, and explicit acceptance criteria (source doc).

## Gate 2 - Supported Pilot

Required evidence (source doc):

- At least two qualified hardware configurations for the platform being sold.
- Ninety days of update, rollback, vulnerability-handling, and support-case exercises.
- A tested security intake and incident communications runbook.
- Supported-version, severity, response, escalation, backup, and end-of-life policies.
- A support owner for every paid account and a sustainable on-call arrangement. The doc is explicit: do not promise 24x7 coverage with fewer than three trained responders or a contracted support partner (source doc).

Allowed: limited annual subscriptions with bounded SLAs (source doc).

## Gate 3 - General Availability

Required evidence (source doc):

- Three completed paid pilots, at least one expansion or renewal signal, and published non-sensitive outcome summaries.
- Six months of operating evidence for the supported channel.
- A real-board Path A proof before using ARM64 owner-root production language. A bounded x86-64 offer may launch earlier only if its OEM firmware boundary is explicit.
- Cyber liability / errors-and-omissions insurance, commercial terms, data processing terms where applicable, and a tested incident response function.
- Independent security review of the supported release and management plane.

## The sales motion

The source doc's mermaid flow runs: Public proof, then Qualified discovery, then Paid pilot, then Annual assurance, then Fleet expansion (source doc). The five steps (source doc):

1. Publish a narrow, reproducible proof with limitations.
2. Qualify for consequence, platform fit, budget, fleet size, and an executive owner.
3. Baseline the customer's current labor, release, evidence, and recovery cost.
4. Run a fixed-fee pilot with pre-agreed technical and economic acceptance criteria.
5. Offer an annual subscription only if the pilot establishes fit.

The doc prohibits mass cold outreach. The motion is proof-first community strategy to earn reviewers and referrals, then tightly targeted founder-led enterprise discovery (source doc).

## How the gates compose with the plan

The gates are the coupling layer between the engineering plan and the commercial plan: each offer's launch gate in doc 05 points into this ladder, the revenue model in doc 07 starts Year 1 only when Technical Preview pilots can run honestly (source doc), and the first-90-days plan in doc 09 maps onto the Gate 0 to Gate 1 transition. The gates are sequenced by evidence, not by date; nothing in the plan promises a calendar for crossing them.

## Sources

- Primary: yubi-OS/yubiOS docs/PLAN.md (source doc), section "5. Readiness gates and go-to-market".
- No searXNG dig: internal-record subtopic. The gates are internal launch criteria for the project's own offers; there is no external mechanism to research. The dig step was skipped deliberately and this is the recorded reason.
