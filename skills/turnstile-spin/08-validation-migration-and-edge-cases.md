# 08 Validation, migration, and edge cases

Scope: the two-stage validation protocol (dummy probe plus real end-to-end token and replay rejection), migration from reCAPTCHA and hCaptcha, and the edge cases the wizard must handle without improvising.

Ground spine: `yubi-OS/yubiOS skills/turnstile-spin/SKILL.md` (source doc), Step 10, "Migrating from another CAPTCHA", and the edge-case table.

## Stage 1: the dummy probe

For a newly created widget, Step 10 runs `scripts/validate.sh` with the secret piped on standard input:

```sh
(set +x; printf '%s' "$WIDGET_SECRET" | scripts/validate.sh --sitekey "$SITEKEY" \
  --account-id "$ACCOUNT_ID" --expected-domains "$EXPECTED_DOMAINS_JSON")
```

The validator reads the secret only from standard input and never writes it to disk or command arguments; the variable is unset afterward (source doc, Step 10). `EXPECTED_DOMAINS_JSON` is the user-approved JSON array of domains from Step 5.

The probe's trick is that it sends a deliberately invalid token and reads the response the way an attacker cannot fake: `invalid-input-response` is expected for the dummy probe token, and that means the secret IS valid; validate.sh treats this as success (source doc, edge-case table). The reason is upstream's error semantics: `invalid-input-response` means the response parameter was invalid, malformed, or expired, while `invalid-input-secret` means the secret itself is wrong (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/; community confirmation at weight 0.07, https://community.cloudflare.com/t/i-keep-receiving-invalid-input-response-when-doing-server-side-validation/736552, weak backing). A dummy token is always invalid, so a valid secret produces exactly `invalid-input-response` and nothing else. If the response instead contains `invalid-input-secret`, the secret did not reach the backend correctly.

The guarded retrieval flow of doc 07 uses the same probe inline: `success: false` with `invalid-input-response` present and `invalid-input-secret` absent, checked in Python against the siteverify response (source doc, existing-widget flow, Step 7).

## Stage 2: end-to-end validation

The dummy probe only proves the credential. Stage 2 exercises the actual protected backend: send a fresh real Turnstile token through the real handler, verify one successful request, then verify that replaying the token is rejected (source doc, Step 10). This is where the token lifecycle of doc 05 becomes an observable fact: the first siteverify call redeems the token, and the replay must fail with `timeout-or-duplicate` (weight 0.95, https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

The failure posture is strict: if the backend cannot be run, report destination validation as pending and do not claim end-to-end success (source doc, Step 10; repeated for the existing-widget flow in Step 8). Validation is not optional, and neither is honesty about its absence: "do not skip validation" is one of the source doc's must-nots (source doc, "Things you must NOT do").

When validation fails with `invalid-input-secret`, the source doc prescribes the remediation path: re-check `TURNSTILE_SECRET` in the customer's env or secret manager, and for a Workers backend run `wrangler secret list` to confirm the secret is bound to the right script (source doc, edge-case table). A token expired mid-flow is different: stop, re-run `scripts/auth-probe.sh`, and prompt for fresh credentials (source doc, edge-case table).

## Migration from reCAPTCHA and hCaptcha

During the Step 6 scan, the agent looks for existing reCAPTCHA or hCaptcha and switches Step 7 to a migration plan (source doc, "Migrating from another CAPTCHA"). Detection signals (source doc):

- reCAPTCHA: the script URL `https://www.google.com/recaptcha/api.js`, `class="g-recaptcha"`, `data-sitekey="6L..."`, and a backend POST to `/recaptcha/api/siteverify`.
- hCaptcha: the script URL `https://js.hcaptcha.com/1/api.js`, `class="h-captcha"`, and a backend POST to `https://hcaptcha.com/siteverify`.

The substitution table (source doc):

| From | To |
| --- | --- |
| reCAPTCHA or hCaptcha script tag | `https://challenges.cloudflare.com/turnstile/v0/api.js` (`async defer`) |
| `class="g-recaptcha"` / `class="h-captcha"` divs | `class="cf-turnstile"`, new sitekey, meaningful `data-action` |
| `g-recaptcha-response` / `h-captcha-response` token field | `cf-turnstile-response` |
| reCAPTCHA `/recaptcha/api/siteverify` or hCaptcha `/siteverify` backend URL | `https://challenges.cloudflare.com/turnstile/v0/siteverify` |
| `RECAPTCHA_SECRET` / `HCAPTCHA_SECRET` env vars | `TURNSTILE_SECRET` |

Upstream confirms the substitution shape and adds two compatibility details (weight 0.89, https://developers.cloudflare.com/turnstile/migration/hcaptcha/; weight 0.94, https://developers.cloudflare.com/turnstile/migration/recaptcha/). For reCAPTCHA, the script can load with `?compat=recaptcha`, which enables implicit rendering for reCAPTCHA containers, the `g-recaptcha-response` input name, and registering the Turnstile API as `grecaptcha`; migration is compatible up to reCAPTCHA v2 (weight 0.94, https://developers.cloudflare.com/turnstile/migration/recaptcha/). A subtle trap the docs make explicit: reCAPTCHA's siteverify accepts GET requests with query parameters, while Turnstile's endpoint does not and only accepts POST with a FormData or JSON body (weight 0.94, https://developers.cloudflare.com/turnstile/migration/recaptcha/). A migrated backend that merely swaps the URL in a GET call will fail.

Edge cases the source doc tells the agent to surface (source doc, "Migrating from another CAPTCHA"):

- reCAPTCHA v3 score thresholds: Turnstile has no score. Tell the user explicitly that migrated code will reject on `success === false`.
- reCAPTCHA Enterprise: do not auto-migrate; point the user at https://developers.cloudflare.com/turnstile/migration/recaptcha/.
- Custom `action=` values: preserve any valid custom action the user passed to `grecaptcha.execute` as `data-action`; otherwise use the stable action from Step 7. Validate the returned action in the backend either way.

## Edge cases

The source doc's edge-case table covers the rest:

| Situation | Action |
| --- | --- |
| Account enumeration unavailable | Ask for the account ID and export `CLOUDFLARE_ACCOUNT_ID`, or get approval for a canonical absolute `WRANGLER_BIN` and exact version. Never install or run a project-local Wrangler. |
| Multiple Cloudflare accounts | `auth-probe.sh` returns all accounts; ask the user to choose and export `CLOUDFLARE_ACCOUNT_ID`. |
| Cloudflare Pages project | Wire siteverify inside a Pages Function. The Pages Plugin (developers.cloudflare.com/pages/functions/plugins/turnstile/) is a shortcut (weight 0.61, https://developers.cloudflare.com/pages/functions/plugins/turnstile/). |
| Cloudflare Workers backend | Use the canonical fetch idiom from Step 9 inside the Worker's request handler; `fetch` to `challenges.cloudflare.com` works the same as in Node. |
| `EXPECTED_HOSTNAME` mismatch | Update widget domains via PUT, not PATCH; PATCH returns `10405 Method not allowed`. The form is `curl -X PUT .../widgets/$SITEKEY -d '{"name":"...","mode":"managed","domains":[...]}'`. |
| Token expired mid-flow | Stop, re-run `scripts/auth-probe.sh`, prompt for fresh credentials. |
| Validation returns `invalid-input-secret` | The secret did not reach the backend; re-check `TURNSTILE_SECRET` and, for Workers, `wrangler secret list` to confirm the binding. |
| Validation returns `invalid-input-response` | Expected for the dummy probe; the secret is valid. |

The PUT-not-PATCH rule is confirmed by the API management docs: the update endpoint is `PUT .../accounts/$ACCOUNT_ID/challenges/widgets/$SITEKEY` with a full body of `domains`, `mode`, `name`, and optional `clearance_level` (weight 0.91, https://developers.cloudflare.com/turnstile/get-started/widget-management/api/). The widget-management docs do not document a PATCH method for widget updates, which is consistent with the source doc's observation that PATCH is rejected.

## The persistence step

After validation passes, Step 11 asks to save the skill for reuse: "Save the Spin skill to `.claude/skills/turnstile-spin/SKILL.md` so I can reuse it on follow-up tasks?" with a default of yes (source doc, Step 11). The mechanics split by agent type: for an agent that supports directory-based skill bundles, run `scripts/persist-skill.sh --path <bundle-directory>/SKILL.md`; for a file-oriented rules target, install the hosted `prompt.md` directly instead and do not run the script (source doc, Step 11). The hosted prompt is served at https://developers.cloudflare.com/turnstile/spin/prompt.md and is byte-identical to the source doc in its frontmatter and trigger sections (weight 0.71, https://developers.cloudflare.com/turnstile/spin/, fetched 2026-10-08, 31629 bytes). Step 12 closes with the structured final report: what was created, what was validated, what to do next (source doc, Step 12).
