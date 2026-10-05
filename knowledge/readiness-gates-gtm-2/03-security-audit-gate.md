# 03: Security Audit Gate

Scope: the independent security review an early-stage security product should hold before commercial pilots: what kind of review qualifies, how SOC 2 tiers and third-party audits differ, and the published-report-versus-private-attestation question.

## Why a security gate before paid pilots

Enterprise buyers in security-sensitive segments routinely subject new vendors to security review before signing. Procurement-side guidance describes third-party security assessment as a mature lifecycle that keeps security, legal, and procurement aligned, with right-to-audit clauses that give the customer the right to assess a vendor's controls directly or through a third-party assessor (source: https://lorikeetsecurity.com/blog/third-party-risk-vendor-assessment, weight 0.28, weak backing). A 2025 KPMG report on third-party security notes that when procurement, IT, legal, and security operate in silos, vendors can be onboarded or offboarded without adequate controls, and that leading organizations establish dedicated review processes for vendor risk (source: https://kpmg.com/kpmg-us/content/dam/kpmg/pdf/2025/2025-key-considerations-third-party-security.pdf, weight 0.90, strong).

For an early-stage security product whose trust thesis is itself technical (for example, FIDO2-first authentication, immutable system images, signed boot chains), the gap between claimed posture and verified posture is exactly what a buyer's security review probes. An evidence-grade security review captured before the first paid pilot exists so that the pilot conversation starts from a reviewable artifact instead of a vendor claim.

## What kind of review qualifies

A full certification regime (SOC 2 Type 2, ISO 27001) takes a year or more and is disproportionate as a pre-pilot gate. The realistic options, in ascending order of external weight:

1. Documented self-audit with a named independent reviewer: a third-party consultancy or qualified external individual reviews the supported release and management plane against the product's threat model and produces a written report or summary.
2. Point-in-time third-party audit: a review of controls at a single moment, comparable to SOC 2 Type 1, which tests what controls existed and whether they were suitably designed at a point in time. Practitioner guides describe Type 1 as a snapshot that takes weeks rather than the track record Type 2 provides over an observation period (source: https://www.redseclabs.com/blog/soc-type-1-vs-soc-type-2-key-differences-guide/, weight 0.29, weak backing).
3. Continuous-certification regimes: SOC 2 Type 2 reports on operating effectiveness over a period. Sources covering startup adoption note some enterprise buyers accept Type 1 as an interim measure while a Type 2 observation period runs, especially if the buyer can see the observation period has started (source: https://soc2scout.com/soc2-type-1-vs-type-2, weight 0.14, weak backing; https://atlantsecurity.com/learn/soc-2-type-1-vs-type-2-explained, weight 0.21, weak backing).

Third-party security audit practice itself is a structured discipline: scoping, evidence collection, testing of controls, and reporting against a defined standard (source: https://qualysec.com/third-party-security-audit/, weight 0.41, weak backing).

## The published report question

Whether the audit report must be public is a real design decision for the gate. The trade-off is symmetric. A published summary strengthens the proof surface: the whole point of an evidence gate is that downstream parties (prospects, procurement reviewers) can verify rather than trust, and a private report cannot be verified by anyone who was not the client. A private report paired with a public attestation preserves confidentiality of findings while giving external parties something checkable. For most early-stage security vendors the published summary is the stronger commercial asset, because the buyer's reviewer wants evidence, not assurances that evidence exists.

The gate definition should pick one position explicitly before the first paid SOW is signed, because the SOW's scope of claims (what the pilot customer is told is proven) depends on what the audit actually covered.

## Scope discipline

Whatever the review covers, the gate should bind claims to it. A review of the supported release and its management plane justifies pilot conversations about those components only. Claims about hardware platforms, configurations, or deployment topologies outside the reviewed scope stay outside the gate's protection. This mirrors the procurement-side principle that vendor risk assessment is scoped to the specific services and data flows the vendor will touch, and the right-to-audit clause defines what can be examined (source: https://lorikeetsecurity.com/blog/third-party-risk-vendor-assessment, weight 0.28, weak backing).

## Positioning the gate

A security-audit gate sits between open discovery conversations (where the buyer is evaluating whether the vendor is worth a formal review) and signed paid pilots (where the buyer's procurement and security teams will demand reviewable evidence). Skipping it does not remove the buyer's requirement; it just means the pilot's first serious buyer becomes the de-facto first audited deployment, and every SOW negotiation carries the delay of a review that should have been done once, on the vendor's own schedule, before any deal depended on it.
