# 02 - Nominative fair use vs implied endorsement in the README

Scope: when a project README's heavy use of a third-party brand (badges, naming, product references) stays inside nominative fair use and when it slides into implying endorsement, plus the standard non-affiliation disclaimer practice.

## What nominative fair use actually covers

Nominative fair use is the doctrine that allows referring to someone else's trademark when that reference is necessary for understanding. A vendor trademark policy states it plainly: "nominative use" allows the use of another's trademark where it is necessary for understanding (source: https://particular.net/trademark-policy, weight 0.84). The International Trademark Association's plain-language fact sheet adds context on where the doctrine applies: nominative fair use generally applies to comparative advertising, parody, and non-commercial use of trademarks in academic articles and media reports, with European use subject to the EU directive on misleading and comparative advertising (source: https://www.inta.org/fact-sheets/fair-use-of-trademarks-intended-for-a-non-legal-audience/, weight 0.84).

For a hardware-compatibility project, the compatibility reference is the load-bearing case. A weakly backed practitioner summary captures the line: you can refer to a well-known brand to describe compatibility, comparison, or identification, provided you do so accurately and without suggesting sponsorship (source: https://www.jimersonfirm.com/blog/2025/10/whats-fair-use-in-trademark-law-and-how-does-it-apply-to-my-business/, weight 0.06, weak backing). A mid-weight survey of the doctrine covers the same distinction, descriptive versus nominative use, and the confusion analysis that still creates infringement risk (source: https://techandmedialaw.com/trademark-fair-use-examples-lessons-landmark-cases/, weight 0.54).

## Where the yubiOS README sits

The source risk register observes that the README's current framing, YubiKey as root of trust plus extensive YubiKey badges and logo styling, sits close to the compatibility end of that line: describing what the project works with. It also observes that nothing in the project's own governance docs (AGENTS.md, COMPANY.md) records any actual relationship with Yubico. The dig supports the doctrine side of that read but cannot bless the specific README styling: that judgment is a trademark-counsel question, and this corpus keeps it flagged.

The open-source casebook adds a relevant lens from the trademark holder's side: courts analyzed, in the Freecycle matter, the types of control a licensor may have over licensed trademarks, and a project can explicitly permit trademark use in some circumstances (source: https://google.github.io/opencasebook/trademarks/, weight 0.80). That cuts both ways for yubiOS: Yubico controls its mark, and yubiOS's freedom to reference it is bounded by nominative necessity, not by any license yubiOS holds.

## The disclaimer practice

The standard mitigation is an explicit non-affiliation statement. A disclaimer-of-endorsement clause, as collected in contract databases, states that the mention or use of a product, service, or organization does not imply official approval or support by the issuing party (source: https://www.lawinsider.com/clause/disclaimer-of-endorsement, weight 0.34, weak backing). Weakly backed guidance on third-party trademark disclaimers recommends the same practice in branding contexts (source: https://www.upcounsel.com/trademark-disclaimer, weight 0.17, weak backing).

A live example of the pattern, weakly backed but concrete, is a launcher project's disclaimer page stating it is not affiliated with, endorsed by, sponsored by, or approved by the upstream game's studio or publisher (source: https://flintlauncher.vercel.app/disclaimer, weight 0.05, weak backing). The weak weights here reflect that these are examples and aggregator pages, not authority; they establish that the disclaimer pattern is common practice, not what the law requires.

Weak background on the doctrine's classification within trademark fair use generally (source: https://en.wikipedia.org/wiki/Nominative_use, weight 0.13, weak backing) and a weak multi-circuit overview (source: https://www.buzko.legal/content-eng/nominative-fair-use-in-trademark-law-different-circuit-approaches-and-business-takeaways, weight 0.28, weak backing) are listed for completeness.

## Decision flagged, not resolved

The register's recommendation, add an explicit "not affiliated with or endorsed by Yubico" disclaimer once legal counsel confirms the naming approach, stays open. The dig supports the pattern's legitimacy (nominative use doctrine, weight 0.84) and its commonness (disclaimer clauses, weak backing), but the timing and wording remain a flagged decision for the project owner.

## Sources considered

| URL | Weight | Note |
|---|---|---|
| https://particular.net/trademark-policy | 0.84 | Vendor policy defining nominative use |
| https://www.inta.org/fact-sheets/fair-use-of-trademarks-intended-for-a-non-legal-audience/ | 0.84 | INTA plain-language fact sheet |
| https://google.github.io/opencasebook/trademarks/ | 0.80 | Freecycle analysis, licensor control |
| https://techandmedialaw.com/trademark-fair-use-examples-lessons-landmark-cases/ | 0.54 | Doctrine survey |
| https://www.lawinsider.com/clause/disclaimer-of-endorsement | 0.34 | Weak: disclaimer clause samples |
| https://www.buzko.legal/content-eng/nominative-fair-use-in-trademark-law-different-circuit-approaches-and-business-takeaways | 0.28 | Weak: circuit overview |
| https://www.upcounsel.com/trademark-disclaimer | 0.17 | Weak: disclaimer guidance |
| https://en.wikipedia.org/wiki/Nominative_use | 0.13 | Weak: background |
| https://www.jimersonfirm.com/blog/2025/10/whats-fair-use-in-trademark-law-and-how-does-it-apply-to-my-business/ | 0.06 | Weak: compatibility reference line |
| https://flintlauncher.vercel.app/disclaimer | 0.05 | Weak: live example |
| https://www.merriam-webster.com/dictionary/not | 0.31 | Discarded: off-topic |
| https://handwiki.org/wiki/Wikipedia | 0.15 | Discarded: off-topic |
