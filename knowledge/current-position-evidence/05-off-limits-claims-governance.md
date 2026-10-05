# Off-limits claims: governing what a project may not say until evidence exists

Scope: enumerating claims that must stay off-limits until specific named evidence closes (production-ready, platform support, ROI figures, sealed boot), and enforcing that list across documents.

## The pattern: name the claim, name the gate

An off-limits list is the negative half of an evidence boundary. The positive half says what is verified; the negative half enumerates claims that are banned until a named condition closes. The yubiOS evidence-boundary snapshot (OMN-68, 2026-07-25) does this as a table of claim-to-gate pairs:

1. "Production-ready" or "enterprise-ready": off-limits until at minimum B-VM-CTAP2, B-HARDENING-RUNTIME, and B-REAL-FIDO2 close, per the exit criteria the project's own readiness doc (OMN-66) defined.
2. "ARM64 support" as a shipped capability: off-limits until B-ARM64-PATHA and B-RK3588-TPL close with real-board evidence; today it is groundwork only (6 forks staged).
3. Any ROI figure ("customers save X with yubiOS"): off-limits until at least one real pilot produces measured data, per the claim boundaries in the project's customer-ROI model doc (OMN-78, PR #115).
4. "Sealed/attested boot" or "tamper-proof": off-limits until B-BOOTC-SEAL resolves to an actual signed UKI plus Secure Boot chain, not the current mutable-anchor fs-verity story.
5. General availability or public pricing: off-limits before Gate 3 per the readiness-gates doc (OMN-73, PR #118); the organization is at Gate 1 (provisional).
6. Any claim of Yubico affiliation or endorsement: off-limits regardless of blocker status, because it is false, not merely unproven.

Note the last entry's different character: the first five are "not yet proven" claims that evidence could someday license; the sixth is a false claim that no evidence will ever license. A governance list should separate the two, because the enforcement language differs (wait versus never).

## The legal floor: substantiation before dissemination

The strongest external anchor for this pattern is the US regulatory standard for advertising claims. The FTC's policy statement on advertising substantiation commits the Commission to the prior substantiation requirement: before disseminating an advertisement, the advertiser must substantiate all claims, express and implied, that the ad conveys to reasonable consumers (https://www.ftc.gov/sites/default/files/attachments/training-materials/substantiation.pdf, weight 0.85, primary). The FTC's formal policy statement adds that the agency will consider post-claim evidence only in limited circumstances, and whether to do so in any particular case remains within its discretion (https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation, weight 0.94, primary).

Two features of this doctrine translate directly to engineering claim governance:

1. The standard is prior substantiation: evidence must exist before the claim ships, not after someone asks. An off-limits list is just substantiation doctrine written as a project convention.
2. Express and implied claims both count. "Enterprise-ready" is an express claim; a customer logo arranged next to the word "trusted" is an implied one. A governance list that only names express claims will be routed around through implication.

The FTC's mission framing (enforcing against deceptive business practices, https://www.ftc.gov/, weight 0.82, primary) and a practitioner law-firm explainer on substantiating advertising claims (https://www.dwt.com/insights/2024/03/how-to-substantiate-advertising-claims, weight 0.25, weak) cover the same ground at descending rigor. Thomson Reuters' compliance material on advertising claim substantiation (https://practicalcompliance.thomsonreuters.com/, weight 0.45, weak) sits in between.

## Enforcement mechanics inside a project

The off-limits list only works if it is enforced where documents are produced, not remembered after publication. Practical mechanics:

1. Cite the gate by identifier. Every allowed claim's positive counterpart cites a CI run, PR, or blocker ID; every banned claim names the blocker that must close first. This makes violations mechanically checkable.
2. Inherit, do not restate. Downstream documents (offer, pilot collateral, funding deck, case study) cite the canonical boundary document instead of drawing their own line, which is exactly how the yubiOS snapshot positions itself for OMN-65 (PR #103) and OMN-73 (PR #118) and every other landed business doc.
3. Separate "not yet" from "never." Affiliation and endorsement claims fail permanently; readiness and ROI claims fail temporarily. The list should mark which is which.
4. Review the list at the same cadence as the blocker list. When a blocker closes, the corresponding claim moves from off-limits to citable-with-citation; the list, not individual docs, is where that transition is recorded.

## Where the general web is thin

Sources on claim governance outside regulated advertising are mostly vendor marketing-compliance content: an "ultimate guide" to marketing compliance (https://intelligencebank.com/guides/the-ultimate-guide-to-marketing-compliance/, weight 0.36, weak), claim-substantiation workflow content (https://www.bivisee.com/capabilities/compliance-risk/compliance-claim-substantiation/, weight 0.17, weak), and claim-governance framework pages (https://flickbloom.com/blog/approved-brand-claim-management-governance, weight 0.19, weak). These are directionally consistent (govern claims centrally, require substantiation) but carry no authority beyond their own marketing, and this corpus cites them only to show the pattern's spread, not to ground any claim. The engineering-grade version of the pattern rests on the primary sources above plus the project's own blocker discipline.
