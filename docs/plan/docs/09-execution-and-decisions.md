# 09 - Execution plan and standing decisions

Scope: the planning document's operational closing sections: the first 90 days in three 30-day blocks, the metrics and reporting discipline, and the standing adopt, defer, and reject lists, plus the closing commercial test.

## First 90 days

### Days 0 to 30: make the offer safe to discuss

From the source doc (yubi-OS/yubiOS docs/PLAN.md) (source doc):

- Complete trademark/name, license, contributor-provenance, and entity consultations.
- Publish the public-interest covenant and conflict policy.
- Turn the current blocker list into explicit Technical Preview entry criteria.
- Draft the pilot statement of work, data sheet, support boundaries, and ROI baseline worksheet.
- Conduct 10 to 15 problem interviews with release engineering, security platform, firmware, and regulated-lab operators. Do not pitch before understanding their alternative cost.
- Apply selectively for public-security funding only where yubiOS has a scoped, public deliverable.

### Days 31 to 60: prove the narrow product

(source doc):

- Retire or reclassify the VM, physical-token, runtime-hardening, and release blockers for one pilot platform.
- Publish a reproducible physical-YubiKey and recovery demonstration with exact evidence and limits.
- Recruit two design partners matching the initial customer profile.
- Price the pilot; do not default to unpaid custom engineering.
- Establish vulnerability triage, release severity, escalation, backup, and incident communications exercises.

### Days 61 to 90: test willingness to pay

(source doc):

- If Gate 1 is met, run one paid 25 to 50 node pilot on disposable or non-critical systems.
- Measure deployment hours, operator training, update/rollback success, evidence preparation, recovery time, and support load.
- Produce a confidential customer ROI readout and, with permission, a bounded public case study.
- Decide: proceed to a second pilot, narrow the offer, change the target segment, or pause commercial hiring.

## Metrics and reporting

The source doc separates project health from business health and forbids vanity metrics without a decision they inform (source doc).

Public project health metrics (source doc): supported release and artifact-verification status; percentage of published artifacts with SBOM and provenance; critical-fix lead time and security-report acknowledgement time; update/rollback, recovery, physical-token, and real-hardware test results; active blockers, independent reviewers, retained contributors, and bus factor; upstream contributions and public-interest budget allocation; corrections to public claims and sponsor/customer conflicts.

Business health metrics (source doc): qualified interviews, priced pilots, pilot conversion, time to value, and measured customer ROI; ARR, recognized revenue, gross margin by stream, cash runway, and burn; customer/node count, renewal, expansion, support hours per customer, and concentration; percentage of custom work upstreamed or converted into reusable capability; services share of revenue and recurring revenue coverage of core maintenance cost.

## Standing decisions

### Adopt

(source doc):

- Public core plus paid assurance, operations, and services.
- Proof-first, customer-funded discovery.
- Annual contracts with a minimum commitment.
- Transparent security and stewardship reporting.

### Defer until evidence exists

(source doc):

- A hosted fleet control plane.
- 24x7 response.
- Formal compliance certification.
- Channel partners, hardware bundles, or OEM volume pricing.
- A separate foundation or nonprofit.
- Venture financing beyond what is required to cross verified demand and support gates.

### Reject as the primary model

(source doc):

- Paid-only security fixes or delayed public fixes.
- Dual licensing that requires broad contributor copyright assignment.
- Advertising, data resale, or mandatory telemetry.
- A proprietary fork of the core OS.
- One-off customer branches that cannot be maintained or upstreamed.
- Broad consumer launch before support and recovery are proven.
- Treating grants, stars, downloads, or press coverage as recurring revenue.

## The closing commercial test

The source doc ends with a single test: keep the owner's control and the public security work genuinely public, then determine whether enterprises will pay for reliable operation, evidence, recovery, and accountability. If the paid layer requires weakening those public guarantees, it is the wrong business model for yubiOS (source doc).

## Drift note

The source doc carries a 2026-09-18 drift check (wayfinder round 11, cycle 6): PLAN.md was repaired in round-9 cycle-10 with planning claims re-anchored to the round records, and the register-review gap surfaced that round is the plan's own next step, noted as additive (source doc).

## Sources

- Primary: yubi-OS/yubiOS docs/PLAN.md (source doc), sections "10. Metrics and reporting", "11. First 90 days", "12. Decisions, deferrals, and rejected models", and the closing statement.
- No searXNG dig: internal-record subtopic. The execution plan and standing decision lists are internal choices of the project; there is no external mechanism to research. The dig step was skipped deliberately and this is the recorded reason.
