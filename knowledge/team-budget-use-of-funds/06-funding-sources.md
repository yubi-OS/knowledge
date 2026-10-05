# Funding sources: where an early-stage open-source envelope comes from

Scope: the funding landscape for an early-stage open-source venture (grants, sponsorships, fiscal hosts, donations, personal capital) and how the funding source shapes the use-of-funds envelope and its constraints.

## Why the source of funds precedes the envelope

The yubiOS source framework explicitly conditions its budget envelope on "funding actually raised or committed (personal capital, revenue, or a grant)." The funding-source question is therefore not adjacent to the budget; it is the budget's input. Until one of those sources produces a recorded number, the envelope stays an open item (see the envelope-discipline doc).

## The funding taxonomy

An open-source funding guide structures the 2026 landscape as a staged progression: "start with the simplest visible funding surface, then add a second route that matches your project stage. Most projects should begin with GitHub Sponsors, Open Collective, or another donation option. Mature projects can add grants, paid support, Tidelift, bounties..." (https://www.oss.fund/guides/how-to-fund-open-source-project/, weight 0.587). The staged logic matches the yubiOS trigger-based allocation: funding surfaces are added as the project's stage justifies them, not all at once.

A community-oriented funding guide enumerates four types (https://softwareforprogress.org/learn/finding-funding-sources-for-your-open-source-project/, weight 0.549):

1. **Open source grants and fellowships** (institutional programs funding specific work).
2. **Community sponsorship platforms** (GitHub Sponsors, Open Collective).
3. **Fiscal hosts and nonprofit backing** (an existing nonprofit holds funds on the project's behalf).
4. **One-time donations or tip jars** (lowest commitment, lowest overhead).

The grants.gov portal itself confirms the institutional tier: "Federal funding opportunities published on Grants.gov are for organizations and entities supporting the development and management of government-funded programs and projects" (https://www.grants.gov/, weight 0.828). Two implications follow: federal grants generally require an organized entity to apply (which links back to the front-loaded entity decision in the legal doc), and federal money arrives with program-specific use-of-funds rules attached.

## The grants model: high value, competitive, time-bound

The OSS Fund's grants model page characterizes institutional grants as "institutional or programmatic funding for specific open source outcomes," suited to "projects aligned with public infrastructure, research, ecosystem priorities, or social good. Can be high-value, but competitive and time-bound" (https://www.oss.fund/models/grants/, weight 0.576). The time-bound property matters for budgeting: grant money typically arrives with an allowed-use window and reporting obligations, which means a grant-funded envelope carries constraints a personal-capital envelope does not. A use-of-funds framework must therefore record not just the amount but the source and its conditions.

## How the source shapes the envelope's shape

Each funding source imposes a different constraint structure on the envelope:

- **Personal capital**: fewest external constraints; the founder's own risk tolerance sets the envelope; no reporting duty.
- **Revenue (paid pilots, support contracts, consulting)**: unconstrained in use but bounded by deal flow; the yubiOS framework's event-driven cost classes (pilot work, support) scale with this source rather than with a fixed amount.
- **Grants**: often purpose-restricted and time-bound; the envelope must allocate within the grant's allowed categories and horizon.
- **Sponsorships and donations**: least restricted but least predictable; suited to ongoing costs, not front-loaded one-time items.

## Weak-backing context

Directory and listing material covers the same landscape with weaker weight: an open-source funding directory index (https://moldstud.com/articles/p-finding-funding-for-open-source-projects-essential-sources-and-strategies, weight 0.074) and a grant aggregator (https://www.opengrant.tech/, weight 0.371), plus a sponsorships-versus-grants explainer (https://www.societ.com/blog/fundraising/grants-sponsorships-donations/, weight 0.204) and a sustainability survey piece (https://matforge.org/open-source-scientific-software-sustainability-funding/, weight 0.450). Labeled weak; not load-bearing.

## Takeaway

Fund the envelope before writing it. Match the funding surface to the stage (donations and sponsors first, grants when there is an entity and a fundable outcome, revenue from the offer catalog as it lands), and record each source's constraints alongside its amount, because a grant dollar and a revenue dollar buy different things.
