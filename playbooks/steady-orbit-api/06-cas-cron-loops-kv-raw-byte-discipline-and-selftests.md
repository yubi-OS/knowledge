# 06: CAS Cron Loops, KV Raw-Byte Discipline, and Selftests

**Scope:** hourly evolution (`0 * * * *`) and 5-minute automation (`*/5 * * * *`) CAS crons, fail-closed switches, HTMLParser-validated `--data-binary` KV writes, and the 9-route live selftest suite.

**Ground source:** `yubi-OS/yubiOS playbooks/steady-orbit-api.md` (2026-10-21, deploy etag `356cb5c1c2e3e3f8b308ba6e29ab06bf27fd99fc107cc9d7f60b01d0dfb7e6b7`).

> Internal-record subtopic grounded in yubi-OS/yubiOS playbooks/steady-orbit-api.md, no external web dig.

## 1. Two crons, CAS-claimed

The worker has exactly 2 cron triggers (Decision 9, modules `jev-cycle.js`, `jev-scheduler.js`):

| Cron | Loop | Selftest |
|---|---|---|
| `0 * * * *` | hourly evolution | `/api/jev/evolution/selftest` |
| `*/5 * * * *` | 5-minute automation | `/api/jev/automations/selftest` |

Cron triggers can fire more than once for one slot (retries, overlapping invocations). Each tick therefore starts with a **compare-and-swap claim**: the tick atomically claims its slot, and a second invocation for the same slot finds the claim taken and exits. The ground source states the result plainly: double-firing is impossible.

Deploy note: the schedules are pulled with `GET .../workers/scripts/steady-orbit/schedules` before every deploy (Mechanism step 1) so they are preserved; after deploy, confirm crons read `["0 * * * *", "*/5 * * * *"]`.

## 2. Fail-closed switches

`jev-switches.js` holds operator switches stored in D1 (`DB`, `sos-agent`). The 2 named in the ground source:

- `approval_emails`
- `pwc_enabled`

Both **fail closed**: if the D1 read errors, the switch is treated as off and the code reports `switch_read_failed`. The wrong default (fail open) would mean a D1 outage turns on outbound approval emails or the gated feature. Fail closed means an outage only ever reduces what the worker does.

## 3. KV raw-byte discipline

Decision 10 covers writes to KV `SITE` keys, including `jev-index.html`, `AGENT.md`, and `website-v19/*`. Two classic corruptions:

| Mistake | Effect |
|---|---|
| Wrapping text or HTML in `json.dumps` before writing | value stored as a JSON string: surrounding quotes, escaped `\"` and `\n` |
| `curl -d @file` | strips CR/LF line breaks; HTML arrives mangled |

**The procedure:**

1. **Validate DOM balance** with Python's `HTMLParser`: walk the document and require **0 unmatched closing tags** before any upload.
2. **Upload raw bytes** with `curl --data-binary @file` (never `-d`, never `json.dumps`).
3. **Wait 15 seconds** for edge propagation.
4. **Verify `sha256`** of the stored value twice: once via the KV REST API and once via the public URL. Both must equal the local file hash.

The 2026-10-21 docs and KV sync (commit `7cbae103f8f5f038642de2353f0de410ddd98924`) recorded exactly these hashes: KV `SITE/AGENT.md` with `tools/point-map/AGENT.md` at `sha256` `365f12cb791f0d62`, KV `SITE/jev-index.html` at `eb4199a36d483e63`, `docs/ENDPOINTS.md` at `3ed38c5ac7c08563`, `skills/jev-timeseries/SKILL.md` at `4f5becbd20c779d1`. `AGENT.md` is mirrored publicly at `https://steady-orbit.systems-a.workers.dev/AGENT.md`, which is why the public-URL hash check matters.

## 4. The 9-route live selftest suite

Mechanism step 3 runs after every deploy, after a 15 to 20 second wait. First the negative check (doc 03):

```bash
curl -sS -o /dev/null -w '%{http_code}\n' \
  -H "X-Sauna-Connection-Id: none" "${BASE}/api/jev/summary"   # expect 401
```

Then the 9 routes with the operator connection and a User-Agent:

| # | Route | Covers |
|---|---|---|
| 1 | `/api/jev/health` | liveness (the only unauthenticated `/api/jev/*` route) |
| 2 | `/api/jev/selftest` | core orchestrator |
| 3 | `/api/jev/selftest/ledger` | ledger |
| 4 | `/api/jev/evolution/selftest` | hourly loop |
| 5 | `/api/jev/automations/selftest` | 5-minute loop |
| 6 | `/api/jev/map/selftest` | point-map |
| 7 | `/api/jev/corpus/selftest` | corpus instruments |
| 8 | `/api/jev/timeseries/selftest` | WAE reads + `cascade_selftest` |
| 9 | `/api/jev/forecast/task_state?h=5&engine=cascade` | end-to-end cascade |

Each response is reduced with `jq -c '{path, ok, status, active_model}'`. Pass condition: every `ok` true (or a healthy `status`), and route 9 returning `200` with an `allowed`-class verdict. On 2026-10-21, route 8 reported `cascade_selftest` 8/8 PASS and route 9 returned `200`, `timesfm-2.5-200m`, `clef` choice `wait`, `p=0.7677`, `allowed`.

## 5. Other operational rules from the ground source

- Wait 15 to 20 seconds after every Worker PUT or KV PUT before probes.
- Never `SELECT *` on large D1 tables (`maps`); paginate with `LIMIT`/`OFFSET`.
- Long map admission checks (`N=1200`, over 100s) go through a detached job, because sandbox egress cuts at about 100s; reconcile server state before retrying.
- Worker CPU limit is `cpu_ms: 300000`; carry it in `meta.json` (doc 02).

## 6. Failure modes this subtopic prevents

| Failure | Guard |
|---|---|
| Cron double-fire runs a loop twice | CAS slot claim |
| D1 outage enables gated behavior | fail-closed switches, `switch_read_failed` |
| Quoted or escaped HTML in KV | no `json.dumps`, `--data-binary` |
| Unbalanced HTML shipped | `HTMLParser` 0 unmatched closes |
| "Deployed" but edge still stale | 15s wait + dual `sha256` check |
| Silent regression after deploy | 401 check + 9-route suite |

## 7. Cross-references

- `skills/steady-orbit-deploy/SKILL.md`, `skills/jev-orchestrator/SKILL.md`, `skills/jev-timeseries/SKILL.md`.
- `docs/ENDPOINTS.md`; `tools/point-map/AGENT.md`.
