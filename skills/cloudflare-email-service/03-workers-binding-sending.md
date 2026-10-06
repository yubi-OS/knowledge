# Sending From a Worker With the send_email Binding

Scope: the Workers binding path the source doc recommends as the default for sending: wrangler.jsonc configuration, the `env.EMAIL.send()` call shape, the from-domain requirement, and the binding restrictions the docs layer on top.

## The binding is the default path

The source doc (yubi-OS/yubiOS skills/cloudflare-email-service/SKILL.md) is unambiguous about preference: "The binding is recommended for Workers — no API keys needed." The only sanctioned reason to use the REST API from inside a Worker is a user explicitly requesting it, for example when they already have an API token workflow; the skill points that case at its rest-api reference. The dig backs the same preference: the Workers API page instructs, "Send emails directly from Cloudflare Workers using the Email Service binding and send() method" (w 0.96, https://developers.cloudflare.com/email-service/api/send-emails/workers-api/), and the get-started page lists the Workers binding first among the sending paths: "the Workers binding for applications built on Cloudflare Workers, the REST API from any platform, or SMTP from any SMTP-capable application or mail client" (w 0.97, https://developers.cloudflare.com/email-service/get-started/send-emails/).

## Configuration and call shape

Two pieces of config and one call make up the whole flow (source doc, Quick Start section):

1. Add the binding to `wrangler.jsonc` as `{ "send_email": [{ "name": "EMAIL" }] }`.
2. Call `env.EMAIL.send()` with an object carrying `to`, `from` (an object with `email` and `name` keys), `subject`, `html`, and `text`.
3. Ensure the `from` domain is onboarded: the source doc requires `npx wrangler email sending enable yourdomain.com` before the first send.

The source doc's quick-start example sends from `welcome@yourdomain.com` with both an `html` and a `text` body. Both body fields are mandatory in practice: the skill's common-mistakes table records that sending HTML only hurts spam scores and breaks plain-text-only clients, so "Always include both `html` and `text` versions" (source doc).

## Restricted bindings

The source doc's sending.md reference covers "restricted bindings", and the dig surfaced the current docs' treatment of them. The send-bindings configuration page states: "Each entry in send_email can be configured to restrict what the binding can do. The sender address must always belong to a domain you have onboarded to Email Service. No restriction attribute: The binding can send to any verified destination address in your account" (w 0.96, https://developers.cloudflare.com/email-service/configuration/send-bindings/), revised Jun 9, 2026. Two constants fall out of that text. The from-address domain requirement holds regardless of binding configuration; restrictions narrow the destination side, never the sender side. And an unrestricted binding can send to any verified destination address in the account, so a Worker that should only ever message one internal address should be pinned by configuration rather than trusted to its code.

## Non-JavaScript Workers

The dig found an official example for Rust-based Workers: the workers-rs send-email example shows "using worker::SendEmail to send a message through a [[send_email]] binding" with two routes, a structured path that sets "from, to, subject, and text / html on Message::builder, and the runtime assembles the MIME body" and a raw MIME path (w 0.69, https://github.com/cloudflare/workers-rs/tree/main/examples/send-email). The weight 0.69 clears the 0.5 authoritative threshold (it is Cloudflare's own repository), but it is below the docs pages, so treat it as supporting evidence that the binding model extends beyond JavaScript, not as the canonical reference.

## Local testing

The local-development page ties the binding path to testing: "Test email sending functionality locally using wrangler dev to simulate email delivery and verify your sending logic before deploying" (w 0.94, https://developers.cloudflare.com/email-service/local-development/sending/), revised Jun 25, 2026. The simulation point matters for the source doc's warning about fake addresses: bounces from non-existent addresses hurt sender reputation (source doc, common mistakes table), so local `wrangler dev` testing is the reputation-safe way to exercise sending logic before real recipients are involved.

## Failure modes specific to this path

The source doc's mistakes table names the binding-specific failures directly (source doc):

1. Forgetting the `send_email` binding in wrangler config, because "Email Service uses a binding, not an API key".
2. Sending from an unverified domain, because "Domain must be onboarded onto Email Sending before first send".
3. Using the `email` key in the `from` object when the REST API requires `address` (the binding shape and the REST shape differ; see the REST API doc in this corpus).
4. Ignoring the from-domain requirement by sending from `anything@unrelated-domain.com`.

Each has a 1-line fix in the table, and all 4 are configuration problems rather than logic bugs, which is why the skill puts the prerequisite checks before any code.

## Backing summary

5 of the 12 collected results for this subtopic scored 0.5 or higher: the Workers API page (0.96, appearing twice in the dig), the get-started send-emails page (0.96), the send-bindings configuration page (0.96, from the retrieval subtopic's query set and reused here as corroborating context), the local-development sending page (0.94), and the workers-rs example (0.69). The 7 low-weight results included a community forum thread about enabling the binding, third-party wrapper repos, and general Cloudflare marketing pages; none were used for load-bearing claims.
