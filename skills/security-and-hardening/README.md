# security-and-hardening knowledge corpus

Knowledge corpus minted from the yubiOS skill `skills/security-and-hardening/SKILL.md` (ground source, yubi-OS/yubiOS). Topic: hardening code against vulnerabilities: untrusted input handling, authentication, data storage, external integrations, session management, dependency vulnerability triage, supply-chain risk, and GDPR/CCPA privacy compliance.

The corpus explicates the skill: what it does, how to use it, its primitives and patterns, and the domain knowledge it encodes. The SKILL.md itself remains the primary source of record; every doc cites it as the grounding spine and adds searXNG-dug external sources weighted by the jev decision model.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | [01-threat-model-first.md](01-threat-model-first.md) | Trust boundaries, assets, STRIDE per boundary, abuse cases next to use cases, OWASP A04 Insecure Design. |
| 02 | [02-three-tier-boundary-system.md](02-three-tier-boundary-system.md) | Always Do (no exceptions), Ask First (human approval), Never Do; internal-record from the source doc, no dig. |
| 03 | [03-owasp-prevention-patterns.md](03-owasp-prevention-patterns.md) | Injection, broken authentication, XSS, broken access control, security misconfiguration, sensitive data exposure. |
| 04 | [04-ssrf-prevention.md](04-ssrf-prevention.md) | SSRF: scheme, host, and resolved-IP allowlisting, redirect handling, and the DNS-rebinding TOCTOU gap. |
| 05 | [05-input-validation-and-uploads.md](05-input-validation-and-uploads.md) | zod schema validation at boundaries, structured 422 errors, file upload type/size/magic-byte controls. |
| 06 | [06-destructive-path-safety.md](06-destructive-path-safety.md) | Destructive operations on derived paths: allowlisted root after symlink resolution, minimum depth, ownership evidence, TOCTOU limits. |
| 07 | [07-dependency-audit-and-supply-chain.md](07-dependency-audit-and-supply-chain.md) | npm audit triage by severity and reachability, plus supply-chain hygiene: lockfile, npm ci, typosquats, install scripts, signatures, provenance. |
| 08 | [08-rate-limiting-and-secrets.md](08-rate-limiting-and-secrets.md) | Rate limiting with shared stores behind multiple instances and serverless, plus secrets management and rotate-before-purge. |
| 09 | [09-data-privacy-compliance.md](09-data-privacy-compliance.md) | Data classification, minimization, retention with working deletion paths, data-subject rights, consent, localized defaults. |
| 10 | [10-llm-feature-security.md](10-llm-feature-security.md) | OWASP Top 10 for LLM Applications: untrusted output, prompt injection, secrets in prompts, excessive agency, unbounded consumption, vector-store isolation. |

## Research summary

- Results collected: 162 (108 from the first dig round, 54 from 1 redo round across 3 subtopics).
- Weight split: 65 high (>= 0.5) / 97 low (< 0.5), all 162 weighted.
- jev requests: 15 (1 outline score validation, 9 first-round noul batches, 5 redo-round noul batches) via DefAPI direct, model typesafe/jev-1.13. Usage: 17346 input tokens, 3612 output tokens.
- Redos: 3 (docs 07, 08, 09; the first dig round returned mostly aggregator sources for those subtopics, so the digs were redone with different queries and landed primary sources: npm Docs, GitHub Docs, OWASP cheat sheets, ICO, EUR-Lex, CA AG).
- Skipped docs: none. Docs kept: 10 of 10 outlined (1 subtopic, the three-tier boundary system, is an internal-record subtopic with no dig by design).
- Every factual claim in the docs carries its source URL and jev weight; claims from the source doc are attributed to it explicitly. Weakly backed corroboration (weight < 0.5) is labeled in each doc's Provenance section.

Preflight 2026-10-06: searXNG healthy (campaign preflight, orchestrator-run); decide 200 via DefAPI direct, model typesafe/jev-1.13 (campaign preflight orchestrator-side; agent-side probe skipped for speed per skills variant).

## Research DB

Full provenance lives in `research-db/` (schema v2):

- `preflight.json`: campaign preflight record.
- `outline.json`: the 10-subtopic decomposition and jev score validation (all kept, none dropped).
- `archive.json`: all 162 collected results with query, snippet, collected_at, and full noul decision records (weights all non-null).
- `digs/`: one record per subtopic with queries attempted, raw vs kept counts, redo log, and results kept.
- `jev-log.json`: one entry per jev HTTP request with usage tokens.
- `db.ts`: TypeScript interfaces for every shape above.
