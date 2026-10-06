# 03 - Customer segments and enterprise value proposition

Scope: who the planning document says pays first, the four initial enterprise segments with fleet sizes and economic buyers, the reconciliation note against the canonical demand-side segment list, and the capability-versus-accountability split that defines the enterprise value proposition.

## The four initial enterprise segments

The source doc (yubi-OS/yubiOS docs/PLAN.md) starts with organizations for which a small fleet has unusually high consequence or trust requirements, not with general desktop buyers. Its four segments (source doc):

| Segment | Initial fleet | Job to be done | Economic buyer |
|---|---|---|---|
| Release and signing workstations | 25 to 150 nodes | Protect artifact signing, release engineering, SSH, and privileged local identity | CISO, VP Engineering, Head of Platform |
| Security engineering and privileged developer fleets | 50 to 500 nodes | Standardize a hardened endpoint with recoverable hardware-token ceremonies | CISO, security platform lead |
| Regulated labs and high-assurance environments | 25 to 250 nodes | Produce repeatable deployment and control evidence, including offline operation | Compliance lead, lab director, CISO |
| ARM64 appliance and edge builders | 100 to 10,000 devices | Avoid building and maintaining a verified Linux and owner-key workflow alone | CTO, product security lead |

Each segment gets a "why yubiOS may fit" rationale in the source doc, all of them traceable to the owner-control thesis: owner-held authorization, verified and replaceable OS images, public threat model, evidence packs, air-gap option, and board-specific enablement (source doc).

## Who is not a target

Research labs, firmware specialists, and security consultancies are useful design partners. General consumers, broad office fleets, and safety-critical deployments are not initial commercial targets (source doc).

## Enterprise overlay versus the canonical demand-side list

A note added 2026-07-28 in the source doc reconciles two segment lists: the four enterprise segments above are the enterprise overlay for paid operators, while the canonical demand-side segment list (including S1 individuals, S2 small teams, S3 public-interest orgs) lives in refs/who-pays-and-why-2026-07-25.md (OMN-69). The doc states the two lists are not in conflict; they cover different altitudes, demand versus paid-operator overlay, and PLAN.md only describes the enterprise subset (source doc).

## The enterprise value proposition

The source doc splits the proposition cleanly (source doc):

- The free project supplies capability.
- The paid operator supplies accountability: a named release owner and supported lifecycle; tested updates, rollback evidence, compatibility qualification, and recovery drills; security advisories, case handling, and bounded response commitments; deployment, enrollment, and air-gap runbooks tied to a known hardware matrix; procurement-ready SBOM, provenance, dependency, vulnerability, and control evidence; help integrating identity, logging, update infrastructure, and incident procedures.

The economic comparison the doc prescribes is not "free Linux versus paid Linux." It is yubiOS operations versus the next-best alternative: internal platform/security engineering, external integration, continuing test maintenance, and the cost of assembling evidence for every release (source doc). This framing feeds directly into the ROI model (source doc section 7): the buyer's alternative cost, not the theoretical cost of a breach, is the baseline.

## What the dig adds

The dig for this subtopic asked about enterprise buying roles and hardened-fleet demand. Weighted findings:

- Role-based buying structure is standard practice in enterprise open source: the GitLab handbook documents product personas down to named roles such as security analyst and compliance manager (https://handbook.gitlab.com/handbook/marketing/product-and-technical-marketing/product-personas/, noul 0.79). The source doc's per-segment economic-buyer column follows the same convention (source doc for the segment mapping).
- Hardened endpoint guidance aimed at enterprise Linux fleets is a live category: SUSE publishes a Linux system hardening guide aimed at securing enterprise systems (https://www.suse.com/c/linux-hardeningthe-complete-guide-to-securing-your-systems/, noul 0.58), consistent with the source doc's "standardize a hardened endpoint" job-to-be-done for the second segment (source doc for the segment definition).
- Fleet-oriented endpoint management is a product category with commercial and open source players (https://fleetdm.com/, noul 0.37, weak backing), adjacent to but not the same as the owner-controlled assurance the source doc sells (source doc).
- A general enterprise guide to open source adoption (https://www.shopify.com/enterprise/blog/open-source-enterprise, noul 0.31, weak backing) is directional context only.

## Dig quality note

The first dig returned mostly unrelated results; a redo with different queries (attempt 2) produced the references above. The segment table itself is an internal record of the planning document and is cited to the source doc, not to the dig.

## Sources

- Primary: yubi-OS/yubiOS docs/PLAN.md (source doc), section "2. Who pays and why".
- https://handbook.gitlab.com/handbook/marketing/product-and-technical-marketing/product-personas/ (noul 0.79)
- https://www.suse.com/c/linux-hardeningthe-complete-guide-to-securing-your-systems/ (noul 0.58)
- https://fleetdm.com/ (noul 0.37, weak)
- https://www.shopify.com/enterprise/blog/open-source-enterprise (noul 0.31, weak)
