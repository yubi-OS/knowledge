# 01. Where everything lives: the GET_TO_WORK layout

Scope: the GET_TO_WORK folder contract, its two state files, the shared cult.sh engine, and the GTW path variable that binds it all together.

## The folder

The entire runtime state of a sermon lives in one directory: `documents/github-yubios-KS9n5GAT/GET_TO_WORK/`. The source doc is explicit that this is a space-local working folder in the #github-yubios documents tree and that it holds runtime sermon state, not repo-truth (source doc: https://github.com/yubi-OS/yubiOS/blob/main/skills/the-follower/SKILL.md). Nothing in the folder is a git artifact; it is coordination scratch space. That distinction matters: a follower should never try to commit the sermon state, and never mistake a missing folder for a missing repo.

The folder contains exactly two kinds of files:

1. `CULT_LEADER.md` holds the PULPIT: the objectives, the doctrine (rules), and the dependency/merge order. The source doc calls it scripture and requires every follower to read it before doing anything.
2. `FOLLOWER_<N>.md` is the personal file a follower owns once claimed. Its `## Inbox` section carries orders from the leader; its `## Outbox` section carries the follower's reports back.

## Why the engine is shared

Every action a follower takes (init, claim, checkin, worklock, workunlock, report, post) goes through one shared engine: `scripts/cult.sh`. The source doc states it lives in the the-cult skill at `the-cult/scripts/cult.sh` and is a companion script not shipped in-repo. The reason for routing all writes through one script is lockfile honesty: using the engine keeps the lockfile honest so you never clobber another follower's writes (source doc). Ad-hoc writes straight to `FOLLOWER_<N>.md` bypass the locking discipline the engine maintains.

The path is set once with an environment variable when the folder is not in its default location: `export GTW=documents/github-yubios-KS9n5GAT/GET_TO_WORK`. The source doc repeats this exact export in its failure-mode recovery branch for a silent checkin, which makes GTW the first thing to verify when the engine appears to do nothing.

## The wider pattern this fits

The leader-worker split the folder encodes is a recognized multi-agent orchestration shape. Microsoft's Copilot Studio guidance describes multi-agent systems where one agent calls other agents, and notes that breaking problems into multiple specialized agents makes an application more modular, scalable, and manageable (https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns, jev weight 0.86). The OpenAI Agents SDK frames orchestration as the flow of agents in an app: which agents run, in what order, and how the next step is decided (https://openai.github.io/openai-agents-python/multi_agent/, jev weight 0.79). GET_TO_WORK answers those same two questions in flat files: the PULPIT decides which work exists and in what order it merges, and the FOLLOWER_N files decide who is running what right now.

What makes this layout notable is that it is file-based rather than API-based. The leader reads progress from the Outbox sections of the follower files; followers read orders from the Inbox sections and doctrine from the PULPIT. There is no queue service, no database, and no network call in the coordination path. The cost is that the folder is a single point of failure for the whole sermon; the benefit is that every piece of state is directly readable by any participant with filesystem access, which is what makes the recovery protocol (doc 07) verifiable rather than trust-based.

## Reading order for a newcomer

The layout implies a strict reading order, which the arrival ritual (doc 02) enforces: read `CULT_LEADER.md` first, because doctrine governs everything downstream; then claim and read your own `FOLLOWER_<N>.md`; then poll it. A follower who reads their own file before the PULPIT risks acting on a task whose constraints they have not seen.

Internal-record subtopic, no dig: the file names, paths, sections, and script name above come from the ground source itself; no external research is needed to state them.
