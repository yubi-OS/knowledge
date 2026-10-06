# Prerequisites and Domain Onboarding

Scope: the 3 checks the source doc requires before any email code is written, and how a domain actually gets onboarded onto Email Sending.

## The 3 prerequisite checks

The source doc (yubi-OS/yubiOS skills/cloudflare-email-service/SKILL.md) has a "FIRST: Check Prerequisites" section that orders the work: before writing any email code, verify the basics. It names 3 checks:

1. Domain onboarded. Run `npx wrangler email sending list` to see which domains have email sending enabled. If the domain is not listed, run `npx wrangler email sending enable userdomain.com`, or follow the full setup instructions in the skill's cli-and-mcp reference.
2. Binding configured. Look for `send_email` in `wrangler.jsonc` (for Workers).
3. postal-mime installed. Run `npm ls postal-mime`. This is needed only for receiving and parsing emails, not for sending.

The order matters. A missing binding or an un-onboarded domain produces errors that look like code bugs but are configuration gaps, and the skill's common-mistakes table lists both as the top entries (source doc).

## What onboarding actually does

The dig adds detail the source doc leaves to its cli-and-mcp reference. The get-started page describes the dashboard onboarding flow: "In the Cloudflare dashboard, go to Compute > Email Service > Email Sending", select "Onboard Domain", choose a domain from the Cloudflare account, and optionally review the DNS records Cloudflare will add to the `cf-bounce` subdomain of the domain, specifically "MX records to route bounce emails to Cloudflare" (w 0.96, https://developers.cloudflare.com/email-service/get-started/send-emails/). Two facts land here. First, onboarding is a per-domain action, not an account-wide toggle. Second, Cloudflare provisions bounce handling infrastructure under a `cf-bounce` subdomain as part of onboarding, which is why sending from an un-onboarded domain is impossible rather than merely discouraged.

The domain configuration page frames the same work from the settings side: "Configure domains for Cloudflare Email Service, manage DNS records, and verify domain setup for both email sending and routing" (w 0.96, https://developers.cloudflare.com/email-service/configuration/domains/), revised Sep 16, 2026. Note the "both" in that sentence: one domain configuration serves both the sending side and the routing (inbound) side, so the onboarding check in step 1 covers prerequisites for both halves of the service.

## The binding and postal-mime checks in context

The `send_email` binding check is the Workers-only branch of the prerequisite list. The Workers API docs page confirms the same shape the skill teaches: "Send emails directly from Cloudflare Workers using the Email Service binding and send() method. Configure a send_email binding in your Wrangler configuration file to enable email sending" (w 0.96, https://developers.cloudflare.com/email-service/api/send-emails/workers-api/). If the binding is absent, the code path the skill recommends (the binding, not the REST API) simply cannot run.

The postal-mime check exists because inbound parsing is an npm dependency, not a platform primitive. The Email Handler docs page instructs developers to "Use postal-mime to parse the MIME structure of an incoming email" (w 0.96, https://developers.cloudflare.com/email-service/api/route-emails/email-handler/), so the dependency must be installed before the receiving half of a project will build. The skill's own check (`npm ls postal-mime`) catches this before it surfaces as a build failure.

## Local testing as a fourth, implicit check

The local development docs page extends the prerequisite mindset to testing: "Test email sending functionality locally using wrangler dev to simulate email delivery and verify your sending logic before deploying. If you are using the REST API instead of Workers, you can test by sending requests directly with curl or any HTTP client without a local development server" (w 0.93, https://developers.cloudflare.com/email-service/local-development/sending/), revised Jun 25, 2026. This gives a clean split: binding-based sending is testable locally through `wrangler dev`, while REST-based sending is testable from any HTTP client with no local server at all. Either way, the source doc's warning that testing with fake addresses hurts sender reputation (source doc, common mistakes table) applies during this phase; use real addresses you control.

## Drift note

The source doc's prerequisite list mentions only the wrangler and dashboard paths. The dig found that the current docs also expose SMTP as a third sending path for SMTP-capable applications (w 0.97, https://developers.cloudflare.com/email-service/get-started/send-emails/). This does not contradict the skill; the skill's scope is Workers, REST, and coding-agent entry points. It is recorded here as a dated observation (Jun 25, 2026 revision) so future sessions know a third path exists when the user's app is neither a Worker nor a REST caller.

## Backing summary

3 of the 12 collected results for this subtopic scored 0.5 or higher: the local-development sending page (0.93), the domain configuration page (0.96), and the get-started send-emails page (0.96). The other 9 results (community forum threads, GitHub repos of third-party wrappers, aggregator skill libraries, the wrangler general docs page) scored below 0.5 and were not used for load-bearing claims.
