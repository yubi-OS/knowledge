# 03. Reading and mapping the network (safe, read-only)

Scope: what read-only reconnaissance is allowed in the live browser session (My Network connections and the Messaging inbox in list view), and why the full connections graph still requires a LinkedIn data export or public profile research.

Ground source: yubi-OS/yubiOS skills/linkedin-browser-outreach/SKILL.md (primary source of record).

## What list-view reconnaissance is for

The source doc defines the safe zone: browsing "My Network" to Connections and the Messaging inbox in list-view is fine for reconnaissance, meaning names, headlines, and last-message previews (source doc). This is what a session uses to map who the account owner talks to and what state each thread is in, before any send decision.

Two hard limits from the source doc:

- Do not click into individual profiles at volume (source doc). Volume profile visits are automated activity with detection risk; the recon value of list-view does not require them.
- Do not treat browser recon as a substitute for real connections data (source doc). LinkedIn's connections graph is not additionally exposed through the browser versus any other route (source doc).

## Why the graph needs an export instead

The official API confirms the boundary. Microsoft Learn's Connections API documentation states that the Connections API does not permit browsing member connections, and that connections are only available for the given member who granted access, with 2nd-degree connections excluded (https://learn.microsoft.com/en-us/linkedin/shared/integrations/people/connections-api, jev weight 0.36, weak backing). LinkedIn's developer documentation hub organizes API access by business lines, none of which offer a general connections-graph read for automation purposes (https://learn.microsoft.com/en-us/linkedin/, jev weight 0.52, strong backing).

The sanctioned way to get the member's own full connections list is the member's own data export. LinkedIn Help documents the flow: click the Me icon, select Settings and Privacy, click Data privacy, and use the export option (https://www.linkedin.com/help/linkedin/answer/a566336/exporting-connections-from-linkedin?lang=en, jev weight 0.47, weak backing). The broader account-data download lives under Data Privacy and "Get a copy of your data", and LinkedIn notes that some connections' email addresses are missing from exports because members choose in their privacy settings whether to allow their email to be downloaded (https://www.linkedin.com/help/linkedin/answer/a1339364/downloading-your-account-data, jev weight 0.14, weak backing).

So the source doc's routing is exactly right: a full list export requires the user's own LinkedIn data export (Settings, Data privacy, Get a copy of your data) or public profile research via the lead_research skill for people outside the network (source doc).

## Operational pattern

Per the source doc, a reconnaissance pass in this skill looks like:

1. Open My Network and Connections in list view. Record names and headlines as needed for the outreach list.
2. Open Messaging inbox in list view. Record last-message previews to determine which threads are one-sided (the account owner sent the last message and no reply has arrived; see doc 05).
3. Stop. No volume profile visits, no scraping, no bulk extraction from the UI.

A third-party 2026 guide independently describes the same export flow (Settings and Privacy, Data Privacy, Get a copy of your data, select Connections, request archive) and notes the export is the sanctioned path versus scraping (https://connectsafely.ai/articles/export-linkedin-contacts-connections-guide-2026, jev weight 0.09, weak backing). The overlap is corroboration only; the weight is weak, so cite the LinkedIn Help pages as the closer-to-primary sources where the claim matters.
