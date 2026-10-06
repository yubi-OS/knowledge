# 04 - Dispatch discipline rules

Scope: the three operational rules the playbook records for issuing dispatches safely: one dispatch per POST, letting the dispatcher settle after a bump, and the `Docker_push` input renaming on forward.

Grounding spine: source doc yubi-OS/yubiOS playbooks/digest-bump-recovery.md. This is an internal-record subtopic (rules distilled from incident behavior inside the repo's CI); it required no searXNG dig, and no dig was run.

## Rule 1: one dispatch per POST

The source doc's first rule: one dispatch per POST (source doc). The failure mode it guards against is stated precisely: an unconfirmed `204` gets retried and duplicates a run within 10 to 20 seconds (source doc). A dispatch POST that returns 204 has been accepted, but the playbook treats acceptance as unconfirmed until the run is seen: the agent must list runs immediately (step 3 of the mechanism, doc 03) rather than re-POSTing on the assumption that a slow response means failure.

If a duplicate does appear, the remedy is also recorded: cancel with `POST /actions/runs/{id}/cancel`, which returns `202` (source doc). The cancel endpoint's own status code is a 202, accepted for processing, not a completed cancellation, so the cancellation itself should be verified the same way as everything else in this playbook: by listing runs and reading the conclusion.

The rule exists because retries feel safe ("nothing happened") while the API's actual semantics make them destructive in the exact window where the operator is most tempted to retry: the 10 to 20 seconds right after an unconfirmed dispatch. In that window the run exists and is starting, and a second POST forks the pipeline.

## Rule 2: after a bump, let the dispatcher settle

The source doc's second rule: after a bump, let the dispatcher settle. One clean `group=fetches` round confirms currency; do not loop it (source doc).

This rule shapes how the recovery terminates. The instinct after any recovery is to re-verify by re-running the fetch group, but the playbook defines currency as one clean round: the fetch workflow re-resolves the pin against quay.io, lands the bump commit, and the agent confirms it in step 4. A second round adds no information if the first was clean, and each extra round is another dispatch governed by rule 1's duplicate hazard. "Boring" recovery, in the source doc's phrase, is one round plus verification, not a loop.

## Rule 3: `Docker_push` renames on forward

The source doc's third rule: `Docker_push` renames on forward; children declare `ci_Docker_push`, and forwarding the outer name 422s (source doc).

This is the input-plumbing detail that makes step 5 of the mechanism work or fail. The orchestrator-level workflow (`ci.yml`) names the input `Docker_push`, but the child workflows that receive it declare the input as `ci_Docker_push`. An agent that forwards the outer name to the child workflow dispatch gets an HTTP 422, an unprocessable request. The playbook's recorded usage in step 5 dispatches `ci_dev_image.yml` with `{"Docker_push":"false"}` at the orchestrator level (source doc); the renaming rule is what tells an agent why the child's declared input has the `ci_` prefix.

## How the rules interlock

The three rules cover the three ways the recovery can go sideways after a successful decision (doc 02):

- Rule 1 covers the dispatch POST itself: never retry an unconfirmed 204, verify by listing instead.
- Rule 2 covers the loop structure: one fetch round confirms currency, no looping.
- Rule 3 covers the re-dispatch inputs: child workflows rename forwarded inputs, so the outer name 422s against the child.

All three are records of observed failure behavior in this repo's CI, distilled into rules so the next self-mode recovery does not rediscover them. The source doc's phrase for the collection is "Rules that keep this boring" (source doc), which is the operational standard: the recovery should be uneventful, and these rules are what make it so.

## What this doc adds beyond the source doc

Nothing external was needed: all three rules, their failure modes, and the associated status codes (204 accepted, 202 cancellation, 422 unprocessable) are internal records of the playbook. The corpus adds only the structural reading above: each rule attaches to a distinct phase of the recovery, and together they close the gap between "the decision is right" (doc 02) and "the dispatch mechanics are safe" (this doc).
