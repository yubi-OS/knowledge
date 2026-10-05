# 07 Deploying a map module as a Worker API endpoint

Scope: Shipping a computation module as a Worker API endpoint: fetch handlers, routing, and serving numeric JSON results.

## The module boundary

A placement pipeline is easiest to compare across runtimes when the core computation lives in one module with a single entry point, and the deployment wraps that module in an HTTP handler. On Cloudflare Workers the handler contract is the fetch handler: handle incoming HTTP requests using the fetch() handler and return responses (https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/, weight 0.83). The handlers reference generalizes the idea: handlers are methods, such as fetch(), on Workers that can receive and process external inputs, and in the Python Workers flavor handlers are placed in a class named Default that extends the WorkerEntrypoint class imported from the workers SDK module (https://developers.cloudflare.com/workers/runtime-apis/handlers/, weight 0.95).

Wrapping a module this way means the same numeric code can sit behind a Worker endpoint, a local node script, or an app server, and the comparison between runtimes tests the module rather than the wrapper.

## Routing a path to the handler

An endpoint like /api/map is a routing decision: the Worker inspects the request URL and dispatches to the map module. Cloudflare's routing layer can also put a Worker on a path: to add a route you must have an active Cloudflare zone, a Worker to invoke, and a DNS record set up for the domain or subdomain proxied by Cloudflare, and route setup differs depending on the application type (https://developers.cloudflare.com/workers/configuration/routing/routes/, weight 0.96). Workers are positioned as a backend option explicitly: build back-end applications, build APIs and connect to data stores (https://developers.cloudflare.com/workers/, weight 0.96).

## Request and response patterns

The map request is a POST with a JSON body (the projected matrix plus parameters such as the seed, draw count, and rule) and the response is JSON with the placement results. The worker-template-fetch example repository shows the canonical patterns: making fetch requests from within a Worker script, generating JSON POST requests then reading in the resulting response body, aggregating multiple requests into one response, and following or catching redirects (https://github.com/cloudflare/worker-template-fetch, weight 0.59). The fetch() API itself is promises-based and a cleaner surface than XMLHttpRequest (https://davidwalsh.name/fetch, weight 0.58). For subrequests, the Workers fetch API supports preferring response compression by including the Accept-Encoding header, with both gzip and brotli supported (https://developers.cloudflare.com/workers/runtime-apis/fetch/, weight 0.89), which matters when the response payload is a large result matrix.

## Serving numeric results honestly

An endpoint that serves computed statistics should also serve the metadata that makes the numbers comparable: the runtime identity, the input dimensions, the seed, the draw count K, and a rule hash. Community discussion of Workers as API endpoints shows the common shape, a Worker endpoint fronting stored data with KV as the backing store (https://community.cloudflare.com/t/cloudflare-workers-as-an-api-endpoint/389646, weight 0.05; weak backing, forum thread). For a compute endpoint the backing store is not data but code: the deployed module version is the thing that must be pinned, since two versions of the same module can produce different rule hashes on identical inputs.

## Portability of the wrapper

The same module can be wrapped by other runtimes without changing the module code: Cloudflare documents deploying an Express.js application on Workers (https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/, weight 0.89), which demonstrates that the handler is a thin adapter over arbitrary framework code. The practical contract for a map endpoint is therefore: a stable path, a JSON request schema (matrix, seed, K, rule), a JSON response schema (classes, statistics, hashes, runtime identity), and no hidden state between invocations, so that the same request returns the same response on any runtime that implements the module faithfully.

## Sources considered

| source | url | weight |
|---|---|---|
| Cloudflare Workers handlers reference | https://developers.cloudflare.com/workers/runtime-apis/handlers/ | 0.95 |
| Cloudflare Workers overview | https://developers.cloudflare.com/workers/ | 0.96 |
| Cloudflare Workers routes | https://developers.cloudflare.com/workers/configuration/routing/routes/ | 0.96 |
| Cloudflare fetch handler | https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/ | 0.83 |
| Cloudflare fetch API | https://developers.cloudflare.com/workers/runtime-apis/fetch/ | 0.89 |
| Cloudflare Express on Workers tutorial | https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/ | 0.89 |
| worker-template-fetch GitHub | https://github.com/cloudflare/worker-template-fetch | 0.59 |
| davidwalsh.name fetch API | https://davidwalsh.name/fetch | 0.58 |
| Cloudflare homepage (off-topic hit) | https://www.cloudflare.com/ | 0.64 (weak, marketing) |
| Cloudflare community API endpoint thread | https://community.cloudflare.com/t/cloudflare-workers-as-an-api-endpoint/389646 | 0.05 (weak) |
| Medium JSON APIs on Workers | https://medium.com/@psgtech.mohan/how-to-deploy-json-apis-using-cloudflare-workers-8c08f52b1149 | 0.07 (weak) |
| Merriam-Webster deploy (off-topic hit) | https://www.merriam-webster.com/dictionary/deploy | 0.55 (weak, off-topic) |
