# Sending Via the REST API

Scope: the Email Sending REST API path for applications outside Workers, with the request and response shapes that differ from the Workers binding.

## When to use the REST API

The source doc (yubi-OS/yubiOS skills/cloudflare-email-service/SKILL.md) positions the REST API as the path "For apps outside Workers, or within Workers if the user explicitly requests it". The docs agree on the breadth: "The REST API allows you to send emails from any application using a standard HTTP request" (w 0.97, https://developers.cloudflare.com/email-service/api/send-emails/rest-api/), and the API reference confirms the endpoint shape (w 0.96, https://developers.cloudflare.com/api/resources/email_sending/methods/send/). Any HTTP client, in any language the source doc's frontmatter names (Node.js, Go, Python), can drive it with a Bearer token.

## Endpoint and differences from the binding

The source doc lists 4 key differences from the Workers binding (source doc, Quick Start — REST API section):

1. Endpoint: `POST https://api.cloudflare.com/client/v4/accounts/{account_id}/email/sending/send`.
2. The `from` object uses `address` (not `email`): `{ "address": "...", "name": "..." }`.
3. The reply-to field is `reply_to` (snake_case), not the binding's `replyTo`.
4. The response returns `{ delivered: [], permanent_bounces: [], queued: [] }` rather than a `messageId`.

The naming asymmetry between the two paths (`email` + `replyTo` on the binding, `address` + `reply_to` on REST) is the single most error-prone detail in the whole skill: the source doc devotes 2 rows of its common-mistakes table to exactly these 2 mistakes, "Using `email` key in REST API `from` object" and "Using `replyTo` in REST API", and both rows point at the same root cause, field-name drift between the two surfaces. An agent translating a working binding example into a REST call must rewrite both fields.

## What the API reference adds

The Cloudflare API reference page for the send method states the request contract: "Provide the sender, recipients, subject, and at least one of text or html; attachments are optional" (w 0.96, https://developers.cloudflare.com/api/resources/email_sending/methods/send/). Two observations sharpen the skill's guidance here. First, the API accepts either body format, while the skill's common-mistakes table warns that HTML-only sends hurt spam scores and break plain-text clients (source doc), so best practice is to supply both even though only one is required. Second, attachments are supported at the API level, which the source doc routes to its rest-api reference for details (curl examples, response format, error handling).

The response shape the source doc names (`delivered`, `permanent_bounces`, `queued`) is worth reading operationally: a single send can produce results in all 3 arrays, so the caller's success logic should treat `permanent_bounces` entries as hard failures to record, `delivered` as confirmed, and `queued` as pending rather than delivered. The source doc does not spell out this interpretation; it is the natural reading of the shape it documents, and the deliverability half of this corpus covers why permanent bounces are reputation-critical.

## Bearer token handling

The source doc's "What Do You Need?" table routes external apps to "REST API with Bearer token" (source doc), and its mistakes table adds the credential-handling rule: "Hardcoding API tokens in source code" is a listed mistake with the fix "Use environment variables or Cloudflare secrets" (source doc). The reason the binding path is preferred inside Workers follows directly: the binding needs no token at all, so the token-hygiene failure mode cannot occur.

## Drift note: SMTP exists

The dig found that the current docs describe a third sending path the source doc does not cover: "You can use the Workers binding for applications built on Cloudflare Workers, the REST API from any platform, or SMTP from any SMTP-capable application or mail client" (w 0.97, https://developers.cloudflare.com/email-service/get-started/send-emails/, Jun 25, 2026 revision). This is a dated correction, not a contradiction: the skill's scope is the 2 programmatic paths plus the coding-agent paths, and its references may simply not have caught up to the SMTP surface. When a user's app is a legacy mail client or SMTP-capable system, the docs page is the right source, not the skill.

## Testing

The local-development page covers the REST path explicitly: "If you are using the REST API instead of Workers, you can test by sending requests directly with curl or any HTTP client without a local development server" (w 0.93, https://developers.cloudflare.com/email-service/local-development/sending/). Combined with the source doc's warning that testing with fake addresses hurts sender reputation (source doc), the REST path's test loop should hit real addresses the developer controls.

## Backing summary

4 of the 12 collected results for this subtopic scored 0.5 or higher: the REST API docs page (0.97, appearing twice), the API reference send-method page (0.96), and the get-started send-emails page (0.97). The 8 low-weight results included a third-party email SDK adapter, an unofficial cURL builder site, a self-hosting blog, and generic Cloudflare pages; none were used for load-bearing claims.
