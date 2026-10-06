# 04 - Public-interest operating covenant

Scope: the commitments the planning document says must be published before accepting unrestricted sponsorships or production subscription revenue: what stays public, what customers may buy, and the stewardship rules that keep the paid layer from eroding the public guarantees.

## What remains public

The source doc (yubi-OS/yubiOS docs/PLAN.md) lists five standing public commitments (source doc):

- All security-critical OS code and build recipes under the current license or another OSI-approved license adopted through a public process after legal review.
- Security fixes and advisories released to the public at the same time as to paying customers, subject only to normal coordinated-disclosure embargoes.
- Public release hashes, SBOMs, provenance, verification instructions, threat model, supported-version status, and known blockers.
- An open management agent and documented protocol. A hosted service may charge for operation, scale, integrations, and support, but must provide customer data export and a credible self-host path.
- A free, non-telemetry-dependent path for individuals to build, install, update, recover, and replace their own trust material.

The timing rule is the structural point: these commitments should be published before unrestricted sponsorships or production subscription revenue are accepted (source doc). The covenant is a precondition to monetization, not a promise made after it.

## What customers may buy

Customers may buy response time, named support, release lifecycle, compatibility qualification, managed operation, evidence assembly, and integration labor. They may have private handling of their configurations and incidents. They may get priority for a business problem, but not unilateral control over the public roadmap or the right to suppress a security fix (source doc).

## Stewardship rules

The source doc enumerates seven stewardship rules (source doc):

- No advertisements, sale of usage data, mandatory phone-home telemetry, or dark patterns.
- Telemetry is off by default, documented, minimal, revocable, and separable from security updates.
- Disclose material sponsors, customer-funded roadmap work, conflicts, and any exception to normal release policy.
- Prefer a Developer Certificate of Origin and contributor ownership over mandatory copyright assignment. Do not make dual licensing a core revenue dependency.
- Do not maintain permanent customer-only forks of security-critical code. Upstream reusable fixes unless a documented confidentiality or hardware constraint prevents it.
- At $1 million ARR, create an annual public-interest budget equal to the greater of $25,000 or 5 percent of the prior year's subscription gross profit, funding upstream fixes, independent review, hardware access, documentation, and security work.
- Publish an annual transparency report covering revenue mix, sponsor concentration, public-interest spending, security response performance, governance changes, and unresolved conflicts.

## How the covenant connects to the rest of the plan

The covenant is the reason the rejected models in doc 09 are rejected: paid-only or delayed public security fixes, advertising and data resale, mandatory telemetry, proprietary forks of the core OS, and customer-only branches all violate one or more of the rules above (source doc). It also disciplines the offer list in doc 05: every priced offer attaches to operation, evidence, support, or enablement, and none of them sells exclusive access to the code or the fixes (source doc).

The managed-fleet offer is explicitly gated by the covenant: it launches only after a secure, self-hostable management protocol exists, which is the covenant's "credible self-host path" requirement expressed as a launch gate (source doc).

## Why the covenant is load-bearing

The source doc closes with the commercial test: keep the owner's control and the public security work genuinely public, then determine whether enterprises will pay for reliable operation, evidence, recovery, and accountability. If the paid layer requires weakening those public guarantees, it is the wrong business model for yubiOS (source doc). The covenant is the written form of that test; the transparency report and the public-interest budget are its measurable artifacts.

## Sources

- Primary: yubi-OS/yubiOS docs/PLAN.md (source doc), section "3. Public-interest operating covenant", plus the closing commercial test.
- No searXNG dig: internal-record subtopic. The covenant is a set of commitments the project makes about its own operation; there is no external mechanism to research. The dig step was skipped deliberately and this is the recorded reason.
