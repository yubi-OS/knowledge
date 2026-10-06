# 10 Recommended next work and the hardware proof packet

Scope: the 6 ordered next-work actions the source doc records, and the hardware proof packet a board must attach before it can be promoted beyond research candidate. This is an internal-record subtopic, no dig: the content is the source doc's own plan and checklist.

Grounding spine: `yubi-OS/yubiOS docs/OPTS.md`, sections "Recommended next work" and "Hardware proof packet for any promoted option".

## The 6 next-work actions

All claims below are source doc:

1. Do not reopen ADR-029 yet. Complete the existing ROCK 5B sacrificial fuse rehearsal first; it remains the shortest route to a Path A hardware claim. The document explicitly does not promote a board, change ADR-029, or make a production-readiness claim.
2. Add an i.MX8MM source-feasibility lane. Build both reviewed upstream defconfigs and create one board config that combines `CONFIG_EFI_MM_COMM_TEE`, `CONFIG_CMD_OPTEE_RPMB`, `CONFIG_SUPPORT_EMMC_RPMB`, `CONFIG_TEE`, `CONFIG_OPTEE`, and `CONFIG_TPM2_FTPM_TEE`. Verify dependency closure with `olddefconfig`; do not treat a hand-edited fragment as proof.
3. Prefer the NXP EVKB for the first i.MX8MM destructive test. Its reference design and recovery documentation are more suitable for fuse work. Use the CompuLab board as the industrial follow-on once owner provisioning is demonstrated.
4. Add one RK3588 alternate only after ROCK 5B works. Orange Pi 5 Plus or NanoPC-T6 LTS should reuse the same SoC firmware sources and tests, differing only in board config, storage population, and evidence.
5. Prototype STM32MP2 and i.MX93 in CI before buying hardware. STM32MP2 needs U-Boot secure-state configuration work; i.MX93 first needs an explicit trust-boundary decision for EdgeLock firmware.
6. Treat RK3576 and RB3 Gen 2 as watch lanes. Re-evaluate RK3576 when upstream has a real secure-boot/OTP path, and RB3 Gen 2 when upstream demonstrates OP-TEE secure storage plus owner-controlled signing without ambiguous QTI authority.

The ordering is a dependency chain, not a menu: the ROCK 5B rehearsal gates the RK3588 alternate, the i.MX8MM source feasibility lane can start now, and the CI lanes exist to defer purchase decisions.

## The hardware proof packet

A proposal to add a board to the supported matrix should attach, at minimum (all claims below are source doc):

- Exact board revision, storage SKU, SoC stepping, and fuse-state-before record.
- Immutable source manifest and all firmware/blob digests.
- Owner key ceremony and offline key custody record.
- Fuse dry-run, readback, close-state readback, and irreversible-action peer review.
- Positive boot log and negative logs for wrong BL2/SPL, BL31, OP-TEE, U-Boot, StandaloneMM/TA, and UKI signatures.
- OP-TEE production configuration with insecure defaults disabled.
- RPMB key provisioning evidence, replay negative test, and secure-variable persistence test.
- fTPM enumeration, TCG2 event log, PCR expectations, and seal/unseal negative tests.
- Rollback and downgrade tests.
- Recovery procedure tested after closure.
- JTAG/serial-download/debug policy and proof of the intended production state.
- Statement of every vendor-controlled executable or signing authority remaining before the owner-controlled UKI.

The packet's design mirrors the 8 gates in 01-path-a-candidate-gates.md: every gate maps to at least one packet item, and most map to a negative test on closed hardware rather than a configuration display.

## The promotion label rule

Until that packet exists, the correct label is research candidate, not Path A-supported (source doc). This is the rule that keeps the comparison matrix honest: the matrix's "yes" means an upstream source or configuration exists, not that yubiOS has validated it on hardware (source doc, comparison matrix preamble).

## Governance annotations carried by the source doc

The source doc also carries 3 substrate annotations and a drift note (source doc): a least-privilege coverage statement (Linux capabilities with drop + ambient, ProtectSystem/ProtectHome, rootless execution, dynamic user, RBAC, PrivilegeBoundary, and sandbox/jail idioms where isolation beats containers), a declarative-policy coverage statement (OPA/Rego policy files, signing-config JSON, policy-as-code workflows, with policy gates named at integration points), and a continuous-monitoring coverage statement (falco/tracee/tetragon/kubeArmor runtime detection feeding the audit-evidence rollup). A 2026-09-18 drift check (wayfinder round 11, cycle 14) records that the options/invariant text is unchanged, the round's nspawn-boundary and claims-boundaries records extend its decision surface, and the change is additive.
