# 07 - Recursion and audit rules

Scope: the self-audit rules the custom-connection skill imposes on itself, with their cadence triggers, so the connection table keeps reflecting reality instead of drifting. Grounding spine: yubi-OS/yubiOS skills/custom-connection/SKILL.md (source doc). This is an internal-record subtopic, no dig: the recursion rules are norms this file imposes on its own maintenance, and the source doc is the record.

## Session-start audit

Run the health check (`GET /accounts` through the currently-listed working row) before any Cloudflare work in a session (source doc). The rationale is stated in the source doc: the working row id has churned twice, so the file's tables are provisional until the check returns 200 (source doc). This is the same check the calibration discipline requires (doc 06), applied at a fixed cadence: session start, unconditionally, before the first Cloudflare call.

## Table update discipline

When a row's status changes (worked to dead, or a new row lands), update the dead/working table in the same session (source doc). The tables are the audit trail, and a stale table misdirects the next session in exactly the way the six dead rows once did (source doc). The rule is about latency: a status change is recorded in the session it is observed, not deferred to a later cleanup.

## Append, don't rewrite

Status changes get dated lines, in the pattern of the 2026-09-21 resolution note (source doc). Rewriting history hides the drift the tables exist to expose (source doc). The format the source doc models: a dated note that states what changed, what the failure signature was, and what the resolution was, added as a new line rather than editing the old entries.

## Re-run triggers

The source doc names three events that trigger a fresh health check outside the normal cadence (source doc):

1. A 9109 on a previously-working row: the token expired or was revoked, so every other row's status is now suspect.
2. A 6111 on a previously-working row: a stored value defect surfaced on a row that used to pass, so re-verify before trusting anything.
3. A workers.dev subdomain rename: hostnames change, so the live-check URL inventory (doc 08) needs re-derivation.
4. Any new Cloudflare credential flow in Settings: a new row may have landed, and the working-row table may need a new entry.

## Why recursion rules on a connection file

The connection file is state that future sessions consume without the context of the session that wrote it. The audit rules exist because that state decays in specific, observed ways: ids churn (2 prior working rows died), credentials expire silently (9109), and creation flows write bad values (6111). Each rule ties a maintenance action to the trigger that historically demanded it, so the next session starts from a verified table rather than a remembered one. The calibration section (doc 06) is the "what to check" layer; this section is the "when to check and how to record" layer.
