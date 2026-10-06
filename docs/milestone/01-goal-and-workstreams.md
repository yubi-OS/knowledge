# 01 Goal and the four main workstreams

Scope: the yubiOS milestone project's stated goal, its four main workstreams, and the Linear-mirroring arrangement that keeps the planning doc aligned with execution. Grounding spine: source doc yubi-OS/yubiOS docs/MILESTONE.md, fetched 2026-10-06 from https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MILESTONE.md.

## The goal

The source doc states the goal plainly: "Drive yubiOS from research-backed roadmap items to production-proof evidence across ARM64 Path A, token-backed CI, sealed bootc flow, and runtime/supply-chain validation." (source doc). The operative phrase is "production-proof evidence": each milestone is defined not by shipped features but by evidence classes, real-hardware proof, deterministic CI runs, sealed boot proofs, and runtime validation of hardened images.

The goal line was last reviewed against docs/BLOCKERS.md in the 2026-07-30 review (sha 7501fa0c13a4) (source doc). That review recorded no new blocker retirements since the doc's prior 2026-07-28 review and stamped itself as a "no-new-retirements confirmation", leaving the 2026-07-28 review diff as the binding drift correction (source doc).

## The mirror, not the source of truth

The document is explicitly a "repo-native mirror of the Linear execution project" and is planning-only: it summarizes workstreams and milestones and deliberately does not duplicate TODO.md, BLOCKERS.md, or FUTURE.md (source doc). The mirrored project is "yubiOS Production Proof & Release Gates", id a9a0701b-d1be-448c-a194-e573c82bd9f8, team OMNI-AGENT, mirrored per OMN-64 and OMN-44 (source doc). This means the doc's status percentages and issue lists are read-only projections of Linear state at review time, not live data.

## The four workstreams

The source doc names four main workstreams, which map 1:1 onto the four milestones covered in docs 02 through 05 of this corpus (source doc):

1. **ARM64 Path A**: "real-hardware production proof for the ARM64 secure-boot chain (ROTPK, OP-TEE, fTPM, U-Boot UEFI Secure Boot)" (source doc). The distinguishing word is real-hardware: simulation and QEMU coverage exist, but the milestone counts only board-level proof.
2. **VM/CI coverage**: "deterministic, token-dependent guest operations in CI (FIDO2 enumeration, LUKS2 unlock) with clear production/dev-test isolation" (source doc). Two requirements are bundled here: determinism (the same token operations must run reproducibly in CI) and isolation (production and dev-test paths must stay explicitly separated).
3. **Sealed boot chain**: "moving from the current unsealed fs-verity story to a signed-UKI plus Secure Boot proof" (source doc). This workstream is a promotion from an integrity story that is proven but unsealed to one that is cryptographically anchored.
4. **Runtime hardening and supply chain**: "turning static hardening audits into target-image runtime evidence, with pinned inputs and provenance" (source doc). The shift is from audits of source code to evidence collected against a built target image.

## How the workstreams connect to the system being built

The yubiOS repository describes a complete build that "compiles the pinned EDK2/StandaloneMM, OP-TEE/fTPM, TF-A, and U-Boot firmware sources; runs the QEMU fTPM checks; builds and verifies the SoftHSM PKCS#11-signed mkosi UKI and disk payload" (https://github.com/yubi-OS/yubiOS, jev weight 0.72). That build description shows the exact surfaces the four workstreams must turn into production evidence: the firmware chain (workstream 1), the VM/CI harness that exercises fTPM in QEMU (workstream 2), the UKI signing path (workstream 3), and the pinned-input build discipline (workstream 4). The same repository's SPEC.md frames the consolidated specification for "what the system is, what it guarantees, how it is built and updated, and the deployment scenarios it is designed for" (https://github.com/yubi-OS/yubiOS/blob/main/SPEC.md, jev weight 0.69), with decisions and rationale kept elsewhere; MILESTONE.md sits below SPEC altitude as the execution-level plan.

The org-level listing confirms the project context: yubiOS is the FIDO2-first immutable OS project under the yubi-OS org (https://github.com/yubi-OS, jev weight 0.50).

## Sequencing reality

The four workstreams are not executed strictly in parallel or in series. The source doc states for milestone 3 that its child issues "feed back into Milestone 1 (signed UKI consumed by ARM64 boot) and into Milestone 4 (target-image runtime hardening meaningless without a sealed chain). The four milestones are not strictly sequential." (source doc). The corpus treats this as a load-bearing fact: any reading of the milestone list as a linear roadmap is wrong, and the critical-path analysis in doc 04 (milestone 3 as the long pole) only makes sense with these cross-dependencies in view.

## What this corpus doc does not cover

Per-milestone scope, ownership, and gate detail live in docs 02, 03, 04, and 05. The cross-milestone items that carry no parent issue are covered in doc 06. The blocker-seeding model and the TODO/BLOCKERS/FUTURE division of labor are covered in doc 07, and the planning-doc publish-gate process rule is covered in doc 08.
