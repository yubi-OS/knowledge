# 04 Parallel implementation lanes

Scope: dispatching parallel implementation subagent lanes in ONE message: type general, model_preset smart for correctness-critical lanes and fast for thinner ones, self-contained lane prompts, and RETURN payloads with paths, test counts, and interface summaries.

Grounding spine: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md ("source doc").

## Dispatch in one message

The source doc's phase 4 begins: "Parallel lanes: dispatch all lanes in ONE message." This is an atomicity requirement, not a convenience. Lanes that are dispatched sequentially run against a world where earlier lanes already returned, which invites implicit coupling; lanes dispatched together are all written against the same SPEC with no lane able to see another's output. Combined with the lane rule that lane tests import nothing from other lanes, the one-message dispatch is what makes the lanes genuinely parallel rather than merely concurrent.

## Model assignment per lane

The doc pins the model policy: "type general, model_preset smart for correctness-critical lanes and fast for thinner ones." Two axes are fixed. The lane type is always general (a full-capability implementation agent, not a read-only or narrow worker). The model preset is assigned per lane by criticality: lanes whose correctness the whole build depends on (a shared data layer, a gate or policy engine) get the smart preset; thin lanes (a static page, a small helper module) get the fast preset. The doc does not enumerate which module kinds count as correctness-critical; the capability map's dependency field is the natural guide, since modules with many dependents fail loudest.

## The self-contained lane prompt

Every lane prompt is required to be self-contained, and the source doc lists its five components: "read-the-spec instruction, exact output directory, deliverable file list, test requirements, and RETURN with paths, test counts, and interface summaries."

The read-the-spec instruction points the lane at the formal SPEC doc; the lane does not get the design re-explained in its prompt, it gets told where the contract lives. The exact output directory and deliverable file list remove path ambiguity, which matters because lanes run in sandboxes with write restrictions (see the lane rules doc, 05). Test requirements bind the lane to the SPEC's testing strategy. The RETURN contract is the inverse of the input contract: the lane must return with concrete paths, test counts, and interface summaries, which is the raw material the advisor lane uses to reconcile interfaces and run all suites together.

## Why self-containment is non-negotiable

A lane that must ask a question mid-build stalls its lane but not the others; the advisor then integrates an incomplete set. Self-contained prompts plus self-contained tests mean a lane either returns complete or fails visibly. The source doc's integration lessons reinforce why: the approvals-array drop bug (an adapter silently dropping a field) was found only because the lane boundaries made the seam explicit. Self-containment is what makes the seams observable.

## Corroboration from external practice

The dig results for this subtopic are on-topic but all carry weak jev weights (below 0.5) and are labeled as such. Claude Code's official sub-agent documentation describes custom sub-agents as independently-contexted workers dispatched with their own prompts and tool access (weak, 0.42; code.claude.com/docs/en/sub-agents). Pydantic's harness docs describe subagents as isolated contexts that return structured results to an orchestrator (weak, 0.23; pydantic.dev/docs/ai/harness/subagents/). Addy Osmani's essay on multi-agent coding, "The Code Agent Orchestra," argues that orchestrator-planned, worker-executed decomposition with explicit contracts is what makes multi-agent builds work (weak, 0.36; addyosmani.com/blog/code-agent-orchestra/). A CodeSignal lesson on parallel subagent orchestration covers fan-out and fan-in patterns (weak, 0.16; codesignal.com/learn/courses/codex-subagents-multi-agent-orchestration-1/lessons/parallel-subagent-orchestration). None of these specify the one-message dispatch, the smart/fast preset split, or the RETURN payload shape; those are the source doc's own validated mechanics from the jev-orchestrator and Jev Automations builds (steady-orbit worker, 2026-10-01).

## Lane count and applicability

The skill applies to builds with "3+ parallel implementation lanes," and the worked example dispatches "4-5 lanes" for an orchestrator built as a Cloudflare Worker. Below 3 lanes the coordination overhead of the full pipeline (capability map, one-pager, SPEC, advisor) exceeds what the parallelism saves; that threshold is the doc's own, stated in its frontmatter description.

## Operational rules for the orchestrator

1: write all lane prompts from the approved SPEC, not from memory of it, so the contract text is identical across lanes. 2: dispatch every lane in one message and do not start the advisor until all lanes have returned with their RETURN payloads. 3: record each lane's returned paths, test counts, and interface summaries before the advisor starts, because the advisor's reconciliation pass consumes exactly that data.
