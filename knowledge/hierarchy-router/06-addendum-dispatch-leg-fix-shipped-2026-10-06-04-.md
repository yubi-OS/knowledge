# 06. Addendum: Dispatch-Leg Fix Shipped (Follow-Up 1 Resolved)

**Scope:** Addendum: dispatch-leg fix SHIPPED (2026-10-06 ~04:20 PT, follow-up 1 resolved): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-router-2026-10-06.md, no external web dig

## Timing and status

The addendum is dated 2026-10-06, about 04:20 PT. It resolves follow-up 1 (doc 04).

## The root cause was not what the follow-up guessed

Follow-up 1 proposed capturing the runLLM outcome synchronously. The addendum states the root cause was **not** the outcome capture. The dispatch had captured the model response all along: `response_json` contained `route`, `text_len`, `neurons`, and `text`.

The bug was in the **verify semantics**:

- The action carries `expected: {status_range: [200, 299]}`. That field is required by the propose-time caller-action validator for http-shaped actions.
- A lane-* model dispatch has no HTTP status.
- `evalPredicates` found nothing decidable, so the verdict was `unknown`.
- The action was demoted **after** a successful dispatch.

In short, a predicate designed for HTTP calls was applied to a model call, could not decide, and the fail-closed default (`unknown`) correctly refused to claim success.

## The fix: verify by dispatch shape

One branch in `jev-verify.js`. route.dispatch dispatches are verified by their **shape**, not by stock HTTP predicates:

| Dispatch shape | Detected by | verified_success iff |
|---|---|---|
| model dispatch | response has `route` + `text_len` | text_len > 0 |
| automation dispatch | response has `run_state` | run task's terminal state |
| anything else | n/a | falls through to the stock decision |

The evidence row carries `route_verify: {basis: model_text | automation_run_state}` so an auditor can see which rule decided each verification.

**Redeploy**: etag `6792ff0a9ee2cf9f`, 43 parts, crons and 14 bindings unchanged.

## Proof in both directions

### Direction 1: a fresh end-to-end run in one request

- Artifact: **gasket-L320**, a never-routed gasket variant.
- Live-measured D 1.600459680939992, r2 0.9996, 366 components.
- Band `hierarchy-image` -> gate allowed -> 70b draft dispatch (text_len 2603) -> patched verify `verified_success`.
- **Task state `terminal`, reason "all actions verified_success"**: the full lifecycle closed in-request.

Using a never-routed variant rules out caching or idempotency as the reason for success.

### Direction 2: the seed task closed

- Task `t_894b380e6126f9bd` (created in the post-promote verification, doc 02) was re-verified against its **stored** model response.
- Verdict `verified_success`, basis `model_text`; continue -> **terminal, "all actions verified_success"**.
- No re-dispatch was needed. The outcome was already stored; only the verifier had misread it.

This direction matters for the doctrine: the fix did not re-run the model to manufacture success. It applied the corrected rule to existing evidence, appending new events rather than rewriting history.

## API-contract note (not a bug)

The task verify endpoint requires `body.action_id`. Without it, the handler resolves `action = null`, and verifyAction returns 500 with `Cannot read properties of null (reading 'expected_json')`. Callers must pass the action id; the router's own in-request chain does. The record classifies this as a contract requirement rather than a defect, though the 500 (rather than a 4xx validation error) is a hardening opportunity worth noting.

## Remaining follow-up at the time of this addendum

The multimodal band remained `provisional` until its 21-point calibration sweep. That was resolved in the second addendum the same morning (policy v8; see doc 04).

## Lessons recorded

1. **A wrong hypothesis in a follow-up list is fine** if the list is treated as hypotheses. The investigation found the real cause in verify, not capture.
2. **Fail-closed verification worked**: undecidable predicates produced `unknown`, not a false success, and reconcile-before-repeat prevented a duplicate dispatch.
3. **Verification must match action shape**: HTTP predicates for HTTP actions, text_len for model dispatches, run_state for automations.
4. **Fix the reader, keep the record**: the stored response was correct; the seed task closed by re-verification, not re-execution.

## Before and after

| Aspect | Before (etag 5e3447e5113c14fd) | After (etag 6792ff0a9ee2cf9f) |
|---|---|---|
| model dispatch verify | stock http predicates -> unknown | text_len > 0 -> verified_success |
| task outcome | stuck non-terminal | terminal in-request |
| evidence | no basis field | route_verify.basis recorded |
