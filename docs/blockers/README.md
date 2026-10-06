# docs/blockers - the yubiOS blockers ledger, explicated

Knowledge corpus for `yubi-OS/yubiOS docs/BLOCKERS.md` (the yubiOS blockers ledger: the active register, its unblock paths, the permanent CI-evidence patterns, and what the ledger teaches about dependency management in a hardware-coupled OS project). The source doc is the primary source of record; this corpus explicates and deepens it.

## Ground source

`yubi-OS/yubiOS docs/BLOCKERS.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/BLOCKERS.md), fetched 2026-10-06, 20610 bytes.

## Docs

1. `01-register-and-lifecycle.md` - what the register is, its active-only retention policy, the reporting rule, and the review cadence that moves resolved blockers out of the table.
2. `02-arm64-production-gate.md` - B-ARM64-PATHA: the real-board proof gate over the secure-boot chain (ROTPK/fuse, OP-TEE, RPMB StandaloneMM, fTPM NV, U-Boot UEFI, signed UKI).
3. `03-rk3588-tpl-blob.md` - B-RK3588-TPL: the external DDR/TPL blob, why the green publish job is diagnostic packaging only, and the pin-checksum-fail-closed unblock path.
4. `04-qemu-zboot-workaround.md` - B-QEMU-ZBOOT: the pinned QEMU workaround for zstd EFI zboot, the runner-image refresh removal condition, and the bcvk #290 asymmetry.
5. `05-digest-pin-supply-chain.md` - B-PINS: base-image digest pinning, package-floor checks, PINNED.md as the single live digest source, and the SLSA provenance frame.
6. `06-systemd-hardening-runtime.md` - B-HARDENING-RUNTIME: static audit complete, runtime evidence pending; the RestrictFileSystems vs RestrictFileSystemAccess v261 correction.
7. `07-fido2-e2e-unlock.md` - B-REAL-FIDO2 and the resolved B-VM-CTAP2: software substitutes vs the physical-YubiKey production gate, and the 2 root-caused bugs that closed CTAP2.
8. `08-bootc-seal-uki.md` - B-BOOTC-SEAL: the shipped artifact split, the bootc 1.16.3 BLSConfig wiring gap, the 2 unblock options, and the Secure Boot / negative-tamper gate.
9. `09-ci-runner-infrastructure.md` - B-VGPU-VM-UNZIP and B-ROCK1-OFFLINE: one missing apt package, one offline board, and how every VM leg serializes behind rock1.
10. `10-permanent-patterns-and-drift.md` - the systemd drop-in lex-sort rule, the runner host-deps gap, the Inconsistency Log, and the 2026-09-18 drift checks as institutional memory.

## Research summary

- Results collected: 114 (84 from the first dig pass, 30 from redo digs).
- Weight split: 49 high (>= 0.5), 65 low (< 0.5).
- jev requests: 10 (1 outline score validation, 9 noul weighting batches), usage 13292 input / 3166 output tokens, via DefAPI direct (api.defapi.org/api/v1/decisions).
- Redo counts: doc 03, 2 redos (both queries); doc 04, 2 redos (both queries); doc 06, 1 redo (query 1); doc 08, 2 redos (query 2 plus a complementary UKI query).
- Skipped docs: none. All 10 outline subtopics validated non-zero and were authored.
- Internal-record subtopics (01, 09, 10) skipped searXNG entirely per the docs-variant dig rule; their grounding is the source doc itself.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide (typesafe/jev-1.13) healthy via DefAPI direct, agent-side probe skipped for speed.

## Notes

- Claims from the source doc are attributed as "source doc"; claims from digs carry their URL and jev weight inline. Weak results (< 0.5) are labeled where cited.
- The noise results that scored >= 0.5 in the dig (off-topic pages) are retained in the research-db archive with their weights but are not cited in any doc.
