# 01. Scope and triggers: when this migration applies

Scope: when the sandbox-migrate-to-next migration applies, when it does not, and the routing boundaries around the sibling skills.

## What the skill is

The ground source for this corpus is the yubiOS skill `skills/sandbox-migrate-to-next/SKILL.md` ([source doc](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/sandbox-migrate-to-next/SKILL.md)). It is a perform skill: it exists to actually carry out the port of an existing application from the stable `@cloudflare/sandbox` package to the `@cloudflare/sandbox@next` tag, which is the preview line for Sandbox SDK 1.0. The same skill text is published in the cloudflare/skills repository ([0.56](https://github.com/cloudflare/skills/blob/main/skills/sandbox-migrate-to-next/SKILL.md)), so the wording can be cross-checked against the upstream copy.

The Cloudflare 1.0 preview overview confirms the naming the skill assumes: "Sandbox SDK 1.0 is the next major release of the SDK. It is available now as a preview on the npm @next tag. The current stable package remains published for existing apps" ([0.75](https://developers.cloudflare.com/sandbox/1-0-preview/)). A Cloudflare changelog entry from August 7, 2026 adds that Cloudflare aims to ship 1.0 "once those are in" and that it continues "to support and maintain the 1.0 preview (@next) alongside the current stable release" ([0.75](https://developers.cloudflare.com/changelog/post/2026-08-07-sandbox-sdk-1-0-preview/index.md)).

## Triggers

Per the source doc frontmatter, the skill fires on 2 kinds of request:

1. Porting a Cloudflare Sandbox app from stable `@cloudflare/sandbox` to `@cloudflare/sandbox@next` (Sandbox SDK 1.0 preview).
2. A user asking to migrate or upgrade to Sandbox SDK 1.0 / `@next`.

The preview overview gives the strategic reason the migration exists: the 1.0 preview "collapses that toward a smaller contract" where running a program is `exec(argv)` returning a process handle when launch succeeds, and observing it is `output()`, `logs()`, `waitForExit()` and related waits ([0.74](https://developers.cloudflare.com/sandbox/1-0-preview/index.md)). The skill teaches an agent to move an app onto that smaller contract.

## Non-triggers and sibling routing

The skill explicitly routes 3 neighboring jobs elsewhere (source doc):

- New projects: start on `@next` directly, using the `sandbox-next` skill, not this one.
- Day-to-day work on the stable line: use `sandbox-stable`.
- Deprecated-API cleanup that does NOT move to `@next`: run the 2026 deprecation guide first if needed ([guide](https://developers.cloudflare.com/sandbox/guides/2026-deprecation/), [0.67]).

The deprecation guide states its own scope precisely: "This guide is for apps that stay on the current stable @cloudflare/sandbox package and need to leave deprecated features (transports, default sessions, stream helpers, and related APIs). To move onto Sandbox SDK 1.0 (@cloudflare/sandbox@next), use..." the migration path instead ([0.67](https://developers.cloudflare.com/sandbox/guides/2026-deprecation/)). The same page's index.md copy tells the agent that after finishing stable-line changes it should "move on to the Sandbox SDK 1.0 preview on @cloudflare/sandbox@next when you can" ([0.60](https://developers.cloudflare.com/sandbox/guides/2026-deprecation/index.md)). So the 2 flows chain but do not overlap: deprecation cleanup happens on stable, then this skill moves the app across the version line.

The Cloudflare sandbox overview describes the 2 sandbox environments both being "accessible through a Worker" and directs 0.x applications to either stay on the 0.x section or "move it to the current version" ([0.71](https://developers.cloudflare.com/sandbox/)). Weak backing ([0.13](https://community.cloudflare.com/t/sandboxes-deprecating-sandbox-sdk-features/933294), community post) echoes the same policy: deprecated features have been "superseded by newer capabilities or seen low adoption," do not build new work on them, migrate with the deprecation guide or move to the 1.0 preview when you can.

## The stance on timing

The source doc sets a deliberate posture: "Existing apps should migrate when you can, so you are ready when 1.0 becomes the stable release. Do not force production cutover without the user agreeing" (source doc). This is a readiness play, not an emergency: the changelog shows both lines are maintained in parallel ([0.75](https://developers.cloudflare.com/changelog/post/2026-08-07-sandbox-sdk-1-0-preview/index.md)), so migrating early buys readiness without being forced by a deadline.

## Known drift

A GitHub issue reports that as of October 1, 2026 the `1-0-preview/migrate/` path has a real target at `/sandbox/sdk/migrate/` while other 1-0-preview doc links redirect to the sandbox landing page ([0.25](https://github.com/cloudflare/skills/issues/212), weak). Treat the linked doc URLs in the source doc as subject to Cloudflare's doc-site reorganization: if a link lands on the sandbox overview, search the same domain for the migrate page.
