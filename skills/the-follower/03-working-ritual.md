# 03. The working ritual

Scope: the per-task loop a follower runs for every order: lock, dedupe, acknowledge, execute, heartbeat, report, unlock, coordinate, and loop.

## Step 0: the work-lock comes first

Before acknowledging any task, a follower runs `bash <cult.sh> worklock "$N"`. If it prints `BUSY`, a sibling run for the same slot is already on this task; the follower checks in with "heartbeat — sibling active, standing down" and exits. If it prints `OK`, the follower holds the lock and proceeds (source doc: https://github.com/yubi-OS/yubiOS/blob/main/skills/the-follower/SKILL.md). The reason the lock exists is that cron can fire the same slot twice while a task runs longer than the interval; the lock makes that idempotent. Idempotency in exactly this sense is the standard reliability primitive: Google Cloud's idempotency guide states that if you send the same request five times, an idempotent system ensures the outcome does not change after the first successful attempt (https://cloud.google.com/discover/idempotency, jev weight 0.86), and the general definition is the same (https://en.m.wikipedia.org/wiki/Idempotence, jev weight 0.69).

Step 0b is the dedupe check: re-read your own `## Outbox`. If the open inbox `- [ ]` task already has a matching `DONE:` line you wrote, mark the inbox `- [x]`, run `workunlock "$N"`, and exit. Never redo a completed task.

## Steps 1 to 3: acknowledge, execute, heartbeat

Step 1 confirms receipt: `report "$N" "ACK: starting <task>"`. Step 2 is the work itself, and the source doc attaches two hard rules to it. Use the relevant yubiOS skills (it names github-api, github-actions, mkosi-image-builder, systemd-hardening, bcvk-virtualization among others), and ground everything in the live repo; never invent a PR number, digest, or fact. Step 3 is the heartbeat: while working, check in at least once per 5 minutes with a one-line status. The instant you finish or hit a blocker, report immediately rather than waiting for the timer.

The heartbeat is not decorative. Temporal's long-running-activity pattern describes the same mechanism: an Activity Heartbeat lets long-running work report progress, handle cancellation gracefully, and resume from the last checkpoint after failures (https://docs.temporal.io/design-patterns/long-running-activity, jev weight 0.84). CockroachDB's lease design documents the ownership half of the same problem: an epoch-based range lease specifies an epoch in addition to the owner instead of relying on timestamp expiration (https://github.com/cockroachdb/cockroach/blob/master/docs/RFCS/20160210_range_leases.md, jev weight 0.80). The worklock is the follower's equivalent of the lease: it names the owner, and the heartbeat keeps the ownership current.

## Step 4: report, then release

Report results as `report "$N" "DONE: <result + evidence>"` or `"BLOCKED: <what + why>"`. Evidence goes in the message: a PR link, command output, a digest. The source doc requires marking the inbox checkbox done if you can, and then always running `bash <cult.sh> workunlock "$N"` so the next fire can pick up the next task. The word always is load-bearing: release on DONE and on BLOCKED alike. A follower that exits BLOCKED without unlocking wedges its own slot.

## Step 5: cross-talk, once

To coordinate with another follower, write to cross-talk: `post "FOLLOWER_$N" "FOLLOWER_3" "your message"`. The rule is post each message once. When waiting on a peer, post your result a single time, then poll by re-reading `CULT_LEADER.md` for their reply. The source doc forbids re-posting the same verdict or update on every poll loop: duplicate posts spam the cross-talk and bury the signal. One message, then read, then wait.

## Step 6: loop

Go back to waiting for the next order and stay until the leader dismisses you. The working ritual is a loop, not a one-shot script: the same follower processes serial orders for the whole sermon, which is why the heartbeat and outbox conventions carry across tasks rather than resetting per task.

## What the loop optimizes for

The source doc's opening line sets the value system: speed and honesty over cleverness. Every mechanic in the ritual serves one of those two values. The worklock, outbox dedupe, and evidence-in-message rules serve honesty (no duplicate work, no unverified claims). The 5-minute heartbeat and immediate terminal reports serve speed (the leader always knows the true state within one heartbeat window). Cleverness, by contrast, is explicitly not the follower's job: the ritual says do exactly the task assigned.
