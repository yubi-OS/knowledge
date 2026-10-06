# docs/opts - the yubiOS Path A device options corpus

Knowledge corpus explicating `yubi-OS/yubiOS docs/OPTS.md` (Path A device options, upstream survey, 2026-07-19). The source doc is the primary source of record; every doc below cites it as its grounding spine and adds dig-sourced depth on the external mechanisms it references.

## Docs
- 01-path-a-candidate-gates.md (700 words) - The 8 evidence gates defining a Path A candidate (owner root at reset, complete chain, owner-controlled inputs, secure state, persistent UEFI state, TPM and measured boot, rollback/recovery/debug, reproducibility) and the first-verifier wording caveat.
- 02-imx8mm-priority-one.md (668 words) - Priority 1 i.MX8M Mini lane: CompuLab IOT-GATE-iMX8 / SBC-IOT-iMX8 and NXP i.MX8M Mini EVKB, their split upstream defconfigs, HABv4/SRK fuse closure, and unproven items.
- 03-rk3588-alternates.md (615 words) - Priority 1 alternate RK3588 boards: Orange Pi 5 Plus and NanoPC-T6 LTS; SPL FIT signatures and RPMB transport only; Rockchip OTP and CFG_RK_SECURE_BOOT caveats.
- 04-imx93-evk.md (727 words) - Priority 2 conditional NXP i.MX93 EVK: strong U-Boot integration (EFI MM, RPMB, OP-TEE) but EdgeLock Enclave/AHAB vendor trust boundary and three open questions.
- 05-stm32mp257f-ev1.md (669 words) - Priority 2 STM32MP257F-EV1: full TF-A BL2/BL31 plus OP-TEE BL32 plus U-Boot BL33 firmware shape, but U-Boot secure-state configs missing and DDR PHY blob required.
- 06-rk3576-watch.md (630 words) - Priority 2 watch lane RK3576 (Radxa ROCK 4D, ArmSoM Sige5): BL31-only TF-A, no RK3576 secure-boot/OTP path in OP-TEE, DDR/TPL blobs, eMMC preferred for first proof.
- 07-lx2160a-rb3gen2.md (639 words) - Priority 3 NXP LX2160A-RDB (OTPMK/SRKH TBBR, split secure-boot and StandaloneMM configs) and watch lane Qualcomm RB3 Gen 2 (QTI signing, qtiseclib, UFS storage).
- 08-deferred-rejected.md (651 words) - Deferred and rejected intersections (RK3566/68, Raspberry Pi 5, TI K3, Allwinner A64, i.MX8MQ, newer i.MX9 variants, Nuvoton Arbel) with the recorded rejection reasons.
- 09-cross-cutting-conclusions.md (621 words) - The three cross-cutting upstream conclusions: Rockchip Path A has no TF-A BL1/BL2; no reviewed board arrives with the complete yubiOS config; binary firmware remains inside the security boundary.
- 10-next-work-proof-packet.md (667 words) - Recommended next work (6 ordered actions) and the hardware proof packet required before any board is promoted beyond research candidate.

## Research summary
- Results collected and weighted: 88 (high >= 0.5: 48, low < 0.5: 40)
- Jev requests: 9 (score validation 1, noul weighting 8), usage tokens in 10860 / out 2034
- Redos: 0. Skipped docs: none.
- Per-doc results kept / primary (>= 0.5):
  - 01-path-a-candidate-gates: 12 kept, 3 primary
  - 02-imx8mm-priority-one: 12 kept, 10 primary
  - 03-rk3588-alternates: 10 kept, 3 primary
  - 04-imx93-evk: 10 kept, 5 primary
  - 05-stm32mp257f-ev1: 12 kept, 10 primary
  - 06-rk3576-watch: 10 kept, 4 primary
  - 07-lx2160a-rb3gen2: 11 kept, 7 primary
  - 09-cross-cutting-conclusions: 11 kept, 6 primary
- Subtopics 08 and 10 are internal-record subtopics with no dig, grounded in the source doc itself.
- The source doc carries least-privilege, declarative-policy, and continuous-monitoring coverage annotations plus a 2026-09-18 drift check note; these are recorded in 10-next-work-proof-packet.md.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide via DefAPI direct (typesafe/jev-1.13), agent-side probe skipped for speed, 0 failures across 9 requests.
