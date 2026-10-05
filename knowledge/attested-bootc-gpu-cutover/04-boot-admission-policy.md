# 04 The Boot Admission Policy object and policy-gated cutover

Scope: the synthesis's central design object, a single signed policy naming image digest, measurement replay, and GPU binding claims, evaluated at three points in the libvirt lifecycle; plus the reference-value store it would live in.

## One policy, three claims

The synthesis defines a single policy object, the Boot Admission Policy (BAP), that binds three claims at once: (a) the expected bootc image digest, (b) the expected PCR or RTMR replay for that digest, and (c) the set of allowed GPU binding claims. The dig supports each ingredient separately:

- Digest naming and provenance verification are established container-registry practice (doc 01; weights 0.95, 0.90).
- Measurement replay against reference values is what remote verifiers already do: a verifier validates trustworthiness by processing TPM quotes, IMA measurement lists, and measured boot logs (weight 0.16, https://deepwiki.com/keylime/keylime/3-attestation-and-verification, weak backing; stronger component-level evidence in doc 03).
- GPU binding as a claim is the one ingredient with no direct prior-art backing in the dig; the closest analogues are KBS resource policies that release a resource only when the attestation token passes (weight 0.72, https://confidentialcontainers.org/docs/attestation/policies/).

## Where such a policy would live: RVPS

The reference-value store half of the design maps cleanly onto existing infrastructure. The Reference Value Provider Service (RVPS) is a Trustee component that receives software supply chain provenances and metadata, verifies them, extracts reference values, and stores them; when the Attestation Service queries specific software claims, RVPS responds (weight 0.86, https://github.com/confidential-containers/trustee/blob/main/rvps/README.md). Red Hat's solution overview describes RVPS as responsible for verifying, storing, and providing reference values, and as the component that generates reference value claims for the Attestation Service (weight 0.71, https://www.redhat.com/en/blog/introducing-confidential-containers-trustee-attestation-services-solution-overview-and-use-cases). Secondary writeups describe RVPS as the component managing trusted measurements used during attestation (weight 0.67, https://deepwiki.com/confidential-containers/trustee/2.3-reference-value-provider-service-(rvps), and weight 0.36 for an OpenShift-focused variant, weak backing).

This matters for the BAP design because RVPS already implements "verify supply-chain input, store it, answer policy queries from it." A BAP holding approved digests, PCR policies, and GPU binding claims is an extension of that pattern, not a new store category.

## Where the gate would act: the libvirt qemu hook

The launch-time enforcement point is the libvirt hook chain. libvirt's own documentation documents hooks for specific system management, including the qemu hook, which fires at defined points in the guest lifecycle and is called before libvirt restores labels when a QEMU guest is stopped (weight 0.66, https://www.libvirt.org/hooks.html). The hook interface supports custom event scripts, defined script locations and argument structure, and return codes with logging (weight 0.39, https://avdv.github.io/libvirt/hooks/, weak backing). Community hook collections exist for automating VM lifecycle actions beyond stock libvirt XML (weight 0.35, https://github.com/mateussouzaweb/libvirt-hooks, weak backing).

An important honest-gate caveat comes from a practitioner guide: a qemu hook should be used only for host-side side effects that must fire in lockstep with the VM lifecycle, and hook-based gates have real failure semantics around error swallowing (weight 0.21, https://www.bigiron.cc/guides/libvirt-qemu-hook-scripts-the-practical-cookbook, weak backing). This bounds what a BAP-enforcing hook can honestly promise: it can refuse to advance the launch, but it is host-side software, not a TEE.

## Cutover sequencing: policy-gated, not launch-order-gated

The synthesis's sequencing model places the GPU bind last:

1. Pre-launch: C1 only, verify the image digest and provenance before QEMU starts.
2. Post-launch: C1 and C2, the measurement replay matches the reference for that digest.
3. Pre-device-bind: C1, C2, and C3, the GPU binding claim is checked immediately before vfio-user connect or vfio-pci attach.

The dig supports the components of this ordering but not the ordering itself as an existing artifact: no kept result describes a system that sequences resource release this way at the libvirt layer. The nearest pattern is KBS's policy-selector mapping, where a resource request is matched against attestation policies and unmapped selectors are rejected (weight 0.90, https://github.com/confidential-containers/trustee/blob/main/kbs/docs/kbs_attestation_protocol.md). Mapping that selection model onto a three-stage launch sequence is the synthesis's contribution.

## Honest limits

Two limits are visible in the sources themselves. First, hook-based enforcement is host-side software with the failure modes practitioners warn about (weight 0.21, bigiron.cc, weak backing). Second, RVPS reference values are supply-chain inputs verified at ingest; nothing in the kept results describes rolling them forward when images upgrade atomically, which is the replay-protection question doc 08 carries forward.
