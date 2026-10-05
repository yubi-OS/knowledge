# Harness contracts and failure lessons

Scope: the endpoint contracts a unit round runs against, the failure lessons baked into the flow, and the specific workarounds: preview single-change, the placements 404 workaround, stale-deploy and KV propagation lags, and the nulls >= 400 rule.

## The contracts

The unit round runs against a fixed set of harness endpoints, and the skill carries an endpoint quick-reference table so each step calls the right one (source doc). The contracts were fixed during refs5, the harness-contracts round, which is where four of the flow's load-bearing rules were written down: outcomes supersedes shares baseline_id+target (doc 04), realized row before remap (doc 04), preview single-change, and the placements 404 workaround (source doc, refs5).

## Preview single-change

The preview endpoint is called with exactly one change, not a batch. This is the harness-side face of the unit protocol (doc 01): if the preview simulated multiple changes, its output could not be attributed to the one atomic change the round will commit. Contract-testing practice makes the same demand of fixtures: idempotent replay means executing the same consumer-driven contract interaction including its provider state setup and teardown, so each replay measures one interaction under controlled state (https://itestbdd.dev/distributed/how-idempotent-replay-exposes-hidden-state-in-contract-test-fixtures/, w0.581). Recording and replay harnesses exist for the same reason: recording agent executions and replaying them gives deterministic tests where each run measures the same inputs (https://open-harness.github.io/open-harness/docs/guides/testing/recording-replay, w0.567). A preview with one change is the corpus-level equivalent: deterministic, attributable, replayable.

## The placements 404 workaround

The placements endpoint has a failure mode with a documented workaround: a 404 that is not a missing resource but a listing behavior, worked around by fetching incrementally rather than assuming one-shot enumeration (source doc, refs5, "placements 404 workaround"). The general pattern is cursor-based resumption over list APIs: fetch a page, record the cursor, and continue from where you left off rather than restarting. Resumable API sources are built exactly this way, with cursor or link-header pagination and time windows supporting resumption (https://claudeskills.info/skills/posthog/posthog/implementing-warehouse-sources/, w0.127, weak backing). The lesson encoded in the flow is not "handle 404s" but "know which endpoints lie about missing data, and encode the workaround in the harness rather than the caller's memory."

## Stale-deploy and KV propagation lags

Two lags are baked into the flow as known failure lessons: a stale deploy (the worker is running older code than the repo) and KV propagation lag (a config write has not reached the edge). Both produce symptoms that look like logic bugs: a new gate behavior not appearing, an updated threshold not taking effect. The flow's answer is procedural, not heroic: after a deploy or a KV write, expect propagation time and verify against the live endpoint before scoring (source doc, failure lessons). Debugging methodology supports the framing: verify behavior does not match expectations against the actual runtime state, not against what the source says should happen (https://www.arika.dev/blog/mcp/testing-mcp-servers/, w0.364, weak backing; testing protocol-level surfaces against live state).

## Nulls >= 400

The null calibration floor is 400 nulls. Below that, the null distribution backing the gate statistic is too thin for the z-score to behave, and gate verdicts become threshold artifacts. The floor is a flow-level contract: the audit's null set is built to at least 400 before any gate is read (source doc, failure lessons). This is the same logic as null-hypothesis testing generally: the statistic's null distribution must be characterized before a detection claim is meaningful, which is the founding problem of statistical signal detection (https://www.songxichen.com/Uploads/Files/Publication/Statistical_Inference_for_High_Dimensional_Means__A_Surve, w0.809).

## Why contracts beat heroics

Every item in this doc is a contract or a documented workaround rather than an ad-hoc fix, and that is the point. The API is a connection between computer programs, and its reliability properties are part of the system's design surface, not an implementation detail (https://en.wikipedia.org/wiki/API, w0.769). A harness whose failure modes are enumerated in the operating procedure converts "the endpoint is flaky" into "run the workaround step." The validated rounds treated these lessons as hard-won: each one is traceable to a round where it was learned, and the skill carries them so the next chain does not re-learn them (source doc).
