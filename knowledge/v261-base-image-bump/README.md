# v261-base-image-bump

Knowledge corpus minted 2026-10-05 from yubi-OS/yubiOS refs/v261-base-image-bump-2026-07-23.md.

Topic: the Fedora bootc v261 base image bump, what changed upstream, how the bump was verified against the build policy, and what the cross-check against the base-images status established.

## Docs

- `01-fedora-bootc-tag-landscape.md` - The published quay.io/fedora/fedora-bootc tag set (43, 44, 45, 46, rawhide), what each tag carries, and how the tag set evolves across releases.
- `02-digest-pinning-discipline.md` - Why a multi-arch index digest pinned in one authoritative file (PINNED.md) is the source of truth, and why Containerfile must not copy a digest from an ADR or old PR note.
- `03-digest-refresh-workflow.md` - The fetch-fedora-bootc-manifest.yml workflow pattern used to re-resolve and refresh the pinned digest, and how refresh cadence interacts with pin staleness.
- `04-bump-verification-gate.md` - The two-command bump gate: docker buildx imagetools inspect on the new digest, then docker run with systemd --version as a functional smoke check.
- `05-systemd-v261-features.md` - What systemd v261 shipped that the bump unblocked: ConditionSecurity=measured-os, systemd-tpm2-swtpm.service, and RestrictFileSystemAccess= for dm-verity-backed execution.
- `06-restrictfilesystems-vs-access.md` - The consistency trap: RestrictFileSystems= (older BPF-LSM filesystem-type control, used in the shipped yubiOS enrollment unit) versus RestrictFileSystemAccess= (v261 signed-filesystem control).
- `07-base-images-cross-check.md` - The cross-check against the fedora bootc base-images status: which Fedora streams the repo tracks, and the bootc package version lag (rawhide at 1.16.3 while upstream shipped 1.16.4).
- `08-pin-drift-and-staleness.md` - Digest drift after a bump: the 2026-09-18 stale-pin finding, the 2026-09-29 quay tag refresh, the :46 tag appearing upstream, and who owns re-resolution.

## Research summary

- Results collected: 186
- Weight split: 96 results at noul >= 0.5 (authoritative backing), 90 results at noul < 0.5 (weak backing, labeled in text)
- Jev requests: 40 (1 preflight probe, 1 outline validation, 38 weighting batches); usage 31135 input / 0 output tokens
- Redo counts: 16 dig queries attempted across 8 docs, 0 dig redos; 4 jev weighting batches hit 429 rate limiting and were re-sent after 30s sleeps (6 rejected sends total) per the redo rule
- Skipped docs: none; all 8 outline subtopics scored above 0 on the jev score metric (lowest 0.91 for 06-restrictfilesystems-vs-access, kept because the dig came back strong) and were authored
- Sources considered but not cited: searXNG results below noul 0.5 are recorded in archive.json with their weights and labeled weak in the docs

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200

## Metrics

score (outline) / noul (weighting) via clef on /api/decide

## Files

- `research-db/preflight.json` - preflight probe record
- `research-db/outline.json` - outline and jev score validation
- `research-db/archive.json` - every collected result with its weight and decision record
- `research-db/digs/<NN>-<slug>.json` - per-doc dig record
- `research-db/jev-log.json` - one entry per jev HTTP request
- `research-db/db.ts` - TypeScript interfaces for all shapes above
