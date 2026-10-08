# 07 Observability and Testing

Scope: `wrangler tail`, the observability config block, startup profiling with `wrangler check startup`, and the Vitest integration.

## Tail logs

`wrangler tail` streams live logs from a deployed Worker (source doc). The flag set (source doc): `wrangler tail my-worker` to tail a specific Worker, `--status error` to filter by status, `--search "error"` to filter by search term, and `--format json` for JSON output. Tail is the fastest loop between deploy and diagnosis: ship, reproduce, watch the stream.

## Observability config

Config-side logging is enabled with an `observability` block: `"observability": { "enabled": true, "head_sampling_rate": 1 }` (source doc). Cloudflare's Workers Logs page describes head-based sampling as logging a percentage of incoming requests, which for high-traffic applications reduces log volume and manages cost while still providing meaningful data (https://developers.cloudflare.com/workers/observability/logs/workers-logs/, weight 0.91). A rate of 1 means every request is logged; lowering it trades completeness for cost.

The broader observability surface covers logs, traces, metrics, and other data sources for understanding Worker performance (https://developers.cloudflare.com/workers/observability/, weight 0.92), and Cloudflare documents log capture, retrieval, and forwarding for its dynamic Workers variant as well (https://developers.cloudflare.com/dynamic-workers/usage/observability/, weight 0.9).

## Startup profiling

`wrangler check startup` measures Worker startup time and detects scripts that exceed the startup time limit (source doc). This maps directly onto a real failure mode: Cloudflare rejects deploys whose script startup exceeds the CPU time limit, and the documented remedy is `npx wrangler check startup`, which builds the Worker, analyzes the startup phase, and writes a `worker-startup.cpuprof`-style profile (https://nilaykabariya.blog/deploy/script-startup-exceeded-cpu-time-limit-10021, weight 0.1, weak; anecdotal blog, cited only as corroboration of the workflow).

The authoritative description comes from the limits page: Wrangler automatically generates a CPU profile that can be imported into Chrome DevTools or opened in VS Code, and refers readers to `wrangler check startup` for details (https://developers.cloudflare.com/workers/platform/limits/, weight 0.95). The CPU-usage profiling page covers keeping CPU time per request under Workers limits (https://developers.cloudflare.com/workers/observability/dev-tools/cpu-usage/, weight 0.93).

## Testing with Vitest

The skill installs the Workers Vitest integration as dev dependencies: `npm install -D @cloudflare/vitest-pool-workers vitest` (source doc). The `vitest.config.ts` uses `defineWorkersConfig` from `@cloudflare/vitest-pool-workers/config` with `poolOptions.workers.wrangler.configPath` pointing at `./wrangler.jsonc` (source doc), so tests run inside the same runtime and binding environment the config declares.

Cloudflare's Vitest integration configuration docs document the integration's options, including `main` as the Worker entry point run in the same isolate and context as the tests (https://developers.cloudflare.com/workers/testing/vitest-integration/configuration/, weight 0.89). The integration was announced by Cloudflare as allowing unit and integration tests via Vitest that execute directly in workerd, the Workers runtime (https://blog.cloudflare.com/workers-vitest-integration/, weight 0.86). A community guide frames the choice: Workers run in the V8 isolate runtime, not Node.js, so testing requires Miniflare or Wrangler's built-in Vitest integration, with Vitest plus Wrangler being the most accurate option (https://helpmetest.com/blog/cloudflare-workers-testing/, weight 0.13, weak; corroborates only). Framework-level usage is documented by Hono, which shows the `cloudflare:test` module exposing `env` from the config (https://hono.dev/examples/cloudflare-vitest, weight 0.72).

## Scheduled-event testing

Cron handlers need a manual trigger in dev: run `wrangler dev --test-scheduled`, then `curl http://localhost:8787/__scheduled` (source doc). Without this flag, the scheduled handler never runs during a dev session, which makes it a classic source of "works in prod, untested locally" gaps.

Grounding spine: yubi-OS/yubiOS skills/wrangler/SKILL.md (source doc).
