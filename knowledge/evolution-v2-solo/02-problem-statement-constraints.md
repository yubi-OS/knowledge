# 02. Problem statement and constraints

Scope: The evolution v2 problem statement and the hard constraints the framing log places around any solution: cron driven autonomy, jev quality assessment, honesty about its own claims, and a fixed blast radius.

## The question

The framing log states the problem as: how might the evolution loop's machine-side run become self-sustaining (worker-cron-driven, hourly), quality assessed by jev at every stage, and honest about its own claims (nulls, candles, invariants), using the full Cloudflare endpoint suite, without inflating blast radius or inventing new trust anchors (source: the framing log, refs/evolution-v2-solo-2026-10-01.md).

This is a constraint set, not a feature list. Four constraints are load bearing: self-sustaining on a cron schedule, jev as the quality assessor at every stage, honesty about the loop's own claims, and a hard ban on inflating blast radius or inventing new trust anchors.

## Least privilege as the dominant constraint

The blast radius constraint is the least privilege principle applied to an autonomous loop. Microsoft's Zero Trust guidance defines an explicit least-privilege pattern for AI agents, shifting the security question as organizations adopt agentic AI (https://learn.microsoft.com/en-us/security/zero-trust/sfi/least-privilege-for-ai-agents, weight 0.95, authoritative). Identity-centric writeups make the boundary operational: scoping access to the specific tool and action an agent needs right now, rather than at account level, is what bounds the damage of a compromised agent (https://www.entrust.com/blog/2026/08/why-agentic-ai-expands-blast-radius-and-how-identity-limits-it, weight 0.52, authoritative). Supporting treatments treat agents like human users under Zero Trust and scope agent permissions narrowly, though these are vendor and blog grade sources with weak weight (https://www.threatlocker.com/blog/the-principle-of-least-privilege-for-ai-agents, weight 0.40, weak; https://www.loginradius.com/blog/engineering/limiting-data-exposure-and-blast-radius-for-ai-agents, weight 0.30, weak; https://copilot-autogent.github.io/ai-security-blog/blog/least-privilege-ai-agents-capability-minimization, weight 0.25, weak; https://digitalthoughtdisruption.com/2026/07/24/agent-blast-radius-model-ai-agent-autonomy/, weight 0.12, weak).

The framing log enforces this by partitioning the action surface. The worker auto-executes only record_learning and note actions plus its own measured atoms. Repo touching kinds stay with Sauna sessions, which act as the loop's hands. This is the autonomy boundary the log later cites when it drops variation V1: a variation that moved repo push execution worker-side was rejected on switching cost across that boundary (source: the framing log).

## Guardrails for unattended loops

The design patterns literature for autonomous agent loops converges on the same ingredients the framing log demands: a trigger schedule, a verification step on the agent's own work, and a defined stop condition (https://github.com/groktopus/loop-designer, weight 0.32, weak). Guardrail placement writeups discuss where guardrails belong in an agent loop and how to balance safety against context and latency (https://loop-engineering.net/knowledge/reliability-safety/guardrails-autonomous-ai-loops/, weight 0.40, weak). Practical guides to unattended agent operation list long-running loops, scheduled or cron triggers, memory that survives across sessions, and the guardrails that keep the loop safe, all blog grade and weakly weighted (https://dev.to/wartzarbee/how-to-run-claude-as-an-autonomous-agent-loops-memory-schedules-and-guardrails, weight 0.14, weak; https://khimananda.com/blog/guardrails-for-autonomous-ai-agents, weight 0.13, weak; https://gigafloptechlab.com/ai-agent/blog-guardrails-for-autonomous-ai-agents/, weight 0.12, weak).

## Honesty as a first class requirement

The problem statement's honesty clause, being honest about nulls, candles and invariants, is unusual: most guardrail checklists talk about permission boundaries, not epistemic honesty about the loop's own measurements. The framing log turns it into two concrete mechanisms that became the V6 and V7 finalists: every executed directive carries a measured delta against a named metric, and the loop periodically plants known-outcome candles that it must detect and score (source: the framing log). This is the constraint set the whole variation set was generated against, which is why V1 and V2 were dropped on constraint grounds (boundary crossing and untestability) rather than on their axis scores alone.

## What the log explicitly refused

The not-doing list fixes the edges: no worker-side repo pushes (autonomy boundary), no Durable Objects (CAS on D1 suffices), no R2 (not enabled on the account), no approval via email link (new auth surface; console approval is proven). Each refusal names its reason, which keeps the constraint set auditable rather than folklore (source: the framing log). The refusal of new auth surfaces in particular is a direct application of the blast radius rule: every new trust anchor widens the set of things that can fail badly.
