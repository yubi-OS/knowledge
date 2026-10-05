# RK3588 DDR/TPL source (knowledge corpus)

Corpus REF: `rk3588-ddr-tpl-source`. Minted 2026-10-05 from the yubiOS research note `refs/rk3588-ddr-tpl-source-2026-07-29.md`, supporting OMN-56 ("Select and pin a redistributable RK3588 DDR/TPL source") and the B-RK3588-TPL blocker.

## Topic

RK3588 DDR/TPL binary redistribution: licensing, blob provenance, pinnable and redistributable paths, and the B-RK3588-TPL blocker

## Docs

| NN | slug | scope |
|---|---|---|
| 1 | 01-tpl-ddr-boot-role | What the RK3588 TPL/DDR blob is, its role in the boot chain, and why it is not U-Boot code. |
| 2 | 02-rkbin-source-landscape | The rkbin repository as the single upstream source: layout, blob variants, forks and mirrors, licensing picture. |
| 3 | 03-open-boot-chain-status | Which RK3588 boot-chain stages are open (BL31 TF-A, BL32 OP-TEE, BL33 U-Boot) and which remain closed (TPL/DDR). |
| 4 | 04-community-packaging | Community build environments that package RK3588 firmware from rkbin: Radxa, Docker toolchains, Nix flakes, edk2, distro-level. |
| 5 | 05-distribution-options | The five candidate acquisition and distribution models for the blob and what the evidence says about each. |
| 6 | 06-pinning-supply-chain | Supply-chain pinning of build-time-fetched binaries: sha256 pinning, fail-closed builds, SLSA provenance discipline. |
| 7 | 07-open-ddr-init-efforts | Open-source DDR init efforts for Rockchip SoCs: community progress, feasibility, and the timeline outlook. |
| 8 | 08-om-n56-recommendation | The OMN-56 recommendation: build-time pull with fail-closed sha256 pinning, the user-fetch alternative, and open items. |

## Research summary

- Results collected and weighted: 126
- Weight split: 48 results at weight >= 0.5 (primary/official backing), 78 below 0.5 (weak backing, labeled in text)
- Jev requests: 27 (outline validation: 1, weighting: 26), usage input_tokens 20636 / output_tokens 0
- Redos: doc 06 (pinning-supply-chain) required 2 dig redos; attempt 1 and 2 digs were thin, attempt 3 (SLSA/reproducible-builds queries) returned 6 authoritative results
- Skipped docs: none (all 8 outline subtopics passed validation with score > 0 and were authored)

## Sources of record

Primary anchors: the Collabora RK3588 boot-chain blog and upstream-status post, the rockchip-linux/rkbin repository, the Radxa ROCK 5 build guides, the edk2-rk3588 project, slsa.dev, and reproducible-builds.org. Full per-result weights live in `research-db/archive.json`; per-dig attempts live in `research-db/digs/`.

## Licensing caveat carried forward

The exact rkbin repository license text was not verifiable in this dig and is recorded as an open item in docs 02 and 08.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
