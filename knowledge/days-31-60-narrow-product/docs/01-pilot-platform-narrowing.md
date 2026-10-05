# 01 - Pilot Platform Narrowing

Scope: narrowing the offer to one pilot platform, choosing the x86_64 virtual machine validated lane over ARM64 hardware, and the general discipline of picking the narrowest defensible platform slice.

## The narrowing decision in the source plan

The days 31 to 60 phase plan (yubiOS refs, `days-31-60-narrow-product-2026-07-25.md`) narrows the claim to a single pilot platform: x86_64 with VM proven boot plus LUKS2. The rationale is mechanical, not aspirational. The ARM64 path (blockers B-ARM64-PATHA and B-RK3588-TPL) has no board proving the full chain of ROTPK and fuse provisioning, OP-TEE, RPMB backed StandaloneMM, fTPM NV, U-Boot UEFI, and signed UKI boot, and the ROCK 5B build is not a flashable image. The VM lane is measurably closer: two blockers are already retired in a logged run, and one known issue is a contained workaround rather than an open failure. Narrowing is therefore a retirement decision: pick the platform where the open risk is smallest and name what stays out of scope explicitly.

The plan excludes ARM64 with the words "explicitly excluded, not silently dropped". That phrasing is the load-bearing move. A narrowing that leaves the excluded branch ambiguous will resurface as scope creep inside the pilot window.

## Platform narrowing maps to support policy, not ambition

Vendor support policy documents show how mature platform vendors draw the same boundary, and they are worth citing because they demonstrate the shape of a defensible platform claim.

Microsoft states that not every application is a good candidate for virtualization, and gives the concrete test: if an application has specific hardware requirements, such as access to a physical PCI card, it cannot be supported in a virtual machine (weight 0.813, https://learn.microsoft.com/en-us/troubleshoot/windows-server/virtualization/microsoft-server-software-support-policy). yubiOS faces the exact mirror of this constraint in reverse: physical FIDO2 tokens are the hardware requirement, so the software claim must first be proven in the VM lane where tokens are passed through virtually, and only then on physical hardware.

Microsoft also requires that a supported virtualization configuration run on hardware certified for the OS version in support lifecycle (weight 0.844, https://learn.microsoft.com/en-us/troubleshoot/sql/database-engine/install/windows/support-policy-hardware-virtualization-product). The lesson for a narrow pilot: a platform claim is only defensible when the underlying hardware or virtualization target is itself on a supported, certified path.

Broadcom's VMware Product Interoperability Matrix exists specifically "for verifying compatibility and supported upgrade paths" across products and third party solutions (weight 0.841, https://interopmatrix.broadcom.com/). Mature vendors publish the compatibility surface instead of leaving it to inference. A pilot platform recommendation should be able to point at the equivalent matrix row: which hypervisor, which guest OS build, which token stack.

Broadcom further instructs that host compatibility must be verified before upgrades, because failure to check produces failed upgrades or unsupported configurations (weight 0.694, https://knowledge.broadcom.com/external/article/381824/checking-host-compatibility-before-upgra.html), and maintains a versioned table of virtual machine hardware versions tied to EVC modes (weight 0.686, https://knowledge.broadcom.com/external/article/315655/virtual-machine-hardware-versions.html). Version pinning of the virtual hardware surface is part of the platform claim, not an implementation detail.

## What the narrowing buys and what it costs

The source plan is explicit about the trade: the VM lane is the "fastest path to a defensible working claim", and in exchange ARM64 hardware proof is deferred entirely. Two weakly backed practitioner sources make the same trade from the product side. CRV's MVP methodology guide argues for picking the MVP type that validates demand with real users and avoiding the mistakes that sink early stage startups before they ship (weight 0.483, weak, https://www.crv.com/content/mvp-methodology). A guide on choosing a startup tech stack argues MVPs should prioritize speed, simplicity, and developer familiarity (weight 0.405, weak, https://www.creolestudios.com/how-to-choose-tech-stack-for-startup-mvp/). Both are consistent with the source plan's logic but are marketing adjacent blogs, so they are labeled weak.

## Operating rules for the pilot window

Combining the source plan with the sourced material:

1. Name the pilot platform as a composition: x86_64, VM validated boot, LUKS2, FIDO2 unlock. A platform claim without its composition is a slogan.
2. Keep an explicit out of scope list (ARM64 hardware, sealed UKI at pilot time) with the same status discipline as the in scope list.
3. Treat compatibility as a published, checkable surface: pin hypervisor, image digest, and token stack versions, and state them in the demonstration evidence.
4. Sequence hardware proof after virtual proof. The physical requirement that blocks virtualization support in the Microsoft policy is the same reason the physical YubiKey run is sequenced after the VM lane closes in the source plan.
