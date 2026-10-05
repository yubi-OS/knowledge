# Citation register and dependencies

Scope: the reusable citation register table structure (source, use for, do not use for) and its dependency map into pricing, ROI, and funding target documents.

## The register structure

The register's reusable artifact is a table with one row per benchmark. Each row carries five fields: a sequence number, the benchmark claim as a short citable line, the source (named specifically enough to refetch), a "use for" column, and a "do not use for" column. The two use columns are the point of the design: they make the claim boundary a stored field rather than a judgment each downstream writer has to remake. The register row for the breach cost benchmark, for example, reads: claim, average breach cost with phishing vector 4.8 million USD; source, IBM Cost of a Data Breach Report 2025; use for, directional cost of status quo argument; do not use for, claiming a specific customer's savings.

The pattern matches how claim governance is handled elsewhere. A marketing claims template organizes records by claim, evidence record, reviewer decision, approval conditions, and approved wording before anything moves forward (https://www.getveridat.com/resources/evidence-backed-marketing-claims-template, weakly backed, weight 0.4045). A brand claim governance writeup argues enterprise marketing teams should manage brand claims through a central register (https://flickbloom.com/blog/approved-brand-claim-management-governance, weakly backed, weight 0.0892). Both are below the 0.5 authoritative threshold and are cited as weak corroboration of the pattern, not as authority for any specific register row.

On the regulatory side, an above threshold source shows why registered, pre approved claim language matters: the FTC's guides on environmental marketing claims apply to claims in labeling, advertising, and promotional materials and require substantiation practices for business to business transactions as well (https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-260/, weight 0.9548, primary). That regulation concerns environmental claims specifically, not security benchmarks, and is cited only as evidence that claims made to the market are subject to substantiation expectations.

Research source tracking templates converge on the same row shape from the academic side: record the source name, date, and what you intend to use from it, in a table that survives the writing process (https://libguides.sccsc.edu/organizeresearch/table, weakly backed, weight 0.2950; https://uscupstate.libguides.com/c.php?g=1242370&p=9091821, weakly backed, weight 0.1675; https://study.sagepub.com/booth3e/student-resources/templates-and-trackers, weakly backed, weight 0.3273). An automated citation claim audit tool exists as a minimal experiment checking whether citations actually support their attached claims (https://github.com/t46/citation-claim-audit-kit, weakly backed, weight 0.1962), and a claims audit policy from a public library district shows the audit the register's validation gate mirrors: each claim examined against its evidence (https://www.buffalolib.org/sites/default/files/users/elm/files/policies/CLAIMS%20AUDIT%20POLICY.pdf, weight 0.7772, primary for its own policy).

## The dependency map

The register feeds three downstream doc families, and the dependency is directional: downstream docs cite register rows, they do not collect their own benchmarks.

1. Pricing and offer documents. The market growth benchmark (row 2) and the hardware cost benchmark (row 4) supply citable external numbers for pricing context. The row 4 hardware cost line is live checkable and is the only row in the register refreshed per conversation rather than per year.
2. Customer ROI models. Row 1 (breach cost) and row 4 (hardware cost) are the external inputs; the customer's own baseline data is the other required input, and the register rows explicitly do not substitute for it.
3. Public security funding targets. Row 5 (regulatory tailwind) supplies the federal direction argument, bounded by the certification exclusion: the standards are strong sources, the product's certification status is unsupported by anything in the register.

## What the dependency map prevents

Because rows are the only permitted citation source, three failure modes are structurally blocked: a downstream doc citing a vendor forecast without the range caveat (the caveat is stored in the row); a downstream doc converting a directional benchmark into a product claim (the do not use for field is stored in the row); and a downstream doc citing a stale number after a refresh has landed (the row carries the retrieval date and refresh state). The refresh cadence doc (08-refresh-cadence-and-source-aging.md) tracks which rows are current.

## Maintenance

The register is maintained by re-running the checklist gates on each row at its cadence, not by editing downstream docs to match reality after the fact. When a row's number changes, the row is updated first with a new retrieval date, and downstream documents inherit the change on their next revision. The one open maintenance item carried by this pass is the overdue owner resolution on the 25 dollar worksheet floor flag (see 05-hardware-cost-validation.md) and the already triggered refresh of the breach cost benchmark to the 2026 IBM edition (see 02-breach-cost-benchmarks.md).
