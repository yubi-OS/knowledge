# 07 Integration path: extending an ADR versus filing a new one, and staged rollout

Scope: how the synthesis proposes to land, extend the existing GPU mediation ADR with a boot-time attestation rule rather than filing a parallel one, plus the staged C1/C2/C3 rollout and the CI surface that would prove it.

## ADR practice: extension is a normal operation

Architecture decision records capture an important architectural decision with its context and consequences (weight 0.41, https://github.com/architecture-decision-record/architecture-decision-record, weak backing). The well-architected literature treats the ADR corpus as the record of how and why a system came to be its current shape, documenting all key decisions including their evolution (weight 0.86, https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record). The foundational definition from the ADR community: an architectural decision is a justified design choice that addresses an architecturally significant requirement (weight 0.74, https://adr.github.io/).

Two conventions matter for the extend-versus-file decision:

1. ADRs describe a single decision each, are numbered sequentially, and become immutable once accepted (weight 0.14, https://github.com/henu-wang/architecture-decision-records, weak backing). The synthesis's proposal, a new rule inside the existing decision record, threads this needle by keeping the original decision's history intact while adding a rule the same decision governs.
2. Repositories designate a single location to record high-level architecture decisions for feature and module proposals (weight 0.56, http://hub.cosmos.network/architecture), so a child of the existing GPU trust boundary decision stays discoverable in the same corpus.

The synthesis's rationale for extension over a parallel ADR is consistent with this practice: the mechanism is unchanged, only the policy rule is new, and a parallel record would create two live decisions over one boundary. The source topic also reports the team previously dropped a parallel-ADR approach for a similar reason; that is project history, not web-sourced, and is recorded here as synthesis context rather than a cited claim.

## The staged rollout: C1, C2, C3

Each stage of the synthesis is independently shippable, which is what makes the path testable:

1. C1: verify the bootc image digest and its provenance at build and registry level. This is the most mature layer (doc 01, weights 0.95, 0.90).
2. C2: add measured-boot verification against reference values. The building blocks are Keylime-style PCR validation and event-log analysis (doc 05, weights 0.74, 0.86, 0.87).
3. C3: gate the GPU binding claim at the vfio-user connect or vfio-pci attach moment, using the libvirt hook surface (doc 04, weight 0.66).

## What attestation SDKs and CI plumbing look like today

For the C3 stage the nearest attestation tooling is vendor-shaped. NVIDIA's attestation documentation defines attestation as cryptographically verifying claims about hardware and software to establish trust between parties, confirming systems are authentic, unmodified, and operating as intended (weight 0.89, https://docs.nvidia.com/attestation/index.html). NVIDIA's NVAT SDK is an open-source C++ SDK providing resources for implementing and validating trusted computing solutions on NVIDIA hardware (weight 0.77, https://github.com/NVIDIA/attestation-sdk). These anchor the "attestation is callable from automation" premise the CI leg would need.

On the CI side, the dig surfaced generic pipeline structure rather than a direct analog: CI configuration files define stages, jobs, and scripts with variables and dependencies (weight 0.56, https://docs.gitlab.com/ci/), and practitioner guidance for GPU validation pipelines argues that quality-gate logic should live in reusable, version-controlled tools rather than being duplicated across pipeline files (weight 0.12, https://medium.com/@tanya_srivastava/building-ci-cd-pipelines-for-gpu-validation-86b468130c48, weak backing). A broad funding catalog of attestation-adjacent projects (weight 0.66, https://nlnet.nl/project/) confirms the ecosystem is active but adds no mechanism detail.

The concrete yubiOS proposal, extending the existing vGPU CI matrix with an attested leg, follows the same principle: the gate logic (BAP evaluation) would live in a version-controlled tool the matrix calls, not in per-job script duplication.

## What the dig cannot confirm

The synthesis's project-internal claims (the specific ADR numbers, the merged PR that proves the mechanism in CI, the Linear parent issue) are about the yubiOS repository, not the public web. No kept result can confirm or refute them, and none are cited here as web-backed. The README records this scope boundary explicitly: this doc covers the public-methodology grounding for the integration path; the project-internal state must be verified against the repository itself.

## Source-quality note

The strongest sources are Microsoft's ADR guidance (0.86), NVIDIA's attestation docs (0.89) and SDK (0.77), and adr.github.io (0.74). The ADR-convention points about immutability and single-decision scope come from weak sources (0.14) and are framed as conventions, not standards. No off-topic results (a DJ software page weighted 0.20) are used.
