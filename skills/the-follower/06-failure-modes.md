# 06. Failure modes: the four cult.sh error classes

Scope: the four enumerated `cult.sh` error classes, each with an explicit recovery branch, under the standing rule that silent retries and fake successes are forbidden.

## The standing rule

The source doc introduces its failure-mode section with the rule that governs all four classes: never silently retry or invent a fake success; do the recovery move, or report BLOCKED with the underlying error (source doc: https://github.com/yubi-OS/yubiOS/blob/main/skills/the-follower/SKILL.md). Every branch below is either a bounded recovery or an honest report; there is no third option.

## Class 1: worklock returns BUSY

A sibling already holds the lock for your slot. The recovery branches on the lock file's mtime. Stale means at least 15 minutes old, roughly 3 times the heartbeat window: post one cross-talk message naming the holder and stand down; do NOT break the lock yourself. Fresh means under 15 minutes: check in with "heartbeat — sibling active, standing down" and exit, one check and one exit, no tight-loop polling. If the lock file is missing or unreadable, `report "$N" "BLOCKED: worklock file unreadable"` and exit; do NOT proceed without the lock.

The lockfile pattern is the standard shell-script mutual-exclusion tool: the flock(1) utility exists precisely to manage flock(2) locks from within shell scripts, wrapping a lock around a command's execution (https://www.man7.org/linux/man-pages/man1/flock.1.html, jev weight 0.88). The skill's innovation over plain flock is the staleness arbitration: rather than stealing a lock by age alone, it converts a stale lock into a single cross-talk message and lets the leader adjudicate.

## Class 2: claim fails or races

`claim` returns a non-integer, exits non-zero, or two followers race for the same N. The atomic claim failed. Recovery: retry `claim` up to 2 times with `sleep 1` between attempts. The source doc repeats the invariant that claim is atomic and picks the lowest free N, so manually picking a higher N is itself a race and is forbidden. If claim still fails after 2 retries, post to cross-talk asking whether GET_TO_WORK is reachable, and stand down. The retry budget (2) and the spacing (1 second) are both bounded; an unbounded retry loop against an unreachable filesystem would look like diligence while producing nothing.

## Class 3: checkin exits 0 but does nothing

The checkin succeeded silently: no timestamp change, no leader-visible pulse. Verify in order: (a) `$GTW` is set; if empty, export it and retry once; (b) the path exists, tested with `test -f "$GTW/CULT_LEADER.md"`; if missing, post to cross-talk and wait for the leader to initialize; (c) writability, tested with `touch "$GTW/.write-test" && rm "$GTW/.write-test"`; if it fails, `report "$N" "BLOCKED: GET_TO_WORK read-only"` and exit. If all three checks pass and checkin still no-ops, `report "$N" "BLOCKED: checkin no-op despite valid $GTW"`; do NOT fake a heartbeat.

The three-step ladder mirrors how the shell itself fails: the GNU Bash manual documents that a script's behavior under error depends on the shell's exit-status conventions, which is why each check here is an observable side effect (an environment echo, a file test, a touch) rather than a return-code read (https://www.gnu.org/software/bash/manual/bash.html, jev weight 0.93). A silent success is the nastiest failure class in shell tooling precisely because exit 0 hides it; the skill's answer is to demand an externally visible effect before believing any heartbeat.

## Class 4: report without a held worklock

A `report` called without a held worklock, or after `workunlock` returned non-zero, would race a sibling. Do NOT send the report. Re-acquire the lock with `worklock "$N"` first, then send the report normally. If the report is already in flight, send `report "$N" "BLOCKED: out-of-order report — re-running under worklock"` so the leader knows to discard the prior one. The class exists because the report is the one message the leader acts on; an out-of-order report can overwrite or duplicate a sibling's terminal state, so the skill treats it as a lock-discipline violation rather than a formatting problem.

## Why four classes and not more

The four classes map 1:1 onto the four engine verbs a follower calls most (worklock, claim, checkin, report), and each recovery ends in one of two observable outcomes: a lock held and work proceeding, or a BLOCKED report the leader can see. Idempotency discipline keeps this tractable: the same operation replayed must not change the outcome after the first success, the property Google Cloud's idempotency guide states as "the outcome on the server doesn't change after the first successful attempt" (https://cloud.google.com/discover/idempotency, jev weight 0.86). The worklock plus outbox dedupe give the follower exactly that property; the failure classes cover the ways the property can be violated at the boundary.
