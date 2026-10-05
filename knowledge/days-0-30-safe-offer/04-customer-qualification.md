# Customer Qualification for Security Infrastructure

Scope: Target customer profile and qualification for security infrastructure. Who pays and why, buying triggers, deployment constraints, and shortlisting interview candidates.

## Why define the profile before the offer exists

An ideal customer profile (ICP) is the filter that decides which prospects are worth interview time and, later, pilot slots. Guidance on ICP construction argues that most B2B ICPs are too vague to actually filter a pipeline, and that a usable profile names specific firmographic and technographic criteria that disqualify as well as qualify ([tomba.io, weight 0.24, weak backing](https://tomba.io/blog/b2b-ideal-customer-profile)). For a pre-proven security infrastructure product the filter is even more important, because every pilot consumes scarce engineering support capacity and produces the reference case that later sales depend on.

## Anatomy of a usable qualification profile

ICP templates across the practitioner literature share a consistent structure: firmographics (industry, size, geography), the technical environment (what the prospect already runs), the trigger condition (what event makes them buy), and explicit disqualifiers ([prospeo.io, weight 0.15, weak backing](https://prospeo.io/s/ideal-customer-profile-b2b-examples); [diggrowth.com, weight 0.25, weak backing](https://diggrowth.com/blogs/gtm-strategy/b2b-ideal-customer-profile-template/)). Two elements matter disproportionately for security infrastructure:

1. Deployment constraints as qualification criteria. For infrastructure that touches boot chains, disk encryption, or firmware, the prospect's hardware fleet, OS estate, and compliance regime determine whether a pilot is even feasible. A regulated-lab operator running locked-down hardware is a different qualification question than a cloud-native platform team.
2. Disqualifiers written down. Evaluation-criteria guidance emphasizes scoring methods with explicit disqualifiers, because early-stage companies systematically waste pilot slots on accounts that fit the pain but not the deployment reality ([oppora.ai, weight 0.12, weak backing](https://oppora.ai/blog/b2b-ideal-customer-profile-evaluation-criteria-examples/)).

## Who pays in security infrastructure

Persona work for cybersecurity buying groups distinguishes the roles that approve a security purchase by their concern, their vocabulary, and the artifact each requires before approving a deal ([getgangly.com, weight 0.10, weak backing](https://getgangly.com/blog/cybersecurity-buyer-personas)). In practice this maps to a split between the technical evaluator (who tests the product), the budget holder (who pays), and the risk owner (who signs off on running unproven infrastructure). A days 0 to 30 plan that interviews only technical operators will capture the pain accurately and still misprice the offer, because none of the interviewees owns the budget decision. The yubiOS plan's pairing of problem interviews (OMN-65) with a separate who-pays-and-why workstream (OMN-69) reflects exactly this split.

## Regulated-industry buyers are a distinct profile

Analysis of internal developer platform buying in regulated industries argues that FedRAMP- and HIPAA-constrained buyers evaluate infrastructure against compliance requirements first and features second, and that the compliance surface changes what evidence a buyer needs before running anything ([iancloud.ai, weight 0.26, weak backing](https://iancloud.ai/blog/internal-developer-platform-security-regulated-industries-2026)). For a security infrastructure project, this means the regulated-lab operator segment should be qualified (and priced) differently from the platform-team segment: longer evaluation cycles, different evidence requirements, and a higher cost of an unsupported claim. Treating them as one ICP is a common early-stage error.

## Qualification against an evidence boundary

The final qualification dimension is internal: what the vendor can currently prove. A prospect whose pilot would require a capability sitting on the unproven side of the evidence boundary (for example, hardware not yet supported) should be scheduled later or scoped differently, not disqualified outright. The yubiOS days 0 to 30 pattern is to define the initial customer profile in week 1 alongside the evidence boundary, so that interview shortlists and pilot scoping both inherit the same constraint. This keeps qualification honest in both directions: the customer must fit the market, and the pilot must fit the evidence.

## Honest limits of the evidence

Every source backing this doc scored below 0.5 (0.10 to 0.38), meaning practitioner guidance rather than authoritative documentation. The structural claims (ICP anatomy, role splits, regulated-industry divergence) are consistent across sources but the specific thresholds and templates should be treated as starting points to be calibrated against the first interview set, not as validated constants.
