# 02 - When to use and when not: audit frameworks and the do-not-use cases

## Scope

The trigger surfaces the skill serves (HITRUST, CISA ZTMM v2.0, SOC2/ISO 27001, remote attestation, CI/CD, downstream consumers), and the 4 cases where the skill explicitly says do not use it.

## The use cases

The source doc (yubi-OS/yubiOS skills/audit-evidence-packaging/SKILL.md) lists 8 use cases. The first 3 are framework-facing: packaging audit evidence for a HITRUST assessor (control families 01-14), for a CISA ZTMM v2.0 reviewer (5 pillars plus 3 cross-cutting capabilities), and for an internal SOC2 / ISO 27001 audit. The other 5 are mechanism-facing: generating a remote attestation quote over a set of logs (boot logs plus audit logs plus IMA measurements), wiring a transparency-log attestation into a CI/CD pipeline (every build produces a signed evidence bundle), designing a chronicle-yara-l-detection rule that consumes evidence bundles as input, building a tamper-evident archive of long-term logs such as multi-year audit retention, and designing the verification path for a third-party auditor who runs `evidence-bundle verify` and gets a verdict.

### HITRUST

The HITRUST CSF is a security and privacy framework validated through the HITRUST CSF Assurance Program, which provides a practical mechanism for validating an organization's compliance with the CSF (https://hitrustalliance.net/hubfs/CSF-Assurance-Program-Requirements.pdf, weight 0.87). HITRUST positions its threat-adaptive controls and assurance methodology as the basis organizations use to meet stakeholder expectations (https://hitrustalliance.net/, weight 0.77). The evidence bundle maps onto this shape directly: control evidence is a set of artifacts whose integrity an assessor must be able to verify, which is exactly the tamper-evident, independently verifiable bundle. Practitioner coverage of what HITRUST assessors actually ask for (documentation sets, scoring, checklists across control domains) confirms the artifact-collection shape (https://www.accountablehq.com/post/hitrust-csf-requirements-explained-core-controls-domains-and-a-practical-compliance-checklist, weight 0.51, weak backing: secondary practitioner source).

### CISA ZTMM v2.0

CISA's Zero Trust Maturity Model v2.0 is organized around 5 pillars and 3 cross-cutting capabilities, with specific maturity stages inside each pillar (https://www.cisa.gov/resources-tools/resources/zero-trust-maturity-model, weight 0.87; https://www.cisa.gov/sites/default/files/2023-04/zero_trust_maturity_model_v2_508.pdf, weight 0.88). CISA released the updated second version after a 2021 public comment period (https://www.cisa.gov/news-events/cisa-releases-updated-zero-trust-maturity-model, weight 0.8). For a ZTMM reviewer, evidence of mature zero-trust implementation is precisely the kind of thing the skill's remote-attestation use case produces: boot logs, IMA measurements, and PCR quotes that demonstrate the runtime state was actually measured and attestable.

### CI/CD wiring and downstream consumers

The skill's CI/CD use case makes every build produce a signed evidence bundle, and the Chronicle YARA-L use case treats the bundle as an input to detection rules (both source doc). These two cases are what turn the bundle from a point-in-time audit artifact into a continuously re-emitted artifact, which the source doc maps to the continuous/adaptive primitive in its 10-primitive coverage note.

## The do-not-use cases

The source doc lists 4 exclusions, and each has a named reason:

1. **Ephemeral evidence**: logs that can be discarded after a few days should go through the regular log pipeline instead. Bundling adds signing, quoting, and transparency-log publication cost that ephemeral logs do not justify.
2. **No TPM2 / YubiKey**: the bundle can still be hash-chained without an attestation quote, but it loses the platform-identity binding, which is the property that makes the bundle attestable.
3. **Auditor does not accept transparency-log attestation**: the source doc calls this rare, noting most modern audit frameworks accept it as strong evidence.
4. **Bundle over 100 MB**: split into per-day bundles per the bundling strategy section.

## Decision rule

The skill's own boundary statement is that every use stays inside the frontmatter description's scope and anything beyond it is a different skill's job (source doc, Guidelines). In practice the decision rule is: if an external party must verify the evidence without trusting you, and the evidence has retention value beyond a few days, the bundle path applies; otherwise it does not.

## Key takeaways

- 8 use cases: 3 audit-framework facing (HITRUST, CISA ZTMM, SOC2/ISO) and 5 mechanism facing (attestation quotes, CI/CD, Chronicle consumption, long-term retention, third-party verification).
- CISA ZTMM v2.0's 5 pillars and 3 cross-cutting capabilities and HITRUST CSF's control families are the two named external frameworks, both backed by primary sources.
- 4 do-not-use cases: ephemeral evidence, no TPM2/YubiKey, auditor rejection of transparency-log attestation, bundles over 100 MB.