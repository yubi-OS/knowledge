# 05. The SMC-based hard lockout: a proposal, not a citation

Scope: the from-scratch SMC-mediated GPU lockout mechanism described in the source material, the SMCCC and TF-A constraints that govern it, and why the realistic v0 architecture keeps enforcement in Linux.

Primary source: yubi-OS/yubiOS skills/drm-gpu-quota-secure-time/SKILL.md (the "source doc").

## Status: custom mechanism, not upstream

Everything in the source material past "kernel accounts, then asks for a hard cutoff" is a from-scratch design, not an existing kernel, TF-A, or OP-TEE facility (source doc, section 4). The named pieces are a `GPU_LOCKOUT_SMC` function ID, a `gpu_lockout_msg` mailbox struct, and secure-monitor-side enforcement. The source doc's verdict: treat it as a proposal, not a citation.

## Constraint 1: SMC function IDs are not arbitrary

The ARM SMC Calling Convention reserves function-ID ranges by owning entity: Arch, CPU service, SiP service, OEM service, Standard service, Trusted OS, and Trusted Application (source doc, section 4). A yubiOS-owned hard-lockout call belongs in the SiP Service range, `0xC2000000` to `0xC200FFFF` for fast calls, per the SMCCC spec.

The dig record confirms both the range and its owner. The TF-A documentation for Arm SiP services instructs implementers to follow the SMC Calling Convention and use SMC function IDs in the SiP range, which is 0xc2000000 to 0xc200ffff for 64-bit calls and 0x82000000 to 0x8200ffff for 32-bit calls (jev 0.33, weak backing, https://pfalcon-trustedfirmware-a-sandbox.readthedocs.io/en/latest/components/arm-sip-service.html). The SMCCC specification itself defines the mechanics: the 32-bit integer value indicates which function is being requested, it is always passed as the first argument to every SMC or HVC call in R0 or W0, and several bits within the value have defined meanings per Table 2-1 (jev 0.7, https://chasinglulu.github.io/downloads/ARM_DEN0028B_SMC_Calling_Convention.pdf). Even upstream U-Boot code treats the convention as binding, citing ARM DEN 0028 section 7 for architecture calls such as SMCCC_ARCH_FEATURES (jev 0.68, https://source.denx.de/u-boot/u-boot/-/commits/master/drivers).

Critically, the ID must also be wired into TF-A's own SMC dispatch table (`plat_spm_helpers.c` or the runtime services dispatcher), or into a custom secure partition in an FF-A/SPMD setup (source doc, section 4). The call does not reach OP-TEE or the secure monitor just by being called; something in TF-A/BL31 has to claim that ID first. The source doc's instruction: verify the exact reserved sub-ranges in the current SMCCC spec before allocating a real ID.

## Constraint 2: enforcement bottoms out in a real primitive

"Revoke IOMMU mappings", "fence GPU context", and "reset GPU" are Linux DRM and IOMMU-API operations: `drm_sched_stop()`-family fencing, IOMMU domain detach/invalidate, and driver-specific reset (source doc, section 4). They are not something a secure monitor can do to a normal-world GPU driver's live state without cooperation. The realistic v0 architecture is therefore: Linux enforces (deny allocation, kill, reset), and the SMC path is only useful for cutting power or clocks at a level Linux cannot be trusted to self-police, such as compromised-userspace scenarios (source doc, section 4).

## The TF-A side: how a runtime service gets claimed

TF-A's EL3 Runtime Service Writer's Guide describes exactly the path a custom service takes: BL31 is the EL3 runtime firmware component, and software executing in the normal world and in the trusted world at exception levels lower than EL3 requests runtime services using the SMC instruction (jev 0.84, https://tf-a.docs.trustedfirmware.org/en/latest/getting_started/rt-svc-writers-guide.html). TF-A documentation also covers the supporting machinery a real service needs: SMC argument validation through the standard validation framework, the Secure Payload Dispatcher layer, and the OP-TEE dispatcher (jev 0.84, https://trustedfirmware-a.readthedocs.io/_/downloads/en/latest/pdf/). A GPU-lockout service is not exempt from any of that; it is a peer of the services already registered in BL31.

## Recommended v0 scope, in order

The source doc prescribes the ordering. First: Panfrost BO create and submit accounting per cgroup id with soft and hard in-kernel limits (deny allocation, deny submit). This ships value with zero firmware changes (source doc, section 4). Second: only if self-policing normal world is insufficient for the threat model, design the SiP SMC plus TF-A dispatch as a second PR with its own ADR.

The logic behind the ordering is threat-model-driven. In-kernel enforcement already stops honest-but-greedy or buggy userspace, which is the common case. The SMC tier only adds value where the normal-world kernel itself is suspect, and that is a much narrower and harder problem, so it should not delay the accounting work that pays off immediately. The doc-08 re-check protocol covers verifying the SMCCC SiP sub-ranges before any real ID is allocated.
