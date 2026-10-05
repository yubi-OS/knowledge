# Typed research db: provenance that survives a crash

Scope: persisting every dig result, weight, and decision record into a typed research database, and why persist-after-every-batch is a hard rule rather than a preference.

## What the database holds

The research database is the pipeline's memory and its audit trail. Its file set is deliberately small:

1. archive.json: one entry per collected result, carrying the query that found it, title, url, snippet, collection timestamp, the weight, and the full decision record that produced the weight.
2. digs per document: every query attempted, per attempt, how many raw results and how many were kept, redo counts and reasons, and the outcome (authored or skipped with reason).
3. A TypeScript interfaces file mapping every shape, so the JSON files and the code cannot drift apart silently.

The decision record inside each archive entry is the load-bearing part. It holds the metric type, the exact instructions text sent to the decision model, the model name, the raw answer object with its probabilities, the usage tokens of the request, and the request timestamp. A weight without its decision record is an unverifiable number; with it, any later auditor can re-derive why a claim was considered authoritative.

## Why provenance-first schema

This design aligns with the direction of AI provenance standardization. The AI Provenance Protocol describes itself as "the open standard for recording, embedding, and verifying the provenance of AI-generated content", machine-readable and vendor-neutral (https://aiprovenanceprotocol.io/, weight 0.66). Practitioner guidance on implementing provenance metadata for AI artifacts frames the structured record of an artifact's origin, transformations, and ownership as "the foundation for auditability, reproducibility, and supply chain security" (https://inferensys.com/guides/digital-provenance-and-content-authenticity/how-to-implement-provenance-metadata-standards-for-ai-artifacts, weight 0.64). A corpus minted by an agent pipeline is exactly the artifact class those standards target: the "transformations" are dig, weight, author, and PR, and each one is a record.

The honest caveat is that no dug source prescribes this specific file layout. The layout is a design choice; the standards only back the principle that provenance should be structured, machine-readable, and verifiable.

## Persist after every batch

The operational rule that earned its hard status the painful way: persist state after every batch, not at phase boundaries. During the validated run, a container restart killed one full dig run before it was saved (internal evidence, 2026-09-29). The dig phase is the pipeline's largest uncheckpointed window: 18 or more HTTP queries, each 1 or more seconds apart, all results held in memory. A crash at minute 3 loses everything after the last dump.

## The checkpointing ecosystem backs this up

The pattern is now standard in agent infrastructure. Microsoft's guidance for hosted agents treats interruption as a default condition, not an exception: "A long-running hosted agent can be interrupted at any time by a crash, an out-of-memory kill, a redeploy, or a scale-in", and shows how to resume a recovered run from its last checkpoint (https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/recover-long-running-work, weight 0.95). The Microsoft Agent Framework documents workflow checkpoints with a compatibility constraint worth copying: the workflow passed to resume must have the same structure and executor identities as the workflow that created the checkpoint (https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints, weight 0.60). In pipeline terms: the resume path must read the same file shapes it wrote.

Community tooling states the same problem bluntly: "AI agents crash. State gets lost" (https://github.com/AxmeAI/ai-agent-checkpoint-and-resume, weight 0.66). Practitioner writing frames checkpointing as the boundary between a demo and a production system: "A long-running agent that loses its state on the next deploy is not a production system" (https://www.subodhjena.com/blog/persistence-and-checkpointing, weight 0.54, weak backing). Research writing on durable execution for agent runtimes converges on persisting completed execution boundaries and recovering without repeating tool calls, external mutations, or outbound messages (https://zylos.ai/research/2026-04-24-durable-execution-agent-runtimes/, weight 0.52).

The "without repeating" clause is the one that maps directly to this pipeline. Repeating a dig query wastes rate-limit budget; repeating a weighting request double-spends jev calls; repeating a push can duplicate blobs. Each persisted boundary is one of those repetitions avoided.

## Crash taxonomy observed

The validated run recorded 2 distinct data-loss surfaces, and the research database addresses both:

1. Container restart mid-dig: fixed by persist-after-every-batch, as above.
2. Sandbox /tmp wipes between shell calls: the entire GitHub push chain must run in 1 call because intermediate state (base tree sha, blob shas) cannot survive to the next call. The push chain is itself a checkpoint problem where the platform deletes the checkpoints.

The second surface is worth naming because it is counterintuitive: the environment destroys state even when the pipeline would happily persist it, so the pipeline's design must concentrate the stateful window into a single atomic operation.

## Summary

1. Store the weight with its full decision record or the weight is unverifiable.
2. Persist after every batch; a phase boundary is too coarse (internal evidence, 2026-09-29).
3. Resume paths must read the same shapes they wrote (https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints, weight 0.60).
4. Concentrate unavoidable stateful windows (the push chain) into one atomic call when the platform wipes intermediate state.
