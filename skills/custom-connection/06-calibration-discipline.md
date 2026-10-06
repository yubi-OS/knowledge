# 06 - Calibration discipline

Scope: the calibration layer the custom-connection skill maintains over its own connection table: session re-verification, the false-positive trap, the error-code discrimination as calibration signals, and dynamic id pinning. Grounding spine: yubi-OS/yubiOS skills/custom-connection/SKILL.md (source doc). This is an internal-record subtopic, no dig: calibration is a discipline over this environment's own rows, and the source doc is the record.

## Working-row calibration

Exactly one Cloudflare row works as of 2026-09-21 (`conn_pd_apn_1KhdoD7`, verified `GET /accounts` returns 200) (source doc). The calibration rule: every session re-runs the health check before trusting the row, and a fresh 200 is the only pass condition (source doc). A row that was verified last session is not verified this session.

## The false-positive trap

`GET /client/v4/user/tokens/verify` always fails with code 1000 on this account-scoped credential (source doc). The trap: a session that reaches for the standard token-verify endpoint, sees "Invalid API Token", and concludes the connection is dead. The source doc's instruction is to never read that failure as a dead connection; the health check is `GET /accounts` (source doc). The same scoping logic covers `/client/v4/user` (9109) and `/client/v4/memberships` (9106) (source doc; see doc 03).

## Error codes as calibration signals

The 6111 versus 9109 distinction is itself calibration output (source doc):

- 6111 (malformed stored Authorization value) means the row was created badly. Stop retrying (source doc).
- 9109 (invalid access token) means the token expired or was revoked. The row needs re-creation (source doc).

Neither is a transient error, and both tell you something about the row rather than about the network (source doc; the full table is doc 04).

## The drift trigger

Re-run the health check after any Settings change to Cloudflare rows (source doc). The working row id has churned: two prior working rows died, one of them (9109) between 2026-09-06 and 2026-09-21 (source doc). Because of that churn, ids must be pinned dynamically per session, never from memory (source doc). The concrete sequence:

1. Session start: read the current working row from the connection table (doc 01).
2. Run `GET /client/v4/accounts` through that row (doc 03).
3. Pin `X-Sauna-Connection-Id` to that id for the session (doc 02).
4. After any Settings change touching the rows, re-run the check before the next call (source doc).

## Why this layer exists at all

The dead-row history shows what happens without it: four 6111 rows sat in the table while calls were wasted on them, and one working row silently expired. The calibration discipline converts those incidents into rules: verify every session, use the right endpoint for the scope, treat error codes as row-state signals, and never trust a remembered id. The audit rules that keep the table itself honest are doc 07's subject.
