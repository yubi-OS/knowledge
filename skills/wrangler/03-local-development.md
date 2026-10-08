# 03 Local Development

Scope: `wrangler dev` modes, remote bindings for local runs, `.dev.vars` local secrets, and scheduled-event testing.

## Dev modes

`wrangler dev` is the local dev server and defaults to local mode, where bindings use local storage simulation (source doc). The skill's flag map (source doc):

- `wrangler dev` for local mode with simulated resources.
- `wrangler dev --env staging` to run against a config environment.
- `wrangler dev --local` to force local-only and disable remote bindings.
- `wrangler dev --remote` for the legacy remote mode that runs on Cloudflare's edge.
- `wrangler dev --port 8787` for a custom port.
- `wrangler dev --live-reload` for live reload on HTML changes.
- `wrangler dev --test-scheduled` to enable cron-handler testing, then visit `http://localhost:8787/__scheduled` to trigger the scheduled handler.

Cloudflare's local development docs describe remote bindings as bindings configured to connect to the deployed remote resource during local development instead of the locally simulated resource, supported by Wrangler among other surfaces (https://developers.cloudflare.com/workers/local-development/, weight 0.93). The same page and the Wrangler configuration reference both treat local simulation as the default and remote connections as opt-in per binding (https://developers.cloudflare.com/workers/wrangler/configuration/, weight 0.93).

## Remote bindings

Use `remote: true` in a binding's config to connect to the real resource while running locally (source doc). The skill's example marks an R2 bucket, the `ai` binding, and a Vectorize index as remote. The skill's recommendation list for remote bindings: Workers AI (required, since it always runs remotely), Vectorize, Browser Rendering, mTLS, and Images (source doc).

Workers AI carries an explicit cost warning: it always runs remotely and incurs usage charges even in local dev (source doc). A locally-run Worker with a remote AI binding is therefore a billable surface, not a free simulation.

## Local secrets with .dev.vars

Local development secrets belong in a `.dev.vars` file, with entries like `API_KEY=local-dev-key` and `DATABASE_URL=postgres://localhost:5432/dev` (source doc). Cloudflare's environment-variables docs describe `.dev.vars` as the local way to configure environment variables and note that environment-specific files can simulate different local environments, for example separate settings for a staging-like local profile (https://developers.cloudflare.com/workers/local-development/environment-variables/, weight 0.94). The local-development page similarly points at `.dev.vars` as the standard local configuration surface for values meant to differ between local and deployed environments (https://developers.cloudflare.com/workers/local-development/, weight 0.93).

Secrets set through `.dev.vars` are local-only; production secrets go through `wrangler secret put`, covered in the deployment doc (source doc).

## Why local-first

The skill's best-practices list says to test locally first, running `wrangler dev` with local bindings before deploying (source doc). Local simulation is fast, free, and needs no Cloudflare authentication; remote bindings exist for the cases where simulation cannot be faithful, primarily AI inference and services with no local emulation. The `--test-scheduled` endpoint exists because cron triggers never fire on their own during a dev session; the `/__scheduled` route is the manual trigger (source doc).

Grounding spine: yubi-OS/yubiOS skills/wrangler/SKILL.md (source doc).
