# 03 - Path 2: /api/repo-items one-call full text

Scope: the steady-orbit worker's /api/repo-items endpoint, what one call returns, when it beats the mirror, and the executor constraint that comes with it.

## The endpoint

Path 2 is a single HTTP call that returns the entire knowledge repo's text (source doc: yubi-OS/yubiOS skills/corpus-recall/SKILL.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/corpus-recall/SKILL.md):

```
POST https://steady-orbit.systems-a.workers.dev/api/repo-items
{"repo":"yubi-OS/knowledge","subdir":"knowledge"}
```

The source doc describes it as the worker's existing instrument pointed at the knowledge repo, measured at 824 items with full text and paths in about 1 second, a 7.3 MB response (source doc). The measurement is dated to when the skill was written; the item count grows with each mint, so treat 824 as a historical snapshot, not a live figure.

## What one call replaces

The economics are the argument for the endpoint: one call replaces any number of file fetches (source doc). Path 1 costs a 1.5 MB tarball and a local extract; Path 3 costs one request per doc. Path 2 costs one request and returns everything with paths attached, which makes it the natural fit for jobs that need the full corpus text in-process: building topic maps, computing embeddings, triaging which docs touch a theme. The source doc's examples put it exactly there: "Build a topic index across all corpora: Path 2, grep item labels for topic keywords, keep only paths + titles in context" (source doc).

## Never dump it into context

A 7.3 MB response is far too large to read directly. The source doc is explicit: pipe the response through grep in-script, never dump it into context (source doc). Practically this means the script that calls /api/repo-items should also do the filtering, and the only thing that reaches the model's context is the matched paths, titles, or quoted lines. This is the same context-hygiene rule the skill applies to full doc bodies (see 07-usage-patterns), applied at response scale.

## The executor constraint

The endpoint has one hard gotcha, recorded twice in the source doc: it lives on the workers.dev origin, and the Sauna sandbox's egress blocks workers.dev with Cloudflare error 1010 regardless of headers (source doc). The rule that follows: call /api/repo-items from run_script with executor "worker" only (source doc). A sandbox call does not fail soft; it fails with CF 1010, and no header tweaking fixes it, because the block is on the origin itself, not on auth or user agent.

Background on the origin: workers.dev is Cloudflare's provided subdomain for serving Workers over HTTPS, and Cloudflare's routing docs treat it as a distinct routing surface from custom domains (source: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/, jev 0.92). Cloudflare's custom-domains documentation confirms workers.dev is the default free subdomain route while custom domains are a separate configuration (source: https://developers.cloudflare.com/workers/configuration/routing/custom-domains/, jev 0.93). Third-party integration guides route API extensions through Workers endpoints the same way, which is why tooling that proxies or sandboxes egress has to treat workers.dev origins specially (source: https://docs.dify.ai/en/cloud/use-dify/workspace/api-extension/cloudflare-worker, jev 0.91).

## Auth

The call is authenticated via the Steady Orbit jev operator connection (source doc). The endpoint is not a public anonymous API; the operator credential is what authorizes the POST against the steady-orbit worker.

## When to pick Path 2

Pick Path 2 when you need full text in one shot and the job is mapping, embedding, or triage shaped (source doc, Guidelines). Pick Path 1 instead when the job is grep-shaped and you want to iterate many arbitrary searches offline, and Path 3 when the doc path is already known and you need a single file. If a Path 2 call fails with CF error 1010, that is the sandbox-egress signature: switch to the worker executor, not to header retries.
