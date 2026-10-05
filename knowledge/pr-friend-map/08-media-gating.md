# 08 Media gating: earned media waits for a reproduced proof

Scope: earned media and press outreach gated on reproduced proof milestones, pitching evidence and limitations rather than ambition. This doc is deliberately short on press tactics and heavy on gating logic, because the dig backing it is thin and that thinness is itself the finding.

## The honest quality note first

Most retrievable material about press outreach for technology projects is practitioner or marketing content, and the decision model weighted it accordingly. The sources below carry their weights inline; where a weight is below 0.5 the claim is labeled as weakly backed and should be treated as a practice note, not a verified standard.

## What the sources support

The security-project landscape shows what an amplifiable proof milestone looks like. OpenSSF celebrated Security Slam 2026 by highlighting participating projects and contributors that took steps from automated baseline evaluations to comprehensive threat modeling, framing the event around concrete project milestones rather than announcements (https://openssf.org/blog/2026/04/10/security-slam-2026-celebrating-our-security-champions-and-project-milestones/, jev weight 0.4644, weak backing). The foundation itself describes its community as software developers and security engineers working together to secure open source software (https://openssf.org/, jev weight 0.6448). OWASP describes its mission as empowering a global community to build secure software through open source tools, expert education, and collaborative innovation (https://owasp.org/, jev weight 0.7417). Wazuh, an open source security platform used for threat prevention, detection, and response across on-premises, virtualized, containerized, and cloud environments (https://github.com/wazuh/wazuh, jev weight 0.6629), illustrates the pattern: security projects that earn coverage have a named, demonstrable capability.

The pattern generalizes: media attention follows a milestone a journalist can verify, and community milestones like the Security Slam are how open source security work becomes visible before any press engagement (https://openssf.org/blog/2026/04/10/security-slam-2026-celebrating-our-security-champions-and-project-milestones/, weak backing 0.4644).

## Embargo mechanics, weakly backed

For the eventual press interaction, the standard practice notes are consistent even though each is individually weak-backed. A news embargo is a mutual agreement between a source and a journalist in which information is shared early in exchange for a publishing hold until a specified date and time (https://easyprwire.com/blog/news-embargo-press-embargo, jev weight 0.0914, weak backing). Muck Rack's guidance states the sequencing rule plainly: if pitching a journalist under embargo, the journalist should agree to the embargo before the details of the news are shared with them (https://muckrack.com/blog/2024/05/28/pitching-under-embargo-examples/, jev weight 0.4885, weak backing). Agency-side guidance describes embargo work as part of building trusted relationships with tech journalists and executing coordinated campaigns (https://slicedbrand.com/insights/posts/exclusive-pitching-working-with-embargo-agreements-in-tech-pr, jev weight 0.4023, weak backing), and a press-release platform offers its own best-practices list for embargoed releases (https://pr.co/blog/best-practices-for-embargoed-press-releases, jev weight 0.0804, weak backing). TechCrunch, a major technology and startup outlet, is an example of the kind of outlet such pitches target (https://techcrunch.com/, jev weight 0.4163, weak backing).

One security-specific consideration matters for this campaign: journalists themselves use protection infrastructure for sensitive source material, notably SecureDrop, which is installed at news outlets to protect journalists from surveillance (https://freedom.press/tech/, jev weight 0.4195, weak backing). The existence of that infrastructure is a reminder that any pre-publication sharing of security-sensitive technical detail should be treated with the same care the project's own security policy demands.

## The gating rule

The dig supports one conclusion cleanly, and it is the conclusion the campaign already reached independently: press is a tier 3 friend that activates only after a proof exists. Concretely:

1. Pitch a reproduced proof milestone, never ambition. The coverage-worthy unit is "we reproduced X on hardware Y, here are the logs and the failure modes", the same artifact class community milestones celebrate (https://openssf.org/blog/2026/04/10/security-slam-2026-celebrating-our-security-champions-and-project-milestones/, weak backing 0.4644).
2. Prepare a concise evidence pack with limitations included before any journalist contact.
3. If an embargo is used, secure agreement before sharing details (https://muckrack.com/blog/2024/05/28/pitching-under-embargo-examples/, weak backing 0.4885), and route security-sensitive material carefully (https://freedom.press/tech/, weak backing 0.4195).
4. Keep coverage honest: the ask is a demo of the reproduced milestone, and the pitch should invite scrutiny of limitations.

The gap this doc records: no strongly weighted source in this dig addresses security-project press strategy directly. Until a stronger source is found in a refresh pass, all press tactics here should stay gated behind the proof milestone and treated as provisional.
