# 08 Open problems: workload identity, vfio-user binding, replay, and audit

Scope: the six carry-forward questions the synthesis leaves open, grounded in what the dig shows about the current state of each problem area.

## Workload identity: the live debate

The workload-identity question (what names the policy subject: libvirt domain UUID, bootc image digest, or an init-data hash) maps onto an active upstream debate. A confidential-containers RFC issue on authentication and authorization for workload and pod identity states the design tension directly: the identity of the workload describes the usage of a set of containers inside the guest, so workload identity shares the same shape as guest identity, and that identity affects access to KBS resources (weight 0.36, https://github.com/confidential-containers/confidential-containers/issues/131, weak backing). Azure's AKS confidential containers preview shows one operational answer: a generated security policy plus a workload identity and federated identity credential are deployment requirements (weight 0.92, https://learn.microsoft.com/en-us/azure/aks/deploy-confidential-containers-default-policy).

For the synthesis this means the BAP's "keyed by workload identity" requirement has no settled upstream answer to adopt; any choice inherits a live, contested debate rather than a standard.

## Chain of trust beyond the CPU: the GPU gap

The second open problem is the chain of trust reaching the GPU. A confidential-containers issue on chain of trust for SEV-SNP frames it as an open question: how to extend the chain of trust to additional components needed to run a confidential container, noting that for GPUs a custom kernel and guest filesystem must be deployed (weight 0.35, https://github.com/confidential-containers/confidential-containers/issues/54, weak backing). The project's overall goal, protecting running containers with hardware-backed isolation (weight 0.81, https://confidentialcontainers.org/), is established; the GPU-side extension is the open part. This is the upstream echo of the synthesis's C3 claim: even TEE-first systems have not closed the loop to device binding.

## vfio-user: what the protocol does and does not authenticate

The vfio-user protocol specification documents the session establishment: after the client connects, the first message is VFIO_USER_VERSION, proposing a protocol version and capability set, and the server replies with a compatible version or closes the connection (weight 0.88, https://www.qemu.org/docs/master/interop/vfio-user.html). The kernel-side VFIO facility provides DMA and interrupt remapping to ensure devices behave within their allotted boundaries across AMD-Vi, Intel VT-d, and other platforms (weight 0.92, https://docs.kernel.org/driver-api/vfio.html). The libvfio-user server library is maintained and documented (weight 0.90, https://github.com/nutanix/libvfio-user; weight 0.65 for the mirrored README, https://qemu.googlesource.com/libvfio-user/+/a8242d117118d5191dad69a96e28a21d66fe8b50/README.md).

What the kept results do not show is any signed-binding surface in the protocol, that is, a way to tie the socket connection to a policy-approved device claim. The version/capability exchange authenticates protocol compatibility, not workload identity. This is why the synthesis flags init-data binding for vfio-user as needing either a protocol extension or a weaker libvirt-domain-XML binding artifact.

## Replay protection across atomic upgrades

bootc systems upgrade atomically (doc 01, weight 0.87), which creates the replay-protection question: when the image rolls forward, the BAP's expected measurement replay must roll with it. No kept result addresses reference-value rotation. The nearest operational evidence is negative: Keylime systems failing measured-boot attestation when the reference state was generated from the system's own log (weight 0.60, https://github.com/keylime/keylime/issues/1617), which shows reference-state management is already fragile in practice.

## Auditability and troubleshooting surface

For the auditability question (logging C1, C2, C3 decisions in a tamper-evident store), the dig offers adjacency only: NVIDIA's Confidential Containers troubleshooting documentation exists for installation and workload-deployment failures (weight 0.80, https://docs.nvidia.com/datacenter/cloud-native/confidential-containers/latest/troubleshooting.html), and a secondary analysis recommends attributing failures layer by layer across the many trust boundaries CoCo integrates (weight 0.16, https://deepwiki.com/confidential-containers/confidential-containers/6-troubleshooting, weak backing). Layer-attributed failure evidence is the raw material of an audit trail, but no kept result describes a tamper-evident decision log for attestation gates.

## Summary of carry-forward questions

1. Workload identity shape: contested upstream, partially operationalized in managed clouds (weights 0.36, 0.92).
2. GPU chain of trust: explicitly open in CoCo's own issue tracker (weight 0.35).
3. vfio-user binding: protocol authenticates compatibility, not policy claims (weights 0.88, 0.92).
4. Replay protection: no reference-value rotation mechanism surfaced; reference-state fragility documented (weight 0.60).
5. Bypass policy for virtio-gpu fallback: not addressed by any kept result; recorded as a gap.
6. Tamper-evident auditability: adjacent evidence only (weights 0.80, 0.16).

Three of six questions have weak or no grounding in this dig; they are carried forward as open, and the README records the scope of this absence.
