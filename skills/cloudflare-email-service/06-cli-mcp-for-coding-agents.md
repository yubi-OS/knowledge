# CLI and MCP Paths for Coding Agents

Scope: how the source doc routes coding agents (Claude Code, Cursor, Copilot and the like) into Email Service work: wrangler CLI commands, MCP tools, and the first-time setup commands both paths share.

## The routing table entry

The source doc (yubi-OS/yubiOS skills/cloudflare-email-service/SKILL.md) gives coding agents their own row in the "What Do You Need?" table: "Send emails from a coding agent (Claude Code, Cursor, Copilot, etc.)", via "MCP tools, wrangler CLI, or REST API", pointing at the cli-and-mcp reference. The same reference owns the setup row: "Set up Email Sending or Email Routing" via "`wrangler email sending enable` / `wrangler email routing enable`, or Dashboard". So the coding-agent path is a superset: an agent working in a terminal can do setup (onboard domains, enable routing, create destination addresses), sending (wrangler or REST), and receiving-side configuration without ever leaving the CLI.

## The setup commands in the live docs

The dig corroborates the wrangler command surface. The local-development routing page confirms the wrangler-driven loop for the inbound half: "Test email routing behavior locally using wrangler dev to simulate incoming emails and verify your routing logic before deploying" (w 0.94, https://developers.cloudflare.com/email-service/local-development/routing/), revised Sep 4, 2026. Together with the sending-side local development page (w 0.93, https://developers.cloudflare.com/email-service/local-development/sending/), this means both halves of the service have a `wrangler dev` test loop, which is what makes the CLI path viable for coding agents: they can configure, run, and verify without a dashboard round-trip.

A September 2026 changelog entry extends the wrangler surface further: "Define inbound Email Routing rules in Wrangler configuration and reconcile them during Worker deployments" (w 0.87, https://developers.cloudflare.com/changelog/post/2026-09-05-email-routing-wrangler-addresses/, Sep 5, 2026). This is a drift-relevant fact for the skill: inbound routing rules moving into wrangler configuration means the CLI path now covers rule management that previously lived dashboard-side, and a coding agent following the source doc should expect rules to be declarable and reconciled at deploy time.

## MCP tools

The source doc names MCP tools as one of the 3 coding-agent entry points (source doc). The dig's evidence here is thinner: the Email for agents blog post describes the agent-era framing of the service (w 0.78, https://blog.cloudflare.com/email-for-agents/), and the official MCP server repository appeared in the dig results but scored below the 0.5 threshold, so this corpus does not assert specific MCP tool names beyond what the source doc says. The honest state is: the skill commits to "MCP tools" as a supported path and defers details to its cli-and-mcp reference; the dig found no high-weight page enumerating those tools, so treat tool names as something to retrieve live (per the skill's retrieval-first rule) rather than from this corpus.

## Destination addresses

One setup command appears verbatim in the source doc's mistakes table and matters for the routing half: `wrangler email routing addresses create user@gmail.com` is the fix for "Forwarding to unverified destinations", because "`message.forward()` only works with verified addresses" (source doc). A coding agent doing inbound-email setup should therefore sequence: enable Email Routing, create and verify destination addresses, then deploy the Worker with its `email()` handler. The dashboard offers the same operations ("or add in Dashboard", source doc), but the CLI form is what the agent path needs.

## Which path to pick

Combining the source doc's table with the dig's dated findings (source doc + w 0.94 and 0.87 pages):

1. First-time setup on a new domain: wrangler CLI (`email sending enable`, `email routing enable`, `email routing addresses create`) or Dashboard.
2. Iterating on send or receive code: `wrangler dev` for local simulation of both halves.
3. Config-driven routing rules: wrangler configuration with deploy-time reconciliation (Sep 2026 changelog).
4. Interactive agent-driven sending without code changes: MCP tools or REST API, per the source doc's table.
5. Legacy or non-Worker apps: REST API (see the REST API doc in this corpus); the docs also document an SMTP path (w 0.97, https://developers.cloudflare.com/email-service/get-started/send-emails/) that sits outside the skill's scope.

## Backing summary

3 of the 12 collected results for this subtopic scored 0.5 or higher: the local-development routing page (0.94), the email-routing-wrangler-addresses changelog entry (0.87), and the Email for agents blog post (0.78). The 9 low-weight results included the Cloudflare MCP server GitHub repo, a third-party CLI guide, a DeepWiki mirror of the docs, an unrelated apparel brand's website, and aggregator skill-library listings; none were used for load-bearing claims.
