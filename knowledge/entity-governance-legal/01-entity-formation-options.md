# 01. Entity formation options for a solo open-source security project

Scope: comparison of US legal entity types (sole proprietorship, LLC, nonprofit) for a solo-founder pre-revenue open-source security software project, with the liability, tax, and funding tradeoffs that frame the decision.

## The baseline comparison: sole proprietorship vs LLC

The core comparison for a one-person operation is between remaining a sole proprietorship and forming a limited liability company. Sources consistently frame the decision around four axes: liability protection, tax treatment, formation cost, and ongoing paperwork (https://loio.com/guides/llc-vs-sole-proprietorship, jev weight 0.20, weak backing). A sole proprietorship is usually the simpler fit for a one-person, low-risk business, while an LLC becomes the better fit once liability protection matters (https://loio.com/guides/llc-vs-sole-proprietorship, jev weight 0.20, weak backing).

Liability is the axis that separates the two. A sole proprietorship leaves the owner personally exposed to business debts and claims; an LLC creates a separate legal entity that shields personal assets (https://www.sdocpa.com/llc-vs-sole-proprietorship, jev weight 0.34, weak backing). The same source compares tax treatment and formation costs side by side, noting that the decision is not just about protection today but about when to switch as the business grows (https://www.sdocpa.com/llc-vs-sole-proprietorship, jev weight 0.34, weak backing).

On tax, the sole proprietorship and single-member LLC are taxed identically by default (both flow through to the owner's personal return), so the choice is driven more by liability and formality than by tax at formation (https://unclekam.com/tax-strategy-blog/llc-vs-sole-proprietorship, jev weight 0.16, weak backing). Comparative guides emphasize self-employment tax treatment as a shared feature and point to quarterly estimated payments as an obligation that applies either way (https://www.selfemploytaxcalc.com/blog/llc-vs-sole-proprietorship-tax-comparison, jev weight 0.11, weak backing).

For a security software project, the risk profile matters: selling support contracts, SLA-backed services, or consulting creates contractual liability that a bare sole proprietorship does not contain. Comparative tax and liability write-ups treat an LLC as the standard upgrade path once the business signs contracts or takes payment (https://www.trustedlegal.com/sole-prop-vs-llc-taxes/, jev weight 0.60; https://smallbiztrends.com/llc-vs-sole-proprietorship/, jev weight 0.60).

## The nonprofit alternative

A nonprofit corporation differs from an LLC in a fundamental way: an LLC supports private ownership and flexible profit distribution, while a nonprofit corporation serves an approved mission without private owners (https://www.upcounsel.com/llc-vs-nonprofit, jev weight 0.21, weak backing). The choice between them hinges on goals, funding, governance, and tax treatment (https://thelegalguide.org/difference-between-llc-501c3, jev weight 0.13, weak backing).

Two facts constrain the middle ground. First, a standard LLC almost never qualifies for tax-exempt status; only narrow paths exist (https://myllcschool.com/nonprofit-llc-vs-501c3, jev weight 0.11, weak backing). So "hybrid LLC-nonprofit" is not a practical default for a solo founder. Second, forming a private foundation is a distinct, heavier undertaking with its own compliance regime (https://www.501c3.org/privatefoundation, jev weight 0.35, weak backing), not the natural entry point for a software project.

## What this comparison frames

For a pre-revenue solo-founder project that expects to sign support and consulting contracts, the dig supports a specific framing rather than a recommendation:

1. Remaining unincorporated leaves personal exposure exactly when contract-bearing offers are about to launch.
2. An LLC is the standard low-cost way to get liability separation while keeping pass-through tax (https://loio.com/guides/llc-vs-sole-proprietorship, jev weight 0.20, weak backing).
3. A nonprofit path exists but trades away private ownership and adds formation and compliance overhead, and it is only compatible with the mission if grant funding becomes the primary path (https://www.upcounsel.com/llc-vs-nonprofit, jev weight 0.21, weak backing).

The entity decision is time-sensitive, not abstract: it blocks real contract signing and real payment processing. The tradeoff with grant eligibility is covered in doc 09; the structural and governance consequences of whichever entity is chosen are covered in docs 02 and 03.
