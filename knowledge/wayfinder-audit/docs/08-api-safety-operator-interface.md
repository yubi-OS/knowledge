# API safety and the operator interface

Scope: the input-validation and error-surface repairs on the wayfinder API, plus the operator UI additions that make the instrument usable without silent fallbacks.

## The defect class

The pre-audit API accepted unsafe inputs and hid failures. Numeric controls were not validated before embedding; baseline conflicts were discovered mid-run; legacy baselines were silently coerced; oversized request bodies were unbounded; and exception stacks could reach clients on new routes. On the client side, a validation or identity failure could trigger a silent fallback, so the operator saw an empty map instead of an error.

## The repairs

The audited API now behaves as follows:

1. Preflight validation. Numeric controls and baseline conflicts are validated before any embedding work starts.
2. Dimension handling. 768-D vectors work directly; no rescaling or filtering is applied silently.
3. Seed 0 survives. Zero is a legitimate seed, not a falsy default.
4. No silent coercion or filtering. Inputs are either accepted as given or rejected with a message.
5. Legacy baselines return 409. Old-format baseline requests are refused with a conflict status, not coerced.
6. Body size is bounded.
7. No exception stacks on the new routes. Errors return structured messages; stack traces stay server-side.

The live rejection checks in the audit record confirm the contract: K=1 returns 422, a v0.1 baseline without a frame returns 409, and an explicit d conflict returns 409. Infrastructure failures are reported as errors, never as negative task scores.

## Why 409 is the right status

HTTP 409 Conflict "indicates a request conflict with the current state of the target resource" (https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/409, weight 0.901). The reference guidance for the code frames it exactly as the wayfinder uses it: "the request is valid but cannot be completed due to a state mismatch" (https://http.dev/409, weight 0.586). A legacy baseline is a valid request against an incompatible stored state, so 409 names the situation better than 400, which would imply a malformed request. A weaker dig source agrees on the general rule that validation failures and state conflicts deserve distinct handling (https://apiguide.dev/status-codes/409/, weight 0.231, weak; https://www.cloudthat.com/resources/blog/rest-api-design-best-practices-for-validation-and-error-handling, weight 0.120, weak).

## Why stack traces must not leak

Stack trace disclosure is a documented vulnerability class: exposed traces "contain sensitive technical information including physical file paths, code snippets, framework version details, database connection information, and internal application structure" (https://www.acunetix.com/vulnerabilities/web/stack-trace-disclosure-asp-net/, weight 0.800). The standard remediation is to log the detail server-side and show the user a generic message, so "the developers can still access and use the error log, but remote users will not see the information" (https://codeql.github.com/codeql-query-help/java/java-stack-trace-exposure/, weight 0.791). The wayfinder's new routes follow that split.

## The operator interface

The UI changes mirror the API honesty:

1. Full file and folder inputs, replacing whatever partial selection existed before.
2. A baseline selector, so reuse of a stored frame is an explicit operator choice.
3. Explicit server errors, replacing silent client fallbacks after a validation or identity failure.
4. Escaped paths, closing the path-injection surface the browser check exercised.
5. Copyable hypotheses, so a candidate recommendation leaves the instrument as text the operator can inspect, not as an implicit action.
6. A comparison panel for run-to-run differences.
7. A separate non-admitted spectroscopy card, which keeps the even/odd and rank-block shares visible but labeled as diagnostics that contribute nothing to ranking.

The browser verification in the audit record supports the UI side: the synthetic cloud rendered with zero page errors, comparison-unavailable handling was exercised, and path-injection escaping was checked.

## Fail-closed as a cross-cutting principle

The API and UI repairs are the same design as the persistence rule in doc 06: an unrecognized or failed invariant stops the pipeline with an explicit error. There is no fallback path that produces a plausible-looking map from a broken run. For an instrument whose entire value is the trustworthiness of its comparisons, a silent fallback is worse than a crash: it manufactures evidence. The audited surface now manufactures nothing and reports everything.
