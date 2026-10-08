# 03 - Batch Independent Tool Calls

Scope: issue independent tool calls together instead of serially, and the dependency test that decides which calls actually batch.

## The practice

The source doc (yubi-OS/yubiOS `skills/token-efficiency/SKILL.md`, Core practices 3) states: when two or more tool calls do not depend on each other's output, issue them together instead of serially, because each round trip carries fixed overhead beyond the actual payload (source doc). The same skill's verification checklist makes it checkable: independent read, glob, and grep calls should be issued in a single block, not serially (source doc, Verification).

## Why batching pays

The dig results quantify the win from outside the source doc.

A parallel tool calling guide (https://dev.to/rahulxsingh/parallel-tool-calling-in-llm-agents-complete-guide-with-code-examples-3ilo, jev weight 0.48, weak backing) claims parallel tool calling can reduce total execution time by 50-80% depending on the number of independent tool calls and individual call latency, with the worked example that fetching 5 files at 200ms each takes about 1 second sequentially but roughly 200ms in parallel (jev weight 0.48, weak). Weak per the weighting pass; treat the range as indicative.

An agentic-data explainer (https://airbyte.com/agentic-data/parallel-tool-calls-llm, jev weight 0.46, weak backing) adds the latency anatomy: in many agents the dominant latency comes from input/output rather than LLM inference, and parallel tool calls reduce total latency to the slowest single tool plus the inference cycles needed for planning and synthesis (jev weight 0.46, weak).

A latency analysis post (https://getnadir.com/blog/parallel-tool-calls-agent-latency-cost-gap/, jev weight 0.35, weak backing) claims parallel tool calls cut agent latency up to 3.7x (jev weight 0.35, weak).

A vendor-neutral reference for the pattern's place in agent design is Microsoft's Azure Architecture Center, which documents orchestration patterns including sequential and concurrent patterns for AI agent architectures (https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns, jev weight 0.56). Its value here is the vocabulary: sequential and concurrent are design patterns to be chosen deliberately, not defaults.

## The dependency test

The source doc's sharpest red flag is the failure mode of naive batching: two reads where the second depends on the first's output are sequential, not batchable, and confusing "independent" with "later in the plan" serializes work the round trip cannot actually parallelize (source doc, Red Flags).

The dig adds a design-level warning. A post on hidden coupling (https://tianpan.co/blog/2026/04/10/parallel-tool-calls-hidden-coupling, jev weight 0.48, weak backing) argues that enabling parallel tool execution exposes hidden coupling in tool design, describes silent failure modes, recommends classifying tools for safe parallelism, and suggests consolidating tools instead of parallelizing when parallelism is unsafe (jev weight 0.48, weak). Weak backing, but the direction matches the source doc: the safety boundary is between the calls, and it must be checked before the batch is issued, not after.

## Operational rules

1. Group reads, globs, and greps that need no shared state into one block (source doc, Verification).
2. Apply the dependency test per call pair: if call B's arguments come from call A's result, they are sequential. "Happens to come next in the plan" is not dependency.
3. Include the batch decision in the same plan step as the calls themselves; deciding to batch after issuing the first call has already paid the round trip.
4. For externally slow calls (API fetches), parallelism saves wall-clock; for locally fast calls it saves round-trip overhead. Both count, per the source doc's fixed-overhead rationale.
5. Do not parallelize calls that mutate the same resource; the coupling warning (https://tianpan.co/blog/2026/04/10/parallel-tool-calls-hidden-coupling, jev weight 0.48, weak) and ordinary correctness both say no.

## Sources

- Source doc: yubi-OS/yubiOS `skills/token-efficiency/SKILL.md` (Core practices 3, Red Flags, Verification).
- https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns (jev weight 0.56).
- https://dev.to/rahulxsingh/parallel-tool-calling-in-llm-agents-complete-guide-with-code-examples-3ilo (jev weight 0.48, weak).
- https://airbyte.com/agentic-data/parallel-tool-calls-llm (jev weight 0.46, weak).
- https://tianpan.co/blog/2026/04/10/parallel-tool-calls-hidden-coupling (jev weight 0.48, weak).
- https://getnadir.com/blog/parallel-tool-calls-agent-latency-cost-gap/ (jev weight 0.35, weak).
