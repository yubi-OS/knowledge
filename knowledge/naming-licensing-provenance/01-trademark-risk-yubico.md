# 01 - Trademark risk: the yubiOS name against Yubico's registered marks

Scope: trademark exposure of the name yubiOS given Yubico's registered YUBICO and Yubi-prefixed marks, the rebrand-after-traction cost asymmetry, and what a clearance process actually looks like.

## The exposure is concrete, not hypothetical

Yubico AB holds a registered trademark on YUBICO in the United States. The USPTO registration record for YUBICO (serial 90203978) is live and covers goods categories including apparatus for scientific purposes and data processing equipment, which sits adjacent to what an operating system project sells (source: https://uspto.report/TM/90203978, jev weight 0.80). Third-party mark trackers list Yubico AB with 16 trademark applications, including SECURE IT FORWARD and YUBIENTERPRISE (sources: https://uspto.report/company/Yubico-Ab, weight 0.40; https://usmarkdb.com/owner/yubico-ab, weight 0.16). Both of those counts are weakly backed and should be re-verified directly in the USPTO database before being relied on.

Yubico is not a dormant mark holder. It actively markets YubiKey as "the #1 security key" from an industry leader, and maintains an active product download and support presence (sources: https://www.yubico.com/, weight 0.76; https://www.yubico.com/support/download/, weight 0.77). A vendor that active in the same authentication space has both the incentive and the means to police confusingly similar marks.

## Why checking now beats rebranding later

The official USPTO trademark search exists precisely for this step: the USPTO describes a clearance search as a search completed before applying for registration, to make sure a mark is available to register for particular goods or services and that no other mark conflicts with it (source: https://www.uspto.gov/trademarks/search, weight 0.94). The rebrand-after-traction cost asymmetry in the yubiOS risk register is grounded in this: a clearance search is cheap today, a forced rebrand after adoption is not.

A weakly backed secondary source makes the same point in commercial terms: building on an unvetted name can convert a name into litigation risk regardless of intent (source: https://www.traverselegal.com/blog/how-to-check-if-a-business-name-is-trademarked/, weight 0.13, weak backing).

## The brand question is separate from the code question

Open-source trademark guidance is explicit that a project's brand and its code license are different assets with different enforcement logic. Google's open source trademark casebook frames the core question as what the value of the trademark is to the project: does the unique brand attract contributions or bolster widespread adoption, and how much of a priority is the unique identity to the project (source: https://google.github.io/opencasebook/trademarks/, weight 0.74). A weakly backed guide makes the practical separation concrete: manage trademarks by separating code licenses from names, logos, forks, and package distribution (source: https://www.fosshub.com/resources/maintainers/trademarks/, weight 0.23, weak backing). For yubiOS this means the LGPL-2.1 choice on the code does not settle the naming question at all.

## Decision flagged, not resolved

The yubiOS risk register names this as its number 1 open item and explicitly does not resolve it. Two grounded next steps follow from the dig:

1. Run the actual USPTO clearance search against YUBICO and Yubi-prefixed marks in the relevant classes, using the official USPTO search (source: https://www.uspto.gov/trademarks/search, weight 0.94). This document does not report a search result because no search was run in the session that produced the source doc.
2. Use counsel, not an AI-assisted read. The Open Source Collective documents an attorney-supported path for exactly this: OSC works with an attorney specializing in open source and trademarks, and registering or transferring a trademark through OSC includes 1 hour of legal guidance on the project's name, logo, and brand (source: https://docs.oscollective.org/for-hosted-member-projects/trademarks-and-ip, weight 0.79).

A weakly backed primer on open-source trademark myths is available for background reading only (source: https://www.termsfeed.com/blog/open-source-trademark/, weight 0.13, weak backing).

## Sources considered

| URL | Weight | Note |
|---|---|---|
| https://uspto.report/TM/90203978 | 0.80 | YUBICO registration record (third-party USPTO mirror) |
| https://www.uspto.gov/trademarks/search | 0.94 | Official USPTO clearance search |
| https://www.yubico.com/ | 0.76 | Vendor marketing presence |
| https://www.yubico.com/support/download/ | 0.77 | Vendor product presence |
| https://google.github.io/opencasebook/trademarks/ | 0.74 | OSS trademark strategy casebook |
| https://docs.oscollective.org/for-hosted-member-projects/trademarks-and-ip | 0.79 | OSC attorney-supported registration path |
| https://uspto.report/company/Yubico-Ab | 0.40 | Weak: mark count |
| https://usmarkdb.com/owner/yubico-ab | 0.16 | Weak: mark count |
| https://www.fosshub.com/resources/maintainers/trademarks/ | 0.23 | Weak: brand vs code separation |
| https://www.termsfeed.com/blog/open-source-trademark/ | 0.13 | Weak: background primer |
| https://www.traverselegal.com/blog/how-to-check-if-a-business-name-is-trademarked/ | 0.13 | Weak: litigation-risk framing |
| https://www.namepros.com/threads/ninja-gtld-generic-top-level-domain.1399103/ | 0.04 | Weak: discarded, forum thread |
