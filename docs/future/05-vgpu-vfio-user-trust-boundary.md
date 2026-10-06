# 05. vGPU / vfio-user Trust Boundary

Scope: the landed companion to Milestone Frost (ADR-031, 2026-07-25): the rules governing what kind of GPU access a default yubiOS image exposes, why unmitigated vfio-pci passthrough is treated as a key-extraction primitive, and the CI legs that prove vGPU is a no-op for every trust-boundary component.

## Why this sits before Frost

The doc draws the split precisely: Frost's lockout design governs "how much" GPU a workload may consume, while this work governs "what kind of GPU access" a default yubiOS image exposes at all (source doc, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md). The attack-surface question "has to be settled before a lockout policy is meaningful": there is no point rate-limiting access to a surface that should never have existed in the default image. The full analysis and rules live in `refs/vgpu-vfio-user-trust-boundary-2026-07-25.md`, with ADR-031 as the accepted decision (source doc).

## The headline rule

The doc states the threat model in one sentence: "a GPU sits inside the memory domain a YubiKey unseals secrets into, so unmitigated `vfio-pci` passthrough is a key-extraction primitive" (source doc). The consequences are concrete rules rather than aspirations (source doc):

- Default images ship `virtio-gpu` only.
- Passthrough is opt-in, IOMMU-gated, and policy-gated, never a default.
- Userspace device models use vfio-user (mutual distrust by spec, unprivileged, no kernel VFIO modules).
- No trust-boundary component (Secure Boot, LUKS2 FIDO2, homed, pam-u2f, fTPM PCR) may depend on GPU state.

The last rule is the architectural one: the trust chain must be provably independent of the GPU, so that any GPU compromise or failure cannot weaken disk unlock or measured boot.

## What the dig adds

The vfio-user mechanism is documented upstream. QEMU's vfio-user device documentation covers the userspace device-model path the doc mandates (weight 0.86, https://www.qemu.org/docs/master/system/devices/vfio-user.html), and the vfio-user protocol specification documents the wire protocol whose "mutual distrust by spec" property the doc leans on (weight 0.84, https://www.qemu.org/docs/master/interop/vfio-user.html). The nutanix/libvfio-user project is the reference implementation the CI pins for its sample server (weight 0.47, https://github.com/nutanix/libvfio-user; labeled weak by jev, though it is the actual project the CI uses), and the Google-hosted mirror of the same code carries weight 0.63 (https://qemu.googlesource.com/libvfio-user/).

On the passthrough side, ArchWiki's PCI passthrough via OVMF page documents the conventional vfio-pci setup the doc is restricting: host IOMMU configuration, device binding, and VM assignment (weight 0.69, https://wiki.archlinux.org/title/PCI_passthrough_via_OVMF). General passthrough guides from Medium (weight 0.15, https://medium.com/@armestonaidoost/kvm-gpu-passthrough-with-vfio-a-production-focused-guide-de432ca2a12b), tech-insider (weight 0.14, https://tech-insider.org/gpu-passthrough-iommu-vfio-setup-2026/), stackharbor (weight 0.16, https://stackharbor.com/en/knowledge-base/gpu-passthrough-vfio-iommu/), and a GitHub personal repository (weight 0.18, https://github.com/4G0NYY/PCIEPassthroughKVM) are all weak-backed; they show the technique is widely documented but none is citation-grade for a security decision.

## The landed CI work

The doc records what actually shipped with the 2026-07-25 ref (source doc):

- `.github/workflows/ci_test-vgpu-vm.yml` re-runs the entire `ci_test-vm.yml` suite (fTPM, LUKS2 FIDO2, homed, pam-u2f) with `YUBIOS_VGPU=1`, proving a vGPU is a no-op for every trust-boundary leg, plus two new legs below.
- `tests/vm/test-vgpu-virtio-ci.sh` runs a host device-model probe, then a guest leg asserting DRM nodes and driver are bound and the negative VFIO surface holds: no `/dev/vfio`, nothing bound to `vfio-pci`, no `vfio_pci` module.
- `tests/vm/test-vfio-user-host-ci.sh` runs a real vfio-user client/server handshake (QEMU `vfio-user-pci`, upstream since 10.1, against a pinned nutanix/libvfio-user sample server) with zero kernel VFIO modules loaded.
- Both tests follow the 0-pass / 77-loud-SKIP / else-fail contract used across `tests/vm/*`, and both needed a CI-only `--extra-qemu-arg` patch to the pinned yubi-OS/bcvk fork so an ephemeral guest can have a QEMU device attached. The open question recorded in the ref is whether to upstream that as a real bcvk PR.
- Tracking issue: OMN-108, "GPU trust boundary: vfio-user/virtio-gpu default design, vGPU e2e CI" (https://linear.app/omni-agent/issue/OMN-108/gpu-trust-boundary-vfio-uservirtio-gpu-default-design-vgpu-e2e-ci, source doc).

## Why it matters

This section is the only fully landed item in the future-work ledger's GPU story, and it demonstrates the ledger's promotion pattern in practice: the ref analysis produced an ADR, the rules became image defaults, and the proof became CI legs rather than prose. What remains open (the bcvk upstreaming) is recorded as an explicit question rather than absorbed silently (source doc).

## Sources for this doc

Ground spine: yubi-OS/yubiOS `docs/FUTURE.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/FUTURE.md), fetched 2026-10-06. Dig results weighted by jev noul as cited inline; 12 results kept, 4 with weight 0.5 or higher.
