# 03: Central Bearer Auth and Credential Host Scoping

**Scope:** constant-time `timingSafeEqual` bearer auth on `/api/jev/*` and `/api/jev/map/*`, `CREDENTIAL_HOSTS` outbound secret scoping in `jev-execute.js`, and reconcile-before-repeat on unknown outcomes.

**Ground source:** `yubi-OS/yubiOS playbooks/steady-orbit-api.md` (2026-10-21, policy v24, deploy etag `356cb5c1c2e3e3f8b308ba6e29ab06bf27fd99fc107cc9d7f60b01d0dfb7e6b7`).

> Internal-record subtopic grounded in yubi-OS/yubiOS playbooks/steady-orbit-api.md, no external web dig.

## 1. Inbound: one bearer, checked centrally and again in depth

Decision 2 of the playbook is "central + defense-in-depth bearer auth". The credential is the Secrets Store binding `JEV_API_KEY` (resolved with the dual-shape resolver from doc 02).

**What is gated:**

- Every route under `/api/jev/*`, with exactly one exception: `GET /api/jev/health`.
- Every route under `/api/jev/map/*`.

**How it is checked:** `authorized(req, env)` compares the presented bearer against `JEV_API_KEY` using constant-time `timingSafeEqual`. A constant-time compare matters because a naive `===` short-circuits on the first mismatched byte, which leaks prefix length through response timing.

**Central plus defense-in-depth:** the gate is applied at the routing layer and again inside the route families, so a module added later that forgets its own check is still behind the central gate, and a routing refactor that drops the central check still leaves per-module checks in place.

**Public routes that are not behind this gate:** the relay endpoints listed in the playbook context (`/api/decide`, `/api/chat`, `/api/tts`, `/api/stt`, `/api/contact`, `/api/searxng`) and the site pages served by `solar-rbs-entry.mjs` (doc 01).

## 2. Verifying the 401 gate from the Sauna sandbox

The Sauna egress proxy injects stored credentials for the host `steady-orbit.systems-a.workers.dev` (operator connection `conn_QAvrBSyEG8ml`). If you probe a gated route from the sandbox without disabling that, the proxy adds the operator bearer and you get `200`, which falsely suggests the gate is open or, worse, masks a broken gate.

The ground-source probe disables injection explicitly:

```bash
BASE="https://steady-orbit.systems-a.workers.dev"
curl -sS -o /dev/null -w '%{http_code}\n' \
  -H "X-Sauna-Connection-Id: none" "${BASE}/api/jev/summary"
# expect: 401
```

Then the authenticated pass uses `-H "X-Sauna-Connection-Id: conn_QAvrBSyEG8ml" -H "User-Agent: omni-agent/1.0"` (see doc 06 for the full 9-route suite). Both halves are required: a `401` without the bearer and a `200` with it.

## 3. Outbound: `CREDENTIAL_HOSTS` host scoping

Decision 5 states the principle "models advise; the deterministic fail-closed gate disposes", implemented across `jev-decide.js`, `jev-gate.js`, `jev-execute.js`, and `jev-verify.js`. `askJev` calls `@cf/cloudflare/clef` via `env.AI.run` (`consumed=0`), and model probabilities never authorize execution.

At execution time, `jev-execute.js` enforces `CREDENTIAL_HOSTS` before it injects any of these 4 Secrets Store credentials:

| Secret | Purpose |
|---|---|
| `GITHUB_API_KEY` | GitHub actions |
| `RESEND_API_KEY` | email send |
| `GOOGLE_PLACES_API_KEY` | places lookups |
| `DAYTONA_API_KEY` | sandbox actions |

The rule is an allowlist keyed by credential: a credential is attached only when the outbound request's host matches the hosts registered for that credential. A task whose target URL points anywhere else gets no credential. This closes the classic confused-deputy path where a model-proposed or user-supplied URL tricks the executor into sending a real key to an attacker-controlled host. The ground source names the mechanism and the 4 credentials; the exact host list lives in `jev-execute.js` and is not reproduced in the playbook, so it is not reproduced here.

## 4. Reconcile before repeat

Non-idempotent actions (sending an email, creating a GitHub object) cannot be blindly retried: if the first attempt actually landed, a retry duplicates it.

Ground-source contract:

1. A non-idempotent task that **fails** or returns outcome **`unknown`** enters a state that blocks retry.
2. A retry attempt in that state returns **`409 failed_requires_reconcile`**.
3. The operator (or an automation with evidence) calls `POST /api/jev/tasks/:id/reconcile` with one of 2 values: `happened` or `did_not_happen`.
4. Only after reconciliation can the task proceed: `did_not_happen` makes a retry safe; `happened` records the side effect and closes it.

This is the API-level version of the BEFORE/AFTER logging discipline: the ambiguous middle is made explicit and a human-or-evidence decision is required to leave it.

## 5. Failure modes this subtopic prevents

| Failure | Guard |
|---|---|
| Timing-leak on bearer compare | `timingSafeEqual` |
| New module ships without auth | central gate plus per-module check |
| False-green 401 test from sandbox | `X-Sauna-Connection-Id: none` |
| Key exfiltration via crafted URL | `CREDENTIAL_HOSTS` allowlist in `jev-execute.js` |
| Model "decides" to act | probabilities advise only; deterministic gate disposes |
| Duplicate side effect on retry | `409 failed_requires_reconcile` + `/reconcile` |
| Secrets Store object sent as string | dual-shape resolver (doc 02) |

## 6. Cross-references

- Doc 02 for `JEV_API_KEY` resolution and binding shapes.
- Doc 04 for approval bindings that sit in front of execution.
- Doc 06 for the live selftest suite.
- Skills named by the ground source: `skills/jev-orchestrator/SKILL.md`, `skills/steady-orbit-deploy/SKILL.md`.
- `docs/ENDPOINTS.md` (136-route inventory) for the per-route auth column.
