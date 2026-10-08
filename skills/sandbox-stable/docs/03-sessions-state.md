# 03. Sessions and shell state

Scope: how sessions preserve working directory and environment across commands on the stable package: the default session and `enableDefaultSession`, and explicit sessions via `createSession` when state must carry across calls.

Grounding spine: yubi-OS/yubiOS skills/sandbox-stable/SKILL.md (source doc).

## The default session, and why the docs want it off

The source doc's non-negotiable says sessions "can preserve working directory and environment across commands (default session / enableDefaultSession, createSession)". The stable Sessions API page explains the default state precisely: "By default, for backwards compatibility, every sandbox has a default session that maintains shell state. It is recommended to set enableDefaultSession to false on getSandbox() so operations without an explicit sessionId run in isolation" (https://developers.cloudflare.com/sandbox/api/sessions/, jev weight 0.84). The concept page adds the forward-looking reason: "It is recommended that you always apply this setting as it will become the default in a future Sandbox SDK release" (https://developers.cloudflare.com/sandbox/concepts/sessions/, jev weight 0.83).

## What state carrying actually means

The mechanism is shell-level inheritance. "Without the default session, the second command does not inherit shell state from the first command" (https://developers.cloudflare.com/sandbox/concepts/sessions/, jev weight 0.83). So a `cd` in one `exec` is invisible to the next one unless both run in a session that carries state. When you do want shared state, the concept page says to "Create or retrieve an explicit session when you want commands to share shell state" (https://developers.cloudflare.com/sandbox/concepts/sessions/, jev weight 0.83). Explicit sessions on the stable package are scoped shells: the 0.x sessions page describes "shell sessions with independent working directories and environment variables" (https://developers.cloudflare.com/sandbox/sdk/api/sessions/, jev weight 0.82).

## The durability caveat

Session state is container-scoped, not durable. "This state resets if the container restarts due to inactivity" (https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/sandbox/sdk/concepts/sessions.mdx, jev weight 0.70). Anything that must survive a container restart belongs in files, storage, or backups, not in shell state. This is the operational boundary the source doc gestures at when it says to open the Sessions docs "when state must carry across calls": carry across calls, not across restarts.

## The 1.0 direction, for orientation only

The lifecycle page notes where sessions are headed: in the 1.0 preview you "do not rely on enableDefaultSession" (https://developers.cloudflare.com/sandbox/api/lifecycle/, jev weight 0.79). That is consistent with the stable docs' own recommendation to set it false today. The deprecation cleanup path (doc 08) makes the same move a migration step rather than a behavior change you absorb implicitly.

## Why this subtopic stayed in the corpus

The outline validator scored this subtopic 0.64, in the "marginal: keep only if the dig comes back strong" band. The dig came back strong: three primary Cloudflare docs pages weighted 0.82 to 0.84 carry the entire mechanism, and the source doc names the APIs involved. It is kept on dig strength.

## Weak-source caution

Two DeepWiki mirrors scored 0.15 and 0.10 and are not cited as authority (https://deepwiki.com/cloudflare/sandbox-sdk/3.6-sessions-and-isolation, https://deepwiki.com/cloudflare/sandbox-sdk/3-user-guide, weak backing below 0.5). The vendor landing page quote (0.58) is marketing context only. Every mechanism claim above rests on Cloudflare docs pages at 0.70 or higher, plus the source doc.
