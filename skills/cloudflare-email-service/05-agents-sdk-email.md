# Email in the Cloudflare Agents SDK

Scope: the Agents SDK email path the source doc covers: the `onEmail()` handler and `replyToEmail()` method on the Agent class, and how the SDK positions email as a native channel.

## The two primitives

The source doc (yubi-OS/yubiOS skills/cloudflare-email-service/SKILL.md) routes agent email work to a single row in its "What Do You Need?" table: "Send emails from an AI agent built with Cloudflare Agents SDK", via "`onEmail()` + `replyToEmail()` in Agent class", with the full details in the skill's sending.md reference. So the Agents SDK surface reduces to 2 named primitives: an inbound hook (`onEmail`) that fires when an email reaches the agent, and an outbound method (`replyToEmail`) that sends a reply through the same Email Service infrastructure the binding uses. The source doc's Quick Start notes the binding powers agent sending too, since agents run on Workers.

## What the live docs establish

The Agents docs' email channel page frames the integration in the same terms: "Connect agents to email so they can send outbound messages, process inbound mail, and handle follow-up replies" (w 0.76, https://developers.cloudflare.com/agents/communication-channels/email/), revised Jun 9, 2026. The three verbs map cleanly onto the source doc's two primitives plus the underlying send path: outbound sending, inbound processing (the `onEmail` hook), and reply handling (`replyToEmail`).

The Agents email-agent example goes further on scope: "Build an agent that sends, receives, routes, and replies to email using Cloudflare Email Service and the Agents SDK" (w 0.66, https://developers.cloudflare.com/agents/examples/email-agent/), revised Aug 17, 2026. The weight 0.66 is above the 0.5 threshold (it is official Cloudflare documentation) but lower than the platform docs pages, so treat it as the worked-example companion rather than the API reference; the source doc itself points at the Agents SDK repo's `docs/email.md` as the authoritative type-level source (source doc, Retrieval Sources table).

## How email became an agent primitive

The Cloudflare blog post announcing the public beta gives the historical context the skill assumes: "Today, as part of Agents Week, Cloudflare Email Service is entering public beta, allowing any application and any agent to send emails. We are also completing the toolkit for building email-native agents: Email Sending binding, available from your Workers" (w 0.83, https://blog.cloudflare.com/email-for-agents/, Apr 16, 2026). The same post states: "with the rest of the developer platform, you can build a full email client and Agents SDK onEmail hook as native functionality" (w 0.83). The framing matters for how an agent should be designed: email is treated as one channel among several the agent speaks natively, not as an integration bolted on through an external mail provider. The blog's second phrasing makes the product intent explicit: "Agents are becoming multi-channel. That means making them available wherever your users already are — including the inbox" (w 0.77, same URL).

## Why the binding still matters for agents

An agent is a Worker, so the source doc's binding-first rule applies unchanged: the agent's `send_email` binding carries the outbound mail, and `replyToEmail()` composes on top of it. The practical consequence is that the prerequisite checks from the prerequisites doc of this corpus apply to agents as-is: the from-domain must be onboarded (`npx wrangler email sending enable`), the `send_email` binding must be present in `wrangler.jsonc`, and postal-mime must be installed if the agent parses inbound mail. The Agents SDK email-agent example lists sending, receiving, routing, and replying as a single build surface, which means an agent that receives mail without postal-mime installed will fail at build time, not at send time.

## Drift watch

The source doc names `onEmail()` and `replyToEmail()` as the pair to use, and the official blog (Apr 2026) corroborates the `onEmail` hook as "native functionality". Because the Agents SDK docs are fetched from the repo's `docs/email.md` per the skill's own retrieval rule, any agent-email work should re-fetch that file before coding; the skill explicitly says it may lag behind the repo (source doc). The dig found no page that contradicts the two-primitive model as of the dig date; the communication-channels page (0.76) and the email-agent example (0.66) both describe the same send/receive/reply surface.

## Boundary note

The source doc's examples section contains a boundary rule the agent path inherits: "when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising here" (source doc). Applied to email, a request like "make the agent respond to messages" should first establish which channel artifact is meant (email vs chat vs webhook) before the `onEmail` implementation starts, because the skill's scope covers only the email branch.

## Backing summary

5 of the 12 collected results for this subtopic scored 0.5 or higher: the email-agent example (0.66, appearing twice), the Agents communication-channels email page (0.76), and the Email for agents blog post (0.83 and 0.77 from the 2 queries). The 7 low-weight results included the Cloudflare Agents product page, the generic Agents API docs listing, the cloudflare.com homepage, and the agentic-inbox demo repository; none were used for load-bearing claims beyond the positioning quotes already attributed.
