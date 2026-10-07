# 06 Scheduling, workflows, fibers, queue, and retries

Scope: the time and background-processing layer of the SDK: one-shot and recurring schedules, cron, durable Workflows, runFiber checkpointing, the built-in queue, and retry with backoff.

Grounding note: the source doc is yubi-OS/yubiOS skills/agents-sdk/SKILL.md, cited as "source doc". Other claims cite their dig source URL plus the jev weight.

## Schedules

The source doc's Core APIs table gives the three scheduling one-liners (source doc): `await this.schedule(60, "task", payload)` for a delay, `await this.schedule("0 * * * *", "task", payload)` for cron, and `await this.scheduleEvery(30, "poll")` for fixed intervals. The schedule-tasks page confirms the full surface including `getScheduleById()` and `listSchedules()` for inspection (https://developers.cloudflare.com/agents/runtime/execution/schedule-tasks/, jev 0.92).

One-shot schedules take a seconds delay or a `Date`; the docs show `await this.schedule(new Date("2025-06-15T14:30:00Z"), "triggerEvent", { eventId: "conference-2025" })` for a timestamp and Date math for offsets (https://developers.cloudflare.com/agents/runtime/execution/schedule-tasks/, jev 0.92). Cron is five-field `minute hour day month weekday` with the standard special characters (https://developers.cloudflare.com/agents/runtime/execution/schedule-tasks/, jev 0.92).

Two semantics matter (https://developers.cloudflare.com/agents/runtime/execution/schedule-tasks/, jev 0.92):

- Cron schedules are idempotent by default: calling `schedule()` with the same cron expression, callback, and payload returns the existing schedule instead of duplicating, which makes cron setup safe inside `onStart()`.
- `scheduleEvery()` runs at fixed second intervals and, unlike cron, supports sub-minute precision and arbitrary durations such as 90 seconds.

## Workflows

The source doc frames Workflows as durable multi-step background processing via `AgentWorkflow`, started with `await this.runWorkflow("ProcessingWorkflow", params)` (source doc). The docs add the division of labor: agents excel at real-time communication and state; Workflows excel at durable execution with automatic retries and failure recovery. Use agents alone for chat and quick API calls; use Agent plus Workflow for long-running tasks over 30 seconds, multi-step pipelines, and human approval flows (https://developers.cloudflare.com/agents/runtime/execution/run-workflows/, jev 0.90).

A workflow extends `AgentWorkflow` (optionally typed `AgentWorkflow<MyAgent, TaskParams>`), implements `run(event, step)`, does durable steps with `step.do("step-name", fn)`, reports progress with `this.reportProgress()` (non-durable, may repeat on retry) versus `step.reportComplete(result)` (durable, will not repeat), and reaches back into the originating agent with `this.agent.someMethod()` via RPC or `this.broadcastToClients()` over WebSocket (https://developers.cloudflare.com/agents/runtime/execution/run-workflows/, jev 0.90). The agent receives lifecycle callbacks `onWorkflowProgress(workflowName, instanceId, progress)` and `onWorkflowComplete(workflowName, instanceId, result)` (https://developers.cloudflare.com/agents/runtime/execution/run-workflows/, jev 0.90).

## Fibers and durable execution

The source doc lists durable execution as `runFiber()` and `stash()` for work that survives Durable Object eviction (source doc). The docs ground the why: Durable Objects are evicted for three reasons, an inactivity timeout of roughly 70 to 140 seconds with no requests or open WebSockets, code updates and runtime restarts at 1 to 2 times per day, and a 15-minute alarm-handler timeout (https://developers.cloudflare.com/agents/runtime/execution/durable-execution/, jev 0.92).

`runFiber(name, fn)` registers the task in SQLite before it runs, keeps the agent alive during execution, accepts `ctx.stash(data)` checkpoints written synchronously (each call fully replaces the previous snapshot), and calls `onFiberRecovered(ctx)` on the next activation if the agent was evicted mid-task (https://developers.cloudflare.com/agents/runtime/execution/durable-execution/, jev 0.92). `keepAlive()` and the preferred `keepAliveWhile(fn)` create a 30-second alarm heartbeat that resets the inactivity timer; the heartbeat is invisible to `listSchedules()` and multiplexed through the single alarm slot (https://developers.cloudflare.com/agents/runtime/execution/durable-execution/, jev 0.92). The guidance is explicit: keepAlive prevents eviction but not recovery; use it alone when work is cheap to redo, and use `runFiber` when work is expensive and must resume (https://developers.cloudflare.com/agents/runtime/execution/durable-execution/, jev 0.92). For durably accepted background work with dedupe and cancellation, `startFiber(name, fn, { idempotencyKey, metadata, waitForCompletion })` returns a receipt with `accepted: false` on duplicate delivery (https://developers.cloudflare.com/agents/runtime/execution/durable-execution/, jev 0.92).

## Queue and retries

The built-in FIFO queue is `this.queue("handler", payload)` with `dequeue()`, `dequeueAll()`, and `getQueue()` for management (source doc; https://developers.cloudflare.com/agents/runtime/agents-api/, jev 0.90). Retries are `await this.retry(fn, { maxAttempts: 5 })` with exponential backoff and jitter (source doc).

## Choosing between them

The layering the docs teach (https://developers.cloudflare.com/agents/runtime/execution/durable-execution/, jev 0.92): schedules for time triggers, fibers for work inside the agent's own execution, Workflows for work that should run independently of the agent with per-step retries and multi-step orchestration. The source doc's capability list keeps all four because a real agent typically needs all of them (source doc).
