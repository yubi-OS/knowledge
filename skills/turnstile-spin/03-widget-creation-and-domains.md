# 03 Widget creation and domains

Scope: how turnstile-spin creates the Turnstile widget (Wrangler subcommand or the API-backed helper script), registers domains including the localhost rule, captures the sitekey and secret, and why it never falls back after an auth failure.

Ground spine: `yubi-OS/yubiOS skills/turnstile-spin/SKILL.md` (source doc), Steps 5 and 8.

## What a widget is

A Turnstile widget is an instance of Turnstile embedded on a webpage. Each widget has a sitekey, the public identifier placed in HTML, and a secret key, the private credential the server uses to validate tokens; configuration covers mode, hostnames, and appearance (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/). The widget runs in one of three modes: Managed, which automatically chooses between a non-interactive or checkbox challenge based on visitor risk; Non-Interactive, which shows a spinner but never asks the visitor to interact; and Invisible, which runs entirely in the background. Managed is the recommended default (weight 0.94, https://developers.cloudflare.com/turnstile/concepts/widget/).

The skill always creates the widget with `--mode managed` (source doc, Step 8), which matches Cloudflare's recommendation and keeps behavior adaptive rather than pinned.

## Domain registration

Step 5 fixes the domain set before creation. Two entries are unconditional: `localhost` and `127.0.0.1` are always included (source doc, Step 5). The production domain is scanned from the repository itself: `package.json` `homepage`, `wrangler.toml`, `README.md`, `AGENTS.md`, and the git remote (source doc, Step 5). If no production domain is found, the agent asks rather than guesses.

The dashboard version of the same flow confirms the semantics: Spin's domain chips add `localhost` and `127.0.0.1` automatically for local development, and the backend must validate the deployment-specific hostname returned by Siteverify while never allowing local hostnames in production (weight 0.71, https://developers.cloudflare.com/turnstile/spin/).

The source doc adds the safety condition that makes one widget cover both environments: registering local and production domains on one widget is safe only when each backend deployment validates the exact frontend hostname returned by siteverify. Never include `localhost` or `127.0.0.1` in a production backend's expected-hostname allowlist (source doc, Step 5). The widget can be broad; each backend's check must be narrow.

Upstream drift note: the source doc's Step 8 shows the create command with `--domain <d1> --domain <d2>` repeated flags. The current Wrangler docs state that `--domain` accepts comma-separated values (`--domain a.com,b.com`) or repeated flags (weight 0.71, https://developers.cloudflare.com/turnstile/spin/, dated correction from the 2026-07-23 doc revision). Both forms work; the repeated-flag form in the source doc is the canonical one for the skill's scripts.

## Creation paths

Prefer the approved Wrangler executable when its `turnstile widget` subcommand is available (source doc, Step 8):

```sh
WRANGLER_WRITE_LOGS=false WRANGLER_LOG=log WRANGLER_LOG_SANITIZE=true \
  "$WRANGLER_BIN" turnstile widget create "<name>" \
  --domain <d1> --domain <d2> ... --mode managed --json
```

If the approved executable is missing or older than the Turnstile subcommand, use `scripts/widget-create.sh --account-id <id> --name <name> --domains <list> --mode managed` with the same capture pattern (source doc, Step 8). The script wraps the direct API call, whose canonical shape is a POST to `https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/challenges/widgets` with a JSON body of `domains`, `mode`, and `name`, authenticated by `Authorization: Bearer $CLOUDFLARE_API_TOKEN` (weight 0.91, https://developers.cloudflare.com/turnstile/get-started/widget-management/api/).

Two rules bound the choice. Do not fall back after an authentication or API failure: if the create call fails at the auth or API layer, report, do not switch tools and retry blindly (source doc, Step 8). And the environment variables around every Wrangler call are not optional hygiene: `WRANGLER_WRITE_LOGS=false`, `WRANGLER_LOG=log`, and `WRANGLER_LOG_SANITIZE=true` constrain Wrangler's disk logs and debug output so the response can never leak through them (source doc, Step 8; mirrored in the upstream Spin doc at weight 0.71, https://developers.cloudflare.com/turnstile/spin/).

## Capture discipline

In a `set +x` subshell, the agent captures the complete stdout JSON in one shell variable, parses `SITEKEY` and a non-empty, non-whitespace `WIDGET_SECRET` with `jq`, then unsets the response variable (source doc, Step 8). Three properties make this safe: shell tracing is off for the capture, the secret never persists in an exported variable or a file, and the parse doubles as validation (a missing or whitespace secret fails the jq check rather than flowing downstream).

Reporting is asymmetric by design: report only the sitekey, never print the complete response, and never write the secret to disk except into the user's own secret store in Step 9 (source doc, Step 8). The sitekey is public and belongs in HTML; the secret is the server's credential and follows the guarded flow of doc 07.

## Why managed mode and one widget

The corpus-level reading: the skill optimizes for a single adaptive widget whose breadth lives in the domain list, with the real security boundary enforced per deployment by the siteverify hostname check (doc 06). That division keeps creation simple, keeps local development working, and keeps production strict without multiplying widgets per environment, a pattern the upstream get-started guidance treats as the operational default of separating widgets per environment only when the hostname check is not trusted to do the separation (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/, best-practices section).
