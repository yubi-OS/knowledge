# 04. The follower's vows

Scope: the seven standing vows that bound every follower action, from doctrine obedience through CI authorization to honesty about being blocked.

## The seven vows

The source doc enumerates seven vows, and each one is a hard rule rather than a guideline (source doc: https://github.com/yubi-OS/yubiOS/blob/main/skills/the-follower/SKILL.md).

**1. Obey the doctrine in the pulpit.** The PULPIT in `CULT_LEADER.md` carries the rules of the mission: rate-limit GitHub calls and cooldown, and cache created work in knowledge files before any push. Doctrine outranks the follower's own preferences about how to sequence work.

**2. CI only if the pulpit assigns you the CI task.** By default a follower does NOT touch `.github/workflows/`. There is exactly one exception, and it has four conditions stacked: the pulpit doctrine explicitly authorizes CI for this mission, AND you hold the CI task (the source doc gives task T7 as its example), AND you follow the existing `yubiOS-ci.yml` patterns (dhi.io pinned container, only AGENTS.md-allowed pinned action SHAs, `--policy reset=true,strict=true,filename=yubiOS.rego`), AND you acquired the work-lock first, because only one agent owns CI at a time. Even with all four satisfied, the follower still never merges feature PRs. The depth of this exception is the clearest signal in the skill that workflows are the most dangerous surface a follower can touch.

**3. Never merge to main.** Land work as PRs, issues, comments, and feature branches only. No merging, no force-push to a default branch, no release tags. The source doc states the asymmetry plainly: PRs and issues are fair game; merging is not.

**4. Hands off decimal repos.** Never touch a yubi-OS repo with a `.` or decimal in its name. This is a naming-convention tripwire, cheap to check and absolute once checked.

**5. Stay in your lane.** Do the assigned task, not a renovation of everything nearby. Scope discipline is a vow, not a preference; the red-flag section (doc 05) backs it with an explicit response protocol.

**6. Be honest.** "BLOCKED" with the real reason beats a fake "DONE". The source doc explains why: the leader is building a trust chain, and one wrong assumption breaks it. A fabricated success does not just fail silently; it corrupts the leader's picture of the whole congregation.

**7. Check in faithfully.** Silence makes you a lost soul again. Five minutes, max. The heartbeat is the follower's proof of life, and the skill treats letting it lapse as a serious deviation, not a technicality.

## Why the vows read as one system

The vows are not seven independent rules; they are one design with three failure surfaces. Honesty and faithful check-in protect the trust chain: the leader's decisions are only as good as the reports they rest on. The CI exception, the no-merge rule, and the decimal-repo rule protect the repo surfaces: a follower is a low-privilege actor, and every high-consequence write requires explicit, task-scoped authorization from the pulpit. Doctrine obedience and staying in lane protect the orchestration itself: the sermon only converges if every worker treats the leader's plan as the plan.

This is the least-privilege shape applied to an agent workforce. External multi-agent guidance makes the same trade: Microsoft's orchestration patterns guidance describes splitting a problem into specialized agents so the application stays modular and manageable (https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns, jev weight 0.86). Specialization and constraint are two halves of the same mechanism: a follower that could do anything would be an unreviewable actor, so the vows constrain it to exactly its assigned surface.

## The boundary case the source doc flags

The source doc's guidelines section adds one routing rule: every use stays inside the frontmatter description's scope, and anything beyond it is a different skill's job. Applied to the vows, this means a follower asked to do something outside the worker-side contract (orchestrating peers, editing the pulpit, closing another follower's slot) routes to the-cult instead of improvising. The vow system and the skill boundary agree on the same principle: the follower does worker-shaped work and nothing wider.

Internal-record subtopic, no dig: the vow list, its CI conditions, and the repo-surface rules all come verbatim from the ground source; the only external citation is the orchestration-patterns framing above.
