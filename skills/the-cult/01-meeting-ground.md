# 01 - The meeting ground: file layout of the GET_TO_WORK bus

Scope: what the GET_TO_WORK folder contains, what each file and directory is for, and how that layout relates to shared-workspace coordination patterns documented outside yubiOS.

Grounding spine: `yubi-OS/yubiOS skills/the-cult/SKILL.md` (source doc, fetched 2026-10-08). Claims marked "source doc" come from that file. External claims carry their source URL and a jev noul weight; every weight below 0.5 is labeled weak backing.

## The folder, file by file

The source doc defines one folder as the whole coordination surface: `documents/github-yubios-KS9n5GAT/GET_TO_WORK/`, described as runtime sermon state in the #github-yubios documents tree, not repo-truth (source doc). Its contents, per the source doc:

- `CULT_LEADER.md` holds the PULPIT (objectives) on top and the CROSS-TALK (message index) below. This is the leader's document and the sermon's front page.
- `FOLLOWER_N.md` exists once per follower and holds that follower's Inbox (orders from the leader) on one side and Outbox (reports back) on the other.
- `.checkin_board` is the hidden roll-call log recording which followers have checked in.
- `.last_checkin` stores the epoch of the most recent check-in, which is what the gather step's quiet-window logic reads.
- `.pulpit.lock` is a directory, not a file: `mkdir` on a directory is atomic, so exactly one writer can create it (source doc; see doc 03 for the lock protocol).
- All writes go through `scripts/cult.sh` so the locking stays correct; the folder path can be overridden with `GTW=...` (source doc).

The source doc's rule attached to this layout: never hand-edit `CULT_LEADER.md` or a `FOLLOWER_N.md` directly during a live sermon; always go through `cult.sh` so the lock is respected.

## Where this layout sits among known patterns

The meeting ground is a concrete instance of the blackboard pattern. In the blackboard architecture, a central shared data repository acts as a collaborative workspace where independent, specialized agents contribute partial solutions, post problems, and read updates without direct communication (inferensys.com, https://inferensys.com/guides/multi-agent-system-mas-orchestration/how-to-implement-a-blackboard-architecture-for-agent-collaboration, weak backing: 0.22). Descriptions of the same pattern emphasize a shared knowledge space where specialized agents contribute partial solutions that converge into complete answers (callsphere.ai, https://callsphere.ai/blog/blackboard-architecture-multi-agent-systems-shared-knowledge-spaces, weak backing: 0.15). A course text on agentic memory architectures lists the shared workspace, which can be a database, a shared file system, or a dedicated blackboard memory module, as one of the standard coordination mechanisms in multi-agent systems (apxml.com, https://apxml.com/courses/agentic-llm-memory-architectures/chapter-5-multi-agent-systems/coordination-mechanisms-mas, weak backing: 0.18).

A second lens is stigmergy: indirect coordination through the environment, where the trace left by one action stimulates a succeeding action by the same or a different agent (Wikipedia, https://en.wikipedia.org/wiki/Stigmergy, weak backing: 0.28). The cult's files are exactly such traces: a check-in left on `.checkin_board` stimulates the leader's next assignment pass, and an order written into an Inbox stimulates the follower's next work cycle. Writing about software teams, the same idea appears as people leaving traces such as code, pull request comments, and tickets that others read and build on instead of transferring full context (briefhq.ai, https://briefhq.ai/blog/stigmergy/, weak backing: 0.09).

The third lens is the closest match in the literature: a 2026-dated write-up describes a coordination protocol of static file ownership via a shared board, asynchronous message passing, and persistent task management, and claims it enabled 20 LLM agents to work on a multi-project codebase simultaneously without conflicts (pubroot.com, https://pubroot.com/ai/agent-architecture/file-ownership-and-message-passing-a-practical-coordination-protocol-for-2026-024/, weak backing: 0.15). Map its three elements onto the source doc: static file ownership is the `FOLLOWER_N.md` slot, the shared board is `CULT_LEADER.md`, and persistent task management is the PULPIT task pool with its checkbox lifecycle.

As background, a decentralised system is one where lower level components operate on local information to accomplish global goals, with the global pattern an emergent property of mechanisms acting on local components such as indirect communication (handwiki.org, https://handwiki.org/wiki/Decentralised_system, weak backing: 0.11).

## What the cult's layout adds

Compared with generic blackboard descriptions, the source doc pins three things the pattern literature leaves open (source doc): which document is whose (one leader document, one file per follower), where each message class lives (Inbox, Outbox, CROSS-TALK index), and which writes are forbidden without the lock. It also fixes the tooling boundary: the layout is inert without `cult.sh`, the engine that enforces the locking contract.

Drift note: the blackboard literature describes agents contributing to a shared structure directly. The cult's design deliberately routes every write through one lock and one script instead, trading direct-write flexibility for the guarantee that two agents never clobber each other's lines. That is a dated design choice of the source doc, not a contradiction of the pattern.
