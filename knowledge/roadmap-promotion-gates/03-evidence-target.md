# Evidence target: what will prove the claim

Scope: Naming the concrete log, test, hardware run, packet capture, artifact, or attestation that will prove the promoted claim is true.

## The gate question

The promotion gates document (yubiOS refs, roadmap-promotion-gates, 2026-07-17) requires: "What log, test, hardware run, packet capture, artifact, or attestation will prove the claim?" The gate is a naming exercise. The evidence must be enumerable before implementation starts, so that when the item finishes, there is a specific thing to point at rather than a retrospective search for whatever happens to look convincing.

## Signed attestations are the strongest current form

The most developed published pattern for machine checkable evidence is the signed attestation. JFrog's governance documentation defines evidence files as attestations: cryptographically signed metadata records that provide a signed and verified record of an external process performed on a subject, such as test results, vulnerability scans, or official approvals, collected from various tools and cryptographically verifiable (https://docs.jfrog.com/governance/docs/evidence-management, jev weight 0.58, authoritative). The same documentation shows evidence can be attached to a designated subject such as an artifact, build, package, or release bundle (https://docs.jfrog.com/governance/docs/evidence-service-cli, jev weight 0.35, weak backing).

CycloneDX demonstrates the same shape for compliance claims: a declaration of attestations, claims, evidence, and associated metadata, where the evidence supporting and countering a claim is referenced using bom-ref identifiers for traceability between elements (https://cyclonedx.org/use-cases/attestations/, jev weight 0.58, authoritative). Two details transfer directly to the evidence target gate. First, a claim and its evidence are separate linked objects. Second, evidence both supporting and countering the claim is preserved; the gate asks what will prove the claim, and honest practice also records what might disprove it.

## Evidence fragments across tools; the gate forces one address

A practitioner analysis of compliance evidence describes the default failure mode: evidence gets fragmented across engineering tools, and the fix is connecting requirements, risks, tests, decisions, and verification into one chain (https://www.jamasoftware.com/blog/compliance-evidence/, jev weight 0.24, weak backing). A framework to engineering bridge makes the same point operationally: standards become useful when mapped to control owners, release artifacts, recurring evidence, and audit friendly reporting (https://docs.product-security.expert/metrics-audit-risk-evidence-and-compliance/index-1/compliance-to-engineering-evidence-pass, jev weight 0.40, weak backing).

This is exactly why the gate names the evidence target at promotion time. If each implementation step invents its own evidence location, the claim at the end is unverifiable by anyone who did not implement it.

## Defining acceptance evidence before the work

Delivery practice converges on the same ordering. A compliance in delivery and acceptance study note argues that projects prove required controls as work is done, not after the team is already asking for approval (https://pmexams.com/pmi-pmp-2026/business-environment/compliance/compliance-in-delivery-and-acceptance/, jev weight 0.21, weak backing). A delivery methodology hub describes acceptance criteria and evidence as supporting an accountable decision that the delivered result matches agreed intent and satisfies applicable requirements (https://specfirstdelivery.org/en-us/hub/trusted-increments-and-acceptance-evidence, jev weight 0.37, weak backing). An acceptance criteria checklist template includes evidence and owners among the fields to define up front (https://www.leeonex.com/blog/software-acceptance-criteria-checklist, jev weight 0.13, weak backing).

## How the gate reads in the source doc's applications

The recorded applications make the evidence target the boundary between allowed and not allowed promotion states (yubiOS refs, roadmap-promotion-gates, 2026-07-17):

- SecTime: promoted to research/design only; hardware proof is still required before production claims. The missing evidence target is the hardware run itself.
- Frost: promoted to research/design only; the kernel prototype and RK hardware recovery evidence are still required. Two named evidence targets, both absent, hold the item at design.
- OpenWrt deception LAN: promoted to package/proof design only; the VM or spare router build and packet capture remain open. Packet capture is the named evidence target.
- Firmware RK tags: promoted to CI workflow metadata/publish routing; real board divergent payloads remain hardware lane work. The CI run log proves the narrow claim; board runs would be needed for the broad one.

The pattern: promotion width equals evidence width. An item may be promoted exactly as far as its named, obtainable evidence reaches, and no further.

## Authoring guidance

A good evidence target answer names four things: the artifact type (log, test suite, packet capture, attestation), where it will live, what claim it maps to, and who can verify it without privileged access. If any of the four is missing, the gate has not actually been answered.
