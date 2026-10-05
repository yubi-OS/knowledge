# 06. What is testable where: CI runners, self-hosted KVM, and bare metal

Scope: the testability matrix for GPU virtualization, why GitHub-hosted runners cannot host the interesting legs, and why the self-hosted arm64 runner is the only place a guest boots in CI.

## The hosted-runner constraint

GitHub-hosted runners run as virtual machines on Azure, and nested virtualization is not supported on them. The community record is consistent on this: regular GitHub-hosted runners use dv2-series Azure VMs, which do not support nested virtualization (source: https://github.com/orgs/community/discussions/40345, jev weight 0.30, weak backing). The runner-images issue tracker carries both an open request to enable nested virtualization, filed December 2019 (source: https://github.com/actions/runner-images/issues/183, jev weight 0.36, weak backing), and a documentation request recording the background that runners are already VMs in Azure and community consensus says nested virtualization is not possible on them (source: https://github.com/actions/runner-images/issues/12933, jev weight 0.31, weak backing). The docs that GitHub publishes directly are stronger sources for adjacent limits: the larger runners reference documents arm64 compatibility constraints and limitations for hosted runners (source: https://docs.github.com/en/actions/reference/runners/larger-runners, jev weight 0.82).

Third-party platforms fill the gap by changing the substrate: Actuated launches jobs in isolated VMs with nested virtualization support, explicitly as an alternative to hosted runners (source: https://actuated.com/blog/kvm-in-github-actions, jev weight 0.45, weak backing). The takeaway for yubiOS is not to adopt such a platform but to accept the constraint: a guest that actually boots needs a self-hosted runner with real KVM.

## The IOMMU constraint

Even where nested virtualization exists, hosted VMs do not expose an IOMMU to the runner, so nothing in the passthrough family can run there. Real vfio-pci GPU passthrough requires actual hardware: enable IOMMU in firmware, verify groups, bind the driver, and assign the device, a sequence the operations guides describe as a bare-metal procedure end to end (source: https://proxmox.rdem-systems.com/en/blog/proxmox-hardware-passthrough-gpu-usb-pci/, jev weight 0.60; hardware prerequisites and BIOS configuration are the first steps in https://cyberpulstech.com/proxmox-gpu-passthrough-iommu-pcie-bifurcation-guide-2026/, jev weight 0.35, weak backing). Vendor mediated vGPU adds a vendor driver and hardware requirement on top.

## The matrix

| Test | Where it can run | Why |
| --- | --- | --- |
| `virtio-gpu-pci` device model present in the CI QEMU | any runner | host-side `-device help` probe |
| `vfio-user-pci` client present (QEMU 10.1 and later) | any runner with the built QEMU | upstream since 10.1 |
| vfio-user negotiation and `DMA_MAP` against a userspace server | any runner | pure userspace, no kernel VFIO, no IOMMU |
| Guest binds `virtio_gpu`, `/dev/dri/card0` plus `renderD128` appear | self-hosted runner with KVM | needs a booted guest |
| Negative surface: no `/dev/vfio`, no `vfio-pci` bound, no IOMMU-group claim in a default guest | self-hosted runner | image-policy assertion |
| Full LUKS2 FIDO2 plus homed plus pam-u2f plus fTPM suite with a vGPU attached | self-hosted runner | the unlock invariant of doc 05 rule 5 |
| Real `vfio-pci` GPU passthrough with IOMMU isolation and DMA-ownership enforcement | bare metal only | needs a real IOMMU and a real GPU |
| Vendor mediated vGPU (NVIDIA vGPU; Intel GVT-g is archived upstream) | bare metal only | vendor driver and hardware |
| GPU-accelerated 3D (virgl or Venus with a host GPU) | bare metal only | QEMU docs: 3D needs host GPU access |

## Why the workflow inherits an existing matrix

Given the constraints above, the vGPU CI workflow does not invent a matrix. It inherits the existing VM test workflow's legs and gating: the same lint gate, the same host-deps preflight, the same result contract of 0 pass, 77 loud SKIP, else fail, and the same artifact and callback plumbing. The self-hosted arm64 runner is the only leg where a guest actually boots, which makes it the load-bearing leg for everything in the lower half of the table. Everything above it is portable to any runner precisely because vfio-user and virtio-gpu stay in host userspace (docs 02 and 03), and that portability is what lets the device-model legs run fast on every push while the guest legs gate on the self-hosted runner.
