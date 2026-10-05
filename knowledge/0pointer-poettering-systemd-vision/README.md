# 0pointer / Poettering / Amutable systemd Vision Knowledge Corpus

Knowledge corpus minted from the yubi-OS/yubiOS refs/ doc `refs/0pointer-poettering-systemd-vision-2026-07-23.md`. Topic: Lennart Poettering's 0pointer.net systemd architecture vision, the Amutable company, and their relevance to image-based immutable Linux systems.

## Documents

| File | Scope |
|---|---|
| 01-amutable-company.md | Amutable founding (2026-01), leadership (Kuhl CEO, Brauner CTO, Poettering Chief Engineer), Berlin base, mission, and public engineering footprint |
| 02-fitting-everything-together.md | The 11 design goals of the 2022 essay and the boot flow they imply |
| 03-uki-boot-chain.md | Unified Kernel Images, systemd-boot version sorting, usrhash, and measured boot |
| 04-repart-factory-reset.md | systemd-repart declarative partitioning, first-boot adaptation, factory reset, no-installer goal |
| 05-sysext-portable-modularity.md | sysext and confext extension layers, portable services with RootImage, the app-layer gap |
| 06-mkosi-image-builder.md | mkosi image generation, repart integration, configuration and workflow |
| 07-sysupdate-ab-upgrades.md | systemd-sysupdate A/B atomic updates and the provisioning pipeline |
| 08-version-history-v256-v261.md | systemd feature arc v256 (2024-06) through v261 (2026-06) |
| 09-verity-attestation.md | dm-verity, measured boot into PCRs, remote attestation patterns |
| 10-luks2-tpm2-fido2.md | LUKS2 encryption, cryptenroll, TPM2 and FIDO2 sealing, local key generation |

## Research summary

- Results collected: 126 (120 from the initial 20-query dig, 6 from the mkosi redo)
- Weight split (high = jev noul >= 0.5): 74 high / 52 low
- Jev request count: 27 total (1 outline validation over 10 subtopics, 24 weighting batches of 5, 2 redo-weighting batches). Model: clef via https://steady-orbit.systems-a.workers.dev/api/decide
- Outline validation: all 10 subtopics passed (lowest noul 0.5181 for version-history-v256-v261, highest 0.8657 for sysupdate-ab-upgrades); 0 dropped
- Redos performed: 1 (mkosi-image-builder, to recover the primary 0pointer mkosi re-introduction post, which the initial queries missed)
- Skipped docs: none
- Gaps: David Strauss's CPO role at Amutable is asserted in the parent source material but did not appear in any collected result, so doc 01 records it as unverified rather than fact; no independent funding or headcount reporting surfaced
- Every factual claim in the documents carries its source URL and the jev weight that backed it; claims with no collected source were deleted or explicitly marked unverified

## Method

Seeds came from decomposing the source refs/ doc by the domain's own joints (company, design essay, boot chain, partitioning, modularity, image building, updates, release history, integrity, encryption). Each subtopic was validated by the jev decision model, dug with 2 searXNG queries keeping the top 6 results each, and every result was weighted by jev before authoring. Primary sources (0pointer.net, systemd.io, freedesktop.org, github.com/systemd) scored highest; forum and marketing pages were kept in the archive but cited only with their low weight noted.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200.
