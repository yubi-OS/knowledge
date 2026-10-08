# 01 Scope and triggers

Scope: when the turnstile-spin skill loads, the trigger vocabulary it recognizes, how it chooses between the creation wizard and the existing-widget flow, and the scope boundary that keeps it from sprawling into unrelated Cloudflare work.

Ground spine: `yubi-OS/yubiOS skills/turnstile-spin/SKILL.md` (source doc). This subtopic is an internal-record subtopic: the behavior is defined by the source doc itself, so no searXNG dig was run and all claims below are attributed to the source doc.

## Load triggers

The source doc lists four trigger families. Load the skill when the user's prompt mentions any of:

1. The product names: "Turnstile", "CAPTCHA", "bot protection".
2. The implementation nouns: "siteverify", "cf-turnstile-response".
3. The protection intents: "protect this form", "protect this endpoint", "protect this button", "stop bot signups", "spam signups", "block bots on <target>".
4. A specific user-triggered request (signup, login, contact form, download, comment, API endpoint, or similar) combined with "Cloudflare" or "bot".

The negative trigger matters as much as the positive ones. The source doc says: do not load for unrelated Cloudflare tasks such as Workers, Pages, or R2 unless Turnstile is also mentioned (source doc, Guidelines 1). A "set up a Worker" prompt is not a Turnstile prompt; a "protect my signup form" prompt is, even if it never says the word CAPTCHA.

## Flow selection happens before any response

The source doc requires the agent to inspect the user's prompt before starting the numbered wizard. If the prompt says the widget is already created and provides one or more sitekeys, the agent goes directly to the existing-widget flow (retrieve and store the secret, wire, validate) and must not run, summarize, or propose the widget-creation flow (source doc, "Choose the flow before responding"). Otherwise the numbered creation wizard runs from Step 1.

This is a hard branch, not a preference. Presenting widget-creation steps to a user who already has a sitekey risks creating a replacement widget, which the source doc separately forbids: never create replacement widgets (source doc, existing-widget flow, Step 1).

## What the skill is for

The source doc defines the unit of work: turn the prompt "set up Turnstile" into a working end-to-end integration consisting of a widget, frontend snippets at every chosen insertion point, canonical server-side siteverify wired into the customer's existing backend, and a real validation pass before reporting success. The agent runs a wizard: deterministic logic (API calls, retries, error handling) lives in scripts under `scripts/` and the agent's job is orchestration, codebase reading, confirmation, and the frontend and backend edits (source doc, opening section).

The source doc also states its provenance contract: it is the canonical machine-readable behavior, product requirements come from the Turnstile documentation at developers.cloudflare.com/turnstile/, and the hosted prompt must mirror this behavior (source doc, opening section). The upstream mirror at https://developers.cloudflare.com/turnstile/spin/prompt.md (fetched 2026-10-08, 31629 bytes) is byte-identical in its frontmatter and trigger sections, confirming the mirror discipline in practice (weight 0.71, https://developers.cloudflare.com/turnstile/spin/, weak-strong primary from dig).

## Every use stays inside the frontmatter scope

The source doc closes with the boundary rule: every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job (source doc, closing line). Concretely, the scope is: scan the codebase, create the widget via the Cloudflare API, embed it where user requests need bot verification (form submissions, SPA actions, API endpoints, download links, comment or vote submissions), wire canonical server-side siteverify in the existing backend, validate, and persist the skill.

The hard scope boundary section (source doc) excludes: email or SMS delivery, adding a new backend when none exists, database or payment or OAuth work, frontend framework migration or styling, reCAPTCHA v3 score threshold semantics, and pre-clearance configuration. The skill either gates the existing handler or says so and exits; it never builds adjacent infrastructure (source doc, "Hard scope boundary: DO NOT ask the user about").

## Practical reading

For a corpus consumer the takeaways are: trigger on protection intent, not product name alone; pick the flow from the prompt before speaking; and treat the wizard as orchestration over scripts rather than free-form implementation. Everything else in this corpus (widget creation, siteverify wiring, secret handling, validation) presupposes these three rules.
