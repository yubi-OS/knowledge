# Pin and matrix scoring

Scope: steps 1 and 2 of the runflow. Pin the branch SHA, pull the corpus fresh from codeload, count the docs, and score the whole matrix per-doc at concurrency 12 into a resumable JSONL.

## Step 1: pin

The round pins its input. `GET /repos/yubi-OS/yubiOS/branches/main` returns the head SHA (source doc yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md). Then the corpus is pulled fresh from `codeload.github.com/yubi-OS/yubiOS/tar.gz/refs/heads/main` and the operator extracts `refs/` plus `tools/point-map/taskcheck_refs.sh` (source doc). The source doc is explicit that a stale mirror is never reused: the corpus grows every round, so the doc count is re-derived each time (source doc).

This is the unit protocol's freshness guarantee in miniature. Because every unit re-derives its own frozen frame with no carryover across units (source doc), a cached corpus from yesterday's round would silently shift the frame the measurement runs on. The codeload tarball is the honest fetch path: it is the same archive GitHub serves for repository archives over plain HTTP (https://stackoverflow.com/questions/8377081/github-api-download-zip-or-tarball-link, weight 0.14, weak), and the pin SHA ties the round's numbers to an exact commit.

## Step 2: score the matrix at concurrency 12

The whole `refs/` corpus is scored per-doc with `POST /api/jev/corpus/scorer/score {doc:{name,text}}` at concurrency 12 (source doc). The number 12 is not a preference, it is a measurement. The refs10 experiment found: concurrency 6 gives 3.9 seconds per 24-doc slice, concurrency 12 gives 2.5 seconds, and concurrency 24 or above is worse because the per-call p50 inflates from 716ms to 1.9 seconds (source doc). At scale, that is about 257 docs in about 27 seconds at concurrency 12 versus 52.7 seconds at concurrency 6 (source doc).

The sweet-spot shape is a common property of HTTP client concurrency tuning: pushing more requests in flight helps until a resource pool saturates, then latency per call degrades and total throughput falls (https://csv2geo.com/blog/concurrency-tuning-geocoding-sweet-spot, weight 0.22, weak). The refs10 numbers are the strong evidence; the external link only names the phenomenon. Every score call is an ordinary HTTP request-response exchange, which is why the per-call latency floor eventually dominates (https://developer.mozilla.org/en-US/docs/Web/HTTP, weight 0.87).

## The batch route is a trap

The batch route `POST /scorer/matrix` returns 500 through the egress proxy; per-doc pooling at concurrency 12 is the working path (source doc). This is a lesson the flow encodes so no operator rediscovers it: the endpoint that looks architecturally superior is the one that fails, and the one that looks brute-force is the one that works. The response is saved as JSONL keyed by doc name, which makes the scoring resumable (source doc). If a run dies mid-matrix, the operator re-reads the JSONL, scores only the missing docs, and reconstructs the full matrix without repeating work.

## Why the matrix must be complete before the baseline

Steps 3 and 9 consume the matrix. The frozen-baseline check posts the matrix to the audit, and the gate-grade audit at step 9 rebuilds the matrix with one re-scored row (source doc). A partial or stale matrix would produce a gate statistic over the wrong corpus shape, so step 2 is a hard prerequisite, not an optimization target. The only legitimate speedups are the ones the flow itself encodes: concurrency 12 and the resumable JSONL.

## What this record does not claim

This record does not describe the scorer's internal model or the audit statistic (both belong to doc 03 and the `jev-corpus` skill), and it does not claim the concurrency sweet spot generalizes to other endpoints; it is measured for the scorer route specifically (source doc).

Sources: yubi-OS/yubiOS skills/jev-corpus-unit-round/SKILL.md (source doc); MDN HTTP index (https://developer.mozilla.org/en-US/docs/Web/HTTP, weight 0.87); MDN HTTP overview (https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview, weight 0.90); CSV2GEO concurrency tuning (https://csv2geo.com/blog/concurrency-tuning-geocoding-sweet-spot, weight 0.22, weak); Stack Overflow on GitHub archive links (https://stackoverflow.com/questions/8377081/github-api-download-zip-or-tarball-link, weight 0.14, weak).
