# bootc-composefs-sealed-flow

Knowledge corpus minted from yubi-OS/yubiOS refs/bootc-composefs-sealed-flow-2026-07-22.md. Topic: the bootc composefs and sealed UKI boot flow, how composefs signed catalogs, dm-verity, and sealed UKIs compose into a verifiable immutable OS boot path.

## Documents

| NN | slug | scope |
|---|---|---|
| 01 | [composefs-backend-layout](01-composefs-backend-layout.md) | The bootc composefs backend: three-store repository layout, EROFS metadata-only images, digest naming rules from composefs-rs. |
| 02 | [fs-verity-integrity](02-fs-verity-integrity.md) | fs-verity as the file-level integrity primitive behind composefs: Merkle tree enforcement, ext4/btrfs support, fsverity tooling. |
| 03 | [verity-comparison](03-verity-comparison.md) | dm-verity vs fs-verity vs composefs: which layer each authenticates and why dm-verity belongs to the block-image path. |
| 04 | [composefs-digest-boot-arg](04-composefs-digest-boot-arg.md) | The composefs kernel command line contract: strict digest vs the ? marker, --allow-missing-verity, why strict BLS is still unsealed. |
| 05 | [sealed-uki-chain](05-sealed-uki-chain.md) | The sealed UKI boot chain: ukify assembly, whole-artifact signing, /boot/EFI/Linux placement, how the signed command line anchors the digest. |
| 06 | [install-to-filesystem](06-install-to-filesystem.md) | bootc install to-filesystem with the composefs backend: writable verity-capable target, root-mount-spec, deployment wiring. |
| 07 | [split-kernel-ukify-cli](07-split-kernel-ukify-cli.md) | The split-kernel-and-rootfs and container ukify CLI contract: argument placement, pass-through after --, staged sealed build shape. |
| 08 | [initramfs-root-setup](08-initramfs-root-setup.md) | The initramfs side: 51bootc dracut module, bootc-root-setup.service, setup-root-conf.toml handoff, composefs root assembly. |
| 09 | [ci-promotion-gates](09-ci-promotion-gates.md) | CI verification and promotion gates: offline smoke checks, integrity levels, Secure Boot on-target proof, negative tamper testing. |

## Research summary

- Results collected: 108 (2 searXNG queries per subtopic, top 6 per query kept).
- Weight split: 67 results at weight >= 0.5 (primary/official backing), 41 below 0.5 (weak backing, labeled in text where used).
- Jev requests: 24 POST /api/decide calls (1 preflight probe, 1 outline score validation over 9 questions, 22 noul weighting batches), usage 18267 input tokens / 0 output tokens.
- Redos: 0 dig redos, 0 weighting failures (1 transient HTTP 429 retried per the redo rule).
- Skipped docs: none. All 9 outline subtopics scored load-bearing or marginal-with-strong-dig and were authored.

## Gaps / skips

None. No subtopic's dig was too thin to author after the initial 2 queries, so no redo-with-different-queries cycles were needed.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

(Probe detail: the preflight searXNG query returned 36 results across engines with no unresponsive engines; /api/decide answered the noul probe with noul=0.0599 for example.org as expected for a placeholder domain.)
