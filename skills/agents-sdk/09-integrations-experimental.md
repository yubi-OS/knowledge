# 09 Integrations and experimental surfaces

Scope: email, webhooks, push notifications, observability, cross-domain auth and readonly connections, and the experimental voice, browser-tools, and think packages, plus the full package map from the monorepo.

Grounding note: the source doc is yubi-OS/yubiOS skills/agents-sdk/SKILL.md, cited as "source doc". Other claims cite their dig source URL plus the jev weight. This subtopic had the weakest dig pull of the corpus, so several sections rest on the source doc alone and say so.

## Email

Agents receive email through `onEmail(email)` and reply with `replyToEmail()`, both listed in the Agents API server-side surface (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90). The source doc indexes Email under "Email routing, secure reply resolver" (source doc). Cloudflare's Email Service supports agents directly: the product blog announcing email for agents describes email sending and routing aimed at agentic use (https://blog.cloudflare.com/email-for-agents/, jev 0.49, weak backing: a product blog post rather than documentation). The email agent example is listed among the docs' example set (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90).

## Webhooks and push notifications

The source doc's capabilities list two separate integrations here: "Receive and verify external webhooks" and "Web Push + VAPID delivery from agents" (source doc). These are internal-record claims from the source doc; the dig pull for this subtopic returned mainly aggregator pages, so no additional external corroboration is cited rather than padding with weak sources. The docs' own navigation confirms both surfaces exist under Communication channels: Webhooks and Push notifications (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90).

## Observability

The source doc lists observability as `diagnostics_channel` events for state, RPC, schedule, and lifecycle (source doc). The Agents API maps this to `subscribe()` and diagnostics channels on the server side, with a dedicated Tracing section including `wrapAISDK()` for wrapping AI SDK calls (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90).

## Cross-domain auth and readonly connections

Two operational security surfaces come from the source doc's retrieval table: cross-domain authentication covering WebSocket auth, tokens, and CORS, and readonly connections via `shouldConnectionBeReadonly` (source doc). The WebSockets page corroborates the auth-adjacent surface: `onConnect(connection, ctx)` exposes the original upgrade request for auth, headers, and cookies, and a handler can reject with `connection.close(4001, "Unauthorized")` (https://developers.cloudflare.com/agents/runtime/communication/websockets/, jev 0.90). The routing layer adds `cors` options on `routeAgentRequest` for cross-origin frontends (https://developers.cloudflare.com/agents/runtime/communication/routing/, jev 0.90). The WebSockets page also documents `shouldSendProtocolMessages(connection, ctx)` to suppress identity, state, and MCP frames for binary-only clients (https://developers.cloudflare.com/agents/runtime/communication/websockets/, jev 0.90).

## Experimental: voice, browser tools, think

Three surfaces are marked experimental in the source doc (source doc):

- Voice: STT and TTS via `@cloudflare/voice`, with a `withVoice` wrapper per the retrieval table.
- Browser tools: CDP-powered browsing via `agents/browser`, indexed as "Experimental CDP browser automation".
- Think: a higher-level chat agent class via `@cloudflare/think`.

The monorepo README grounds the package reality behind these (https://github.com/cloudflare/agents, jev 0.77): the `agents` core package covers Agents, routing, Voice, Channels, scheduling, MCP, workflows, x402, and browser agents; `@cloudflare/ai-chat` is the higher-level AI chat layer with persistent messages and resumable streaming; `@cloudflare/think` is an opinionated chat agent base with an agentic loop, stream resumption, client tools, and workspace tools; `@cloudflare/codemode` lets LLMs write executable code that calls your tools; `@cloudflare/shell` provides sandboxed JS execution plus a virtual filesystem; and `hono-agents` adds agents to Hono apps as middleware. The docs navigation also lists agentic payments (x402 for HTTP content and MCP tools, MPP) and Code Mode as first-class areas (https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90).

## Gap note for this doc

The source doc's own retrieval table names the authoritative pages for every surface listed here, including https://developers.cloudflare.com/agents/api-reference/email/, webhooks, push-notifications, observability, cross-domain-authentication, readonly-connections, voice, and browse-the-web. The dig pass surfaced fewer of those pages directly than the earlier subtopics did, which is why several sections above cite the source doc or the Agents API overview instead of the individual feature pages. A follow-up refresh should re-dig with feature-page-specific queries.
