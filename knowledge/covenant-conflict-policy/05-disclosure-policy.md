# 05 - Disclosure policy: coordinated disclosure and the no-early-access rule

Scope: coordinated vulnerability disclosure for open source, embargo norms, and why paying customers must not get security fixes ahead of everyone else.

## The authoritative process: OpenSSF

The OpenSSF Vulnerability Disclosures working group's maintainer guide is the strongest-backed source in this corpus (weight 0.70). It exists to "help mature and advocate well-managed vulnerability reporting and communication" for open-source projects, and its guide lays out the coordinated process end to end: private reporting channel, acknowledgement, fix development, embargo window, coordinated public release of fix and advisory (weight 0.70: https://oss-vulnerability-guide.openssf.org/maintainer-guide.html). The companion guide site carries the same program (unweighted duplicate, see archive: https://oss-vulnerability-guide.openssf.org/).

## Embargo norms

Red Hat's explainer defines the embargo precisely: within coordinated vulnerability disclosure, "an embargo is a strictly-defined window of time during which a security vulnerability is known only to a small group" before public disclosure (weight 0.45, weak backing: https://www.redhat.com/en/blog/Understanding-security-embargoes-at-Red-Hat). The definition matters for covenant design because the embargo's legitimacy rests on who is inside the small group: reporters, maintainers, and distributors preparing fixes together, not a paying tier of customers.

CISA's CVD program frames the same practice as critical-infrastructure doctrine: coordinated reporting, analysis, and public disclosure across affected parties (weight 0.34, weak backing: https://www.cisa.gov/resources-tools/programs/coordinated-vulnerability-disclosure-cvd-program). US federal guidance from CISA goes further and recommends that suppliers of commercially and publicly available open-source software "implement a CVD program with public CVE records and vulnerability disclosures" (weight 0.32, weak backing, agency PDF: https://media.defense.gov/2026/Jul/14/2003961238/-1/-1/0/260714-D-AB123-1001.PDF).

## Timeline pressure and the paywall temptation

Practitioner writing shows the timeline consensus is under strain. An analysis from May 2026 argues "the 90 day disclosure policy is dead" and that "the assumption that you have time between disclosure and exploitation" no longer holds, which raises the value of fast, universal fix publication (weight 0.16, weak backing: https://blog.himanshuanand.com/2026/05/the-90-day-disclosure-policy-is-dead/). MLCommons' responsible-disclosure essay, written for AI evaluation but structurally parallel, affirms that "coordinated vulnerability disclosure is a standard practice for a reason" and can solve hazard-disclosure problems "with transparency and technical rigor" (weight 0.42, weak backing: https://mlcommons.org/2026/06/responsible-disclosure/). A 2026 survey of open-source disclosure practice catalogues the recurring failure modes: coordination problems, timeline conflicts, and maintainer constraints (weight 0.28, weak backing: https://safeguard.sh/resources/blog/responsible-disclosure-open-source).

## The covenant rule

None of the cited sources describes a legitimate scheme in which paying customers receive a fix before the general public; every framework treats coordinated disclosure as time-boxed and bounded by the embargo group, after which the fix is universal. A covenant should therefore state: security fixes ship to everyone simultaneously at disclosure time; early access to a fix for paying customers is a covenant conflict, not a premium feature; and embargo membership is defined by coordination need, never by payment tier.
