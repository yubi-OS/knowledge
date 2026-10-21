# 03. Deploy chain and live bugs caught

**Scope:** Deploy chain + live bugs caught (etag 7f8fa641 → dda2f487 → f0c6d7c7 → f2313fa6): detailed analysis grounded in yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/jev-timeseries-2026-10-08.md, no external web dig

## The etag chain

The deploy went through four worker etags before it settled: `7f8fa641`, then `dda2f487`, then `f0c6d7c7`, and finally `f2313fa6`. Each hop corresponds to a defect that only surfaced against the live Cloudflare runtime, not in the sandbox or the repo test suite. The ground-source doc records four such bugs. Each is explained below with its symptom, its cause, and the rule it leaves behind.

## Bug 1: CF 10021, "Could not read content for part 'metadata'"

**Symptom.** The multipart worker upload failed with Cloudflare error 10021, complaining that it could not read the `metadata` part.

**Cause.** The upload used curl's single-token `-F=x` form. That form mangles the multipart field, so the metadata part arrived malformed.

**Fix and rule.** Use separate `-F` and value entries. The general lesson is that the metadata part is the most fragile element of a modules upload. The same 10021 code reappears in the concurrency record (doc 04), where a missing fixture module would also have triggered it.

## Bug 2: `secret_text` bindings are plain strings

**Symptom.** The first live forecast calls returned 503 with the named error `MISSING_READ_TOKEN`.

**Cause.** The code called `.get()` on `env.AE_SQL_TOKEN`. A `secret_text` binding surfaces at runtime as a plain string. The `.get()` accessor belongs to a different binding type, `secrets_store_secret`. Calling `.get()` on a string threw, and the fail-closed handler mapped the throw to "missing token".

**Rule.** Know the binding's runtime shape before writing the accessor. The fail-closed naming did its job: the error was explicit and pointed at the token, not at a generic 500.

## Bug 3: the WAE SQL time column and ORDER BY

**Symptom.** Forecast reads failed with 422 "unable to find type of column".

**Cause, part 1.** Lane B's documentation-based reading assumed the time column was `_timestamp`. The selftest's `SELECT *` schema probe showed the column is empirically named `timestamp`. The source states the rule plainly: the probe is the arbiter, and the `_timestamp` hypothesis is false.

**Cause, part 2.** Even with the right name, `ORDER BY` on a column that is absent from the SELECT list fails with the 422. The column must be included in SELECT.

**Related behavior.** Read-your-writes lag is on the order of seconds. Rather than fail when a fresh write is not yet visible, the selftest reports honest propagation-lag notes.

**Rule.** For a managed SQL surface, a live schema probe outranks documentation reading. Building the probe into the selftest means future schema drift is caught by the same route that operators already check.

## Bug 4: contaminated no-auth testing

**Symptom.** The first 401 check on the new routes appeared to show that the routes accepted unauthenticated requests.

**Cause.** The check passed the operator connection through the Sauna proxy, which injects the bearer on every fetch. The "unauthenticated" request was actually authenticated.

**Fix.** No-auth testing through the proxy requires the header `X-Sauna-Connection-Id: none`. The proper run showed all three routes returning 401 cleanly.

**Rule.** An auth-gate test is only valid if the test harness provably sends no credential. Otherwise a passing route and a broken gate look identical.

## Pattern across the four bugs

| # | Layer | Detected by | Would unit tests catch it? |
|---|---|---|---|
| 1 | Upload tooling | Cloudflare API error | No, it is a deploy-path defect |
| 2 | Runtime binding shape | Named 503 | Only with an accurate binding mock |
| 3 | Managed SQL dialect | Schema probe plus 422 | No, the dialect lives server-side |
| 4 | Test harness | Re-run with `none` | No, the harness itself was wrong |

Three of four defects sit outside the code under test. That is the argument for the selftest route design described in doc 01: probes of the real binding, the real dataset, and the real schema, served from the deployed worker.

## Outcome

The final etag, `f2313fa6`, is the one verified live in doc 05. The deploy-chain record converts each failure into a documented rule (separate `-F` fields, plain-string `secret_text`, probe-verified `timestamp` included in SELECT, `X-Sauna-Connection-Id: none` for gate checks), so the next worker deploy does not rediscover them.
