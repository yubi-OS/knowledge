# 08. Failure modes and the recovery baseline

Scope: the four named failure modes for GPU virtualization on a locked-down host, the recovery behavior for each, the real-world failure taxonomy of passthrough, and the gate that keeps the whole design research-class until enforcement evidence exists.

## Failure mode 1: passthrough with no working IOMMU

A DMA-capable device reading unlocked key material is the worst outcome in this space, and it is the default outcome if passthrough is attempted without a working IOMMU (doc 04). Recovery: refuse at the gate. Passthrough is enabled only on an isolated IOMMU group with a documented deviation, and absent any precondition the system refuses rather than degrades (doc 05, rule 2). The defensive contract is the kernel's own framing: DMA and interrupt remapping exist to ensure I/O devices behave within the boundaries they have been allotted (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.87).

Real deployments confirm the failure class is not hypothetical. Passthrough failures on production hypervisors cluster around IOMMU group isolation, vfio-pci binding races, and reset quirks (source: https://vormox.com/blog/diagnosing-gpu-passthrough-failures-on-proxmox-ve-9-x-iommu-groups-vfio-binding-and-reset-quirks, jev weight 0.69). Firmware can also break assignment outright: a BIOS update that requests a 1:1 IOMMU mapping for a device makes passthrough reject it (source: https://forum.proxmox.com/threads/vfio-firmware-has-requested-this-device-have-a-1-1-iommu-mapping.184799/, jev weight 0.04, weak backing). The recovery baseline absorbs these as refusals: the gate re-checks the group and the firmware posture every boot, so a changed platform fails closed instead of passing a device through untranslated.

## Failure mode 2: over-exposed vfio-user socket

If the vfio-user socket is exposed beyond the intended peer, whatever connects to it can reach the negotiated DMA windows: the socket is the boundary that carries `DMA_MAP` grants and SCM_RIGHTS descriptor passing, and the protocol has no authentication layer (doc 02; source: https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.88). Recovery: socket mode `0600`, owned by the VMM user, single host namespace until the protocol has authentication (doc 05, rule 4). The CI leg asserts the mode directly, so the failure mode is detectable in every build rather than only in audit (doc 07).

## Failure mode 3: GPU state coupled into the unlock path

If vGPU presence changes boot or unlock behavior, the display device has leaked into a trust boundary. Recovery: the invariant is enforced by re-running the full LUKS2 FIDO2 plus homed plus pam-u2f plus fTPM suite with a vGPU attached, on the self-hosted KVM runner (doc 06). The invariant is structural as well as tested: no PCR, no UKI section, and no cryptenroll token may depend on a display device (doc 05, rule 5).

## Failure mode 4: pinned CI inputs drift

The vGPU lane pins two nonstandard inputs: a bcvk patch and a libvfio-user commit. The generic failure is silent drift: pinning fails quietly, and a single layer of pinning is not enough (source: https://www.tigzig.com/agents-faq/how-do-i-pin-dependencies-so-they-stay-pinned, jev weight 0.31, weak backing). CI failures from dependency drift are a recognized category where nothing in the repo changed but the build behavior did (source: https://thesdet.com/how-to-debug-ci-failures-caused-by-dependency-drift-lockfile-changes-and-browser-version-mismatch/, jev weight 0.21, weak backing; https://sixteenpillars.com/why-did-a-patch-release-break-my-ci-overnight/, jev weight 0.21, weak backing). Recovery in this lane: the workflow SKIPs loudly when a patch hunk stops applying instead of shipping a bcvk that silently ignores the flag, and results are refreshed against the current pins before being re-asserted (doc 07). The cache prefix change (`-vgpu1`) prevents a stale unpatched binary from being silently reused.

## The promotion gate

The whole design stays research and design class. Promotion to enforcement requires the roadmap-promotion-gates fields to be answered with CI evidence from the rock1 vGPU lane: owner and deployment target, the trust boundary being enforced, the evidence target, and the recovery behavior. Until those are answered, the ADR rules in doc 05 are candidate policy, not enforced image policy, and this corpus records the evidence trail that promotion would cite.
