# 07. ToS risk: say it plainly before any batch

Scope: the obligation to state LinkedIn's terms-of-service risk openly before any outreach batch, and the exact policy facts behind it.

Ground source: yubi-OS/yubiOS skills/linkedin-browser-outreach/SKILL.md (primary source of record).

## The disclosure obligation

The source doc requires this before any batch: state the ToS risk plainly, do not bury it, and do not let repetition of the skill turn into implied approval (source doc). LinkedIn's terms prohibit automated actions (messaging, connecting, scraping) regardless of pacing (source doc). Browser automation at human speed reduces detection risk but does not eliminate it; account restriction or ban is a real possibility (source doc). This is the user's call each time (source doc).

The last clause matters operationally: approval is per batch, not standing. Running this skill five times does not convert the fifth run into a pre-approved one.

## What LinkedIn's policies actually say

The strongest-weighted sources in this corpus are LinkedIn's own policy pages:

- The prohibited software and extensions page says members must not use bots or other unauthorized automated methods to access the services, add or download contacts, send or redirect messages, create, comment on, like, share, or re-share posts, or otherwise drive activity (https://www.linkedin.com/help/linkedin/answer/a1341387/prohibition-of-scraping-software?lang=en, jev weight 0.91, strong backing). This is the direct policy basis for the source doc's claim: automated messaging is prohibited regardless of pacing.
- The account restrictions page states that automated inauthentic activity violates the LinkedIn User Agreement and can result in temporary or permanent restriction of the account (https://www.linkedin.com/help/linkedin/answer/a1340522, jev weight 0.56, strong backing).
- The API Terms of Use require application developers to suspend or terminate users who use LinkedIn services in violation of the terms (https://developer.linkedin.com/legal/api-terms-of-use, jev weight 0.65, strong backing), which closes off the "use an approved integration instead" loophole for unsanctioned messaging.

A 2026 policy guide summarizes the same line in plain terms: LinkedIn's User Agreement prohibits scraping software, automated bots, and automated access without permission, and the 2026 automation policy has not changed in wording, only in enforcement intensity (https://northlight.ai/blog/is-linkedin-automation-against-the-rules, jev weight 0.13, weak backing). That enforcement-intensity point is echoed in community reports of a 2026 crackdown wave (https://linkedinsider.blog/linkedin-automation-crackdown-2026, jev weight 0.10, weak backing; https://www.getcleed.com/blog/linkedin-automation-crackdown-2026, jev weight 0.09, weak backing). These are weak-backed observations about enforcement climate, not policy text; the policy text above is the citable basis.

## How to deliver the disclosure

Before any batch, in one short statement to the user:

1. Name the action: automated messaging through a browser session.
2. State the rule: LinkedIn prohibits automated actions regardless of pacing (source doc, backed by the prohibited-software policy page at jev weight 0.91).
3. State the stakes: account restriction or ban is a real possibility (source doc, backed by the account-restrictions page at jev weight 0.56).
4. Get the explicit go-ahead for this batch. Silence, prior approval of a different batch, or enthusiasm for the skill does not count (source doc).

For actions beyond 1:1 message replies, the bar is higher. Connection requests and bulk profile scraping are higher-volume automated actions with more ToS exposure; the source doc says to flag them as a bigger risk and confirm explicitly before doing them (source doc; see doc 08).
