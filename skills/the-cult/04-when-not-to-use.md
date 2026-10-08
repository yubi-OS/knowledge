# 04 - When NOT to use the cult

Scope: the three boundary rules the source doc sets for the cult leader role, the specific failure each rule prevents, and why this subtopic carries no external dig.

Grounding spine: `yubi-OS/yubiOS skills/the-cult/SKILL.md` (source doc, fetched 2026-10-08). This is an internal-record subtopic: the rules reference project-internal artifacts (the live yubiOS repo, `BLOCKERS.md`, `PROJECT_RULES.md`, and the deleted `cult-poll` schedule) rather than external mechanisms, so per the mint spec no searXNG dig was run and every claim below is attributed to the source doc.

## Rule 1: do not assign from a stale PULPIT

Before any assignment pass, the leader must verify that the PULPIT task pool in `CULT_LEADER.md` reflects the live state of `github.com/yubi-OS/yubiOS` (source doc). The source doc pins the verification horizon: if `BLOCKERS.md` was reviewed today, re-verify the PULPIT against today's state, not last week's snapshot. If a task's pull request, digest, or blocker cannot be verified against the live repo, the leader must not assign it; it gets queued for re-verification or dropped.

The rationale the source doc gives is blunt: a stale PULPIT silently routes followers at work that no longer exists. The cost asymmetry is the point. Verifying costs one repo check; a wrong assignment costs a follower agent a full work cycle on a task that has no target, plus the leader's time to detect and reassign. This is the leader-side counterpart of the skill's broader cosmic duty to never invent a PR number, digest, or blocker.

## Rule 2: do not run solo

`cult.sh gather` needs at least one follower to unblock (source doc). If no follower shows up within `MAXWAIT_SECONDS=570`, the source doc says the skill has no role to play: bring up the-follower first, or stop. The boundary is about the skill's identity, not just its mechanics. The-cult is the orchestrator half of a two-sided contract; with zero followers there is nothing to orchestrate, and a leader that keeps polling an empty folder is not doing orchestration, it is doing a timed wait with no exit condition.

## Rule 3: do not schedule it

The source doc is categorical: this is live interactive orchestration, not a batch job, and there is no scheduled variant (source doc). The `cult-poll` schedule was deleted on 2026-06-25 for exactly this reason, as recorded in `PROJECT_RULES.md` under "Managing schedules (cron tasks)" (source doc). A cron-driven sermon would poll on a fixed cadence regardless of whether followers are present, tasks exist, or the session has any reason to run, which is the same failure mode the gather window's event-driven quiet logic was designed to avoid.

## The zombie-sermon corollary

The boundary rules connect to the source doc's ending protocol: do not leave a sermon alive with `Sermon status` still `IN SESSION` and schedule files still listed while there is no PULPIT work (source doc). The 2026-06-25 `cult-poll` incident accumulated from precisely that state. A dismissed sermon is a clean sermon: schedules deleted, not merely disabled, because `enabled: false` leaves them listed and re-enableable.

## Why these rules are internal-record

None of the three rules names an external tool, standard, or API to dig for. They encode operating discipline learned inside this workspace: the PULPIT verification rule binds to yubiOS repo artifacts, the solo rule binds to the gather implementation's wait semantics, and the scheduling rule binds to a dated incident and a project-rules document. Digging for generic multi-agent guidance would have produced claims weaker than the source doc's own specificity, so the corpus records them as-is from the source doc. The guidelines section of the source doc echoes rules 2 and 3 verbatim, confirming they are load-bearing rather than advisory.
