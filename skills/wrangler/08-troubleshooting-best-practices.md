# 08 Troubleshooting and Best Practices

Scope: the common issues table, debug commands, and the nine best practices, with grounding in the limits and debugging sources.

## Common issues

The skill's troubleshooting table pairs each failure with its fix (source doc):

| Issue | Solution |
|-------|----------|
| `command not found: wrangler` | Install with `npm install -D wrangler` |
| Auth errors | Run `wrangler login` |
| Startup time limit exceeded | Run `wrangler check startup` to profile startup and generate CPU profiles |
| Type errors after config change | Run `wrangler types` |
| Local storage not persisting | Check the `.wrangler/state` directory |
| Binding undefined in Worker | Verify the binding name matches config exactly |

Two of these have deeper grounding. The startup-time row connects to the platform limits: Wrangler automatically generates a CPU profile importable into Chrome DevTools or VS Code, and the limits page points at `wrangler check startup` for measuring startup time (https://developers.cloudflare.com/workers/platform/limits/, weight 0.95; see also https://developers.cloudflare.com/workers/observability/dev-tools/cpu-usage/, weight 0.93). The auth row connects to `wrangler login`; a community-reported failure mode exists where `wrangler login` times out waiting on the local callback port, documented in workers-sdk issue 10509 (https://github.com/cloudflare/workers-sdk/issues/10509, weight 0.7; a primary bug report for that specific timeout case, not a general authority).

## Debug commands

Three commands cover auth, performance, and config discovery (source doc): `wrangler whoami` to check authentication status, `wrangler check startup` to profile Worker startup time, and `wrangler docs configuration` to view the config schema. For live debugging beyond logs, Cloudflare documents breakpoint debugging from within the Wrangler CLI: run `wrangler dev` and press `d` to open a DevTools debugger session, with VS Code setup documented alongside (https://blog.cloudflare.com/debugging-cloudflare-workers/, weight 0.88).

## Best practices

The skill lists nine, in order (source doc):

1. Version control `wrangler.jsonc`; treat it as the source of truth for Worker config.
2. Use automatic provisioning: omit resource IDs to have resources auto-created on deploy.
3. Run `wrangler types` in CI as a build step to catch binding mismatches.
4. Use environments: separate staging and production with `env.staging` and `env.production`.
5. Set `compatibility_date` and update quarterly to get new runtime features; the date opts the project into a specific runtime version (https://developers.cloudflare.com/workers/configuration/compatibility-dates/, weight 0.94).
6. Use `.dev.vars` for local secrets; never commit secrets to config.
7. Test locally first: `wrangler dev` with local bindings before deploying.
8. Use `--dry-run` before major deploys to validate changes without deployment.
9. Never embed secrets in commands: use interactive prompts (`wrangler secret put`), file-based input (`wrangler secret bulk`), or secure CI environment variables; never echo, log, or pass secret values as CLI arguments.

Items 1 through 4 form a config hygiene block: the config file is versioned truth, environments express the staging and production split, and CI type generation is the automated check that config and code agree. Items 5 through 8 form a runtime hygiene block: current compatibility date, local-first testing, and dry-run validation. Item 9 is the security floor and is restated in the secrets section of the skill with the same force (source doc).

Cloudflare's Workers overview frames the deploy target these practices protect: serverless applications across Cloudflare's global network, with errors and exceptions documentation and OpenTelemetry export among the platform surfaces (https://developers.cloudflare.com/workers/, weight 0.9). Framework authors rely on the same workflow; Hono documents developing locally and publishing with a few Wrangler commands (https://hono.dev/docs/getting-started/cloudflare-workers, weight 0.84).

## Failure-mode summary

The recurring pattern across the table: most failures are state mismatches, stale types after a config change, a binding name that drifted between config and code, local state in `.wrangler/state`, or an auth token that expired. The fix set is correspondingly small and command-shaped: `wrangler types`, `wrangler whoami` or `wrangler login`, `wrangler check startup`, and a config diff. Reach for these before reaching for platform support.

Grounding spine: yubi-OS/yubiOS skills/wrangler/SKILL.md (source doc).
