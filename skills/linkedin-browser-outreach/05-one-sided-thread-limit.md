# 05. The one-sided-thread limitation

Scope: the hard LinkedIn UI constraint that hides the compose box entirely when the account owner sent the first message and the other party has not replied yet, and how to handle it operationally.

Ground source: yubi-OS/yubiOS skills/linkedin-browser-outreach/SKILL.md (primary source of record).

## What the limitation is

Per the source doc: if the account owner sent the first message in a thread and the other party has not replied yet, LinkedIn hides the compose box entirely and shows "You haven't received a response yet". No message can be sent until they reply (source doc).

The source doc is explicit about how to classify it: do not treat this as a bug. Report it as a hard LinkedIn UI constraint and move on to the next recipient (source doc). An agent should not retry the send, not look for workarounds, and not spend a browser session fighting the UI; the constraint is on LinkedIn's side, not the session's.

## Why LinkedIn has this constraint

LinkedIn's messaging rules distinguish messaging your connections from contacting people outside your network. InMail, the feature that allows contacting anyone on LinkedIn even when not connected, is a premium feature (https://www.linkedin.com/help/linkedin/answer/a543895/, jev weight 0.42, weak backing; https://www.linkedin.com/help/linkedin/answer/a407457/inmail-messages-faq?lang=en-US, jev weight 0.40, weak backing). The compose-box-hidden state on an unanswered first message is the free-account expression of the same design: the platform gates follow-up contact until the other party engages. The exact UI behavior (hiding the compose box, the "You haven't received a response yet" wording) is the source doc's observed record; the InMail/premium framing is weak-backed context for why the behavior exists.

## Evidence that this is a real, reproducible state

The strongest corroboration found in the dig is an issue report against a third-party LinkedIn automation server where send_message consistently returned composer_unavailable while pure read operations (inbox, conversation, people search) worked, isolating the failure to the compose UI specifically (https://github.com/stickerdaniel/linkedin-mcp-server/issues/344, jev weight 0.44, weak backing). That matches the source doc's picture: reading threads is reliable, sending into a thread that LinkedIn considers not-yet-open is blocked at the compose layer.

LinkedIn's own troubleshooting page for message sending issues lists generic recovery steps and says to retry after each step to identify the cause (https://www.linkedin.com/help/linkedin/answer/a1455996/unable-to-send-messages-troubleshooting, jev weight 0.68, strong backing). It does not document the unanswered-first-message state specifically; the source doc remains the authority for that. The strong-backed page is useful for a different reason: it confirms LinkedIn expects send problems to be diagnosed by observing behavior after each step, which is exactly what the skill's verify-by-reread loop does.

## Operational rules

1. During list-view recon (doc 03), flag threads where the last message is from the account owner and is unanswered. Those are the threads the compose box will refuse.
2. Do not attempt a send into a one-sided thread. The source doc says no message can be sent until they reply (source doc).
3. Report the blocked recipient by name with the reason: hard LinkedIn UI constraint, not a session failure (source doc).
4. Move on to the next recipient in the batch. A blocked thread does not pause or abort the rest of the batch (source doc).
5. For people who must be contacted but have not replied, the only in-skill answer is patience or a channel change. Reaching outside the network is InMail territory, a premium feature (https://www.linkedin.com/help/linkedin/answer/a543895/, jev weight 0.42, weak backing), and this skill does not upgrade or purchase anything.
