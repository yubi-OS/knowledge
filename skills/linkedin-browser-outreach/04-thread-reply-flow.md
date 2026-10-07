# 04. Sending messages: the thread reply flow

Scope: locating an existing thread by recipient search in Messaging, composing and sending a reply, and verifying the send by re-reading the thread, with draft-then-approve applied to every message.

Ground source: yubi-OS/yubiOS skills/linkedin-browser-outreach/SKILL.md (primary source of record).

## Draft first, every time

The source doc makes the draft rule absolute: draft first, every time, per the standard external-actions process (source doc). One message to a real person is exactly the high-stakes case that process exists for (source doc). Batch drafts are fine; the source doc gives the example of 4 replies in one draft file, but each individual message's content still needs the user's eyes before it goes out (source doc).

The draft is a file the user edits and approves; the send only happens after that approval. There is no inline-composed-and-sent path in this skill.

## The send loop for existing threads

Per the source doc, one send is one loop:

1. Search the recipient by name in Messaging. LinkedIn supports finding conversations by keyword or recipient in the search messages bar (https://www.linkedin.com/help/linkedin/answer/a542831/filtering-and-searching-for-messages?lang=en, jev weight 0.58, strong backing).
2. Open the thread.
3. Type into the compose box and send (source doc). One browser_use call carries one message (source doc; see doc 06 for pacing).
4. Verify by re-reading the thread for the new message timestamped as the account owner (source doc). LinkedIn documents the message status indicators: a message passes through sending, then sent (successfully sent and delivered to the recipient's inbox), then read if the recipient has read receipts on; a failed send shows an error message prompt (https://www.linkedin.com/help/linkedin/answer/a569649, jev weight 0.53, strong backing). LinkedIn does not have a sent folder; sent messages live inside the existing conversation thread (https://www.linkedin.com/help/linkedin/topic/a148003, jev weight 0.39, weak backing).

If the thread does not exist yet, meaning the account owner has never exchanged a message with the recipient, this skill cannot start it: see doc 05 for the one-sided-thread limitation and its sibling constraint.

## Verification is part of the loop, not an afterthought

The re-read step matters because LinkedIn's own troubleshooting guidance instructs users to retry and observe after each step to identify the cause of send failures (https://www.linkedin.com/help/linkedin/answer/a1455996/unable-to-send-messages-troubleshooting, jev weight 0.68, strong backing). In an automated browser session there is no user watching the send land, so the re-read for the timestamped message is the only confirmation the flow has. Treat a send that cannot be verified as not sent, and report it as such.

Read receipts add a second, weaker confirmation layer: when the recipient has read receipts enabled, the message indicator flips to read (https://www.linkedin.com/help/linkedin/answer/a569649, jev weight 0.53, strong backing). When they are off, no read state is shown (https://www.linkedin.com/help/linkedin/answer/a569649, jev weight 0.53, strong backing; corroborated at https://expandi.io/blog/how-to-know-linkedin-message-read/, jev weight 0.09, weak backing). Do not depend on read state for flow control; depend on the sent indicator from the re-read.

## What gets sent

LinkedIn delivers a sent message to the recipient's messaging list and possibly to their email address (https://www.linkedin.com/help/linkedin/answer/a564261/linkedin-messaging-overview?lang=en, jev weight 0.45, weak backing). The practical consequence for drafting: the message may arrive in the recipient's inbox as an email, so subject-line-like first lines and tone should be written with that in mind. This is a weak-backed ecosystem fact; the drafting rules themselves come from the source doc and the external-actions process.
