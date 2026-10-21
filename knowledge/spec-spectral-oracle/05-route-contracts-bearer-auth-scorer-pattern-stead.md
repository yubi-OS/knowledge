# 05. Route Contracts: Bearer-Auth Scorer Pattern on the Steady-Orbit Worker

**Scope:** Route contracts (bearer-auth, scorer pattern, steady-orbit worker): detailed analysis grounded in yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/SPEC-spectral-oracle-2026-10-06.md, no external web dig

## Pattern

All routes follow the established steady-orbit worker conventions the SPEC names: bearer-auth, the scorer pattern used by the taste engine, and run rows persisted to `jev_corpus_runs`.

## The four routes

### 1. Walk mode

```
POST /api/jev/corpus/spectral/walk
{mask_b64, width, height}  |  {edges: [[a,b], ...]}
```

Returns walk-mode outputs; run row kind `spectral-walk`. Two input shapes: a base64 binary mask (built into an 8-connected ink graph) or an explicit edge list, which lets non-image graphs enter directly.

### 2. Series mode

```
POST /api/jev/corpus/spectral/series
{values: number[]}
```

Returns series-mode outputs; run row kind `spectral-series`. Any ordered 1D series works: Laplacian eigenvalues, PSD bins.

### 3. Oracle

```
POST /api/jev/corpus/oracle
{image: {width, height, bitmap_b64}}
```

Runs edge-standard internally, then a spectral walk on the traced mask, and returns both feature sets plus the Einstein verdict. Run row kind `oracle`. This is the composed two-axis instrument in one call, with D measured in-route rather than supplied by the caller.

### 4. Selftest

```
GET /api/jev/corpus/spectral/selftest
```

Runs the gold-corpus checks. Returns 200 when all pass, 500 when any fail. The HTTP status itself is the signal, so monitors need not parse the body to detect regression.

## Run-row rules

- **Table**: `jev_corpus_runs`.
- **Idempotent per input sha256**: resubmitting the same input does not create a second row. Combined with sha-seeded walks, the same input always yields the same row.
- **policy_version stamped**: every row records the policy in force when it was measured, so readings can be grouped by regime.
- **Rendered decimals**: every instruction and measurement carries rendered decimals. The SPEC calls this "the fmt() lesson": store the formatted value alongside the raw float so downstream readers see the same digits the instrument reported.

## The authorization boundary

The SPEC's sentence: "Verdicts are data, never authorization; the oracle proposes nothing by itself."

An `einstein.verdict = consistent` reading is a measurement fact. It does not trigger an action, admit a taste axis, or route work. Any system that consumes the verdict (for example a future router pair-band) must pass it through its own fail-closed gate. This matches the doctrine restated in the later hierarchy-router build record: the detector proposes, the gate disposes.

## Route-to-mode summary

| Route | Mode | D source | Run row kind |
|---|---|---|---|
| spectral/walk | walk | n/a or caller | spectral-walk |
| spectral/series | series | n/a | spectral-series |
| oracle | edge-standard + walk | measured in-route | oracle |
| spectral/selftest | gold table | gold | (status only) |

## Verification requirement after deploy

The SPEC's test requirements include live-route verification after deploy and cite two lessons: a stale deploy can take about 20 seconds to clear, and a passing selftest does not prove the routes work. Selftest exercises the math; route verification exercises request parsing, auth, persistence, and response shape. Both are required.

## Practical caller checklist

1. Send a bearer token.
2. Choose the route by input shape: mask or edges to walk, values to series, image to oracle.
3. Read every exponent with its r2; ignore values below 0.98.
4. Treat `insufficient` as "no reading", not as "inconsistent".
5. Never wire a verdict directly to an action.
