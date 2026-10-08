# 05. Anti-patterns and red flags

Scope: the six behavioral anti-patterns and the six situational red flags, with the detection thresholds and standing responses the source doc prescribes.

## The six anti-patterns

The source doc's anti-patterns section is a compact behavioral taxonomy (source doc: https://github.com/yubi-OS/yubiOS/blob/main/skills/the-follower/SKILL.md):

1. **Don't drift into the leader's role.** Your job is the task assigned, not the sermon's strategy. Do not edit `CULT_LEADER.md`, do not reassign peers, do not promote yourself.
2. **Don't skip the worklock.** Two cron fires on the same slot can collide. Always `worklock "$N"` before ACKing; always `workunlock "$N"` after reporting, DONE or BLOCKED alike.
3. **Don't re-post cross-talk messages.** One post, one read, then wait. Polling by re-posting is spam and buries the signal.
4. **Don't merge to main.** Land as PRs, issues, comments, branches only. Even if the task feels done-merged, never touch a default branch or push a release tag.
5. **Don't invent facts.** Never fabricate PR numbers, digests, branch names. If you don't have evidence, report BLOCKED with the gap.
6. **Don't skip the heartbeat.** Five minutes, max. Silence makes you a lost soul, and the leader cannot tell whether you are stuck or absent.

Two of these (the worklock and the heartbeat) also appear as vows; the anti-patterns restating them shows the skill treats them as its two highest-frequency failure modes.

## The six red flags

The red-flag section covers situations where the environment, not the follower, misbehaves:

- **`checkin` returns non-zero** -> check the script, your `$GTW`, your permissions; do not invent a fake checkin.
- **A peer's `FOLLOWER_<M>.md` shows a stale timestamp (more than 15 min, no heartbeat)** -> `post` them once with a heartbeat ping; do not take over their task. The standing rule is detect, ping once, never assume ownership.
- **`CULT_LEADER.md` PULPIT contradicts a yubiOS skill** -> the doctrine wins; ask the leader in cross-talk before proceeding; do not silently pick a side.
- **You feel like you should "just fix this little thing nearby"** -> that is scope creep; stop, write a BLOCKED note if the unrelated thing sits in your path, do not edit it.
- **Your inbox task says "TBD" or "TBA"** -> report BLOCKED with "task under-specified"; do not guess.
- **The cult leader hasn't checked in for more than 30 minutes during your task** -> post a status query once via cross-talk and continue working; do not panic.

## The stale-detection numbers in context

The 15-minute stale-peer threshold and the 30-minute silent-leader threshold are not arbitrary. The skill's own failure-mode section defines a stale lock as at least 15 minutes old, roughly 3 times the 5-minute heartbeat window (source doc). Comparable agent-monitoring implementations converge on the same shape: the knoxio-labs/room agent health-monitoring issue specifies health states of Healthy, Warning, Stale, and Exited, tracks `last_message_at` and `last_status_at` per agent, runs a health-check loop every 60 seconds, and uses configurable thresholds with `status_interval_max` defaulting to 5 minutes and `stale_threshold` to 10 minutes (https://github.com/knoxio-labs/room/issues/685, jev weight 0.59). A separate agent-orchestration issue review found the inverse failure: heartbeat-based stale detection that defaults to disabled (`stale_timeout_seconds` defaulting to 0), leaving stale agents undetected (https://github.com/NousResearch/hermes-agent/issues/35986, jev weight 0.37, weak backing). Together those two sources support the skill's design choice: a fixed, always-on threshold beats a configurable-but-off-by-default one, because the failure mode of a disabled watchdog is exactly the lost-soul condition the skill exists to prevent.

## The response protocol pattern

Every red flag resolves to one of three moves: verify locally (the failed checkin), ping once and stand down (the stale peer, the silent leader), or report BLOCKED with the real reason (the under-specified task, the scope creep). None of them authorizes taking over another actor's work or silently guessing. The consistency across all six cases is the point: when the environment misbehaves, the follower's default is to make the state visible to the leader rather than to repair the state itself, because repairs made unilaterally cannot be trusted by the rest of the trust chain.
