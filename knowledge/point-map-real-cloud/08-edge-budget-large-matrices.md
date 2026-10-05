# 08 Edge budgets for large matrix workloads

Scope: Running large matrix workloads at the edge versus client-side: payload size limits and when to shift work off the server.

## The payload wall

A point-map request carries the projected cloud as JSON: N rows of d floats. At hundreds of rows and a few dozen dimensions the body stays manageable, but the same request at full embedding dimension does not, and every serverless platform draws a hard line. Vercel documents that the maximum payload size for the request body or the response body of a Vercel Function is 4.5 MB (https://vercel.com/docs/functions/limitations, weight 0.96). When a request or upload exceeds it, the function returns a 413 FUNCTION_PAYLOAD_TOO_LARGE error, and the documented playbook is to measure the payload first, then restructure the upload (https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions, weight 0.66). Third-party guides report the same ballpark for other runtimes: keeping JSON payloads under about 6 MB for Lambda, avoiding large JSON imports at module level, and a 4 MB response size limit on the Vercel Edge runtime (https://jsonic.io/guides/json-serverless, weight 0.19; weak backing).

The structural answer to the payload wall is the same one the projection stage already provides: shrink d before shipping the matrix. A 301 by 24 cloud is roughly 30 times smaller than a 301 by 768 cloud, which is the difference between a comfortable request body and one that competes with platform limits.

## Where the compute should run

Serverless functions are written in JavaScript and run on the Node runtime in typical CMS-hosted deployments (https://developers.hubspot.com/docs/cms/start-building/features/serverless-functions/overview, weight 0.78), and platforms position themselves around deploying APIs, scheduled tasks, workflows, and event-driven apps to functions like AWS Lambda (https://www.serverless.com/, weight 0.68). The trade-off space for CPU-heavy numeric work is captured in third-party comparisons: edge functions deliver very fast cold starts but cost more for CPU-heavy tasks, which argues for hybrid architectures that keep CPU-heavy compute off the edge path (https://byteiota.com/edge-vs-serverless-2026-when-to-use-each-cpu-trap/, weight 0.14; weak backing). Broader architectural guides describe a shift toward client-side edge computing, covering the mechanics, benchmarks, and implementation workflows of moving work to the client (https://www.sjcreation.tech/blog/edge-computing-vs-cloud-serverless-architecture-the-shift-to-client-side/, weight 0.28; weak backing).

## The decision rule for a placement run

Three levers exist when an edge run fails or strains, and they compose:

1. Reduce d. Project to fewer components before the request. This only works when the downstream rules read a subspace no larger than what the projection keeps, which is verifiable from the rule definition.
2. Reduce K. The null-model draw count is the other multiplier. A smaller K gives a coarser null distribution but a valid one, provided the K used is recorded with the results and the null spread is still wide enough to be meaningful.
3. Move the compute client-side. The binarization, placement, and null-model stages are pure functions of the projected matrix, so a browser or local node can run them when the edge budget will not hold. The cost is losing the single shared runtime that makes cross-runtime comparisons trivial, so client-side runs should log the same rule hash and seed as edge runs.

A practical budget note from running this class of pipeline: an edge runtime can pass moderate sizes within its window while a smaller-draw configuration passes where the larger one intermittently fails. Treat intermittent failure at a given size as a signal to drop a lever rather than to retry, because per-isolate limits are shared across concurrent requests and a size at the margin will keep flapping.

## What to record either way

Whether the run happened at the edge or client-side, the record should carry: runtime identity, N and d, the draw count K, wall time, seed, rule hash, and the outcome statistics. That record is what allows a K=40 edge run and a K=60 client-side run to be compared honestly: the statistics differ only through the null resolution, and the recorded K makes that difference visible instead of hidden.

## Sources considered

| source | url | weight |
|---|---|---|
| Vercel Functions limits | https://vercel.com/docs/functions/limitations | 0.96 |
| Vercel body size limit guide | https://vercel.com/kb/guide/how-to-bypass-vercel-body-size-limit-serverless-functions | 0.66 |
| HubSpot serverless functions docs | https://developers.hubspot.com/docs/cms/start-building/features/serverless-functions/overview | 0.78 |
| Serverless Framework | https://www.serverless.com/ | 0.68 |
| ScienceDirect article (empty content) | https://www.sciencedirect.com/science/article/am/pii/S0963868717302196 | 0.93 (weak, no usable content) |
| jsonic.io JSON serverless guide | https://jsonic.io/guides/json-serverless | 0.19 (weak) |
| byteiota edge vs serverless | https://byteiota.com/edge-vs-serverless-2026-when-to-use-each-cpu-trap/ | 0.14 (weak) |
| sjcreation client-side edge computing guide | https://www.sjcreation.tech/blog/edge-computing-vs-cloud-serverless-architecture-the-shift-to-client-side/ | 0.28 (weak) |
| designgurus compute model comparison | https://designgurus.substack.com/p/edge-computing-vs-serverless-vs-traditional | 0.27 (weak) |
| dev.to serverless vs edge | https://dev.to/programordie/serverless-vs-edge-vs-traditional-servers-which-ones-the-best-fit-for-you-4aoh | 0.06 (weak) |
| fixdevs Vercel Blob guide | https://fixdevs.com/blog/vercel-blob-not-working/ | 0.07 (weak) |
| Merriam-Webster client (off-topic hit) | https://www.merriam-webster.com/dictionary/client | 0.52 (weak, off-topic) |
