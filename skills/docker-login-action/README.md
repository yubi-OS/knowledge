# docker-login-action knowledge corpus

Explication of the yubiOS skill `skills/docker-login-action/SKILL.md` (yubi-OS/yubiOS): authenticating to a container registry (Docker Hub, GHCR, quay.io, dhi.io) using docker/login-action in GitHub Actions. The source doc is the primary source of record; each doc below deepens one of its sections with web-dig sources carrying jev weights.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-when-to-use-placement.md](01-when-to-use-placement.md) | When a job needs the login step, its placement, and the ordering rule before any push step |
| 02 | [02-action-reference-inputs.md](02-action-reference-inputs.md) | The login-action step shape, its registry/username/password inputs, the upstream scope input and v3 to v4 drift |
| 03 | [03-supported-registries.md](03-supported-registries.md) | Docker Hub, GHCR, quay.io, dhi.io, and the any-OCI fallback with each registry's credential source |
| 04 | [04-ghcr-auth-pattern.md](04-ghcr-auth-pattern.md) | GITHUB_TOKEN auth for ghcr.io, the packages: write permission block, and cross-org limits |
| 05 | [05-quay-dhi-patterns.md](05-quay-dhi-patterns.md) | quay.io robot accounts and dhi.io credentials, the multi-registry yubiOS pattern, and the OIDC alternative |
| 06 | [06-secrets-and-credential-handling.md](06-secrets-and-credential-handling.md) | The four credential sources, masking, build-time secret mounts, rotation posture |
| 09 | [09-examples-and-guidelines.md](09-examples-and-guidelines.md) | Worked setup, in-repo touchpoints, boundary routing, guidelines, and the corpus-audit annotations (internal-record subtopic, no dig) |

## Research summary

- Results collected: 120 (72 from attempt 1 across 6 web-shaped subtopics, 48 from redo queries for 4 subtopics whose attempt 1 returned off-topic results)
- Weight split: 66 results at weight >= 0.5, 54 at weight < 0.5, of 120 weighted
- Jev requests: 27 (1 outline score validation with 9 questions, 26 noul weighting batches of 12), usage 23061 input tokens / 4779 output tokens (6 early weighting batches' usage lost to a sandbox reset and recorded with null usage in jev-log.json)
- Redos: 4 (subtopics 01, 03, 05, 06 re-dug with different queries after attempt 1 returned generic vendor pages)
- Skipped docs: 0. Two outline subtopics were dropped at validation: supply-chain-trust-chain-role (score 0.36, majority drop probability) and continuous-adaptive-primitive-coverage (score 0.04); the source doc's own trust-chain and primitive annotations are preserved in doc 09 instead.
- Outline scores kept: 01 (1.72), 02 (1.95), 03 (1.92), 04 (1.73), 05 (0.52, kept because its dig came back strong), 06 (1.97), 09 (1.72)

## Preflight

2026-10-06: campaign preflight healthy (orchestrator): searXNG https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng, decide typesafe/jev-1.13; agent-side probe skipped for speed (per mint brief optimization 3).

## Research-db

Under `research-db/`: `preflight.json`, `outline.json`, `archive.json` (120 entries, every entry weighted), `digs/` (6 per-subtopic records), `jev-log.json` (27 requests), `db.ts` (interfaces for all shapes).
