# 01. Routing: when to use browser outreach instead of Beeper or the connector

Scope: when to route LinkedIn messaging through a live cloud browser session (browser_use) instead of the beeper bridge or the first-party LinkedIn connector, and the tradeoffs of each path.

Ground source: yubi-OS/yubiOS skills/linkedin-browser-outreach/SKILL.md (primary source of record; claims attributed to it below).

## The three routes

The source doc names three routes for LinkedIn messaging and ranks them:

1. beeper (the LinkedIn DM bridge) is the preferred path when it is available. It needs Beeper Desktop, which needs a Mac, or a Linux/WSL2 box for non-iMessage networks (source doc). Beeper's own product pages list support for Android, iPhone, iPad, ChromeOS, macOS, Windows and Linux as app platforms (https://www.beeper.com/, jev weight 0.03, weak backing), and the mautrix/linkedin bridge lives in the beeper GitHub org (https://github.com/beeper, jev weight 0.07, weak backing).
2. The first-party LinkedIn connected account (Pipedream) has no messaging or connections-list scope at all. The source doc says to never use it for outreach (source doc).
3. The browser path drives LinkedIn directly in a live cloud browser via browser_use. The source doc calls it slower and more fragile than an API, and flags real ToS risk (source doc, elaborated in doc 07).

## Why the API route does not reach messaging

The official LinkedIn API is gated behind partner programs. Microsoft Learn's LinkedIn access documentation states that most permissions and partner programs require explicit approval from LinkedIn, and that Open Permissions are the only permissions available to all developers without special approval (https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access, jev weight 0.40, weak backing). A third-party analysis written in 2026 reaches the same conclusion, describing the official API as approval-gated and enterprise-partner-oriented (https://connectsafely.ai/articles/linkedin-api-complete-guide-2026, jev weight 0.14, weak backing).

The LinkedIn API Terms of Use put the compliance burden on the application: a developer must suspend or terminate a user's access if the user is using content or LinkedIn services in violation of the terms (https://developer.linkedin.com/legal/api-terms-of-use, jev weight 0.65, strong backing). That is the kind of contractual posture that makes unsanctioned messaging integrations a poor fit for an API route, independent of scope questions.

## The decision rule

- If the user has a machine that can run Beeper Desktop (Mac, or Linux/WSL2 for non-iMessage networks), use the beeper skill, not this skill (source doc). Beeper is the more durable, lower-friction path for ongoing messaging (source doc; see doc 08).
- If the only available path is the first-party Pipedream LinkedIn connection, do not attempt outreach through it: the source doc states it has no messaging or connections-list scope (source doc).
- Otherwise, this skill applies: a live browser_use session. Accept that it is slower, more fragile, and carries ToS risk that must be stated before any batch (source doc; docs 06 and 07 cover the pacing and disclosure obligations).

## Drift note

The source doc says Beeper Desktop needs a Mac (or a Linux/WSL2 box for non-iMessage networks). Beeper's current marketing copy lists Windows, Linux and ChromeOS app availability generally (https://www.beeper.com/, jev weight 0.03, weak backing). The narrower platform claim in the source doc is about the Beeper Desktop requirement for LinkedIn bridging specifically; if the user's setup matches a wider platform list, verify against Beeper's own docs at connect time rather than assuming either way.
