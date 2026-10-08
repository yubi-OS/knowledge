# skills/turnstile-spin knowledge corpus

Explication corpus for the yubi-OS/yubiOS `skills/turnstile-spin/SKILL.md` ground source (31198 bytes): the Cloudflare Turnstile end-to-end setup skill (codebase scan, widget creation, embed, canonical server-side siteverify, validation, persistence).

## Docs

- `01-scope-and-triggers.md` - When the skill loads: trigger vocabulary (Turnstile, CAPTCHA, siteverify, cf-turnstile-response, protect-this-form phrasing), flow selection between the creation wizard and the existing-widget flow, and the frontmatter scope boundary. (internal-record subtopic, no dig)
- `02-auth-and-account-probe.md` - Cloudflare API token creation with Account.Turnstile:Edit scope, the auth-probe statuses (ok, missing_token, missing_scope, network_failure, upstream_failure, multiple_accounts, account_mismatch), approved canonical WRANGLER_BIN constraints, and token handoff without chat.
- `03-widget-creation-and-domains.md` - Widget creation via the wrangler turnstile widget subcommand or scripts/widget-create.sh, managed mode, domain registration including the localhost and 127.0.0.1 rule, capturing sitekey and secret with jq, and the no-fallback-after-auth-failure rule.
- `04-codebase-scan-and-insertion-plan.md` - Silent detection of frontend framework, backend handler location, and existing CAPTCHA during the codebase scan; the insertion plan with recommended and skip-by-default markers; stable action assignment (1 to 32 chars, letters numbers underscores hyphens) and action-to-handler mapping.
- `05-frontend-embed-and-token-lifecycle.md` - The frontend-edit contract (gate, don't replace): api.js script tag, implicit rendering via the cf-turnstile class, explicit render and widget ID retention, single-use token lifecycle, and window.turnstile.reset after failed or retried submissions.
- `06-canonical-siteverify.md` - Canonical server-side siteverify: POST to challenges.cloudflare.com/turnstile/v0/siteverify with form-urlencoded secret, response, remoteip; response fields success, action, hostname; fail-closed error handling; expected action and hostname allowlist checks; browser never calls siteverify directly.
- `07-secret-handling-and-guarded-retrieval.md` - Secret hygiene: TURNSTILE_SECRET in the user's env or secret store, git check-ignore before env writes, wrangler secret put for Workers, and the existing-widget guarded retrieval flow (widget get, jq metadata validation, dummy-probe validation before the sink, secret list re-check).
- `08-validation-migration-and-edge-cases.md` - Validation with the dummy probe token (invalid-input-response means the secret is valid) plus real end-to-end token and replay rejection; migration from reCAPTCHA and hCaptcha (detection signals, substitution table, v3 score caveat, Enterprise pointer); edge cases (Pages plugin, PUT vs PATCH 10405, invalid-input-secret remediation).

## Research summary

- Results collected: 84 dig results across 14 searXNG queries (7 web-shaped subtopics, 6 kept per query; subtopic 01 is an internal-record subtopic with no dig)
- Weight split: 25 at weight >= 0.5 (primary), 59 at weight < 0.5 (weak, labeled in text)
- jev requests: 8 (1 outline score validation + 7 noul weighting batches of 12), usage 10599 input / 1748 output tokens, via DefAPI direct (typesafe/jev-1.13-20260917)
- Redo counts: 0 (no dig failures; all 14 queries returned on first attempt)
- Skipped docs: none

Preflight 2026-10-06: campaign preflight healthy (orchestrator); searXNG and DefAPI decide endpoints per skills-variant optimization 3, agent-side probe skipped for speed.
