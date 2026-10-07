# 09 - The operator-experience gap

Scope: the gap the source doc names as the most load-bearing finding of its deep research: none of the four sources addresses the operator who has to use the system day to day, and what that means for yubiOS.

Ground source: yubi-OS/yubiOS skills/internal-big-picture/SKILL.md (source doc).

## The gap statement

The source doc's own wording: none of the four sources addresses the operator who has to use the system day to day. Chronicle's secops-overview has no analyst-fatigue section. HITRUST measures compliance as 0/25/50/75/100% with no discussion of how assessors experience the process. CISA ZT is doctrine with no attention to cognitive load. 0pointer's blog is engineering-correctness-only (source doc).

The source doc then names what this means concretely for yubiOS: an owner has to enroll a YubiKey under stress, recover from a failed boot without documentation, audit their own compliance posture, or operate the OS without a security team. The skill flags this gap; it does not solve it, because solving it requires dedicated user-research work (source doc).

## Why the skill protects this gap

"Skipping the operator-experience gap" is one of the 8 anti-patterns, and "the operator-experience gap was considered" is checklist item 10 of the 14-point verification checklist. The requirement is consideration, not resolution: even if the gap does not apply to a specific decision, the POV run must note it (source doc). This is unusual discipline: most lenses optimize their coverage down to what is actionable, and the source doc explicitly forbids optimizing this finding out.

## What the dig added

This was a web-shaped subtopic and was dug. The dig is judged strong enough to keep the doc (the outline validation scored it 0.59, marginal, keep only if the dig comes back strong), because it surfaced two independently credible anchors for the two halves of the gap:

1. The telemetry half. Alert fatigue in security operations centres is a published research problem: the ACM Digital Library carries "Alert Fatigue in Security Operations Centres: Research Challenges and Open Problems" (https://dl.acm.org/doi/10.1145/3723158, weight 0.74). This is the peer-reviewed anchor for the claim that analyst experience is a recognized open research area in SOC tooling, which the source doc's "no analyst-fatigue section in Chronicle's secops-overview" observation sits within. SOC automation is also an active vendor topic (https://torq.io/blog/what-is-soc-automation/, weight 0.20, low weight, labeled weak: a vendor blog, usable only as a signal that the problem area is active, not as evidence).
2. The compliance half. HITRUST publishes its own Assessment Handbook covering certification requirements and guidance (https://hitrustalliance.net/hitrust-assessment-handbook, weight 0.92). This corroborates that the assessment process is formalized in published guidance documents; what neither the handbook nor the CSF measures is the assessor's or operator's experience of the process, which is exactly the source doc's claim. Third-party write-ups of the HITRUST certification audit process exist but weighted low (https://censinet.com/perspectives/hitrust-certification-audit-process-explained, weight 0.16, labeled weak).

## What this doc adds beyond the source doc

Nothing normative. The source doc is explicit that solving the gap requires user-research work the skill does not undertake. The corpus keeps this doc for two reasons: the gap is a named finding with protected status inside the lens (anti-pattern plus checklist item), and the dig anchors its two halves to external evidence so a future yubiOS user-research effort (for example, studying YubiKey enrollment under stress or failed-boot recovery) starts from the published framing of the problem rather than rediscovering it.

## Carry-through into lens usage

For any four-POV run, the operator-experience check appears in the synthesis as a one-line consideration: does this decision make the owner's day-to-day operation harder, easier, or unchanged? A remote attestation endpoint, for example, adds a verification step an auditor performs; whether the owner experiences that as burden is unmeasured by all four sources, and the POV should say so rather than assume it away (source doc pattern, applied per its checklist item 10).
