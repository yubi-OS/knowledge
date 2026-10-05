# Selective Public-Security Funding

Scope: Selective public-security funding. Applying for grants only where the project has a scoped, public deliverable, and matching funding narratives to the evidence boundary.

## The selectivity principle

Applying for public funding selectively, only where the project has a scoped and public deliverable, is the discipline this doc addresses. The reason for the selectivity is that grant applications consume time the early team does not have, and a funded-but-unscoped deliverable creates a reporting obligation against work the evidence boundary does not yet cover. The test to apply before applying: can the deliverable be named in one sentence, is it public (an open-source artifact, a published standard, a documented tool), and does it sit inside the proven or near-term scope rather than beyond it.

## The US federal landscape

The two relevant federal programs are SBIR (Small Business Innovation Research) and STTR (Small Business Technology Transfer), together known as America's Seed Fund, described by the program itself as major sources of early-stage funding for US technology development and commercialization ([sbir.gov/topics, weight 0.79, authoritative backing](https://www.sbir.gov/topics)). Eligibility is the first gate: the program's own application guidance instructs applicants to check whether they meet eligibility requirements and to read the entire solicitation carefully before applying, because solicitation-specific requirements cause administrative rejections ([sbir.gov/apply, weight 0.68, authoritative backing](https://www.sbir.gov/apply)). NSF's SBIR program documents its specific eligibility and requirements, including that NSF reserves the right to issue an SBIR award based on an STTR proposal and vice versa where the underlying project meets requirements ([seedfund.nsf.gov, weight 0.91, authoritative backing](https://seedfund.nsf.gov/solicitation-eligibility/)). Grants.gov, the federal grants portal, frames eligibility determination as the first step in applying for federal funding opportunities ([grants.gov, weight 0.91, authoritative backing](https://www.grants.gov/)).

For a security infrastructure project the practical sequence is: confirm entity eligibility (an SBIR-eligible small business, or a partner structure for STTR), find solicitations whose topics match a scoped deliverable, and read the full solicitation before deciding to apply. The scoped-deliverable test maps directly onto this structure: an application is only worth preparing when the deliverable named in the proposal is one the project has committed to publicly.

## Open-source-specific funding

NSF's Pathways to Enable Secure Open-Source Ecosystems (PESOSE) program supports the translation of open-source research products into safe and sustainable ecosystems ([nsf.gov, weight 0.78, authoritative backing](https://www.nsf.gov/funding/opportunities/pesose-pathways-enable-secure-open-source-ecosystems)). This is the closest federal program shape to the public-security funding pattern: funding aimed specifically at security work in open-source ecosystems, where the deliverable is inherently public. A project applying here can align its evidence boundary with the program's expectations, because both require naming what exists and what will exist.

Outside the federal programs, open-source grants fund work that ordinary sponsorships rarely cover, including security hardening, infrastructure maintenance, and documentation ([oss.fund, weight 0.18, weak backing](https://www.oss.fund/guides/open-source-grants-2026/)). Private research grants also exist for open-source projects, for example fal.ai's research grants supporting open-source work ([fal.ai, weight 0.64, authoritative backing](https://fal.ai/grants)). These smaller programs are useful where a scoped deliverable is too narrow for a federal solicitation but still deserves dedicated funding.

## Post-award structure

The SBIR phase structure matters for planning: follow-on guidance documents eligibility for a Phase 1 match grant for companies with a current or recent Phase 1 award, and different match structures for Phase 2 ([wisconsinctc.org, weight 0.71, authoritative backing](https://wisconsinctc.org/programs/sbir-and-sttr-guidance/sbiradvance/)). The implication for days 0 to 30 planning is that an award is not one event but a sequence with distinct phases, each with its own reporting and matching opportunities, which strengthens the case for applying only when the deliverable is genuinely scoped: a multi-phase commitment against an unscoped deliverable compounds the reporting risk.

## Connecting funding to the evidence boundary

The funding track and the evidence boundary connect in both directions. Forward: a scoped public deliverable on the near-term roadmap is the natural grant topic, because the application can truthfully describe current capability. Backward: a grant's reporting requirements can force premature claims, which is why the selectivity test includes checking that the deliverable sits inside proven scope. The safe pattern is to fund work that is already committed publicly (a published roadmap item, an open-source tool the project has announced), never to let funding requirements invent commitments the roadmap does not carry.

## What days 0 to 30 actually does

The realistic days 0 to 30 output is not an application but a shortlist: identify grant opportunities matching a clearly public deliverable, record the eligibility gates and deadlines, and defer the application decision to the days 31 to 60 window once the pilot work shows whether the deliverable is on track. Shortlisting in week 3 without applying preserves both the option and the selectivity discipline.
