# Receiving Inbound Email With Email Routing

Scope: the inbound half of the service: the Workers `email()` handler, forwarding rules, postal-mime parsing, and the single-use `message.raw` stream trap.

## The email() handler

The source doc (yubi-OS/yubiOS skills/cloudflare-email-service/SKILL.md) routes "Receive and process incoming emails (Email Routing)" to the "Workers `email()` handler" in its routing.md reference. The docs page for the handler states its capabilities directly: "Process incoming emails with the email () handler in Cloudflare Workers to forward, reply, or reject messages" (w 0.96, https://developers.cloudflare.com/email-service/api/route-emails/email-handler/), revised Jun 15, 2026. The get-started routing page frames the two usage modes: "Forward incoming emails to existing mailboxes or process them with Workers using Email Service" (w 0.96, https://developers.cloudflare.com/email-service/get-started/route-emails/). So the inbound design space is: rule-based forwarding to mailboxes, code-based processing in a Worker, or a mix where a Worker forwards after inspection.

The routing side does not require the sending half: the Cloudflare DNS docs describe Email Routing as free forwarding "If you only need to receive emails" (w 0.91, https://developers.cloudflare.com/dns/manage-dns-records/how-to/email-records/), and the Email Routing product page describes it as "a free, private service for creating custom email addresses and forwarding messages to any inbox, protecting your primary email from spam" (w 0.76, https://www.cloudflare.com/products/email-routing/).

## Parsing with postal-mime

The email-handler docs page prescribes the parsing library: "Use postal-mime to parse the MIME structure of an incoming email. The parser handles multipart boundaries, transfer encodings, and character sets correctly" (w 0.96, https://developers.cloudflare.com/email-service/api/route-emails/email-handler/). The same page shows the call shape the skill assumes: `async email(message, env, ctx)` with `const email = await PostalMime.parse(message.raw)`. This is the reason the source doc's prerequisite list includes `npm ls postal-mime` as a check (source doc): the parser is an npm dependency the Worker must ship.

## The single-use raw stream

The source doc's mistakes table contains the sharpest operational trap in the receiving path: "Reading `message.raw` twice in email handler" happens because "The raw stream is single-use — second read returns empty". The fix is "Buffer first: `const raw = await new Response(message.raw).arrayBuffer()`" (source doc). The pattern generalizes: any handler that needs the raw bytes more than once (parse, then re-forward, then log a hash) must capture the buffer at the top of the handler. A handler that passes `message.raw` to one consumer and then to another will deliver an empty body to the second, which manifests as silently blank emails rather than an error, making it expensive to debug in production.

## Forwarding and verified destinations

The forwarding path has its own prerequisite, stated in the source doc's mistakes table: "Forwarding to unverified destinations" fails because "`message.forward()` only works with verified addresses"; the fix is "Run `wrangler email routing addresses create user@gmail.com` or add in Dashboard" (source doc). This couples the routing doc to the CLI doc: an inbound Worker that forwards must be preceded by address verification, and the failure is again silent-by-default (the forward simply does not work) rather than loudly typed.

## Local testing

The routing half has its own local test loop: "Test email routing behavior locally using wrangler dev to simulate incoming emails and verify your routing logic before deploying" (w 0.94, https://developers.cloudflare.com/email-service/local-development/routing/), revised Sep 4, 2026. Simulated inbound delivery is what makes the `message.raw` buffering pattern testable before production: a `wrangler dev` session can inject a synthetic message and the developer can observe whether the handler's second consumer receives bytes or nothing.

## Configuration drift note

Inbound rules themselves have moved toward the CLI surface: a Sep 5, 2026 changelog entry documents "Define inbound Email Routing rules in Wrangler configuration and reconcile them during Worker deployments" (w 0.87, https://developers.cloudflare.com/changelog/post/2026-09-05-email-routing-wrangler-addresses/). For a codebase that owns its routing rules, this means rules can be declared in the same configuration as the Worker that processes the mail, and deployment reconciles the two. The source doc does not cover this (its routing reference predates or omits it), so it is recorded here as a dated correction with the dig source.

## Handler design summary

Assembling the sourced facts into the handler skeleton the skill drives toward (source doc + w 0.96 email-handler page):

1. Buffer `message.raw` into an ArrayBuffer immediately on entry.
2. Parse the buffer with postal-mime for structured access to parts and headers.
3. Branch: forward to verified destinations, reply, or reject.
4. Route processing results to Workers-side destinations (queues, storage, or the agent's `onEmail` hook per the Agents SDK doc in this corpus).

## Backing summary

4 of the 12 collected results for this subtopic scored 0.5 or higher: the email-handler docs page (0.96, appearing twice), the get-started route-emails page (0.96), and the Email Routing product page (0.76). Notable low-weight results that were excluded from load-bearing claims include the postal-mime official docs site and its GitHub repository (which scored below threshold in this dig despite being the named dependency), tutorial and blog walkthroughs, and a DeepWiki mirror; the postal-mime guidance used here comes from the Cloudflare email-handler page itself, which is the higher-weighted source.
