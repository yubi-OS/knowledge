# 02. Results by section

**Scope:** Results by section: detailed analysis grounded in yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md.

> Ground source: yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md. External dig: dig_context_02.json (10 Clef-weighted searXNG results).

## The module table

The audit grouped routes by the bundle module that serves them. The table below is reproduced from `yubi-OS/yubiOS refs/endpoint-live-audit-harness-plan-2026-10-08.md`.

| Module | Routes | Harness Yes | Partial | No | Live result |
|---|---|---|---|---|---|
| solar-rbs-entry.mjs (site) | 16 | 0 | 0 | 16 | All 200 except /contact (404, F1) |
| index.js (core API) | 36 | 5 | 3 | 28 | Functional; searxng 500 on missing qs (F4) |
| routes-jev.js (orchestrator) | 21 | 0 | 0 | 21 | Gate clean; tasks 500 on validation (F3) |
| routes-automations.js | 7 | 0 | 0 | 7 | Shape-validation clean; no live selftest |
| jev-evolution.js (v1) | 6 | 0 | 0 | 6 | All 200 |
| jev-evolution2-routes.js (v2) | 5 | 0 | 0 | 5 | Cycles/atoms empty pre-run; persist OK after manual run (F5) |
| jev-corpus-routes.js | 20 | 4 | 14 | 2 | All functional; corpus/health 401 vs doc (F2) |
| jev-spectral.js | 3 | 3 | 0 | 0 | selftest PASS |
| jev-lens.js | 2 | 2 | 0 | 0 | selftest PASS |
| jev-router.js | 4 | 0 | 1 | 3 | selftest PASS (24/24) |
| jev-timeseries.js | 3 | 1 | 1 | 1 | selftest G1-G6 plus WAE probe PASS |

Across the 127 classified rows: **15 Yes, 19 Partial, 93 No**, with 2 non-classified rows. All 6 selftests are green, all sampled bearer routes 401 cleanly without the key, and all destructive verbs fail closed (the outcomes ledger returns 405 on DELETE, PUT, and PATCH).

## Reading the table

**Coverage is concentrated in the math modules.** Spectral and lens are fully harnessed (5 of 5 routes Yes). Corpus routes are mostly Partial (14 of 20). The modules that act on the world (orchestrator, automations, evolution) have zero harness coverage across 39 routes combined. That is the inversion the improvement plan targets: the routes most likely to cause real effects are the least protected against silent regression.

**Live health and harness coverage are independent.** routes-jev.js is "gate clean" live, yet 0 of 21 routes are harnessed. jev-evolution.js returns 200 everywhere and is also 0 of 6. Passing today does not imply detection tomorrow.

## The validation-error pattern (F3, F4)

Two of the module rows carry a 500 where a 4xx belongs. In routes-jev.js, POST /api/jev/tasks with a missing field returns 500 "uncaught" with a stack trace. In index.js, GET /api/searxng without params passes through the n8n relay's 500.

The status-code distinction is standard HTTP practice, though every dig source here is weak backing. A comparison page contrasts 422 Unprocessable Content with 500 Internal Server Error and when to use each, per [HTTP 422 Unprocessable Content vs 500 Internal Server Error](https://statuscodefyi.com/compare/http/422-unprocessable-content-vs-500-internal-server-error/) (clef weight: 0.1316) (weak backing, clef weight < 0.5). A Stack Overflow thread distinguishes 400 for malformed syntax from 422 for semantically invalid content, per [rest - 400 vs 422 response to POST of data - Stack Overflow](https://stackoverflow.com/questions/16133923/400-vs-422-response-to-post-of-data) (clef weight: 0.0812) (weak backing, clef weight < 0.5). A GitHub issue on one framework argues the reverse case, that a server-side response-validation failure should be 500 rather than 422, per [Response validation errors should return a 500 rather than a 422 - GitHub](https://github.com/elysiajs/elysia/issues/1480) (clef weight: 0.0667) (weak backing, clef weight < 0.5). That is consistent with the audit's rule: client input errors are 4xx, server faults are 500. A post on CORS notes that error responses missing CORS headers get blocked by browsers, per [How to Handle CORS Errors When Browsers Block Server Error Responses ...](https://www.xjavascript.com/blog/how-to-handle-running-into-cors-error-codes/) (clef weight: 0.1087) (weak backing, clef weight < 0.5), a reminder that error-path responses are part of the contract. Background references on HTTP and information security came back as well, per [HTTP - Wikipedia](https://en.wikipedia.org/wiki/HTTP) (clef weight: 0.0976) (weak backing, clef weight < 0.5) and [Information security](https://en.wikipedia.org/wiki/Information_security) (clef weight: 0.0829) (weak backing, clef weight < 0.5).

The audit's own position is unambiguous: a plain validation error must return 422 with the field error, and stack traces should not ride API responses. Exposing a stack trace in a response body leaks internal structure, which is an information-security concern independent of the status code.

## The harness gap and in-memory drivers

The improvement plan proposes selftests that replay seeded fixtures "in a sandboxed driver" with zero external effects. The seed query probed in-memory test drivers and SQL parity. The weak-backing results are relevant as cautions. Microsoft's EF Core guidance strongly discourages its in-memory provider and suggests SQLite or a repository pattern instead, per [Testing without your Production Database System - EF Core](https://learn.microsoft.com/en-us/ef/core/testing/testing-without-the-database) (clef weight: 0.2113) (weak backing, clef weight < 0.5). A blog post compares in-memory and SQLite in-memory modes and warns that the wrong choice gives misleading results, per [Testing with EF Core in C#: In-Memory vs SQLite for Unit Tests](https://www.devleader.ca/2026/06/24/testing-with-ef-core-in-c-inmemory-vs-sqlite-for-unit-tests) (clef weight: 0.1089) (weak backing, clef weight < 0.5). A small library aims to make SQLite in-memory test databases easier to set up, per [GitHub - Owen-Krueger/SqliteMemoryDatabaseProvider: For creating in ...](https://github.com/Owen-Krueger/SqliteMemoryDatabaseProvider) (clef weight: 0.1934) (weak backing, clef weight < 0.5).

The lesson for the jev selftests is parity: a sandboxed driver must preserve the semantics of the real store (D1 is SQLite-based), or a passing selftest proves less than it appears to. One result, Instagram, is off-topic noise, per [Instagram](https://www.instagram.com/?hl=en-in) (clef weight: 0.0262) (weak backing, clef weight < 0.5).

## Section-level verdicts

| Group | Verdict |
|---|---|
| Site pages | Healthy, one stale doc row (F1) |
| Core API | Functional, one relay 500 (F4) |
| Orchestrator | Gate clean, one defect (F3), no harness |
| Automations | Clean contract, no harness, no live selftest |
| Evolution v1/v2 | Healthy reads, cron leg open (F5), no harness |
| Corpus | Functional, Partial harness, one auth doc row (F2) |
| Spectral, lens, router, timeseries | Selftests pass |

## Sources Considered

| # | Title | URL | Clef weight | Backing |
|---|---|---|---|---|
| 1 | GitHub - Owen-Krueger/SqliteMemoryDatabaseProvider: For creating in ... | https://github.com/Owen-Krueger/SqliteMemoryDatabaseProvider | 0.1934 | weak (< 0.5) |
| 2 | Testing without your Production Database System - EF Core | https://learn.microsoft.com/en-us/ef/core/testing/testing-without-the-database | 0.2113 | weak (< 0.5) |
| 3 | Testing with EF Core in C#: In-Memory vs SQLite for Unit Tests | https://www.devleader.ca/2026/06/24/testing-with-ef-core-in-c-inmemory-vs-sqlite-for-unit-tests | 0.1089 | weak (< 0.5) |
| 4 | Information security | https://en.wikipedia.org/wiki/Information_security | 0.0829 | weak (< 0.5) |
| 5 | Instagram | https://www.instagram.com/?hl=en-in | 0.0262 | weak (< 0.5) |
| 6 | HTTP 422 Unprocessable Content vs 500 Internal Server Error | https://statuscodefyi.com/compare/http/422-unprocessable-content-vs-500-internal-server-error/ | 0.1316 | weak (< 0.5) |
| 7 | Response validation errors should return a 500 rather than a 422 - GitHub | https://github.com/elysiajs/elysia/issues/1480 | 0.0667 | weak (< 0.5) |
| 8 | rest - 400 vs 422 response to POST of data - Stack Overflow | https://stackoverflow.com/questions/16133923/400-vs-422-response-to-post-of-data | 0.0812 | weak (< 0.5) |
| 9 | How to Handle CORS Errors When Browsers Block Server Error Responses ... | https://www.xjavascript.com/blog/how-to-handle-running-into-cors-error-codes/ | 0.1087 | weak (< 0.5) |
| 10 | HTTP - Wikipedia | https://en.wikipedia.org/wiki/HTTP | 0.0976 | weak (< 0.5) |
