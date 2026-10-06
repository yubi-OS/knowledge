# 02 Milestone 1: ARM64 Path A production proof

Scope: the first milestone's scope and gates, its Linear ownership, its seeded blockers, and the real-hardware chain it must prove. Grounding spine: source doc yubi-OS/yubiOS docs/MILESTONE.md, fetched 2026-10-06 from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MILESTONE.md.

## Scope and gates

The source doc defines milestone 1 as: "Close the real-hardware production proof gaps for the targeted ARM64 path, including fuse/ROTPK rehearsal, OP-TEE and RPMB-backed evidence, U-Boot UEFI Secure Boot, and exact board configuration capture." (source doc). Four evidence classes are named: fuse/ROTPK rehearsal, OP-TEE with RPMB-backed evidence, U-Boot UEFI Secure Boot, and exact board configuration capture. The gate is hardware truth: the chain must be proven on a real board, not simulated.

What "Path A" means in substance is recorded in the project's own archival reference: "Path A means an owner-owned root of trust can be enforced before the OS is trusted: owner-provisioned ROTPK, TF-A Trusted Board Boot, OP-TEE, RPMB-backed secure storage, fTPM/TCG2 measurement, U-Boot UEFI Secure Boot" (https://github.com/yubi-OS/yubiOS/blob/main/refs/arm64-path-a-b-board-status-2026-07-23.md, jev weight 0.64). Each element in that chain corresponds to one of the four evidence classes the source doc demands, which is why the milestone doc lists them together as a single closure item.

## Linear ownership

The source doc assigns four Linear issues to this milestone (source doc):

- OMN-36, parent issue, Backlog, P3.
- OMN-45, ROTPK rehearsal, Backlog, P2.
- OMN-46, OP-TEE/RPMB/fTPM/U-Boot evidence on hardware, Backlog, P2.
- OMN-47, signed UKI boot on target board, Todo, P2.

None of the four had an assignee outside the agent at the 2026-07-28 status reading (source doc).

## Seeded blockers

Two blockers seed this milestone per BLOCKERS.md as of its 2026-07-25 review (source doc):

- B-ARM64-PATHA: no board has proven the full chain yet.
- B-RK3588-TPL: the ROCK 5B build is diagnostic packaging, not flashable.

The second blocker pins the concrete hardware target: the Radxa ROCK 5B on the RK3588 SoC. The board itself is a commodity SBC with RK3588, Mali G610MC4, and up to 32 GB RAM (https://radxa.com/products/rock5/5b/, jev weight 0.18, weak backing, cited for board identification only). Board-level bring-up documentation for building U-Boot on that board exists in the vendor's docs (https://docs.radxa.com/en/rock5/rock5b/low-level-dev/u-boot, jev weight 0.61), which is the kind of exact board configuration capture the milestone demands.

## Why the closure is hard

The upstream components are real but each carries its own integration risk. Community work on the same board demonstrates the shape of the problem: an OP-TEE build with a PKCS#11 token on a ROCK 5B that boots edk2-rk3588 UEFI exists as an independent proof of feasibility, with the stated goal of a key store whose private keys root cannot read, with import, sign, and no export (https://github.com/nikicat/rock5b-optee, jev weight 0.25, weak backing, independent community project, not project-internal evidence). Vendor guidance on the fTPM provisioning flow exists in other SoC ecosystems, notably NVIDIA's Jetson firmware TPM documentation describing initialization of the fTPM TA by the Trusted OS (https://docs.nvidia.com/jetson/archives/r36.4/DeveloperGuide/SD/Security/FirmwareTPM.html, jev weight 0.40, weak backing, different vendor, cited only as mechanism reference). U-Boot's UEFI Secure Boot is a documented verification mechanism ensuring that code launched by firmware is cryptographically verified before execution (https://www.linaro.org/blog/uefi-secureboot-in-u-boot/, jev weight 0.42, weak backing).

None of these substitutes for the milestone's gate: the full chain on the target board, end to end.

## Status

The source doc records status as of 2026-07-28: "0% — all 4 child issues Backlog/Todo, no assignees outside the agent, last updated 2026-07-23/24. No work in flight." (source doc). It adds that this milestone is "now the second-longest pole after Milestone 3" (source doc). That ranking is the planning consequence of the cross-milestone dependency noted in doc 01: milestone 3's signed UKI work feeds directly into this milestone's OMN-47 (signed UKI boot on target board), so both poles compound.

## Relation to the research-altitude twin

Milestone 1 overlaps with Milestone F (ARM64 Owner-Owned Root of Trust) tracked in FUTURE.md, but at a different altitude: research backlog versus execution milestone (source doc, see doc 07 for the division of labor). The corpus keeps the two apart because the execution milestone's gates are evidence-classes-on-hardware, while the research item is a longer-horizon design effort.
