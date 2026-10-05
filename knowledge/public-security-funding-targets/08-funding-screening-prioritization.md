# Screening funders and sequencing the application backlog

Scope: Screening criteria and prioritization rationale for selecting funders: avoiding roadmap and governance distortion, matching grants to scoped public outputs, sequencing an application backlog, and re-verifying deadlines before applying.

## Why screening precedes applications

A funding screen is applied before any application is drafted, because the expensive failure mode is not rejection; it is acceptance of terms that bend the project's roadmap or governance toward a funder. The screen answers one question per candidate program: does this funder let the project ship what its own readiness gates already say is next, and does the money arrive without conditions that conflict with what the project has committed to keep public?

## The four screen-out conditions

A candidate program is screened out if any of the following holds:

1. Roadmap substitution. The funder's terms require prioritizing a feature or timeline the funder wants over what the project's own readiness gates say is next. The defense SBIR/STTR model illustrates the pattern to watch for: topics exist "to meet stated agency needs or missions" (https://www.defensesbirsttr.mil/SBIR-STTR/Program/, weight 0.96), so the roadmap arrives from the solicitation. Funding buys scoped deliverables, not roadmap control.
2. Confidentiality or exclusivity. Any term requiring non-disclosure of the funding relationship, exclusivity, or conflict with the project's published commitments (threat models, decision records, source) fails the screen.
3. Governance capture. Money in exchange for a governance seat or veto over core technical decisions fails the screen regardless of source. Governance research on open-source ecosystems documents how institutional and funding complexity reshapes project governance (https://www.sciencedirect.com/science/article/pii/S2444569X24000623, weight 0.55; weak-to-moderate backing, treat as background rather than authority).
4. No public deliverable path. Funding that supports only exploratory work with no path to a public, citable output (a decision record, a merged change, a published audit) fails the screen. Each viable opportunity should be matched to a scoped public output before any application is written.

## Eligibility as the first filter

Before governance screening, eligibility is the mechanical filter, and every program in this corpus makes its eligibility criteria public:

- SBIR/STTR requires a small, for-profit, independent US business concern, certified at award (https://www.sbir.gov/sites/default/files/elig_size_compliance_guide.pdf, weight 0.91). No entity, no application.
- NLnet requires open licences, genuine technical development, human-authored proposals, and, for EU-supported funds, a European dimension with Horizon Europe-eligible applicants (https://nlnet.nl/propose/, weight 0.77).
- OTF's FOSS Sustainability Fund requires maintenance, quality documentation, interoperability, and reproducibility work in the internet-freedom stack, plus a sustainability plan beyond OTF support (https://www.opentech.fund/funds/free-and-open-source-software-sustainability-fund/, weight 0.65; https://docs.opentech.fund/otf-application-guidebook/our-funds-and-fellowships/free-and-open-source-software-foss-sustainability-fund, weight 0.75).
- Sovereign Tech Fund funds long-term maintenance of open digital infrastructure rather than prototypes (https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/document/funding-open-source-case-study-sovereign-tech-fund, weight 0.89), which mechanically screens out prototype-stage projects.
- GitHub's fund targets maintainers of real projects (https://github.com/open-source/github-secure-open-source-fund, weight 0.56).

The Federal Register of opportunities, Grants.gov, is the search layer for the wider government space (https://www.grants.gov/, weight 0.69; https://www.grants.gov/search-grants, weight 0.53), useful for enumerating candidates but not a substitute for each program's own criteria page.

## Sequencing the backlog

Rank candidates by friction and fit, and validate the cheap pattern first:

1. Cohort and maintainer funds first. GitHub's Secure Open Source Fund is the lowest-friction entry: rolling review, funding bundled with programming, and an expected output of a named security improvement (https://github.blog/news-insights/company-news/announcing-github-secure-open-source-fund/, weight 0.84; https://github.com/open-source/github-secure-open-source-fund/projects, weight 0.72). A small scoped application there validates the scoped-deliverable pattern before larger asks.
2. Structured community programs next. The Rust Foundation's Rust Innovation Lab shows the shape of a structured, program-managed funding vehicle for ecosystem work (https://rustfoundation.org/rust-innovation-lab/, weight 0.80): named cohorts, defined support, and published program design. Similar programs reward applicants who arrive with a specific deliverable already scoped.
3. Foundation research grants after that (NLnet), where call windows are dated and criteria are strict but light (https://nlnet.nl/propose/, weight 0.77).
4. Conditional and deferred programs last: OTF only with a genuine at-risk-user deliverable (https://docs.opentech.fund/otf-application-guidebook/our-funds-and-fellowships/internet-freedom-fund, weight 0.75); Sovereign Tech only post-prototype (https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/document/funding-open-source-case-study-sovereign-tech-fund, weight 0.89).

## Decision criteria before any submission

Three checks gate every real application:

1. Does the scoped deliverable map to work already on the project's own plan, rather than new scope invented to fit a funder's theme?
2. Does accepting the funding pass all four screen-out conditions with no exceptions?
3. Is there a named owner who can actually execute the application and the resulting deliverable, given everything else already in flight? An application nobody has capacity to complete is a screening failure, not a backlog item.

## Re-verification discipline

Programs run on rolling or periodic cycles, and third-party funding directories decay fast (aggregator pages in this dig scored as low as 0.04 to 0.41). Before any application: read the program's own criteria and deadlines page, confirm the current cycle is open, and re-verify amounts. Never cite a third-party summary where a program's own page exists.
