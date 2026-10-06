# skills/api-and-interface-design

Knowledge corpus explicating the yubiOS skill `api-and-interface-design` (ground source: `yubi-OS/yubiOS skills/api-and-interface-design/SKILL.md`, 16,052 B). The skill guides stable API and interface design: REST and GraphQL endpoints, module boundaries, type contracts between modules, and the interface-design discipline behind them. This corpus deepens each of the SKILL.md's own sections with external, weight-scored sources.

## Docs

1. [01-hyrums-law-one-version.md](01-hyrums-law-one-version.md) - every observable behavior becomes a de facto contract; the One-Version Rule against diamond dependencies.
2. [02-contract-first.md](02-contract-first.md) - define the interface before implementing it; the contract is the spec.
3. [03-consistent-error-semantics.md](03-consistent-error-semantics.md) - one error strategy everywhere; the APIError shape and the 400/401/403/404/409/422/500 mapping.
4. [04-validate-at-boundaries.md](04-validate-at-boundaries.md) - trust internal code, validate at system edges; third-party responses are untrusted.
5. [05-additive-evolution-naming.md](05-additive-evolution-naming.md) - extend without breaking consumers; predictable naming conventions.
6. [06-idempotency-keys.md](06-idempotency-keys.md) - honouring an Idempotency-Key: atomic claim, payload guard, in-flight duplicates, retention.
7. [07-rest-resource-design.md](07-rest-resource-design.md) - resource-oriented endpoints, pagination, filtering, PATCH partial updates.
8. [08-typescript-type-contracts.md](08-typescript-type-contracts.md) - discriminated unions, input/output separation, branded IDs.
9. [09-rationalizations-red-flags.md](09-rationalizations-red-flags.md) - the rationalization table, red flags, and the 12-item verification checklist.

## Research summary

- Results collected: 160 dig results across 8 web-shaped subtopics (1 internal-record subtopic, no dig).
- Weight split: 50 high (>= 0.5) / 110 low (< 0.5). All 160 weighted; none shipped unweighted.
- jev requests: 15 (1 outline score validation, 14 noul weighting batches of up to 13 questions via DefAPI direct, typesafe/jev-1.13). Usage: 15,970 input / 3,075 output tokens.
- Redo counts: 6 subtopics redone once each (attempt 2 with different queries) where the first dig came back thin or off-topic: hyrums-law-one-version, contract-first, validate-at-boundaries, additive-evolution-naming, rest-resource-design, typescript-type-contracts.
- Skipped docs: none. All 9 subtopics scored load-bearing or marginal-kept in outline validation (no score-0 drops) and all authored.

Per-doc sources (kept = weighted results available to the doc; primary = weight >= 0.5):

| doc | results kept | primary (>= 0.5) |
|---|---|---|
| 01-hyrums-law-one-version | 22 | 4 |
| 02-contract-first | 24 | 5 |
| 03-consistent-error-semantics | 12 | 7 |
| 04-validate-at-boundaries | 24 | 13 |
| 05-additive-evolution-naming | 24 | 4 |
| 06-idempotency-keys | 12 | 4 |
| 07-rest-resource-design | 24 | 8 |
| 08-typescript-type-contracts | 18 | 5 |
| 09-rationalizations-red-flags | 0 (internal-record subtopic, no dig) | 0 |

Primary anchors per doc: hyrumslaw.com (doc 01), weak secondary sources only for doc 02 (grounded on the source doc), RFC 9457 + MDN HTTP (doc 03), OWASP Input Validation Cheat Sheet + zod.dev (doc 04), microsoft/api-guidelines + Cursor API changelog (doc 05), Stripe idempotent-requests + Stripe blog + Google Cloud idempotency (doc 06), RFC 5789 + RFC Editor + IETF (doc 07), typescriptlang.org narrowing + effect.website branded types (doc 08).

## research-db

`research-db/` holds the full typed record: `preflight.json`, `outline.json` (with validation answers), `archive.json` (160 weighted result entries with full decision records), `jev-log.json` (one entry per jev HTTP request with usage tokens), `digs/` (9 per-subtopic dig records with queries_attempted, redo logs, results_kept), and `db.ts` (interfaces matching every shape).

## Gaps / skips

- Skips: none. Every doc was authored.
- Known thin spots recorded honestly in the docs: doc 01's diamond-dependency side and doc 02's external backing are weak-weight only (below 0.5), labeled as such in text and grounded on the source doc.
- The searXNG shared endpoint returned several off-topic result sets on attempt 1 (dictionary/legal pages for "contract", bedding/local-news for "rest"/"patch"); these were redone with different queries per the redo rule and logged in the dig records.

## Preflight

2026-10-06: searXNG campaign preflight healthy (orchestrator); decide endpoint https://api.defapi.org/api/v1/decisions (model typesafe/jev-1.13), agent-side probe skipped per the 2026-10-06 speed optimizations.
