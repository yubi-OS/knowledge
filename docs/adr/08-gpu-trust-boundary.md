# 08 - GPU trust boundary and runtime policy (ADR-031, ADR-033)

Scope: the GPU trust boundary with virtio-gpu as default and vfio-user as preferred mediation, the IOMMU gated PCI passthrough gate, and ADR-033's 4 tier misbehavior triggered cutoff policy with state preservation.

## Why a GPU is a trust boundary (ADR-031)

The source doc (yubi-OS/yubiOS docs/ADR.md, ADR-031, dated 2026-07-25, status Accepted) opens with the threat model: a GPU is the largest DMA capable, firmware carrying peripheral in the machine, and it sits inside the same memory domain where YubiKey unsealed secrets (LUKS2 volume keys, homed keys per ADR-001, ADR-003, ADR-009) are decrypted into. Bootc OCI images are launched as VM guests through libvirt class hypervisor tooling (bcvk today, virt-manager or libvirt XML `<hostdev>` PCI assignment in the wild) via 3 architectures: emulated virtio-gpu, kernel vfio-pci passthrough, or a userspace vfio-user device server. Only the first and third are honestly testable in CI without real IOMMU hardware. The key sentence: vfio-pci passthrough without a working, isolated IOMMU group is a key extraction primitive, because an untranslated DMA capable device can read an unsealed volume key straight out of guest RAM. (source doc, full analysis at refs/vgpu-vfio-user-trust-boundary-2026-07-25.md)

The Linux kernel VFIO documentation corroborates the isolation model: modern systems provide DMA and interrupt remapping facilities to help ensure I/O devices behave within their allocated boundaries (https://docs.kernel.org/driver-api/vfio.html, weight 0.51, authoritative). Community guides on IOMMU group binding scored 0.06 to 0.30 (for example https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF at 0.30, weak; https://kernel-internals.org/virtualization/vfio/ at 0.18, weak) and are recorded as corroboration of the group isolation mechanics only.

## The 7 rule decision

ADR-031's decision block (source doc) is a 7 rule posture:

1. Default yubiOS images ship virtio-gpu only: no vfio-pci autoload, no vfio.conf, no initramfs binding, enforced via `usr/lib/modprobe.d/50-yubiOS-no-vfio.conf` and `usr/lib/dracut.conf.d/52-yubiOS-no-vfio.conf` (commit `afbc94a`).
2. The OCI image GPU access gate: before a libvirt class launcher may attach a PCI GPU to a yubiOS guest, the gate must confirm the host IOMMU is enabled and reporting groups, the target GPU is alone in its IOMMU group (or the operator explicitly assigned the whole group), and an operator has set explicit passthrough policy with a documented deviation. Absent any one condition, the gate refuses the attach outright and never silently degrades to an unisolated or emulated fallback.
3. New VFIO code paths prefer iommufd plus the device cdev over the legacy container and group ioctls, which the kernel docs mark for deprecation.
4. Userspace device models use vfio-user: unprivileged process, `0600` socket owned by the VMM user, mutual distrust per spec, and never a socket exposed beyond a single host namespace until the protocol has authentication.
5. No trust boundary component may consume GPU state: adding or removing a GPU must be a no-op for Secure Boot, LUKS2 FIDO2 unlock (ADR-003), homed (ADR-009), pam-u2f (ADR-005), and fTPM PCR behavior.
6. GPU resource quota and lockout (Frost/Panfrost per FUTURE.md) is a separate concern making no claims about per-cgroup enforcement here.
7. Boot time image attestation gates libvirt launches: before any PCI GPU attach through any of the 3 architectures, the gate must confirm the bootc OCI image digest matches a pinned reference digest in the launcher's reference value store AND the SLSA provenance attestation verifies against the expected builder id. Enforcement is software only, no TEE required; the builder id reference is operator set today, and a future iteration may anchor it to a hardware root of trust (fTPM PCR or YubiKey attestation). The `ci_test-vgpu-vm.yml` matrix extends with a `YUBIOS_ATTESTED=1` leg. (source doc)

Evidence landed with the decision (source doc): the workflow re-runs the full VM e2e suite (fTPM, LUKS2 FIDO2, homed, pam-u2f) with a vGPU attached, plus `tests/vm/test-vgpu-virtio-ci.sh` asserting the negative surface (no `/dev/vfio`, nothing bound to vfio-pci, no vfio_pci module in a default image) and `tests/vm/test-vfio-user-host-ci.sh` running a real vfio-user client/server handshake with zero kernel VFIO modules. Tracking issue OMN-108. The novelty verdict recorded in refs/attested-bootc-gpu-cutover-2026-07-30.md is BORDERLINE: mechanism established via ADR-031, policy layer novel.

## Honesty note (recorded in the source doc)

Rule 2's IOMMU access gate and rule 7's image attestation gate are accepted as design and rules, not yet implemented as enforcement code or proven on real hardware. Real vfio-pci passthrough, IOMMU isolation, and DMA ownership enforcement need a real IOMMU plus a real GPU, which no hosted or self-hosted runner in the org has today. Do not describe either gate as fully validated until the IOMMU evidence exists for rule 2 AND the builder id reference store is hardware anchored for rule 7. (source doc)

## The policy layer: misbehavior triggered cutoff (ADR-033)

ADR-033 (source doc, dated 2026-07-30, status Proposed) settles the policy that decides when to invoke ADR-031's mechanism, the way ADR-031 settled the mechanism itself. Context: a workload (typically an AI/ML model in a yubiOS bootc VM) reaching a GPU via vfio-user can misbehave in ways the device boundary can observe but the model cannot observe or attack: DMA window anomaly patterns, suspicious region access frequencies, syscall sequences inconsistent with the declared workload. Because ADR-031 rule 5 closes model self policing, the policy must live outside the model, in the same place ADR-031 puts the device: the vfio-user server. The prior-art search decision tree (source doc) maps the mechanism family: vfio-user protocol validation is per message with no trigger vocabulary or severity ladder; VFIO mdev delegates behavioral handling to vendor driver error paths with no shared policy engine; NVIDIA vGPU/SR-IOV/MIG resource scheduling modes are orthogonal, not escalating, and policy lives in the orchestration layer. The closest yubiOS cousin is the `drm-gpu-quota-secure-time` skill (per-cgroup VRAM quota plus SMC hard cutoff on Rockchip), which has a different trigger, resource exhaustion rather than behavior, and is complementary.

The decision (source doc): a 4 tier severity ladder (INFO, WARN, THROTTLE, SEVER) for behavioral cutoff of AI/ML workloads at the vfio-user boundary, with state preservation before cutoff as the design invariant. The ladder lives in the vfio-user server process with a pluggable trigger evaluator interface, the initial evaluator being a DMA window anomaly score with tunable threshold. Each tier captures the prior tier's state before escalating, so forensic preservation is monotonic: an INFO log before a WARN snapshot, a WARN metadata snapshot before a THROTTLE state snapshot, a THROTTLE state snapshot before a SEVER full VM snapshot. SEVER snapshots and severs rather than kills: VM state (qcow2 plus bootc delta) is snapshotted, the vfio-user socket is revoked, the VM is frozen, an operator webhook fires, and a fresh socket can be attached later in a clean environment. The trigger model is workload agnostic per OMN-147. The honesty note carries forward: the SEVER cutoff operates in software on top of ADR-031's design even before the hardware gate is validated, and the software policy is the test bed for what the hardware gate eventually enforces.

Key assumptions recorded for validation (source doc): A1, misbehavior detectable from a server side observer without seeing model internals; A2, VM state snapshotted at SEVER without losing the GPU's pending work; A3, operators respond within the model state preservation window; A4, the ladder is monotonic. Open questions: where trigger evaluators live, who owns the snapshot at SEVER (host by default, since rule 5 cuts against guest side capture), how the policy interacts with the DRM cgroup cutoff, and the post-SEVER recovery story.

The differentiation sentence recorded: NVIDIA's discard on suspend is the explicit differentiator, because ADR-033's SEVER preserves; the contribution is escalation with state preservation. OMN-146 (bare metal passthrough testing scope) and OMN-147 (trigger model definition) are downstream. (source doc)

## Sources considered

| Source | Weight | Role |
|---|---|---|
| https://docs.kernel.org/driver-api/vfio.html | 0.51 | VFIO isolation model (appeared on 2 queries) |
| https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF | 0.30 (weak) | IOMMU group mechanics |
| https://kernel-internals.org/virtualization/vfio/ | 0.18 (weak) | VFIO overview |
| https://howtech.substack.com/p/vfio-iommu-and-the-pci-subsystem | 0.12 (weak) | IOMMU context |
| https://medium.com/@armestonaidoost/kvm-gpu-passthrough-with-vfio-a-production-focused-guide-de432ca2a12b | 0.10 (weak, unused) | blog guide |
| yubi-OS/yubiOS docs/ADR.md (source doc) | n/a | ADR-031, ADR-033 text |
