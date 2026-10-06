# docker-buildx-rootless knowledge corpus

A corpus explicating the yubiOS skill `docker-buildx-rootless` (ground source: yubi-OS/yubiOS skills/docker-buildx-rootless/SKILL.md). The skill covers dockerd rootless mode, the docker buildx CLI (drivers, builders, multi-platform, cache, attestations, bake), and Docker Build Policies. This corpus deepens each part with web-sourced, jev-weighted material.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-rootless-mode-architecture.md | How rootless mode works: user namespaces, subuid/subgid mapping via newuidmap/newgidmap, userns-remap difference |
| 02 | 02-rootless-daemon-install.md | Install paths, systemd user unit, linger, socket location, docker context use rootless |
| 03 | 03-rootless-limitations.md | Documented rootless limits: cgroup v1 devices, AppArmor/SELinux, slirp4netns networking, overlay2 kernel floor |
| 04 | 04-buildx-driver-types.md | The four builder drivers and which capabilities each unlocks |
| 05 | 05-builder-lifecycle.md | buildx create/inspect/ls/use/rm and the yubiOS-standard builder |
| 06 | 06-multi-platform-builds.md | amd64 plus arm64 builds, QEMU registration, the ADR-017 multi-arch invocation |
| 07 | 07-buildx-cache-management.md | Cache backends: inline, registry mode=max, GitHub Actions gha |
| 08 | 08-sbom-provenance-attestations.md | SBOM and SLSA provenance attestations, driver requirement, imagetools inspect verification |
| 09 | 09-bake-multi-target.md | docker-bake.hcl structure, inherits, --set overrides, --print dry run |

## Research summary

- Results collected and weighted: 103 (33 high weight >= 0.5, 70 low weight < 0.5)
- jev requests: 7 (1 outline validation score request, 6 noul weighting batches), usage 8344 input / 1330 output tokens
- Weighting endpoint: DefAPI direct (https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13-20260917); zero 429s, no fallback needed
- Digs: 26 searXNG queries (2 per subtopic; 4 subtopics redone with 2 fresh queries each after thin or polluted first digs)
- Redos: 4 (docs 03, 04, 05, 06; each logged in research-db/digs/)
- Skipped docs: none; all 9 kept subtopics authored
- Dropped at outline validation: subtopic 10 (build-policies-opa-rego) scored 0.1 and was dropped per the score metric. Build Policies are covered by the dedicated docker-build-policy skill and its own corpus; this is a deliberate boundary, not a coverage gap in the source doc.

Preflight 2026-10-06: campaign preflight healthy (orchestrator); agent-side probe skipped for speed per mint protocol. Digs healthy in-session: 26 queries returned 31 to 68 results each.

## Provenance

- Ground source fetched 2026-10-06, 17,255 bytes: https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/docker-buildx-rootless/SKILL.md
- Every factual claim in the docs carries its source URL and jev weight; source-doc claims are attributed to the source doc explicitly. Claims backed only by weight < 0.5 results are labeled weak in the text.
- Research database: research-db/ (preflight.json, outline.json, archive.json, digs/, jev-log.json, db.ts)
