# 09 - Failure Modes, Red Flags, and Verification

Scope: the operational traps a sweep run hits in practice, the red flags that demand intervention mid-run, and the verification checklist that decides whether a run shipped honest work.

Grounding spine: `yubi-OS/yubiOS skills/refs-refresh-sweep/SKILL.md` (source doc), plus Cloudflare and audit-log documentation via dig.

## The 8 anti-patterns

Every anti-pattern in the source doc corresponds to something that actually happened in the validating run:

1. Sending requests without a User-Agent. Cloudflare returns error 1010 on both endpoints. Every HTTP call carries a UA string.
2. Unbatched jev calls. One request per doc burns the 15/min/IP cap and 10 times the money.
3. Trusting jev noul as the sole gate. Validation max was 0.79 with zero docs over 0.8; blend with age and record the agreement analysis (doc 05).
4. Rewriting docs instead of appending. The corpus is an audit trail (doc 08).
5. Letting a zero-result dig produce conclusions. Fall back to primary sources or record an honest no-change verdict.
6. Non-incremental persistence. Container restarts killed one full dig batch before it was saved.
7. One giant refresh PR. Unreviewable; one doc per PR.
8. Forgetting the /tmp wipe rule. The whole Git Data API chain, and any multi-step file flow, goes in ONE bash call.

## Dig grounding: what Cloudflare error 1010 actually is

Cloudflare's support documentation defines error 1010 as access denied based on the visitor's browser signature: "The owner of this website has banned the autonomous system number (ASN) your IP address is in" or browser-signature-based bans under Browser Integrity Check, and notes site owners can turn Browser Integrity Check off in their security settings (https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/, weight 0.89, page dated April 23, 2026). This is the mechanism behind anti-pattern 1: both backing endpoints sit behind Cloudflare, and a missing or generic User-Agent triggers the signature-based block. The several third-party "how to fix 1010" articles surfaced in the dig carry weak weight (0.07 to 0.10) and add nothing the official page does not.

## The 5 red flags

Per the source doc, these demand intervention rather than patience:

1. jev 429s persisting after 3 backoffs: slow the whole fan-out (raise inter-request sleep), do not hammer.
2. searXNG engines reporting "too many requests" or suspended on every query: switch affected agents to direct primary-source verification.
3. A subagent returning under 200 characters or no PR number: re-dispatch immediately with the failure mode explicitly forbidden.
4. Two agents picking the same doc: dedupe the brief list before dispatch.
5. A refresh PR claiming upstream changes with no source URL: reject it.

## Dig grounding: why append-only audit records

The verification checklist's demands (every row carries verdict, task_id, cost; every result carries a weight; every finding line carries a URL and weight) are an audit-log design, and the audit-log pattern is grounded: production audit-log APIs are built to give programmatic oversight of every change, capturing who changed what, from where, and when, retrievable into a SIEM (https://docs.ada.cx/reference/audit-log/overview, weight 0.74). Weak-weight material on append-only log storage patterns exists (0.09 to 0.48, including an ADR on append-only audit logging at 0.48) and is cited only as weak corroboration.

## The verification checklist

Per the source doc, a run is verified only when all of these hold:

- [ ] Phase 0 preflight passed (both endpoints healthy, probe results recorded in the DB) before any dig ran.
- [ ] Every corpus row has jev verdict plus task_id and cost in the DB.
- [ ] Every collected result has a jev quality weight.
- [ ] The plan doc states the jev-versus-age agreement analysis honestly.
- [ ] Every refresh PR touches exactly one file and is append-mostly.
- [ ] Every finding line in refresh sections carries a source URL and weight.
- [ ] All PRs verified `merged=true`; main HEAD equals the last merge SHA.
- [ ] No network state changed (the searxng port stays internal-only).
- [ ] Total jev spend is logged (the validating run spent under $0.02 for 112 calls).

## Spend discipline as a failure mode

Budget drift is itself a red flag: the reference run spent under $0.02 across 112 jev calls (234-doc triage plus 144-result weighting). A run whose spend or request count grows well past that shape is usually batching wrong (anti-pattern 2) or hammering past the cap (red flag 1), and should be stopped and re-shaped rather than continued.
