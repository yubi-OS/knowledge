# 02 - When to isolate

Scope: the 4 isolation triggers the context-isolation skill names (independent verification or adversarial review, parallel independent workstreams, large exploratory research, and speculative work whose failure must not contaminate the main thread), and the orchestration research that backs each trigger.

## The source doc's 4 triggers

The source doc (yubi-OS/yubiOS skills/context-isolation/SKILL.md) lists 4 situations that call for a boundary around the unit of work:

1. Independent verification or adversarial review. A reviewer that can see the original author's reasoning inherits its blind spots and biases toward agreeing. Verification needs a fresh context: give it the artifact and the acceptance criteria, not the story of how it was built.
2. Parallel independent workstreams. If 2 pieces of work do not depend on each other's intermediate state, running them in the same context serializes them for no benefit and lets one's noise bleed into the other's reasoning.
3. Large exploratory research or search. Most of what a broad search turns up is noise you discard. Isolate the search so only the distilled conclusion, not every dead end, lands in the main thread.
4. Anything whose failure should not contaminate the main thread. A speculative approach that might not pan out should be explored somewhere its abandonment does not leave confusing half-finished context behind.

The common structure across all 4 is that the boundary is real: the work inside the boundary either must not see the outside's reasoning, or the outside must not inherit the inside's noise.

## Verification and adversarial review

The strongest external corroboration for trigger 1 comes from production multi-agent systems. Anthropic's engineering writeup on its multi-agent research system (https://www.anthropic.com/engineering/multi-agent-research-system, weight 0.78) describes an orchestrator that delegates search to subagents, each operating with its own context window and its own effort allocation, and stresses that parallel subagents explore distinct directions independently before the orchestrator integrates their findings. Claude's platform documentation on multiagent orchestration (https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration, weight 0.70) treats separation of agent contexts as the standard mechanism for decomposing work, which is the same boundary the source doc demands for review. The bias mechanism behind the trigger (why visible reasoning poisons review) is covered in doc 05.

## Parallel independent workstreams

For trigger 2, the Anthropic writeup again applies: parallel subagents are the architecture's core, and the orchestrator scales effort by spawning more of them when a task broadens (https://www.anthropic.com/engineering/multi-agent-research-system, weight 0.78). A weakly weighted formal treatment, AdaptOrch (https://arxiv.org/html/2602.16873v1, weight 0.32, weak), proposes selecting among parallel, sequential, hierarchical, and hybrid topologies based on task dependency graphs, which formalizes the source doc's dependency test: parallel isolation is justified when the dependency graph says the streams are actually independent. A practitioner analysis (https://www.huuhka.net/primary-vs-subagents-in-llm-harnesses/, weight 0.16, weak) makes the complementary observation that subagent delegation trades context sharing for explicit contracts, which is only worth paying when the streams genuinely do not share state.

## Large exploratory research

Trigger 3 is the clearest fit for the Anthropic architecture (https://www.anthropic.com/engineering/multi-agent-research-system, weight 0.78): research search is the canonical workload where most raw material is noise, and the system's design keeps each search's dead ends inside its own subagent while the orchestrator receives only the synthesized findings. The source doc's phrasing, "bring back conclusions, not transcripts," is the same design rule at the level of a single call.

## Speculative work

Trigger 4 has thinner external literature because "failure should not contaminate the main thread" is mostly an agent-workflow concern rather than a benchmarked research topic. The Claude Code documentation on custom subagents (https://code.claude.com/docs/en/sub-agents, weight 0.69) supports the mechanism: subagents run with their own context windows and can be given specialized prompts and tool permissions for bounded tasks, which is the container a speculative exploration needs so that abandoning it costs nothing in the main thread. A weak practitioner source (https://martinuke0.github.io/posts/subagents/, weight 0.21, weak) describes the same execution model, sub-agents with isolated contexts returning results to a parent.

## The dependency test that unifies the triggers

The source doc's when-to-isolate list is not 4 unrelated tips; it is one test applied to 4 cases. Isolate when the boundary is real: reviewer must not see author reasoning (case 1), streams must not see each other's state (case 2), main thread must not inherit search noise (case 3), main thread must not inherit failed speculation (case 4). The Anthropic production system (https://www.anthropic.com/engineering/multi-agent-research-system, weight 0.78) and the Claude orchestration docs (https://platform.claude.com/docs/en/managed-agents/multiagent-orchestration, weight 0.70) both operationalize exactly this test, and the dependency-graph framing in the weak AdaptOrch paper (https://arxiv.org/html/2602.16873v1, weight 0.32, weak) shows the test can be made formal. Doc 03 covers the contrapositive: when the boundary is not real, isolation costs more than it saves.
