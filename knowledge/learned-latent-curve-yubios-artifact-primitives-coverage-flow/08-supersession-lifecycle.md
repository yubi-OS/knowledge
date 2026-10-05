# 08. Supersession and Lifecycle of the Flow Document

**Scope:** The documentation lifecycle practice around the learned-latent-curve yubiOS work: the consolidated flow doc superseding v1 through v3, v4 retained as a negative finding, and the versioned artifacts the pipeline keeps.

## What supersedes what

The consolidated flow doc (dated 2026-08-04) explicitly supersedes v1, v2, and v3, which are deleted on merge of its PR. v4 is deliberately kept as a separate NEGATIVE-finding artifact rather than deleted, because its result (MiniLM is the wrong target space) is evidence, not history ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source, not jev-weighted).

The publication history matters for understanding the supersession: v2, v3, and v4 were each published as their own artifacts at the time as separate commits to main, while v1 was a local-only MVP fit that never reached refs/ ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). The consolidated document then replaced the three published originals in one PR.

## Lifecycle conventions this follows

This is the ADR-style supersession pattern: a decision record carries a status, and a newer record supersedes an older one rather than silently editing it. ADR guidance describes records as dated, immutable decision points with status transitions (https://backstage.io/docs/architecture-decisions/, jev weight 0.872; https://mitlibraries.github.io/guides/misc/adr.html, jev weight 0.552). Superseded material is removed from the live corpus but its replacement carries the reasoning chain.

The changelog discipline is the Keep a Changelog convention: changes are recorded as Added, Changed, Deprecated, and Removed entries so a reader can see what happened to the corpus over time (https://keepachangelog.com/en/1.0.0/, jev weight 0.850). API-evolution governance makes the same distinction between replacing an old version and keeping its replacement trail auditable (https://graphql.org/learn/governance-versioning/, jev weight 0.829).

## The versioned t-pipeline and fit caches

The learned-latent-curve skill's lifecycle section prescribes versioning the t-pipeline itself. In the yubiOS flow, the v3 t-pipeline artifacts are: the manual coverage overrides, the .gitkeep filtering decision, and the PC1+PC2 projection of the 9-D coverage; the canonical fit and warm-start bundle persist in session/llc-v3-fit-cache.pkl ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source). The full cache set across versions: llc-v2-fit-cache.pkl, llc-v3-fit-cache.pkl, llc-v4-fit-cache.pkl, plus llc-v4-embeddings.pkl (211 x 384).

The skill itself was updated to record the v3 wins in an Empirical Validation section, in commit d04d3c564c9948a949ef5454287711cf8d42c202 and b9a0e85ef7304f9ff7dfaa525cda75b9a7466190 across the yubi-OS/yubiOS and yubi-OS/agent-skills repos ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source).

## Why keep the negative artifact

The v4 negative finding earns its separate file because it does independent work: it empirically confirms the skill's target-space heuristic (low-rank structured targets fit the curve, dense semantic embeddings do not), and it draws the tool boundary for future work (semantic search belongs to UMAP, t-SNE, or cosine retrieval). A corpus that deleted v4 on consolidation would lose its only empirical test of the wrong-target failure mode ([flow doc](https://github.com/yubi-OS/yubiOS/blob/main/refs/learned-latent-curve-yubios-artifact-primitives-coverage-flow-2026-08-04.md), internal primary source).

## Weak-source notes

Low-weight dig results here back no load-bearing claim: a lifecycle blog (jev weight 0.148), a template post (jev weight 0.235), and a Google Keep hit triggered by query tokens (jev weight 0.044).
