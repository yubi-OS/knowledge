# skills/composefs-kernel-floors

Knowledge corpus explicating the yubiOS skill `composefs-kernel-floors` (ground source: yubi-OS/yubiOS skills/composefs-kernel-floors/SKILL.md, fetched 2026-10-06, 14594 bytes). The skill is the single reference for which kernel version a yubiOS image needs for a given composefs use case: kernel 6.5 or newer for data-only OverlayFS, 6.6 or newer for the verity=require mount option, and 6.12 or newer for file-backed EROFS, plus the systemd-dissect integration points and the PINNED.md floor-selection convention.

## Corpus index

| NN | doc | scope |
|---|---|---|
| 01 | [01-data-only-overlayfs.md](01-data-only-overlayfs.md) | The 6.5 floor: data-only OverlayFS as the primary composefs backing, metacopy=off and redirect_dir=off, and the writable-upper fallback on older kernels. |
| 02 | [02-verity-require.md](02-verity-require.md) | The 6.6 floor: verity=require as mount-time enforcement of the signed catalog, the upstream per-file fs-verity framing, and the unsigned-catalog exposure. |
| 03 | [03-file-backed-erofs.md](03-file-backed-erofs.md) | The 6.12 floor: file-backed EROFS (CONFIG_EROFS_FS_BACKED_BY_FILE), LZ4 vs GZIP decompression, and the density story vs Squashfs. |
| 04 | [04-systemd-dissect-integration.md](04-systemd-dissect-integration.md) | systemd-dissect as the user-space composer; the three mount modes and their floors; an open-verification note on the mode flags. |
| 05 | [05-kernel-selection-convention.md](05-kernel-selection-convention.md) | The PINNED.md convention: production 6.12, LTS 6.6, experimental 6.5, and the discouraged pre-composefs dm-verity-only path. |
| 06 | [06-anti-patterns.md](06-anti-patterns.md) | The six anti-patterns and the mkosi.prepare build-time kernel assertion, corroborated against mkosi docs. |
| 07 | [07-scope-and-boundaries.md](07-scope-and-boundaries.md) | When the skill applies and the exclusions: dm-verity (4.4), IMA, fs-verity floors, and the Linux-only boundary. |
| 08 | [08-worked-setup-and-touchpoints.md](08-worked-setup-and-touchpoints.md) | Worked setup, in-repo touchpoints, and changelog provenance. Internal-record subtopic, no dig. |

## Research summary

- Results collected: 84 dig results over 14 searXNG queries (7 web-shaped subtopics, 2 queries each; subtopic 08 is internal-record, no dig).
- Weight split: 42 results with weight 0.5 or higher (primary), 42 below 0.5 (weak; labeled as such wherever cited).
- jev requests: 8 (1 outline score validation, 7 noul weighting batches of 15), all via DefAPI direct (https://api.defapi.org/api/v1/decisions), 0 HTTP failures, 0 redos. Usage: 1364 input / 124 output tokens recorded for the outline request; batch-level weighting usage logged as aggregate only (7237 input / 1536 output tokens).
- Redos: 0 dig redos. Two queries returned mostly off-topic noise (05 query 1, 06 query 1); no redo was needed because the affected docs rest their substance on the source doc and the external-facing claims were covered by the other query.
- Skipped docs: none. All 8 outline subtopics were authored.

## Drift notes

Two dated corrections are recorded in the corpus: upstream overlayfs documentation now also documents fd-based layer specification since kernel 6.13 (doc 01), and the upstream framing of verity=require is per-file fs-verity digest enforcement driven by EROFS metadata rather than mount-time catalog signature checking alone (doc 02).

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); DefAPI decide (typesafe/jev-1.13) 200 on every request.
