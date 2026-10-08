# 02. The arrival ritual

Scope: the ordered startup sequence every follower runs when it joins a sermon: init, claim, read the pulpit, check in, and wait for orders.

## The five-minute window

A follower is spawned immediately after Jenny gives the `go-with-<leader-name>` trigger. The leader is already in `gather`, waiting, and the source doc states the window plainly: you have roughly 5 minutes to check in before the leader takes the pulpit and starts assigning (source doc: https://github.com/yubi-OS/yubiOS/blob/main/skills/the-follower/SKILL.md). Arrival speed is therefore not a nicety; it is the difference between being counted in the congregation and starting the sermon as a bystander.

## The four steps in order

1. **Enter the folder.** `bash <cult.sh> init`. The source doc notes it is harmless if the folder already exists, so there is no need to check before running it.
2. **Claim your number.** `N=$(bash <cult.sh> claim)`. The claim is atomic: it creates the lowest free `FOLLOWER_${N}.md` and that file is now yours. The source doc's failure-mode section is emphatic that claim is atomic and picks the lowest free N, and that manually picking a higher N is itself a race. Remember N; every later engine call takes it.
3. **Read the pulpit.** Open `CULT_LEADER.md` and read the PULPIT: the objectives, the doctrine (rules), and the dependency/merge order. The source doc calls this your scripture. The merge order matters because it tells a follower where its work sits relative to peers before any coordination is needed.
4. **Check in.** `bash <cult.sh> checkin "$N" "present — ready for orders"`. This rings the bell and resets the leader's 5-minute quiet timer. The source doc instructs followers to keep checking in while idle, because once 5 minutes pass with no new check-in, the leader takes the pulpit and starts assigning.
5. **Wait for orders.** Poll your inbox by re-reading `FOLLOWER_${N}.md`. When a `- [ ]` line appears under `## Inbox`, that is your task.

## Why the claim must be atomic

The claim step is the only place two followers can collide during arrival. Both are spawned from the same trigger and both run `claim` within seconds of each other. An atomic claim that always assigns the lowest free N removes the race by construction: the engine serializes the check-and-create. If claim nevertheless returns a non-integer, exits non-zero, or two followers race for the same N, the source doc's recovery is bounded: retry `claim` up to 2 times with `sleep 1` between attempts, and never pick a higher N manually. Exclusive-create semantics of the kind behind this pattern are documented in standard references on atomic file creation (https://runebook.dev/en/docs/python/library/os/os.O_EXCL, jev weight 0.23, weak backing: the O_EXCL flag makes creation fail if the target already exists, which is what turns check-then-create into create-or-fail). The stronger framing evidence is thin here; the source doc's own atomicity guarantee is the primary ground for this section.

## The check-in as a liveness signal

The 5-minute quiet timer is a liveness mechanism in the classic distributed-systems sense. External orchestration guidance recognizes the same shape: Microsoft's multi-agent patterns guidance treats one agent calling others as the modular, scalable decomposition of a problem (https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns, jev weight 0.86), and the OpenAI Agents SDK defines orchestration as deciding which agents run, in what order, and how the next step is chosen (https://openai.github.io/openai-agents-python/multi_agent/, jev weight 0.79). The check-in answers the third question from the follower's side: it is how the leader learns the congregation has assembled before it decides who runs what.

## What arrival does not do

The arrival ritual does not verify that the leader is currently in `gather` before claim, and the first follower cannot arrive before `CULT_LEADER.md` exists at all. The source doc is explicit that both preconditions are orchestrator-side responsibilities owned by the-cult, acknowledged in the pairing contract. A follower that finds no pulpit file reports `BLOCKED:` and waits; it does not improvise the missing side of the contract. This keeps the worker-side skill simple: arrival is mechanical, and every judgment call belongs to the leader.
