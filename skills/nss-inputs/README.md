# nss-inputs knowledge corpus

Knowledge corpus for the NSS Inputs axis (axis 2/12 of negative-skill-space): what each file needs (env vars, CLI args, config parameters, file inputs, stdin, request bodies/headers/paths, mounts, secrets, runtime-provided values, plus type/presence/default/precedence/validation/failure behavior).

Ground source: `yubi-OS/yubiOS skills/nss-inputs/SKILL.md` (24692 bytes, fetched 2026-10-06). The source doc is the primary source of record; this corpus explicates and deepens it.

## Documents

| NN | doc | scope |
|---|---|---|
| 01 | [seven-channel-input-taxonomy.md](seven-channel-input-taxonomy.md) | The seven fixed input channels (CLI / env / config / file / stdin / request / platform), why channel naming is verbatim, and why implicit inputs cause 'I forgot to set X' failures. |
| 02 | [per-input-record-fields.md](per-input-record-fields.md) | The per-input record: name, channel, type, required, default, constraints, precedence, prerequisites, validation, failure behavior, side effects; required-with-default contradiction and no-silent-defaults rules. |
| 03 | [three-input-stages-and-schema-first.md](three-input-stages-and-schema-first.md) | Raw input vs validated input vs effective configuration, the collect->parse->validate->defaults->cross-field->prerequisites->execute pipeline, and schema-first configuration (Pydantic Settings, Zod, JSON Schema, OpenAPI, Twelve-Factor config). |
| 04 | [containerfile-arg-env-label.md](containerfile-arg-env-label.md) | Containerfile inputs: ARG vs ENV vs LABEL, build-time vs runtime visibility, image-history leakage of build args, BuildKit secret/SSH mounts, yubiOS provenance labels. |
| 05 | [mkosi-setting-mapping.md](mkosi-setting-mapping.md) | mkosi inputs: mkosi.conf vs --flag CLI vs env vars, mkosi.conf.d/*.conf lex-sorted last-wins drop-ins, validation of unknown keys and incompatible combinations. |
| 06 | [systemd-environment-inputs.md](systemd-environment-inputs.md) | systemd unit inputs: Environment= vs EnvironmentFile= (mode 0600, ownership, daemon-reload not SIGHUP), runtime-surface directives (WorkingDirectory, ExecStart, sandboxing) recorded separately from inputs. |
| 07 | [github-actions-workflow-inputs.md](github-actions-workflow-inputs.md) | GitHub Actions inputs: workflow_call vs workflow_dispatch input declarations (description, required, default, type), INPUT_<NAME> env mapping, secrets.* permission gating, precedence of dispatch input over workflow_call default. |
| 08 | [script-argparse-and-secrets.md](script-argparse-and-secrets.md) | Script input surfaces: the yubiOS four-step argparse pattern (CLI flags first, env secondary, config third, secrets last with documented mode), env-in-default trick, secrets-never-echoed doctrine. |
| 09 | [inputs-audit-and-verification.md](inputs-audit-and-verification.md) | Audit protocol: anti-patterns, red flags, the six verification checks for a cycle-9 Inputs patch, placeholder detection, and when the patch counts as a NO verdict. |

## Research summary

- Results collected: 72 (searXNG, 12 queries over 6 web-shaped subtopics; top 6 kept per query, deduped within subtopic)
- Weight split: 27 primary (>= 0.5) / 45 low (< 0.5) of 72
- jev requests: 7 (1 outline score-validation, 6 noul weighting batches of 12) via DefAPI direct (typesafe/jev-1.13-20260917)
- jev usage tokens: input 8491 / output 1603
- Redos: 0 (all 12 dig queries returned 39 to 54 raw results on the first attempt; no dig was thin)
- Skipped docs: 0 of 9; subtopics 01, 02, and 09 are internal-record subtopics with no dig (recorded in outline.json)
- Gaps: none

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator-side); DefAPI typesafe/jev-1.13 200 (agent-side probe skipped for speed per the skills-variant brief).

## research-db

Schema v2: `preflight.json` (PreflightRecord), `outline.json` (OutlineRecord), `archive.json` (DugResult[]), `digs/<NN>-<slug>.json` (DigRecord), `jev-log.json` (JevLogEntry[]), `db.ts` (interfaces).

