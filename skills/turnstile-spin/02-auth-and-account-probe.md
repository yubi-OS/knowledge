# 02 Auth and account probe

Scope: how turnstile-spin establishes Cloudflare API credentials: token creation with the Account.Turnstile:Edit scope, the auth-probe status machine, the approved canonical WRANGLER_BIN constraints, and token handoff that never puts the token in chat.

Ground spine: `yubi-OS/yubiOS skills/turnstile-spin/SKILL.md` (source doc), Steps 2 through 4.

## The credential the flow needs

The wizard's first irreversible action is the auth and scope probe (source doc, Step 3). It needs a Cloudflare API token with the `Account.Turnstile:Edit` permission, scoped to the target account in Account Resources. When the probe returns `missing_token` or `missing_scope`, the source doc directs the user to create a custom token at https://dash.cloudflare.com/profile/api-tokens and explicitly warns: do not direct them to `wrangler login` unless wrangler's OAuth scope includes `Account.Turnstile:Edit`, which varies by wrangler version (source doc, Step 3).

The API-management page confirms the permission family from the other side: creating or updating a Turnstile widget through the Cloudflare API requires at least one of `Turnstile Sites Write` or `Account Settings Write` (weight 0.91, https://developers.cloudflare.com/turnstile/get-started/widget-management/api/). The permissions reference lists these as account-category token permissions (weight 0.61, https://developers.cloudflare.com/fundamentals/api/reference/permissions/). The skill's stricter ask, `Account.Turnstile:Edit` with the account included in Account Resources, is the narrowest write-scoped grant for exactly this account, which is why the source doc prefers it over `wrangler login`'s broader OAuth grant.

## The status machine

`scripts/auth-probe.sh` returns one of seven statuses, and each has a prescribed response (source doc, Step 3):

- `ok`: continue to Step 4. The script already picked the account (a single-account token, or one matching `$CLOUDFLARE_ACCOUNT_ID`).
- `missing_token` or `missing_scope`: offer the two no-chat token handoffs below, then re-run the probe.
- `network_failure`: the probe could not reach `api.cloudflare.com`. Show the diagnostic (VPN or proxy, TLS interception, DNS). The source doc is explicit: do not treat this as a scope problem (source doc, Step 3 and Guidelines 3). Fix connectivity, then re-run.
- `upstream_failure`: the API returned an unexpected response with a non-4xx http_code. Do not assume the token is bad; show the code, wait briefly, retry the probe (source doc, Step 3 and Guidelines 4).
- `multiple_accounts`: the token covers more than one account and `$CLOUDFLARE_ACCOUNT_ID` is unset. Present the numbered accounts list, wait for the user's choice, export `CLOUDFLARE_ACCOUNT_ID=<chosen>`, and re-run the probe (source doc, Step 3 and the edge-case table).
- `account_mismatch`: `$CLOUDFLARE_ACCOUNT_ID` is set but is not among the token's accounts. Show the accounts list and ask the user to unset the variable or set it to one of those IDs (source doc, Step 3).

The distinction between `network_failure` and `upstream_failure` is diagnostic, not cosmetic: neither means the token is wrong, and the source doc forbids treating either as an auth failure.

## Wrangler constraints for enumeration

Account enumeration needs either an explicit `$CLOUDFLARE_ACCOUNT_ID` or Wrangler (source doc, Step 2). When Wrangler is involved, the source doc imposes three constraints. First, the binary must be a user-approved canonical absolute `WRANGLER_BIN` outside the project, with an exact `WRANGLER_VERSION` recorded. Second, never use `npx`, `pnpm exec`, a package script, a project-local binary, or any unapproved executable for a credential-bearing command. Third, never install Wrangler automatically during the flow (source doc, Step 2; repeated in "Things you must NOT do").

The motivation is supply-chain integrity: a credential-bearing command run through project package resolution can be redirected by repository text, which the source doc treats as untrusted data (source doc, "Things you must NOT do", last bullet). The edge-case table adds the fallback: if account enumeration is unavailable entirely, ask the user for the account ID and export `CLOUDFLARE_ACCOUNT_ID` instead of installing anything (source doc, edge cases).

## Token handoff without chat

The source doc forbids asking the user to paste an API token into chat (source doc, Step 3; Guidelines 2). It offers two channels, cleanest first (source doc, Step 3):

1. Export and relaunch: read the token with `read -rsp`, `export CLOUDFLARE_API_TOKEN="$token"`, unset the variable, and restart the agent from that terminal. The token enters neither chat nor shell history.
2. Save to file: `umask 077`, read the token, `printf '%s' "$token" > ~/.cf-turnstile-token`, unset, then load it without printing it. The file is user-only by permission.

Once auth is established, the agent re-runs `auth-probe.sh` and resumes from Step 4 (source doc, Step 3). The same no-chat discipline later extends to the widget secret, which has its own guarded flow (see doc 07).

## Why a probe at all

The probe runs before any widget mutation, so the flow fails fast on the three credential failure modes it can detect cheaply (missing token, wrong scope, wrong account) and separates them from the two it cannot (network, upstream). Every non-ok status routes the user to a fix rather than letting the agent improvise around the credential layer, which is the property that keeps the rest of the wizard safe to automate.
