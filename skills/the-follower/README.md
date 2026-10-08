# skills/the-follower - knowledge corpus

Ground source: `yubi-OS/yubiOS skills/the-follower/SKILL.md` (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/the-follower/SKILL.md), fetched 2026-10-08, 31,580 bytes. Topic: the worker side of the-cult multi-agent orchestration - agents gather into the GET_TO_WORK folder, claim their own FOLLOWER_N.md, check in to the cult leader's pulpit, poll for orders, do the work, and report back at a 5-minute heartbeat.

## Docs

- [01-get-to-work-layout.md](01-get-to-work-layout.md) - the GET_TO_WORK folder contract: CULT_LEADER.md pulpit, FOLLOWER_N.md inbox/outbox, the shared cult.sh engine, and the GTW path variable.
- [02-arrival-ritual.md](02-arrival-ritual.md) - the ordered startup sequence: init, atomic claim of the lowest free FOLLOWER_N, pulpit reading, first check-in inside the 5-minute gather window, inbox polling.
- [03-working-ritual.md](03-working-ritual.md) - the per-task loop: worklock before ACK, outbox dedupe, ACK, skill-grounded execution, 5-minute heartbeat, DONE/BLOCKED report with evidence, workunlock, one-shot cross-talk, loop.
- [04-follower-vows.md](04-follower-vows.md) - the seven standing vows: doctrine obedience, CI only when pulpit-assigned, no merges to main, decimal-repo tripwire, lane discipline, honesty, faithful check-in.
- [05-anti-patterns-and-red-flags.md](05-anti-patterns-and-red-flags.md) - the six behavioral anti-patterns and the six situational red flags, with the 15-minute stale-peer and 30-minute silent-leader thresholds.
- [06-failure-modes.md](06-failure-modes.md) - the four cult.sh error classes: worklock BUSY (stale vs fresh), claim race (bounded retry), checkin silent no-op (3-step verification), out-of-order report.
- [07-recovery-respawn.md](07-recovery-respawn.md) - crash and context-loss protocol: file-system-read-first, three respawn branches, slot-abandonment handoff.
- [09-verification-checklist.md](09-verification-checklist.md) - the seven pre-DONE gates a follower confirms before its terminal report.

## Research summary

- Results collected: 84 (60 initial + 24 from 1 redo pass on subtopics 02, 03, 07).
- Weight split (jev noul): 27 high (>= 0.5) / 57 low (< 0.5) of 84.
- jev requests: 7 (1 outline-validation score request + 6 weighting batches of 9-15 questions, DefAPI direct, typesafe/jev-1.13); usage 8825 input / 1675 output tokens.
- Redo counts: doc 02 x1, doc 03 x1, doc 07 x1 (see the redo_log fields in research-db/digs/).
- Skipped docs: none. Dropped at outline validation: subtopic 08 (end-of-sermon-idle), score 0.32 with P(padding) = 0.74.

Preflight 2026-10-06: searXNG campaign preflight healthy (orchestrator); decide (typesafe/jev-1.13) 200 via DefAPI direct.

## Subtopic 08 note (gap)

The end-of-sermon and idle-polling material lives in the ground source (its ## End of sermon section); it was dropped by score validation before digging, so this corpus carries no dedicated doc for it. Consult the source doc directly for sermon-end detection, the 1-minute idle poll, and the 15-minute standby threshold.
