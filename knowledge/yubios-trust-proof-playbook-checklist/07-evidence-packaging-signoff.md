# Evidence packaging and signoff

## Scope

The signed, dated, signed-off worksheet as audit evidence: packaging for external reviewers, filing copies with evidence bundles, and generating printable PDF outputs.

## The worksheet is evidence

A completed trust-proof checklist is not a to-do list; it is an evidence artifact. The yubiOS note frames its artifacts as "evidence-packaging primitives... at the worksheet level": a signed, dated, signed-off artifact that a third party (a HITRUST auditor, a CISA reviewer, an internal security team) can later inspect (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source).

What makes a worksheet inspectable rather than anecdotal:

- Identity fields. The name/date/host/arch header ties the record to a person, a time, and a machine.
- Captured values. The digest and YubiKey serial written into blanks are primary observations, not summaries.
- A binary decision. PASS/FAIL plus a signoff line means the artifact asserts something falsifiable, which is what auditors can test.
- Named rules. Because each box maps to a command (see the falsifiable-mechanical-rules doc), a reviewer can re-run the evidence collection rather than trusting the collector.

## What auditors actually expect

Penetration-test compliance practice names the same components: scope, tester credentials, findings and remediation, plus traceable artifacts to satisfy auditors (source: https://www.accountablehq.com/post/pen-test-compliance-evidence-what-auditors-expect-and-how-to-document-it, weight 0.490, weak backing). Third-party attestations are the currency of the audit relationship: auditor-issued reports, certifications, accreditations, and other attestations of a provider are managed as reviewable artifacts (source: https://aws.amazon.com/artifact/, weight 0.480, weak backing).

Signed metadata is the machine-readable version of the same idea: evidence as "signed metadata (often called an attestation) that attests to an action related to a designated subject, such as an artifact, build, application version" (source: https://docs.jfrog.com/governance/docs/evidence-management, weight 0.390, weak backing). The paper worksheet and the signed attestation are the same pattern at two layers: an assertion about a subject, bound to an identity, verifiable by a third party.

## Packaging discipline

Evidence collection guidance converges on assembling a complete, audit-ready package with traceable links and secure storage, with a final review to fill gaps before the audit (source: https://www.cycoresecure.com/blogs/audit-evidence-collection-checklist, weight 0.240, weak backing). Assembly should be automated, not the evidence itself: map each control to verifiable artifacts in systems of record, assemble packets with traceable links, run a periodic human signoff, and keep attestations and exceptions human-owned (source: https://www.sophon.consulting/use-cases/compliance-evidence-assistant, weight 0.270, weak backing).

Applied to the trust checklist: the signoff is the human-owned step; the checkbox-to-rule mapping makes the packet traceable; the two-copy filing (one with the operator's record, one with the evidence bundle) is the assembly step.

## Filing and PDF generation

The yubiOS note's recommended procedure: generate a printable PDF of the one-page checklist for an A4 printout the operator signs and files, with one copy filed with the operator's record and one filed with the evidence bundle (source: yubiOS refs/yubios-trust-proof-playbook-checklist-2026-08-07.md, weak source). The PDF is generated from the same source as the repo copy, so the printed sheet and the canonical text cannot diverge; only the filled-in values differ.

The audit-trail property to preserve: the signed worksheet is a snapshot of a verification run, dated and attributed, that a reviewer can trace back to the rules that produced each box. That is what separates evidence from testimony.
