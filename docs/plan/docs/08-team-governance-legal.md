# 08 - Team, budget, entity, and legal governance

Scope: how the plan staffs and houses the company: the year 1 operating budget and its split, the evidence-driven hiring order, the entity and governance sequencing, the legal review checklist, and the EU Cyber Resilience Act role question the plan flags.

## Year 1 operating budget

The source doc (yubi-OS/yubiOS docs/PLAN.md) allocates the $500,000 year 1 operating budget as follows (source doc):

| Use | Share | Approximate amount |
|---|---:|---:|
| Core product, release, and security engineering | 56 percent | $280,000 |
| Support and reliability | 12 percent | $60,000 |
| Customer discovery, pilots, and success | 10 percent | $50,000 |
| Community, independent review, hardware access, upstream work | 7 percent | $35,000 |
| Legal, insurance, privacy, and compliance preparation | 8 percent | $40,000 |
| Infrastructure, finance, and administration | 7 percent | $35,000 |
| Total | 100 percent | $500,000 |

The budget matches the base-case opex line in doc 07 (year 1 operating expense $500k) and the plan's stance that engineering dominates early spending (source doc).

## Hiring order follows evidence

Start with a small core team and specialist contractors. The source doc's hiring order (source doc):

1. Release/security engineer.
2. Systems/firmware engineer for the selected platform.
3. Support/reliability engineer when paid pilots begin.
4. Customer success/solutions engineering after a repeatable pilot exists.
5. Dedicated sales only after founder-led sales produce a repeatable contract and renewal motion.

## Entity and governance sequencing

Before signing commercial contracts, create a legal receiver for revenue, expenses, employment, insurance, tax, and reporting. A benefit-oriented corporation or a conventional operating company with a binding public covenant are both plausible; the final choice requires current tax and legal advice (source doc).

Sequencing rules (source doc):

- Initially, one operating company may hold contracts, employ maintainers, and fund the project.
- Add an independent technical/community advisory council before General Availability.
- Consider a fiscal host or separate nonprofit stewardship entity only after there are multiple independent maintainers, meaningful community funds, or a credible asset-transfer plan; premature dual-entity administration can consume scarce engineering capacity.

## Legal review checklist

The source doc requires legal review to cover (source doc):

- The yubiOS name and possible YubiKey/Yubico trademark or affiliation confusion.
- Whether LGPL-2.1 is the intended and correctly applied license for the full distribution, plus all third-party notices and source-offer duties.
- Contributor provenance, DCO policy, employer IP, patents, and trademark rules.
- Product warranties, limitation of liability, support SLAs, cyber/E&O insurance, and hardware damage or lockout risk.
- Cryptography/export controls, sanctions, procurement rules, privacy, data processing, and incident notification.
- The EU Cyber Resilience Act role of the project and operator.

## The EU Cyber Resilience Act question

The source doc states the Commission distinguishes non-monetized FOSS, open-source software stewards, and manufacturers placing commercial products on the market; reporting provisions begin applying on 2026-09-11 and full application is scheduled for 2027-12-11; obtain counsel rather than self-classifying (source doc).

The dig for this subtopic confirms the primary sources behind those claims:

- The European Commission's CRA open-source policy page sets out the distinction between non-monetized open-source software, commercial activity, and open-source software stewards (https://digital-strategy.ec.europa.eu/en/policies/cra-open-source, noul 0.88).
- The Commission's CRA reporting-obligations page documents the vulnerability and incident reporting duties (https://digital-strategy.ec.europa.eu/en/policies/cra-reporting, noul 0.91).
- A whitepaper on open-source software stewards and the CRA from the ORC WG (ORCWG) provides community-side analysis of the steward role (https://orcwg.org/files/cra/resources/white-paper-on-open-source-software-stewards-and-cra, noul 0.62).
- A third-party summary of the Article 14 reporting timelines (24h early warning, 72h notification, 14-day follow-up) is available (https://www.cyberresilienceact.eu/reporting.html, noul 0.45, weak backing); treat the Commission pages as the authoritative source for dates and duties.

Drift note: the plan was written 2026-07-17 with the 2026-09-11 reporting date ahead; that date has since passed, so the steward/manufacturer classification is no longer a future question but an active one. The dig confirms the Commission guidance pages remain live as of 2026-10-06.

## Sources

- Primary: yubi-OS/yubiOS docs/PLAN.md (source doc), sections "8. Team, budget, and use of funds" and "9. Entity, governance, and legal work".
- https://digital-strategy.ec.europa.eu/en/policies/cra-open-source (noul 0.88)
- https://digital-strategy.ec.europa.eu/en/policies/cra-reporting (noul 0.91)
- https://orcwg.org/files/cra/resources/white-paper-on-open-source-software-stewards-and-cra (noul 0.62)
- https://www.cyberresilienceact.eu/reporting.html (noul 0.45, weak)
