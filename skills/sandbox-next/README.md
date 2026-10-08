# sandbox-next knowledge corpus

Knowledge corpus for building or changing Cloudflare Sandbox apps on `@cloudflare/sandbox@next` (Sandbox SDK 1.0 preview): code execution, AI runners, interpreters, CI-like jobs, terminals, files, mounts, tunnels, preview URLs, lifecycle, and errors. Ground source: yubi-OS/yubiOS `skills/sandbox-next/SKILL.md`. The SKILL.md is the primary source of record; this corpus explicates and deepens it.

## Docs

| NN | slug | scope |
| -- | ---- | ----- |
| 01 | package-line-gate | Confirming the @next package line: npm dependency and image alignment, routing to sibling skills, bridge status. |
| 02 | exec-contract | sandbox.exec(argv) contract and process handles: output, logs, waitForExit, waitForPort, waitForLog, kill; no implicit shell; per-launch independence. |
| 03 | lifecycle | Sandbox ID vs container, running and sleeping and destroyed states, container-local handles, storing full jobs. |
| 04 | environment | cwd, env per launch, setEnvVars, non-secret config only, outbound handlers keeping credentials in the Worker. |
| 05 | terminals | Interactive PTY via createTerminal plus connect, no stdin on process handles, terminals as container-local. |
| 06 | interpreter | Python and JS code interpreter: withInterpreter attach, runCode serializable data, AI code-executor patterns. |
| 07 | shared-surfaces | Files, mounts, ports, tunnels, backups, proxyToSandbox, preview URLs, exposing services. |
| 08 | errors | Typed error classes, retry versus relaunch decisions, symptom-to-fix map, known sharp edges. |
| 09 | ship-checklist | Lockfile and Dockerfile alignment, typecheck, secrets rule, wildcard DNS for preview hostnames, production wiring. |
| 10 | skill-boundaries | Routing to sandbox-stable and sandbox-migrate-to-next, boundary cases, in-repo touchpoints. Internal-record subtopic, no dig. |

## Research summary

- Results collected: 96 unique results (16 searXNG queries, 2 per web-shaped subtopic, top 6 per query, deduplicated by URL).
- Weight split: 53 results at jev weight >= 0.5 (primary or official), 43 results below 0.5 (labeled weak where cited in docs).
- Jev: 9 requests total (1 outline score validation with 10 questions, 8 noul weighting batches of 12) via https://api.defapi.org/api/v1/decisions, model typesafe/jev-1.13.
- Redos: 0. All digs returned healthy result sets on the first attempt.
- Skipped docs: none. All 10 subtopics kept (outline scores 1.09 to 1.76 on the 0 to 2 load-bearing scale, none scored 0).

Preflight 2026-10-06: searXNG healthy (campaign preflight run orchestrator-side; agent-side probe skipped for speed per the skills-variant brief); decide via https://api.defapi.org/api/v1/decisions model typesafe/jev-1.13 (campaign preflight run orchestrator-side).

## Layout

- `01-package-line-gate.md` through `10-skill-boundaries.md`: corpus docs, numbered in outline order.
- `research-db/`: preflight.json, outline.json, archive.json, digs/*.json, jev-log.json, db.ts.
