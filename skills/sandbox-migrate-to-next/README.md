# sandbox-migrate-to-next knowledge corpus

A knowledge corpus explicating the yubiOS skill `skills/sandbox-migrate-to-next/SKILL.md` (ground source): porting a Cloudflare Sandbox app from stable `@cloudflare/sandbox` to `@cloudflare/sandbox@next` (Sandbox SDK 1.0 preview) - API deltas, migration steps, pitfalls.

The source doc is the primary source of record; these docs explicate and deepen it with web-researched evidence for the external mechanisms it names. Every claim carries its source URL and the jev weight that backed it (weights below 0.5 are labeled weak). Claims from the source doc are attributed to it explicitly.

## Docs

- `01-scope-and-triggers.md` - When to use the migration skill vs sibling skills (sandbox-stable for day-to-day stable work, sandbox-next for new @next apps), the 2026 deprecation guide as optional prerequisite, the 'migrate when you can, do not force production cutover' stance, and the human guide links (Migrate page, 1.0 preview page).
- `02-migration-workflow.md` - The skill's 5-step workflow (review hard rules, audit the codebase, clarify with the user, upgrade package/image/code, validate), the stop-after-user-decision points, and the rule to prefer installed @next types and the migrate doc over memory.
- `03-hard-rules.md` - The migration's hard invariants
- `04-replacement-map.md` - Row-by-row stable to @next API deltas from the replacement map
- `05-audit-call-sites.md` - The audit step
- `06-clarify-user-decisions.md` - The clarify step's four user questions
- `07-upgrade-package-image-code.md` - Upgrade mechanics
- `08-deploy-cutover.md` - Deploy cutover
- `09-validation-red-flags.md` - The 8-point validation checklist (lockfile and Dockerfile on same @next line, typecheck against @next, smoke argv exec plus output utf8, smoke long process/terminal/interpreter, distinguish error classes

## Research summary

- Results collected: 108
- Weight split: 77 high (>= 0.5) / 31 low (< 0.5) of 108
- Jev requests: 9 (usage: 11393 input / 2223 output tokens), via typesafe/jev-1.13 on DefAPI direct
- Redo counts: 0 (no dig needed a redo; no decision request failed)
- Skipped docs: none (all 9 subtopics authored)

## Preflight

2026-10-06: searXNG campaign preflight healthy (orchestrator); /api/decide replaced by DefAPI direct (typesafe/jev-1.13) per the 2026-10-06 speed optimizations. Agent-side probe skipped for speed.
