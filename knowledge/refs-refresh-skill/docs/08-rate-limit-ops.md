# Operational rate limits: user agents, shared caps, ephemeral disks

Scope: the operational hardening the pipeline learned the hard way: user agent headers against Cloudflare 1010, a shared decision-model cap with backoff, and sandbox filesystem wipes.

## Cloudflare error 1010: the user agent tax

The first operational lesson of the validating run: both shared endpoints returned Cloudflare error 1010 to header-less Python clients (internal evidence, 2026-09-29). Every HTTP call in the pipeline now carries an explicit User-Agent header.

Cloudflare documents error 1010 as an access-denied response where the site owner has banned the client's browser signature (https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/, weight 0.52). The official mechanism is Browser Integrity Check, which inspects request headers and blocks requests whose headers look automated. The companion control is User Agent Blocking, a WAF tool available on all plans (https://developers.cloudflare.com/waf/tools/user-agent-blocking/, weight 0.62).

Two details make this a pipeline problem rather than a curiosity:

1. It fires on both endpoints used by the pipeline, so it is an environment property, not a per-service bug.
2. The fix is trivial (always send User-Agent) but only after the failure has cost you a full probe cycle. Preflight should include a header check for any new endpoint.

Weak-backing note: the community discussion threads and third-party guides describing 1010 behavior against Python clients scored below 0.5 on source quality (0.11 to 0.29), so the specific claim that Browser Integrity Check targets missing User-Agent headers rests on those weak sources plus the run's own observed behavior. The strong claim, that 1010 means a banned browser signature, carries the official doc's weight (0.52).

## The shared decision-model cap

The decision-model endpoint enforces a rate cap of 15 requests per minute per IP, and that budget is shared across all parallel subagents hitting it concurrently (internal evidence, 2026-09-29). With N concurrent subagents, each effectively gets 15/N requests per minute.

The run's mitigation: batch 5 questions per request, which multiplies the effective throughput by 5, and back off 30 seconds on a 429. Batching is the higher-leverage mitigation: it converts a per-question cap into a per-request cap. During this mint's own weighting phase, the cap fired once at batch 15 of 22; a 30 second sleep and retry absorbed it with no data loss, which is the backoff rule working as designed.

The general shape is standard. A 429 means the request was understood but not served, so it is always safe to retry after waiting, unlike a 5xx mid-write where retry semantics depend on the operation's idempotency.

## Ephemeral filesystems

The sandbox wipes /tmp between shell calls (internal evidence, 2026-09-29). This surfaces in 2 places in the pipeline:

1. The Git Data API push chain must run in 1 call, because intermediate SHAs cannot survive to a second call.
2. Any dig or weighting script that assumes its output files persist between calls corrupts on restart; the persist-after-every-batch rule exists because of this.

The design response is not to fight the platform but to fit its shape: keep long-lived state in the workspace, not /tmp, and concentrate unavoidable stateful windows into single atomic calls.

## The failure taxonomy worth preflighting

Every operational failure observed in the validating run is cheap to preflight and expensive to discover mid-sweep:

1. 1010 on a header-less client: send User-Agent from the first call.
2. 429 from the shared cap: batch questions and back off 30 seconds.
3. Engine suspension on the search proxy: pace queries at least 1 second apart and treat correlated empty results as throttling, not absence of evidence.
4. /tmp wipe: one atomic call for the push chain, persistent storage for everything else.
5. PAT quirks: PATCH draft:false silently no-ops on some tokens; merge through POST /repos/{repo}/merges instead (internal evidence, 2026-09-29).

Items 1 through 4 are generic. Item 5 is token-specific: the same operation that no-ops on one PAT works on another, so preflight should test the specific write operations the pipeline depends on against the specific token in use, not assume REST semantics.

## Cost as an operational constraint

The run's total decision-model spend was under $0.02 across triage and weighting (internal evidence, 2026-09-29). Keeping the spend this low is itself an operational practice: batch questions, keep instructions short, and reserve the model for decisions rather than generation. The 40-request budget for a full mint is the same discipline expressed as a cap.

## Summary

1. Every call carries User-Agent; 1010 is the environment's default posture toward header-less clients (https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/, weight 0.52).
2. The decision-model cap is per IP and shared; batch 5 questions per request and back off 30 seconds on 429.
3. /tmp is ephemeral: one atomic call for stateful chains, workspace paths for persistence.
4. Preflight the exact write operations against the exact PAT; some PATCH operations silently no-op.
