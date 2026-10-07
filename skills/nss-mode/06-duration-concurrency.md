# 06 - Execution duration and concurrency

Scope: dimensions 8 and 9 of the Mode axis: one-shot versus long-running execution (timeouts, cancellation, cleanup, retry, checkpoint) and concurrency/output flow (batch versus streaming, buffering, backpressure).

## Dimension 8: execution duration (0-2)

The source doc splits the axis on duration: "one-shot/batch vs long-running service; timeout, cancellation, cleanup, retry, checkpoint where relevant." A one-shot tool has the lighter contract (run, exit, report); a long-running one must document what happens across the whole life: unbounded waits are the defect. The source doc's Example 3 scores a CI workflow's duration 1 (one-shot per event), while Example 2's systemd service scores 2 (long-running).

For long-running work, the shutdown path is the part most often missing. The canonical pattern is a shutdown sequence with a defined order: stop accepting new work, drain in-flight work under a deadline, then exit (https://stackpractices.com/patterns/graceful-shutdown-pattern/, weight 0.16, weak backing; same shape at https://www.async-concurrency.com/resilience-cancellation-error-handling/graceful-shutdown-and-signals/, weight 0.20, weak backing). The Tokio tutorial grounds the mechanism: applications shut down when they receive a signal from the operating system, and shutdown work runs before termination (https://tokio.rs/tokio/topics/shutdown, weight 0.83). A mode contract at level 4 or above names its signals (SIGINT, SIGTERM), its drain deadline, and its cleanup obligations; a contract that says nothing about SIGTERM is not a long-running contract.

Retry and checkpoint semantics belong here too: a batch job that dies at record 90,000 of 120,000 needs a documented restart story (checkpoint, resume-from, or idempotent rerun), not a shrug. The source doc lists these "where relevant", so the scorer judges whether the tool's actual duration class makes them relevant.

## Dimension 9: concurrency and output flow (0-2)

The source doc contract: "batch vs streaming; bounded vs unbounded input/output; buffering/backpressure; progress on stderr, data on stdout." The batch/streaming distinction has a standard definition to grade against. Databricks' documentation states the semantic core: "Batch processing reprocesses all available source data; streaming processing tracks and processes only new data" (https://docs.databricks.com/aws/en/data-engineering/batch-vs-streaming, weight 0.83). That is exactly the completion-boundary question the source doc raises: batch has a defined end (the input is exhausted), streaming does not (input is open-ended), so a streaming tool needs explicit boundaries, partial-failure policy, and incremental emission semantics that a batch tool can take for granted.

The stream-splitting rule (progress on stderr, data on stdout) is what makes a tool composable in pipes: if progress indicators land on stdout, the tool's data output is polluted and downstream consumers break. The source doc treats this as part of the observable contract under dimension 9, and the broader CLI conventions agree: data to stdout, messages and diagnostics to stderr.

Bounded versus unbounded matters for backpressure: a tool that reads an unbounded input stream while writing to a slow consumer must either buffer bounded, drop with policy, or block; the contract should say which. The source doc's example 3 notes a CI workflow is "batch per run" and scores batch_streaming 1: the mode is clear but only one of the two flows is exercised.

## How the two dimensions interact

Duration and flow compose. A long-running streaming service has both contracts simultaneously: it must handle SIGTERM gracefully (dimension 8) while defining what one "message" of output is and what happens when the consumer stalls (dimension 9). A one-shot batch tool can score well with much less: defined end, defined exit, bounded memory. The rubric scores each dimension against the tool's own duration class, which is why a systemd unit and a CI workflow can both land at 9/20 total with different dimension profiles (source doc, Examples 2 and 3).

## Scoring notes

- 0 on dimension 8: no duration statement at all; the caller cannot tell if the tool returns or runs forever.
- 1 on dimension 8: duration class named, but no timeout/cancellation/cleanup story.
- 2 on dimension 8: signals, drain deadline, cleanup, and restart/retry policy all documented.
- 0 on dimension 9: output flow unstated; "it prints stuff".
- 2 on dimension 9: both stream classes defined with buffering/backpressure policy and stream separation honored.
- Numbers as digits: dimensions 8 and 9 are dimensions 8 and 9 of 10, scored 0-2 each in the 20-point scheme (source doc).
