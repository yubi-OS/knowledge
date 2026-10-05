# Use-of-funds transparency: how open-source funding platforms handle allocation disclosure

Scope: how open-source funding platforms structure transparent collection and spending, why disclosure matters for backer trust, and what a use-of-funds framework inherits from platform norms.

## Transparency is the platform's core pitch

Open Collective's sponsor page states the model directly: "Make your community sustainable. Collect and spend money transparently" (https://opencollective.com/become-a-sponsor, weight 0.619). The product promise is not just collection; it is that every contributor and every funder can see where money went. For an open-source venture, this inverts the usual privacy of small-company finances: the budget allocation itself becomes a public artifact.

That inversion has consequences for the yubiOS framework. Its allocation logic (the ordered weights over engineering, legal, pilots, support, community, operations) is the kind of document a transparent funding platform would effectively publish. A venture that accepts community money under a transparency norm cannot quietly reallocate; the weights become commitments.

## Platform mechanics that enforce visibility

The Open Collective documentation describes how GitHub Sponsors connects for collectives hosted by Open Source Collective: "Collectives that are hosted by Open Source Collective can connect to GitHub Sponsors" (https://documentation.opencollective.com/collective-settings/github-sponsors, weight 0.824). The hosting-and-fiscal-sponsor layer is what makes funds flows auditable: the fiscal host holds the money, applies its own compliance checks, and surfaces transactions on the collective's public page.

The transaction ledger is visible by design. Open Collective's GitHub Sponsors integration page displays individual fund flows as ledger entries, for example debit entries from GitHub Sponsors to a collective with date, amount, and completion status shown inline (https://opencollective.com/github-sponsors, weight 0.679). A use-of-funds framework operating on such a platform therefore gets per-transaction disclosure for free, but also loses the ability to bundle spending into opaque categories: each expense line is its own public entry.

## What a use-of-funds framework inherits

Three norms transfer from platform practice to any budget framework, whether or not it uses a platform:

1. **Line-item visibility.** Transparent platforms publish individual transactions. A budget framework should be decomposable to the same granularity, so an allocation claim ("spend went to the readiness gate") can be checked against actual expense entries.
2. **Source-attributed funds.** The GitHub Sponsors ledger entries name the funding source on each entry (the sponsor integration itself), not just the amount. Matching the source-funding doc in this corpus, the envelope should record which funding source each allocation draws on, because a grant dollar and a sponsor dollar carry different constraints.
3. **Spend-before-collect framing.** The platform pitch addresses sponsors with "collect and spend money transparently," putting spend on equal footing with collection. A budget framework that only specifies how money would be spent if it arrived, without a record of what did arrive, is missing half the ledger.

## Comparison with direct sponsorship

A practical comparison of GitHub Sponsors and Open Collective frames the choice as "direct sponsorship versus transparent project funding" (https://www.oss.fund/guides/github-sponsors-vs-open-collective/, weight 0.485, weak backing). Direct sponsorship pays an individual; transparent project funding routes money through a collective with public books. The use-of-funds discipline is the differentiator: a venture that wants its allocation logic to be a trust signal should prefer the routed, public-books model or replicate its ledger discipline manually.

## Weak-backing context

Maintainer-facing guidance on funding transparency (https://www.fosshub.com/resources/sustainability/funding-transparency/, weight 0.302) and practitioner write-ups on open-source financial transparency and budgeting (https://dev.to/jennythomas498/open-source-project-financial-transparency-and-budgeting, weight 0.086; https://dev.to/laetitiaperraut/open-source-funding-strategies-case-studies-and-best-practices, weight 0.271) discuss the same norms with weaker authority. Labeled weak; none of the load-bearing claims rest on them.

## Takeaway

Transparency norms from open-source funding platforms are budget-framework requirements in disguise: line-item visibility, source attribution on every fund flow, and equal standing for the spend record next to the collection record. A use-of-funds framework that can be checked against a public ledger is the strongest form; one that cannot should at least be structured as if it could be.
