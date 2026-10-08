# 08 - The follower contract: slots, check-ins, outboxes, skill-load order

Scope: what the cult leader can rely on from every follower slot, and the distributed-systems pattern families behind each expectation.

Grounding spine: `yubi-OS/yubiOS skills/the-cult/SKILL.md` (source doc, fetched 2026-10-08). Claims marked "source doc" come from that file. External claims carry their source URL and a jev noul weight; weights below 0.5 are labeled weak backing.

## The four obligations

The source doc pins four things every follower must do, which define what the leader can depend on:

1. Claim a slot atomically. Each follower creates its own `FOLLOWER_N.md` with bash noclobber, so two agents can never grab the same number (source doc). This is the follower-side half of the locking contract; it is what makes the roster trustworthy before the first assignment pass.
2. Check in on a 5 minute clock. Followers check in at least every 5 minutes, or the instant work completes (source doc). The check-in writes the signals the leader's gather and poll logic read from.
3. Report to the Outbox. Followers report work into the Outbox section of their own `FOLLOWER_N.md`; they do not write into the leader's document (source doc). Direction of write is part of the contract: the leader writes Inboxes, followers write Outboxes.
4. Read the skills first. Inbox task text starts with an explicit skill-load order, `Read these skills first, in this order: token-efficiency + context-isolation + the skill this task needs`, so followers do not waste turns on schema or type errors before reading the right skill (source doc). The full rationale lives in `PROJECT_RULES.md` under "Operating discipline (refined 2026-07-28)".

The leader-side complement: a new follower arriving mid-run claims a free slot and checks in, and the leader folds it into the next assignment pass (source doc). Arrivals are never rejected, only deferred to the next pass.

## Check-ins as liveness detection

The 5 minute check-in is a heartbeat. In distributed systems, liveness detection covers exactly this problem, and heartbeat-based schemes are one of its standard mechanisms, with gossip protocols propagating status over time and membership protocols such as SWIM with Lifeguard combining liveness with membership (aeron.io, https://aeron.io/docs/distributed-systems-basics/liveness-detection/, weak backing: 0.14). The cult implements the same idea at the smallest possible scale: one writer, one shared file, wall-clock freshness instead of network round trips. The quiet-window gather is the failure detector built on this signal: 5 minutes without a check-in means the congregation has stopped arriving.

## The outbox name is a deliberate echo

The transactional outbox pattern solves the dual-write problem in distributed systems, where a single operation involves both a database write and a message or event notification (AWS Prescriptive Guidance, https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html, weak backing: 0.21). The paired inbox pattern ensures idempotent event processing on the receiving side, and the two patterns together give reliable asynchronous messaging (bool.dev, https://bool.dev/blog/detail/inbox-and-outbox-patterns, weak backing: 0.19; SoftwareMill, https://softwaremill.com/microservices-101/, weak backing: 0.12).

The cult borrows the names, not the machinery (source doc). Its Inbox and Outbox are plain file sections, not append-only tables with a relay, because the failure the transactional pattern fixes (two systems disagreeing about whether a message was sent) cannot occur across two file sections on one filesystem. What does carry over is the direction discipline: a producer appends to its outbox, a consumer reads its inbox, and neither writes the other's section. The pattern family is the same; the consistency guarantee comes from the filesystem plus the pulpit lock instead of a database transaction.

## What a network protocol would add, and why it is not used

The Agent2Agent (A2A) Protocol is an open standard for communication and collaboration between AI agents, providing a common language for interoperability between agents built with different frameworks and vendors (a2a-protocol.org, https://a2a-protocol.org/latest/, weak backing: 0.38). Platform vendors are building agent management layers on similar assumptions (Microsoft, https://learn.microsoft.com/en-us/agents/, weak backing: 0.24).

The cult sits deliberately below that layer (source doc): its agents already share a filesystem, so the transport problem A2A solves does not exist here, and the protocol's overhead buys nothing the pulpit lock does not already provide. This is a dated design choice; if the follower set ever spans machines, the file bus stops being sufficient and a network protocol becomes the right tool.

## Why the skill-load order matters

The skill-load prefix is the one obligation that is about cognition rather than coordination (source doc). A follower that starts working before loading the right skill burns turns on schema and type errors; the prefix turns skill loading into part of the task definition itself, ordered so token-efficiency and context-isolation discipline comes before the task-specific skill. It is the leader enforcing, at the inbox level, the operating discipline the project records globally.
