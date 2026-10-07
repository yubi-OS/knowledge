# 06. Human-speed rate limiting

Scope: the pacing discipline for automated sends: one message per browser call, confirm each success, spread batches across sessions, and never fire messages back-to-back.

Ground source: yubi-OS/yubiOS skills/linkedin-browser-outreach/SKILL.md (primary source of record).

## The core discipline

The source doc states the rule in three parts:

- Never fire messages back-to-back with no gap or in a tight loop (source doc).
- Space sends out: treat each browser_use call as one message, confirm success, and only then move to the next (source doc).
- For a batch, spread sends across a session rather than one micro-burst; if the user wants dozens sent, break the batch across multiple turns or sessions rather than one uninterrupted sequence (source doc). The source doc's worked example is a 20-person outreach batch.

The confirm-then-proceed rule pairs with the verification step in doc 04: a send is not done until the re-read of the thread shows the new message timestamped as the account owner. The gap between sends is also the window where a failure is caught, which is why the source doc ties pacing to confirmation rather than to a fixed sleep alone.

## Why the pacing matters

LinkedIn actively sets limits to protect member experience. LinkedIn's own help documentation states that LinkedIn sets invitation limits to protect the overall user experience and keep connection requests relevant (https://www.linkedin.com/help/linkedin/answer/a550555, jev weight 0.53, strong backing; the page is served in Czech under the same answer id used by the English help system).

Third-party analyses of message volumes are consistent in shape but weak-backed and should not be quoted as LinkedIn's official numbers: a 2026 roundup estimates roughly 100 messages per week for free accounts and around 150 for Premium, and states LinkedIn has no strict daily message limit but monitors sending patterns and response rates (https://phantombuster.com/blog/social-selling/how-many-messages-can-you-send-on-linkedin/, jev weight 0.11, weak backing). A LinkedIn Pulse article similarly advises keeping weekly connection requests well under the apparent weekly ceiling (https://www.linkedin.com/pulse/linkedin-limits-2026-beyond-updated-guide-safe-hasam-phd-researcher-xilpf, jev weight 0.11, weak backing). Treat these as weak community estimates; the skill's own rule is the source doc's pacing discipline, which is deliberately conservative.

## Detection risk in plain terms

Browser automation leaves detection surface even at human speed. A 2026 analysis of restriction warning signs concludes that architecture is the root cause: browser-automation accounts face materially higher restriction risk than verified-API platforms, and tuning pacing is a second-order lever that does not override fingerprint detection (https://linkedinsider.blog/linkedin-restriction-warning-signs, jev weight 0.09, weak backing). Guides on why LinkedIn flags automation describe behavior-pattern signals that trigger warnings (https://phantombuster.com/blog/social-selling/linkedin-automation-tool-warning/, jev weight 0.14, weak backing; https://bearconnect.io/blog/linkedin-automation-tool-warning/, jev weight 0.13, weak backing). All of these are weak-backed; they corroborate the source doc's framing that pacing reduces, but does not eliminate, detection risk (source doc; see doc 07 for the disclosure obligation).

## What the agent does concretely

1. One browser_use call per message. Never batch multiple sends into one call (source doc).
2. After each send, verify via the thread re-read (doc 04) before starting the next (source doc).
3. Within a session, spread sends; do not compress a 20-person batch into a burst (source doc).
4. Across dozens of sends, split the work over multiple turns or sessions (source doc).
5. If a send fails, stop and report; do not retry in a loop. The failure may be the one-sided-thread state (doc 05) or a LinkedIn-side block; either way the correct move is to report, not to hammer.
