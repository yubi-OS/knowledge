# 01. What stays public

Scope: which artifacts an open-source project commits to keeping public (source, threat models, base image, architecture decisions), and why a covenant needs to name them explicitly instead of relying on license defaults.

## The baseline: what "open" already promises

Open source software is software whose code is made publicly available for anyone to view, use, modify, and share. It is the opposite of proprietary black-box software, where the underlying code is hidden and controlled [1] (weight 0.75). The Open Source Initiative frames its Open Source Definition as the foundation of the modern software ecosystem, built so the freedoms and opportunities of open source software can be enjoyed by all [2] (weight 0.84).

That license-level promise covers source code and distribution rights. It does not, by itself, guarantee that every artifact a user needs to trust or run a system stays public. A covenant exists to close that gap: it names the artifact classes the project will never close, so the commitment is checkable rather than implied.

## Why a project needs an explicit public-artifact list

The early free-software community treated open sharing of information as an absolute commitment, not a marketing position [3] (weight 0.44, weak backing). Modern covenants translate that ethos into a list. The common artifact classes that appear in such lists:

- **Source of every trust-relevant component.** Anything a user must rely on for security loses its meaning if an opaque variant exists, because the user can no longer verify what they run.
- **Threat models and known limitations.** Security tooling that hides its own gaps is the anti-pattern these documents exist to prevent; publishing limitations is part of the commitment, not a confession.
- **The runnable artifact itself.** A covenant often commits that the bootable or installable form of the system is freely installable, not gated behind a purchase.
- **Design decisions with rationale.** Decisions are published with their reasoning while they are still contestable, not after they are fait accompli.

## How this differs from the open-core split

The open-core model is a business arrangement in which a for-profit company provides a significant core as open source while monetizing a proprietary remainder [4] (weight 0.12, weak backing). A public-interest covenant is a different instrument: it does not divide the codebase into open and closed parts. It instead fixes the floor of what can never move to the closed side, regardless of business model. Projects can be open-core and still sign a covenant; the covenant's role is to guarantee that the parts users must trust (and the parts users must be able to run at all) are on the open side of any future line.

## The checkability test

A useful covenant phrase is testable: "the trust chain ships as source under license X with no closed variant" is checkable by inspection at any release. Vague phrasing ("we believe in openness") is not. Stanford's framing is useful here: the defining property is that anyone can view, use, modify, and share [1] (weight 0.75). If a proposed artifact class fails that test for some tier of users, it does not belong in the "always public" list.

## Caveats

The distinction between free software and open source is mostly shared in practice, but the two movements emphasize different ethics [5] (weight 0.20, weak backing). A covenant does not need to resolve that debate; it needs to state, per artifact class, which freedom it protects (to inspect, to run, to fork, to contest).

## Sources considered

| # | Source | Weight |
|---|---|---|
| 1 | https://opensource.stanford.edu/what-is-open-source-why-does-it-matter | 0.75 |
| 2 | https://opensource.org/home-page-standard | 0.84 |
| 3 | https://www.oreilly.com/openbook/opensources/book/intro.html | 0.44 |
| 4 | https://en.wikipedia.org/wiki/Open-core_model | 0.12 |
| 5 | https://www.geeksforgeeks.org/software-engineering/difference-between-free-software-and-open-source-software/ | 0.20 |
| 6 | https://journalism.university/contemporary-scenario-of-digital-media/open-source-software-philosophy-principles-licensing/ | 0.29 |
| 7 | https://www.openevidence.com/ | 0.08 |
| 8 | https://fourweekmba.com/open-core/ | 0.14 |
| 9 | https://digitaldigest.com/open-core-debate-future-vs-compromise/ | 0.07 |
| 10 | https://github.com/orgs/community/discussions/208934#discussioncomment-18632095 | 0.15 |
| 11 | https://enfilade.guide/en | 0.15 |
| 12 | https://www.openevidence.com/ | 0.13 |
