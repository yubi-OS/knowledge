# 04 - Auth diagnostics: read the status code, do not guess

Scope: the status-code decision table for a misbehaving bridge, the no-proxy token test, and the resolved 2026-09-24 rock1 401 saga that proves why the table works.

## The decision table

The source doc (yubi-OS/yubiOS skills/shell-bridge-connection/SKILL.md) maps three signatures to three root causes. Read the status code first; every guess you skip is a minute saved.

| Signature | Meaning | Action |
|---|---|---|
| 401 with a Python `http.server` error page | funnel + bridge alive, token mismatch | test an alternative token directly (below) |
| 502, body `error code: 502` | bridge process dead on the host | recovery recipe: SAUNA_TOOLS "rock1 shell bridge outage pattern" (2026-08-01) |
| 501 | bridge alive, auth-independent | use as liveness control; problem is credentials, not the process |

### 401 with a Python http.server error page

Funnel and the bridge are both alive; the token mismatched. The stored connection credential is wrong or stale (source doc). This is the signature that most tempts guessing; resist it and run the direct test below.

The MDN reference confirms 401 Unauthorized means the request lacks valid authentication credentials (https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401, weight 0.15, weak backing). A generic 401 troubleshooting guide exists (https://zamd.net/how-to-fix-a-401-unauthorized-error-when-calling-an-api-with-a-token/, weight 0.12, weak backing) and a Stack Overflow thread covers the same error class (https://stackoverflow.com/questions/78196311/post-http-localhost3000-serverside-401-unauth, weight 0.06, weak backing); none of these know this bridge, so the source doc's signature table governs.

### 502, body `error code: 502`

The bridge process is dead on the host; the funnel cannot reach its origin (source doc). Recovery recipe: SAUNA_TOOLS "rock1 shell bridge outage pattern" (2026-08-01). Independent corroboration that 502s surface at the funnel layer when the upstream service is unhealthy: tailscale issue #17892, "random 502 errors when using tailscale funnel" (https://github.com/tailscale/tailscale/issues/17892, weight 0.57). Treat 502 as a host-side process problem before suspecting the network.

### 501

The bridge is alive and auth-independent: the endpoint exists, the method is just wrong for GET (source doc). That makes 501 the cheapest liveness control when a 401 is ambiguous: if `GET /run` returns 501, the process is up and the problem is credentials, not the process.

## The direct-token test

When 401s are ambiguous, test an alternative token directly WITHOUT proxy injection (source doc):

```
curl -H "Authorization: Bearer $TOKEN" -H "X-Sauna-Connection-Id: none" https://<host>.tail3a04f5.ts.net/run ...
```

Extract `$TOKEN` from the other box's token file (doc 06) and never print it (source doc). The `none` connection id is the documented opt-out from proxy injection (source doc). The two boxes share the token filename `/etc/rock1-shell.env` (doc 06), so a token known-good on one box is a valid hypothesis for the other.

## What does NOT fix a 401

Re-creating the Sauna connection row does NOT fix a 401 when nobody outside the box knows the current token (source doc). The connection row can only hold a token someone can produce; if the box itself is the only holder of the live token, editing the row is rearranging furniture.

## The 2026-09-24 rock1 saga, resolved

The real fault behind the 401s was a zombie bridge process on rock1: a nohup'd `rock1-shell-server.py` from August held port 8080 with the OLD token in memory (source doc). The diagnostic tell was the Python http.server error page; the fix ran ON rock1:

1. `pkill -f '[r]ock1-shell-server.py'` (the bracket trick keeps pkill from matching its own command line).
2. `systemctl restart shell-bridge` (source doc; unit names in doc 06).

The full saga is recorded in SAUNA_TOOLS as "rock1 bridge 401 saga". Verified recovery: echo ping plus full state probe round-trip OK (source doc, doc 02).

## The general lesson

When a service restarts but keeps failing auth, check for a zombie process that never got the memo before you touch credentials. A restarted unit cannot evict an orphaned process that still owns the port; the old process keeps serving with old state, and every diagnostic that assumes "restart implies new state" points at the wrong layer.
