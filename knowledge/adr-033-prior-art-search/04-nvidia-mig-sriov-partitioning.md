# 04 - NVIDIA MIG and SR-IOV hardware partitioning

Scope: MIG and SR-IOV hardware partitioning of GPUs: isolation guarantees, IOMMU/ARI/AER prerequisites, and what device-level cut-off options exist in commercial GPU partitioning.

## MIG: hardware-partitioned isolation

The Multi-Instance GPU (MIG) User Guide explains how to partition supported NVIDIA GPUs into multiple isolated instances, each with dedicated compute and memory resources, enabling efficient GPU utilization across multiple users or workloads (https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/index.html, weight 0.87). MIG's isolation is hardware-backed: instances get dedicated slices of SMs, L2 cache, and memory bandwidth, so one instance cannot exhaust another's compute resources.

MIG composes with virtualization: MIG allows multiple vGPUs, and thereby VMs, to run in parallel on a single MIG-supported GPU while preserving the isolation guarantees that vGPU provides (https://docs.nvidia.com/datacenter/tesla/mig-user-guide/virtualization.html, weight 0.84). The isolation guarantee is the strongest prior art ADR-033 inherits: a misbehaving tenant inside one MIG instance is hardware-limited from consuming another instance's resources. But isolation is static. MIG partitions at configuration time and does not observe or react to runtime behavior.

## SR-IOV virtual functions

SR-IOV provides the PCIe-level partitioning path: virtual functions with full IOMMU protection. Operator documentation for A100-class deployments describes enabling SR-IOV and configuring MIG mode for secure and isolated GPU partitioning in private cloud settings (https://openmetal.io/docs/manuals/private-ai/engineering-notes/sr-iov-and-mig, weight 0.52; mirrored source at https://github.com/openmetalio/openmetal-docs/blob/main/docs/private-ai/engineering-notes/sr-iov-and-mig.md, weight 0.79).

## Prerequisites: the failure mode is silent

The vGPU troubleshooting documentation covers the configuration chain: if the card is in the correct display mode but SR-IOV BIOS is disabled, the operator must enable the VT-D/IOMMU and SR-IOV BIOS settings on the hypervisor host and reboot, and ensure all other prerequisites for NVIDIA vGPU are met (https://docs.nvidia.com/vgpu/troubleshooting/latest/config.html, weight 0.96).

NVIDIA's enterprise support portal documents the failure signature: a vGPU virtual machine fails to start on AMD Epyc platforms when Advanced Error Reporting (AER) is disabled in server BIOS settings. The resolution sets the Enable AER Cap setting to Auto or Enabled along with IOMMU, PCIe ARI Support, PCIe 10 Bit Tag Support, Above 4G Decoding, and SR-IOV Support (https://enterprise-support.nvidia.com/s/article/vGPU-virtual-machine-fails-to-start-on-AMD-Epyc-platform-when-Advanced-Error-Reporting-AER-is-disabled-in-server-BIOS-settings, weight 0.90). Missing any prerequisite produces a silent VM launch failure, not a diagnostic error.

For ADR-033 this matters twice: the same prerequisite chain gates yubiOS's IOMMU-gated passthrough, and the silent-failure mode is exactly why a server-side policy layer needs its own observability rather than trusting device bring-up.

## Passthrough versus mediated virtualization

Passthrough assigns the entire card to one VM at a time, while mediated technologies such as SR-IOV, NVIDIA vGPU, and MIG split a single physical GPU across multiple guests (https://tech-insider.org/gpu-passthrough-iommu-vfio-setup-2026/, weight 0.37, weak backing). Platform documentation for VergeOS describes configuring PCI, GPU, vGPU, SR-IOV NIC, and USB device passthrough, from BIOS prerequisites to tenant-level device sharing (https://docs.verge.io/learn-the-platform/module-6-virtual-machines/03-gpu-passthrough, weight 0.69).

## What is absent against ADR-033

1. Isolation is static. MIG and SR-IOV partition at configuration time; neither reviews runtime behavior.
2. No behavioral trigger. The commercial stack's runtime responses are monitoring and orchestration actions, not device-level behavioral enforcement.
3. No preserve-then-sever. Nothing in the MIG or SR-IOV documentation describes snapshotting tenant state before revoking access.
4. Strong hardware isolation as inherited baseline. ADR-033's contribution is the policy layer above this hardware floor, not a replacement for it.

## Sources considered

| source | weight |
|---|---|
| https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/index.html | 0.87 |
| https://docs.nvidia.com/datacenter/tesla/mig-user-guide/virtualization.html | 0.84 |
| https://docs.nvidia.com/vgpu/troubleshooting/latest/config.html | 0.96 |
| https://enterprise-support.nvidia.com/s/article/vGPU-virtual-machine-fails-to-start-on-AMD-Epyc-platform-when-Advanced-Error-Reporting-AER-is-disabled-in-server-BIOS-settings | 0.90 |
| https://github.com/openmetalio/openmetal-docs/blob/main/docs/private-ai/engineering-notes/sr-iov-and-mig.md | 0.79 |
| https://openmetal.io/docs/manuals/private-ai/engineering-notes/sr-iov-and-mig | 0.52, 0.59 |
| https://docs.verge.io/learn-the-platform/module-6-virtual-machines/03-gpu-passthrough | 0.69 |
| https://labhub.hopto.org/blog/virtualization/04_gpu_virtualization?lang=en | 0.47, 0.19 (weak) |
| https://tech-insider.org/gpu-passthrough-iommu-vfio-setup-2026/ | 0.37 (weak) |
| https://massedcompute.com/faq-answers/?question=What+is+the+difference+between+MIG+and+SR-IOV+on+NVIDIA+GPUs | 0.06 (weak) |
