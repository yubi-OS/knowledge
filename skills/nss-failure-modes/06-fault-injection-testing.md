# 06: Fault injection and negative testing

Scope: testing the error path instead of the happy path: the fault list the source doc prescribes, the fault-injection tradition behind it, and the idempotency and distributed-systems verification results that decide whether a recovery path actually works.

## The source doc's fault list

The trigger list in the source doc names the faults a negative test suite should inject: SIGTERM, ENOSPC, EINTR, EIO, ETIMEDOUT, ENOENT, EACCES, EAGAIN [source doc]. Guideline 4 says why: a test that proves the happy path is correct does not prove that timeout, interruption, malformed input, partial completion, dependency failure, permission failure, disk-full, or cancellation is handled. Fault-inject each documented mode [source doc, Guidelines].

The verification checklist then closes the loop: each High or Critical row must have a test entry, and a documented failure mode without one is a hypothesis, not a control, to be marked evidence_gap: untested [source doc, Verification points 4 and 6].

## Fault injection as a discipline

Fault injection has a formal definition as a testing technique: deliberately introducing faults into a system to verify its error-handling paths behave as documented. The Wikipedia article on fault injection covers this lineage (weight 0.29, https://en.wikipedia.org/wiki/Fault_injection) [weak]; the software-testing article similarly frames error-path coverage as a distinct testing concern (weight 0.31, https://en.wikipedia.org/wiki/Software_testing) [weak]. These are weak backing for the framing; the operative fault list and the per-mode test requirement come from the source doc.

## Production fault injection: Chaos Monkey

The strongest external anchor in this dig is the Netflix Chaos Monkey toolchain. Chaos Monkey randomly terminates virtual machine instances and containers in production, and its README states the design intent: exposing engineers to failures more frequently incentivizes them to build resilient services, and the tool follows the Principles of Chaos Engineering (weight 0.54, https://github.com/Netflix/chaosmonkey) [primary]. The project's own documentation describes the same contract: randomly terminating instances to ensure services are resilient to instance failure (weight 0.52, https://netflix.github.io/chaosmonkey/) [primary].

The relevance to the failure-modes axis is direct: Chaos Monkey is fault injection for the Process and Resource channels (instance termination) applied where it hurts, in production, precisely because lab happy paths do not exercise the recovery path.

## Distributed-systems fault injection: Jepsen

For the Concurrency and Network channels, the dig surfaced the Jepsen framework. Jepsen is a framework for testing distributed systems' correctness under faults; it uses a checker to analyze the test's history for correctness and writes the test, history, analysis, and supplementary results to the filesystem for later review (weight 0.61, https://github.com/jepsen-io/jepsen) [primary]. The project describes its mission as pushing vendors to make accurate claims and test their software rigorously, and teaching engineers how to evaluate distributed systems correctness for themselves (weight 0.69, https://jepsen.io/) [primary]. A concrete vendor example: Consul's documentation publishes its Jepsen testing results for consistency verification under network partitions (weight 0.71, http://www.consul.io/docs/internals/jepsen.html) [primary].

Jepsen matters for the failure-modes record because its checker is a detection signal in the record schema's sense: it produces an exact, reproducible artifact (the history analysis) rather than a vibe-level "it failed sometimes".

## The idempotency half of the fault matrix

The retry-duplication hazard that FM-003 and FM-004 in the source doc's examples encode has a primary external anchor in this dig. The AWS Durable Execution SDK documentation states the mechanism precisely: replay and retry can each run the same operation more than once, an operation with a side effect repeats the side effect on every run, and idempotency describes operations where the effect remains the same regardless of how many times they run; the doc then works through at-most-once versus at-least-once execution semantics (weight 0.88, https://docs.aws.amazon.com/durable-execution/patterns/best-practices/idempotency/) [primary].

This grounds the source doc's contract-test pattern: fault-inject a 5xx after commit, retry, and assert one record [source doc, Example 2 FM-003 and Example 5 FM-004]. The AWS page explains why that test is the right shape: the dangerous window is a retry whose completion status is unknown, which is exactly the after-commit injection point.

## Redo note

The initial dig for this subtopic returned no primary-weight sources on these mechanisms; it was redone twice per the REDO rule with different queries (attempt 1: idempotency testing semantics; attempt 2: Chaos Monkey and Jepsen). The redo log is in digs/06-fault-injection-testing.json.
