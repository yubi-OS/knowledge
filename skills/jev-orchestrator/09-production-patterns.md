# 09 Production contracts proven in live rounds

Scope: the contracts verified across the gated repo-commit rounds (PRs 276, 277, 278) and the email regression, plus the guidelines that turn them into caller rules.

## The 3 verified rounds

The source doc records patterns proven across 3 rounds (PRs 276, 277, 278) and the email regression, verified 2026-10-01 and 2026-10-02 (source doc, Gated repo commits section).

## GitHub Contents writes are PUT, not POST

POST /repos/<owner>/<repo>/contents/<path> returns 404. The Contents write is a PUT, and policy v5 and later allow PUT on http.post (learning l_087eda59277032e1) (source doc). The GitHub REST reference documents the update path as PUT /repos/{owner}/{repo}/contents/{path}; community answers confirm the same (https://docs.github.com/en/rest/contents, weight 0.06, weak; https://stackoverflow.com/questions/71054940, weight 0.06, weak).

## Same-file sibling commits need a fresh blob sha

When 2 cycles touch 1 file, fetch the branch head's blob sha again before the second commit; a stale sha returns 409 (source doc). Round 1 went 6 of 10 on the first pass, and all 4 retries were stale-sha failures (source doc). The PUT-contents flow requires the existing file's blob sha in the request, so any concurrent commit invalidates it.

## Approve auto-dispatches

The approve endpoint re-gates against the CURRENT policy version, then executes the bound action plus verify plus continue in one request, with autoexecuted in the response (source doc). No separate execute call is needed. This contract is also the enforcement point for the policy-version rule in doc 02: the re-gate happens at approve time, not grant time.

## Evolution sweep fire is unique per (fire, date)

Sibling sweep rows on the same date collide. Label the sweep with the corpus name (for example refs/-corpus) and reuse one sweep's directives per round instead of stacking same-fire sweeps (source doc).

## The resend.send body validator

The resend.send tool bodies must be {from, to (array), subject, html}, with from = Steady Orbit <site@axel.steadyorbitsystems.ai> (source doc). The validator validateResendSendBody in jev-decide.js shipped 2026-10-02 with etag 4dca4182 and rejects malformed bodies at propose-time on both paths: caller-supplied actions get 422 INVALID_ACTION and the task closes rejected; LLM proposals get dropped with an invalid_action reason (source doc). The Resend send-email API reference documents the same body shape (from, to, subject, html) (https://resend.com/docs/api-reference/emails/send-email, weight 0.19, weak).

The reference regression: task t_e173b0b1d05a1877 on 2026-10-02, approval granted, Resend returned 422, and the email never sent. The validator was bought by that failure (source doc).

## Below-floor prompts still gate, correctly

An intent classification of actionable: 0 (below_floor) does not block a proposed action; the deterministic gate still decides (source doc). The email regression was a schema defect, not a gate defect. The lesson: do not conflate the advisory layer's verdict with the gate's.

## Guidelines that encode these contracts

The source doc's guidelines turn the contracts into caller rules (source doc, Guidelines):

1. Always send an idempotency_key for scheduled or retryable callers; dedupe is per (tenant, key) and returns the existing task instead of double-firing.
2. Declare expected predicates on every action; without them verification degrades to unknown.
3. Never bypass the gate by calling providers directly from the same automation; the audit log only covers what went through Jev.
4. When the gate blocks for policy reasons the caller keeps working for free; when it blocks for spend or limits, promote a learning (human step) rather than raising limits silently.
5. The dashboard's confirm dialogs are the irreversibility contract: approve dispatches the exact bound action.

Guideline 3 is the anti-pattern rule for the whole corpus: a side door around the gate is invisible to the audit log, so it is a compliance failure even when the action itself succeeds.

## Sources

- Source doc: skills/jev-orchestrator/SKILL.md in yubi-OS/yubiOS (sections: Gated repo commits; Guidelines; Examples).
- https://resend.com/docs/api-reference/emails/send-email (weight 0.19, weak)
- https://docs.github.com/en/rest/contents (weight 0.06, weak)
- https://stackoverflow.com/questions/71054940 (weight 0.06, weak)
