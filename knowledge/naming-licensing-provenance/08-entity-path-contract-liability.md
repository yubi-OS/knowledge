# 08 - Entity path before contract and liability-bearing offers

Scope: why signing paid support contracts and carrying managed-service liability wants a business entity in place first, and the sole proprietorship versus LLC tradeoffs for a pre-launch open-source maintainer.

## What the IRS definitions establish

The Internal Revenue Service definitions are the strongest sources in this dig. A sole proprietor is someone who owns an unincorporated business by themselves, with a specific carve-out: a sole member of a domestic LLC that elects corporate treatment is not a sole proprietor (source: https://www.irs.gov/businesses/small-businesses-self-employed/sole-proprietorships, weight 0.52). A limited liability company is a business structure allowed by state statute, with each state using different rules (source: https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc, weight 0.95). Two facts follow directly: the sole-proprietorship default needs no formation filing, and the LLC alternative is state-law creation rather than a federal category.

## Why contracts and liability change the calculus

The yubiOS risk register's concrete driver is its offer catalog: paid support SLAs, consulting, and managed services are liability-bearing offers, and the register flags the missing entity as blocking those offers rather than as a general incorporation itch. The dig supports the surrounding practice with mid-weight and weak sources:

1. Consulting agreements exist to protect both sides in case of nonpayment, failure to deliver services, or problems arising between consultant and client, and are signed before the consultant commences work (source: https://www.legalzoom.com/articles/what-to-include-in-your-consulting-agreement, weight 0.50, weak backing). Who the parties to that agreement are is the entity question.
2. An LLC can separate business contracts, debts, and ownership from personal affairs, though the reason to form one should be broader than a single piece of advice (source: https://myllcschool.com/llc-for-consultants/, weight 0.24, weak backing).
3. Contractor-focused comparisons weigh liability, taxes, contracts, and insurance together (source: https://www.wexfordins.com/post/llc-vs-sole-proprietorship-for-contractors, weight 0.27, weak backing).
4. General comparisons put the tradeoff plainly: an LLC protects personal assets while a sole proprietorship costs nothing to start (source: https://businessanywhere.io/llc-vs-sole-proprietorship-whats-best-for-freelancers-and-side-hustlers/, weight 0.36, weak backing), with a Forbes comparison covering the same decision space (source: https://www.forbes.com/advisor/business/sole-proprietorship-vs-llc/, weight 0.50, weak backing).

## What the register deliberately does not decide

The register states this is a decision requiring the founder's actual legal and tax situation, which the session that drafted it had no visibility into. The dig confirms that the two standard candidates differ on exactly the axes that matter for a contract-bearing offer catalog: formation cost and formality (sole proprietorship default versus state-law LLC, per the IRS pages at weights 0.52 and 0.95), liability separation (weakly backed sources above), and tax treatment. It does not and cannot pick one without the founder's tax situation, jurisdiction, and the actual contract terms planned.

One related weakly backed note on the open-source context: maintainer burnout and the unsustainable customer-like relationship users sometimes project onto free work is a documented phenomenon (source: https://mikemcquaid.com/open-source-maintainers-owe-you-nothing/, weight 0.24, weak backing). Paid contracts formalize that relationship, which is exactly why the entity question surfaces before the first SLA is signed rather than after.

## Dependency, flagged not resolved

Per the register: the entity decision is owned by the broader OMN-72 workstream (entity, governance, legal), and this corpus records only that the decision is open and that the paid offers depend on it. Nothing here asserts an entity type, a jurisdiction, or a formation timeline.

## Sources considered

| URL | Weight | Note |
|---|---|---|
| https://www.irs.gov/businesses/small-businesses-self-employed/limited-liability-company-llc | 0.95 | IRS LLC definition (primary) |
| https://www.irs.gov/businesses/small-businesses-self-employed/sole-proprietorships | 0.52 | IRS sole proprietorship definition (primary) |
| https://www.legalzoom.com/articles/what-to-include-in-your-consulting-agreement | 0.50 | Weak: consulting agreement purpose |
| https://www.forbes.com/advisor/business/sole-proprietorship-vs-llc/ | 0.50 | Weak: comparison |
| https://businessanywhere.io/llc-vs-sole-proprietorship-whats-best-for-freelancers-and-side-hustlers/ | 0.36 | Weak: comparison |
| https://www.wexfordins.com/post/llc-vs-sole-proprietorship-for-contractors | 0.27 | Weak: contractor framing |
| https://mikemcquaid.com/open-source-maintainers-owe-you-nothing/ | 0.24 | Weak: maintainer context |
| https://myllcschool.com/llc-for-consultants/ | 0.24 | Weak: consultant LLC guide |
| https://www.rcdwealth.com/ | 0.38 | Discarded: off-topic marketing page |
| https://en.sorumatik.co/t/zenbusiness-reviews-to-form-an-llc-in-for-consulting/270006 | 0.09 | Weak: background |
| https://www.openevidence.com/ | 0.05 | Discarded: off-topic |
| https://en.wikipedia.org/wiki/Islamic_finance_products,_services_and_contracts | 0.11 | Discarded: off-topic |
