# 01 - Campaign thesis and executive decision

Scope: the executive decision that gates the whole campaign, the thesis sentence it commits to, the two-question trust split that makes the thesis both honest and memorable, and the 90-day strategic outcome targets that define success.

Grounding spine: yubi-OS/yubiOS docs/PR.md, sections "Executive decision" and "Strategic outcome". All claims below are source-doc claims unless a dig source is named.

## The decision

The campaign document is dated with "Last researched: 2026-07-16" and states campaign status as pre-launch, proof-first, build in public, with the project itself in groundwork (source doc: yubi-OS/yubiOS docs/PR.md). Its executive decision is explicit: do not market yubiOS as generally available or production-ready. Instead run a staged, technical campaign that earns trust by publishing evidence, limits, and repeatable demonstrations as the project crosses its engineering gates. The document also fixes a naming hazard at the top: in this document PR means Public Relations, not pull request.

## The thesis

The campaign thesis is a single sentence: "yubiOS is building a Linux trust chain the owner can hold in their hand." (source doc). The document rejects the obvious alternative framing, "a more secure Linux distribution," on the grounds that the category is crowded and difficult to prove.

What makes the sharper story work is a separation of two questions that conventional systems often blur (source doc):

1. Is the authorized owner present? An owner-held YubiKey gates signing, unlock, SSH, and privileged local identity.
2. Did the expected platform boot? Signed boot artifacts, verified operating-system content, and platform measurement answer this separately.

The document argues this identity-versus-platform split is technically honest and memorable, and that it protects the project from its own shorthand: yubiOS avoids a mandatory TPM as the owner-facing unlock and identity gate, while still using TPM and fTPM measurement where measurement adds platform evidence. A headline like "No TPM" without that qualification would become a misleading claim, so the split is the corrective mechanism built into the narrative itself.

## Who the first campaign optimizes for

The first campaign should optimize for qualified reviewers, contributors, hardware collaborators, and technical credibility. Downloads, broad consumer coverage, and enterprise adoption are explicitly later outcomes, not first-campaign goals (source doc).

## The 90-day strategic outcome

Within 90 days of the first campaign wave, the document sets 6 targets (source doc):

- 10 qualified contributors, reviewers, or hardware testers who engage beyond a social reaction.
- 2 real-hardware collaborators, including at least 1 candidate for the RK3588 Path A proof.
- 3 substantive independent technical discussions, articles, podcasts, or community presentations.
- 5 actionable external findings or questions triaged in public, with outcomes linked to the repository.
- 1 repeatable physical-YubiKey demonstration whose commands, logs, hardware, and limitations are published.
- 0 uncorrected production-readiness claims, false affiliations, or test-versus-production artifact ambiguities.

The zero target is the distinctive one: the campaign treats an uncorrected overclaim as a failure of equal weight to a missed engagement number. Stars, impressions, and page views are named as diagnostic signals rather than the primary goal (source doc).

## Why this reads as a trust argument, not a marketing one

Every element of the decision is falsifiable on purpose. The thesis names a mechanism (a trust chain the owner holds), not a benefit. The two-question split gives reviewers a precise thing to attack or confirm. The outcome targets count engaged humans and public corrections, not reach. The document's own readiness-gate structure (see doc 05) is what keeps the campaign from drifting into launch language: the wording available to the campaign expands only when the evidence does.
