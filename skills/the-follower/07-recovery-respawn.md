# 07. Recovery and respawn

Scope: the crash and context-loss protocol: file-system-read-first, the three respawn branches, and the slot-abandonment handoff.

## The hard rule

Crashes are expected: a cron slot times out, a runtime update kills the worker mid-task, or the chat context window overflows and the next spawn has no memory of the last run. The source doc's hard rule is: never silently resume work you can't prove you remember. The file system is your continuity. Before any action, re-read `FOLLOWER_${N}.md` end-to-end, both Inbox and Outbox, because the `## Outbox` is the only ground truth the leader can verify (source doc: https://github.com/yubi-OS/yubiOS/blob/main/skills/the-follower/SKILL.md). If the Outbox is empty or unreadable, report `BLOCKED: respawn — no outbox history` and exit. Never fabricate progress the leader cannot verify.

This is the checkpoint-and-replay discipline used by durable execution systems, applied to files instead of a database: Hatchet's durable execution engine checkpoints every task so machine crashes and restarts never lose work (https://hatchet.run/platform/durable-execution, jev weight 0.49, weak backing). The follower's Outbox is its checkpoint log; the Inbox plus Outbox pair is the recoverable state machine. Microsoft's agent-platform documentation frames the same requirement organizationally: agents deployed across an organization need secure, scalable, and compliant operation (https://learn.microsoft.com/en-us/microsoft-agent-365/overview, jev weight 0.82), and recoverable state is a precondition of that rather than an optional feature.

## The three respawn branches

**Case A: same FOLLOWER_N, context restored.** You remember your last action and the slot is yours. Resume: re-acquire the worklock, re-check the inbox, continue from the last Outbox line. Do NOT re-ACK, because the leader can already see your heartbeat history. If the worklock returns BUSY after a crash, follow the lock-stale branch from the failure modes: post one cross-talk ping naming the dead holder, then stand down.

**Case B: same FOLLOWER_N, context lost.** You are a re-spawn with the same number and no memory of prior runs. Read the Outbox end-to-end, then pick the branch that matches its ending:

- **Outbox ends with `DONE:` and no inbox `- [ ]` is open** -> stand down. `report "$N" "DONE: standing down (respawned, prior work complete)"`, `workunlock "$N"`, then poll for the next order.
- **Outbox ends mid-task** (last line is `ACK: starting <task>` or a partial status with no terminal `DONE:` or `BLOCKED:`) -> replay. The prior run was never confirmed, and a fresh re-run could double-write a branch or PR. `report "$N" "BLOCKED: respawn mid-task — leader please re-assign or confirm completion"`, mark the inbox `- [x]` with reason "stale on respawn", `workunlock "$N"`. Do NOT silently redo the work.
- **Outbox ends with `BLOCKED:`** -> the leader already knows. `report "$N" "heartbeat — still blocked, respawned, awaiting leader direction"`, hold the worklock, do not retry.

**Case C: different FOLLOWER_N, new slot.** You are a fresh follower. Run the arrival ritual from scratch: init, claim, read the PULPIT, check in. Do not try to claim the dead follower's slot; the leader can read its history and decide.

## Abandoning an old slot

If the leader reassigns you a new N but the old FOLLOWER_N still shows you in progress (no terminal DONE or BLOCKED line in its Outbox), post one cross-talk ping: `post "FOLLOWER_$N" "leader" "old slot FOLLOWER_<OLD_N> stale on reassign — please mark closed"`. Do NOT edit the old slot's file yourself; the leader owns closure. This keeps a single writer per slot file, which is the same invariant the worklock enforces during work.

## Why read-first beats re-run-first

The protocol's asymmetry is deliberate. Re-running work risks the one thing a follower must never do: double-writing a branch or PR that a sibling or a prior self already created. Reading first costs one file read and converts every ambiguous situation into either a resumable state or an explicit leader decision. The mid-task branch is the sharpest example: rather than guessing whether the prior run finished, the follower marks its own task stale and asks the leader to re-assign or confirm, trading a possible duplicate write for one round of leader attention.

After recovery, the follower re-enters the working ritual at the step that matches its state: resume at step 1, replay handling at step 4, stand-down at the post-DONE idle state. The recovery protocol and the working ritual are therefore the same state machine seen from two entry points, which is what makes respawn behavior predictable to the leader without any out-of-band coordination.
