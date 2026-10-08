# 03 - Running a sermon: the leader loop step by step

Scope: the full step-by-step flow a cult leader runs, from trigger to steady-state polling and re-gather, and how each step maps onto the orchestrator-workers pattern documented outside yubiOS.

Grounding spine: `yubi-OS/yubiOS skills/the-cult/SKILL.md` (source doc, fetched 2026-10-08). Claims marked "source doc" come from that file. External claims carry their source URL and a jev noul weight; weights below 0.5 are labeled weak backing.

## The ten steps

The source doc prescribes the flow in this order:

1. Trigger discipline. When Jenny types `go-with-<name>` in chat, the leader must not open the sermon. The typed text only re-surfaces the bell button: set the `LEADER_NAME:` line in `GET_TO_WORK/RING_THE_BELL.md`, keep `isComplete: false`, and present the draft so the button reappears. One click equals one stamped trigger (source doc).
2. Open the doors on the trigger. Run `bash scripts/cult.sh begin <leader-name>`, which inits the folder, stamps the pulpit status `IN SESSION, led by <name>`, and blocks in `gather`. If `CULT_LEADER.md` is missing, seed it from `references/CULT_LEADER.template.md` first (source doc).
3. Let them gather. Followers run the the-follower skill: each claims a `FOLLOWER_N.md` and checks in. The leader waits and does nothing yet (source doc).
4. Wait for the congregation to settle. `cult.sh gather` blocks until 5 minutes pass with no new check-in and at least one follower is present, then prints the roster. The quiet window is the arrival signal (source doc).
5. Take the pulpit. With the roster known, clear the roll-call board with `cult.sh clear-board` (source doc).
6. Assign the work. For each follower, drop an order into their inbox: `cult.sh assign <N> "task text"`. Tasks come from the PULPIT task pool in `CULT_LEADER.md`, matched to the follower, respecting the dependency and merge order in the pulpit (source doc).
7. Keep the channel open. Followers check in at least every 5 minutes or the instant work completes; the leader polls their files, reassigns as tasks clear, and uses `cult.sh post FROM TO "msg"` to write cross-talk when followers need to coordinate with each other (source doc).
8. Re-gather as needed. A new follower arriving mid-run claims a free slot and checks in; the leader folds it into the next assignment pass (source doc).

The remaining steps live in the ending protocol (source doc, covered by a dropped outline subtopic; see README gaps).

## The orchestrator-workers mapping

The loop is a file-backed instance of the orchestrator-workers pattern. In the canonical description, the orchestrator-workers pattern operates in two phases: an analysis and planning phase where the orchestrator receives the task and context, analyzes what approaches would be valuable, and generates structured subtask descriptions, followed by a dispatch phase where workers execute them (Claude Cookbook, https://platform.claude.com/cookbook/patterns-agents-orchestrator-workers, weight 0.75, authoritative backing). The same pattern is described elsewhere as a central orchestrator agent that dynamically breaks down complex goals into smaller subtasks, delegates them to specialized worker agents, and synthesizes the workers' outputs, enabling dynamic task decomposition unlike rigid workflows (agents.kour.me, https://agents.kour.me/orchestrator-worker/, weak backing: 0.20).

The pattern traces to Anthropic's Building Effective Agents essay: a central LLM plans, dispatches subtasks to workers, then aggregates (buildingeffectiveagents.com, https://buildingeffectiveagents.com/patterns/orchestrator-worker/, weak backing: 0.20). Anthropic's own engineering write-up is the origin source (https://www.anthropic.com/engineering/building-effective-agents, weak backing: 0.46) and is also served at the research mirror URL (https://www.anthropic.com/research/building-effective-agents, weak backing: 0.41).

Where the cult departs from the canonical pattern (source doc): planning is not done live by the orchestrator. The PULPIT task pool is pre-derived from the live yubiOS repo before assignment, and step 5's rule forbids assigning from a stale PULPIT. Subtask descriptions are free-text inbox orders plus a skill-load order prefix, not structured XML payloads.

## Assignment, not work stealing

In parallel computing, work stealing is a scheduling strategy where idle processors take work from the queues of busy ones (Wikipedia, https://en.wikipedia.org/wiki/Work_stealing, weak backing: 0.22). The cult is the opposite regime: the leader pushes tasks into specific slots via `cult.sh assign`, and the one-task-one-slot guard refuses to fan the same task token to two slots. Push assignment plus the guard trades automatic load balancing for explicit accountability, which is what the leader's verification duties require (source doc).

## The gather window as a barrier

Concurrent orchestration frameworks describe fan-out/fan-in with superstep barriers, where parallel branches run and a real aggregator merges results at a synchronization point (arafattehsin.com, https://arafattehsin.com/blog/agent-orchestration-patterns-part-3/, weak backing: 0.22). The cult's gather step plays the same role with wall-clock semantics instead of a framework primitive: it blocks until a 5 minute quiet window passes, which is the barrier behind which the roster is frozen and the first assignment pass begins (source doc). The analogy is inexact, since late arrivals are re-gathered mid-run rather than rejected, but the synchronization intent is the same.
