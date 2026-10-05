# 05. The policy layer: rules for shipping GPU virtualization on a locked-down image

Scope: the candidate ADR-024 rule set as policy: virtio-gpu by default, IOMMU-gated passthrough as a documented deviation, vfio-user socket discipline, the GPU-independent unlock invariant, and what stays out of scope.

## Rule 1. Default images ship virtio-gpu only

The default image carries no `vfio-pci` autoload, no `vfio.conf`, and no initramfs binding. The grounding is in doc 03: a paravirtualized device needs no privilege escalation anywhere in the image. The negative surface this rule buys is checkable in CI: no `/dev/vfio`, no `vfio-pci` bound, no IOMMU-group claim in a default guest.

## Rule 2. Passthrough is an opt-in, all-or-nothing deviation

Passthrough requires all of the following, and absent any one the system refuses rather than degrades:

1. IOMMU enabled and reporting groups.
2. The target device alone in its group, or the whole group assigned.
3. Explicit operator policy.
4. A documented deviation.

The operational sources back the mechanics. The standard procedure for assigning a PCI device to a guest is: enable IOMMU, identify the device's PCI address and group, prepare the device, then assign it; the device, once passed through, is not available to the host (source: https://pve.proxmox.com/wiki/Pci_passthrough, jev weight 0.87). Microsoft documents the same defensive idea on the graphics stack: IOMMU-based GPU isolation is a technique used to enhance system security and stability by managing how GPUs access system memory (source: https://learn.microsoft.com/en-us/windows-hardware/drivers/display/iommu-based-gpu-isolation, jev weight 0.82). Community guides converge on the same ordering: enable IOMMU, inspect the groups, bind vfio-pci, then attach (source: https://stackharbor.com/en/knowledge-base/gpu-passthrough-vfio-iommu/, jev weight 0.23, weak backing; https://laptopjudge.com/vfio-pci-gpu-passthrough/, jev weight 0.25, weak backing).

The documented-deviation step is policy, not mechanics. The pattern is standard in baseline management: security baselines enumerate their exact settings in a settings reference so that any departure from the baseline is a visible, named act rather than drift (source: https://learn.microsoft.com/en-us/intune/device-security/security-baselines/ref-windows-mdm-settings, jev weight 0.95; relevance noted: this is the general baseline-and-deviation pattern, not a GPU rule). In yubiOS terms the deviation record is what an auditor reads to reconstruct why a signed image was allowed to hand hardware to a guest.

## Rule 3. Prefer iommufd and the device cdev

Anything yubiOS writes that touches kernel VFIO should use the iommufd plus device cdev path, because the kernel marks the legacy container and group model for deprecation and the cdev path makes DMA ownership an explicit `VFIO_DEVICE_BIND_IOMMUFD` claim (source: https://docs.kernel.org/driver-api/vfio.html, jev weight 0.94; full argument in doc 01).

## Rule 4. vfio-user sockets are unprivileged, mode 0600, single namespace

Userspace device models use vfio-user, run unprivileged, with the socket mode `0600` and owned by the VMM user, and never exposed beyond a single host namespace until the protocol has authentication. The grounding is the protocol's own shape: the socket is the boundary that carries `DMA_MAP` grants and SCM_RIGHTS descriptor passing, the specification states client and server must not trust each other and must validate input, and authentication is not part of the negotiated feature set (source: https://www.qemu.org/docs/master/interop/vfio-user.html, jev weight 0.88; doc 02). A world-readable vfio-user socket hands the negotiated DMA windows to whatever can connect, which is why the rule fixes both the mode and the namespace scope.

## Rule 5. No trust-boundary component may consume GPU state

Adding or removing a vGPU must be a no-op for Secure Boot, LUKS2 FIDO2 unlock, homed, pam-u2f, and fTPM PCR behavior. This is a yubiOS design invariant, not a claim from an external source: no PCR, no UKI section, and no cryptenroll token may depend on a display device. The enforcement mechanism is the CI suite re-run with a vGPU attached (docs 06 and 07), which turns the invariant into a checkable assertion rather than a promise.

## Rule 6. GPU resource limits are out of scope here

GPU quota and lockout stay a separate concern under the `drm-gpu-quota-secure-time` notes. Nothing in this rule set promises a merged upstream DRM cgroup controller, and no source in this corpus claims one exists.

## What the rules refuse

The enthusiast passthrough recipe, taken as a whole, is the shape these rules refuse to ship: blacklist the host display driver, bind `vfio-pci` at initramfs, and claim devices with node permissions. Each step is individually defensible on a dedicated gaming host and collectively hostile to a signed, minimal boot path. The rules keep the same capabilities available to operators who ask for them explicitly, with an IOMMU group that actually isolates the device and a deviation record that says why (source: https://pve.proxmox.com/wiki/Pci_passthrough, jev weight 0.87, for the procedure being a deliberate multi-step act rather than a default).
