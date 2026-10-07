# 08. Precedent and boundaries: what this skill does and refuses to do

Scope: the first-run precedent that validated the skill's flow, and the hard boundaries: no connection discovery, no connection requests, no bulk scraping, and no replacing Beeper once it is available. This is an internal-record subtopic, no dig.

Ground source: yubi-OS/yubiOS skills/linkedin-browser-outreach/SKILL.md (primary source of record; this doc is sourced entirely from it and records internal history).

## The first-run precedent

The source doc records the skill's first run on 2026-07-24:

- Logged into shant@omniteck.com via the live browser flow (doc 02's credential-safe flow).
- Mapped 10 recent chats and 48 connections using list-view only (doc 03's recon zone).
- Sent 3 of 4 drafted test replies successfully. Each was drafted and approved first (doc 04's draft-then-approve rule).
- The 4th reply was blocked by the one-sided-thread limitation (doc 05): the account owner had sent the first message and the recipient had not replied, so LinkedIn hid the compose box.
- The work is tracked in Linear OMN-90 and OMN-85 on the OMNI-AGENT team.

The precedent is the evidence that the skill's full loop works end to end: login, recon, draft, approve, send, verify, and correct handling of the one limitation. The 3/4 send rate was not a failure of the flow; the blocked message was blocked by a platform constraint the skill now documents as expected behavior.

## The hard boundaries

The source doc lists three things this skill does not do, and the reasons are structural rather than temporary:

1. Does not discover 1st/2nd-degree connections. No route exists (source doc). The browser does not expose the connections graph beyond what list-view shows, and the official API does not permit browsing member connections either (doc 03). Candidate sourcing comes from a manual LinkedIn data export (Settings, Data privacy, Get a copy of your data) or public profile research via the lead_research skill (source doc).
2. Does not send connection requests or bulk-scrape profiles. The source doc classifies these as higher-volume automated action with more ToS exposure than 1:1 message replies. If asked, the agent must flag the bigger risk and get explicit confirmation before doing it (source doc); the confirmation bar is higher than for a reply batch, not lower (doc 07).
3. Is not a replacement for Beeper once the user has a Mac or Linux box set up. Beeper is the more durable, lower-friction path for ongoing messaging (source doc; doc 01 covers the routing logic). This skill exists for the window where no bridge machine is available, not as the long-term architecture.

## Scope discipline

The skill's guidelines close with one sentence that bounds everything above: every use stays inside the frontmatter description's scope, and anything beyond it is a different skill's job (source doc). In practice, the boundary test for any request is:

- Reading and replying in existing threads: in scope (docs 03, 04).
- Logging in and verifying login: in scope (doc 02).
- Stating ToS risk and getting per-batch approval: required (doc 07).
- Finding new people to contact: out of scope, route to lead_research or a data export (source doc).
- Starting new threads to non-connections: out of scope, blocked by the platform and by the skill's boundaries (docs 05, 08).
- Sustained messaging operations: out of scope, route to beeper once a machine exists (doc 01).
