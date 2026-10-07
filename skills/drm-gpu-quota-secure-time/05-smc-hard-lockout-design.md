Scope: the SMC-based hard lockout as a from-scratch proposal, the SMCCC ownership rules a real function ID must respect, and the TF-A wiring a real call would need.

## A proposal, not a citation

Everything past "kernel accounts, then asks for a hard cutoff" in the source material, meaning the GPU_LOCKOUT_SMC function ID, the gpu_lockout_msg mailbox struct, and secure-monitor-side enforcement, is a from-scratch design ("source doc"). It is not an existing kernel, TF-A, or OP-TEE facility. The source doc's instruction: treat it as a proposal, not a citation. No corpus document may present those names as upstream symbols.

## SMC function IDs are not arbitrary

The ARM SMC Calling Convention reserves function ID ranges by owning entity: Architectural, CPU service, SiP service, OEM service, Standard service, Trusted OS, and Trusted Application ("source doc"). A yubiOS-owned hard-lockout call belongs in the SiP service range, 0xC2000000 through 0xC200FFFF for fast calls, per the SMCCC spec ("source doc"). The dig surfaced an SMCCC reference document (https://chasinglulu.github.io/downloads/ARM_DEN0028B_SMC_Calling_Convention.pdf, weight 0.40 weak) that carries the convention's ownership model; its weight is weak, so the source doc's own instruction to verify the exact reserved sub-ranges in the current SMCCC spec before allocating a real ID remains the operative rule.

## The wiring: someone in TF-A has to claim the ID

A call into the SiP range does not reach OP-TEE or the secure monitor just by being issued. It has to be wired into TF-A's own SMC dispatch table, in the plat_spm_helpers.c path or the runtime services dispatcher, or into a custom secure partition if using an FF-A/SPMD setup ("source doc"). Something in TF-A/BL31 has to claim that ID first. The TF-A runtime service writer's guide documents exactly this registration mechanic, how an owning entity adds a runtime service so the EL3 dispatcher routes its FIDs (https://tf-a.docs.trustedfirmware.org/en/latest/getting_started/rt-svc-writers-guide.html, weight 0.30 weak). The guide is a weak-weight corroboration; the design obligation comes from the source doc.

The practical reading: the mailbox struct is the easy half. The dispatch-table surgery in BL31, plus a build of TF-A that carries it, is the part that determines whether the mechanism exists at all. That is also why the v0 scope in doc 06 defers the whole SMC tier.

## What the lockout would actually do

The proposal's intent is a hard cutoff the normal world cannot talk itself out of: revoke GPU access below the kernel, enforced from secure world. The source doc is careful about what that can and cannot mean, and doc 06 carries the enforcement analysis. What belongs in this section is the boundary condition: the SMC path is only useful for cutting power or clocks at a level Linux cannot be trusted to self-police, for example compromised-userspace scenarios ("source doc"). Everything short of that is better done in the kernel, where the accounting already lives.

## Status

This mechanism is unshipped by design at the time of the source doc. It exists as a proposal with two named corrections (ID ownership, dispatch wiring) and one sequencing rule (second tier). Any implementation work starts with the re-checks the source doc lists: the current SMCCC spec for the SiP range, and the TF-A tree the firmware stack actually pins.

## What the dispatch wiring implies operationally

Claiming a SiP FID in BL31 is not a data-structure edit in isolation. The TF-A runtime service model described by the writer's guide (https://tf-a.docs.trustedfirmware.org/en/latest/getting_started/rt-svc-writers-guide.html, weight 0.30 weak) means the owning code becomes part of the EL3 runtime image, which carries consequences the source doc's sequencing rule already anticipates: the firmware binary on the board changes, the boot chain that verifies that binary changes, and the rollback story changes with it. That is why the source doc routes this work through a second PR with its own ADR rather than as a rider on the kernel-side patch ("source doc").

There is also a trust-direction consideration the source doc makes explicit in its boundary analysis: the SMC tier exists for the case where the normal world cannot be trusted to enforce against itself, such as compromised userspace ("source doc"). That threat model is precisely the one where the caller of the SMC, the Linux kernel, is not the trusted party, so the enforcement decision has to be anchored somewhere the compromise does not reach. The mailbox design is the transport for that anchoring; it is not itself the enforcement (doc 06).

## Why the function-ID correction matters before any code exists

The 0xC2000000 through 0xC200FFFF fast-call range is the SiP ownership band per the SMCCC spec ("source doc"), and a collision in it is not theoretical: silicon vendors allocate SiP IDs for their own services, and a Rockchip platform already has vendor SiP calls in flight. An implementer who picks an ID by intuition, or by quoting a chat transcript, risks aliasing an existing vendor call whose arguments happen to overlap. The source doc's instruction to verify the exact reserved sub-ranges in the current SMCCC spec before allocating a real ID ("source doc"), plus a survey of the platform's existing SiP usage, is the minimum diligence. The DEN0028B reference document surfaced in the dig (https://chasinglulu.github.io/downloads/ARM_DEN0028B_SMC_Calling_Convention.pdf, weight 0.40 weak) is a starting point for the convention's range map, at weak weight, with the current Arm-published spec as the authority to check against.

## Status recap

To repeat the section's governing line, because it is the one most likely to be misquoted downstream: GPU_LOCKOUT_SMC and gpu_lockout_msg are a from-scratch design, not an existing kernel, TF-A, or OP-TEE facility ("source doc"). Cite this skill when describing the proposal; cite the SMCCC spec when describing the ID rules; cite TF-A docs when describing the dispatch mechanics. Do not cite any of them as if the lockout itself shipped.
