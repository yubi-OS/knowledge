# 01 - Workflow and API Safety

Scope: the 5-step operating workflow of the Cloudflare One skill (classify, gather context, retrieve, inspect, propose) and the retrieval-first API safety rules that keep configuration advice honest.

Grounding spine: source doc `yubi-OS/yubiOS skills/cloudflare-one/SKILL.md` (fetched 2026-10-06, 22946 bytes). All "source doc" attributions below refer to that file.

## The 5-step workflow

The source doc defines a strict workflow before any configuration work.

1. Classify the ask as one of 5 types: architecture, configuration, troubleshooting, migration, or review (source doc).
2. Gather context: account ID, users, sites, apps, identity provider, SCIM or group sync, device management, the traffic path, compliance constraints, and the blast radius of the rollout (source doc).
3. Retrieve only the current docs needed for the products involved: Access, Gateway, WARP or device client, Tunnel or Mesh, Cloudflare WAN, DLP, CASB, device posture, or identity (source doc).
4. If account access is available, inspect existing resources before proposing or making changes. The inventory to check includes Access apps, policies, groups, and IdPs; Gateway rules, lists, and categories; device profiles and posture checks; tunnels and routes; DNS and resolver settings; and locations or sites (source doc).
5. Propose the change set with prerequisites, validation, and rollback. Risky changes are staged disabled or scoped to a pilot group or site unless the user explicitly asks otherwise (source doc).

The inspection step (4) matters because Cloudflare One accounts accumulate drift. Proposing an Access policy without reading the existing IdP config, group names, or device profiles produces advice that looks correct and fails on contact. The source doc treats "inspect before propose" as mandatory when credentials exist.

## Retrieval-first discipline

The source doc's opening rule: before citing limits, settings, API fields, category IDs, or exact UI paths, retrieve current information from the [Cloudflare One docs](https://developers.cloudflare.com/cloudflare-one/), the Cloudflare docs MCP server, or the Cloudflare API schema (source doc). The rationale is drift: Cloudflare One products change faster than any embedded snapshot of the docs, and category IDs and UI paths are exactly the values that rot.

The retrieval surfaces the dig confirmed as current:

- The [Cloudflare API reference](https://developers.cloudflare.com/api/) is the canonical endpoint-level reference (weight 0.9). It exposes operations across every product surface, including the Zero Trust sensitivity and settings endpoints the skill touches.
- The [cloudflare/api-schemas](https://github.com/cloudflare/api-schemas) repository contains OpenAPI schemas for the Cloudflare API (weight 0.75). It is the machine-readable schema source the skill points to instead of remembered field names.
- Cloudflare ships official MCP servers: the [Cloudflare API MCP server](https://developers.cloudflare.com/agents/model-context-protocol/cloudflare/servers-for-cloudflare/) provides access to over 2,500 API endpoints across DNS, Workers, R2, Zero Trust, and other products through 2 tools, using a search-and-execute Code Mode pattern where the model writes JavaScript against a typed representation of the OpenAPI spec (weight 0.86). The general [Model Context Protocol docs](https://developers.cloudflare.com/agents/model-context-protocol/) describe MCP as an open standard connecting AI systems with external applications (weight 0.81). The [cloudflare/mcp-server-cloudflare](https://github.com/cloudflare/mcp-server-cloudflare) repository hosts several MCP servers for connecting from an MCP client (weight 0.69).
- The [Cloudflare system status page](https://www.cloudflarestatus.com/) carries real-time status and incident history for Cloudflare services, network locations, and scheduled maintenance (weight 0.91), which is the right surface to check before blaming an account config for a regional failure.
- The [Cloudflare dashboard](https://dash.cloudflare.com/login) is the UI surface whose exact paths the skill refuses to cite from memory (weight 0.77, used here only as the target of the rule).

## API safety rules

The source doc sets 3 hard rules (source doc):

- Use fully qualified MCP tool names when MCP tools are available.
- Never guess category IDs, application IDs, wirefilter fields, or API request bodies. Retrieve the current schema or docs and inspect the existing account objects first.
- Do not enable broad production policies without explicit approval.

The third rule is also a deployment guardrail: the source doc requires broad block, allow, DLP, and TLS policies to start disabled and scoped to a pilot with specific target users or groups unless the user approves a wider rollout.

## Why this workflow is the skill's spine

Every other subtopic of this corpus (assessment, Access, tunnels, Gateway, CASB, logs, WAN) is a domain the workflow routes into. The skill's value is not a memorized product map but a repeatable loop: classify, gather, retrieve current truth, inspect real state, propose reversible change. The [API schema management approach in cloudflare-docs](https://deepwiki.com/cloudflare/cloudflare-docs/3.3-api-schema-management) shows why the loop is necessary: even Cloudflare's own docs tooling pulls OpenAPI schemas from the api-schemas repo with a pinned, automatically updated commit reference (weak source, weight 0.15; treated as corroboration only).
