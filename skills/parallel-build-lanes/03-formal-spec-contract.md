# 03 The formal SPEC contract

Scope: the formal SPEC doc every lane implements against: invariants up top, endpoint and schema contracts, module file contract with exact export names, testing strategy, boundaries (always / ask-first / never), and success criteria.

Grounding spine: yubi-OS/yubiOS skills/parallel-build-lanes/SKILL.md ("source doc").

## One doc, every lane

The source doc's phase 3 is: "Formal SPEC: one doc every lane implements against." The singular is the point. With 3 to 5 lanes implementing in parallel, there is no opportunity to reconcile divergent readings mid-build; the SPEC is the shared text that prevents divergence before it starts. Its position in the sequence is after the ideate-solo one-pager (design direction settled) and before the lane dispatch (implementation frozen to contract).

## The six required sections

The source doc enumerates the SPEC's contents: "invariants up top, endpoint/schema contracts, module file contract (exact export names), testing strategy, boundaries (always / ask-first / never), success criteria."

Invariants up top is an ordering instruction, not decoration. The skill's deploy-safety section later says "Never weaken the fail-closed invariants: a gate or config failure ends in blocked, never dispatch," which only works if the invariants are stated first where every lane reads them before any implementation choice. Endpoint and schema contracts give the lanes a stable seam: the advisor lane later reconciles "cross-lane interface mismatches," and a mismatch is only detectable if the SPEC pinned what each interface should be.

The module file contract with exact export names is the SPEC's most mechanical section. Lane tests import nothing from other lanes and stub against documented interfaces, so an export name typo'd in one lane's reading becomes a seam failure at integration time. Exact names convert that from a judgment call into a string comparison.

Boundaries use a 3-level vocabulary: always, ask-first, never. This is the SPEC's delegation surface; it tells each lane what it may do unilaterally, what requires a check-in, and what is forbidden. Success criteria close the doc, giving the advisor and the orchestrator's final report (shipped, live proof points, tests, what is open) their checklist.

## Testing strategy as a section, not an afterthought

The SPEC's testing strategy section feeds the lane rules directly: "Tests run with node --test and ALL pass before the lane returns. Never weaken a test." A lane that receives no testing strategy would invent its own, and the advisor would inherit 4 incompatible suites. By fixing the strategy in the SPEC, the skill makes the advisor's job "runs all suites together" rather than "reconciles 4 testing philosophies."

## What external sources corroborate

The dig for this subtopic returned mostly weak results (all below 0.5, labeled as such), but the on-topic ones align with the doc's structure. A design-by-contract explainer describes invariants as conditions that must hold across all operations of a component, which is the sense in which the SPEC puts invariants first (weak, 0.04; 360devconnect.com/2024/02/13/understanding-invariants-in-dbc/). Pactflow's contract-testing essay argues that consumer and provider agree on explicit contracts before implementation, the same logic that puts endpoint and schema contracts in the SPEC before lanes dispatch (weak, 0.06; pactflow.io/blog/contract-testing-using-json-schemas-and-open-api-part-1/). An arXiv paper on systematic API testing through executable contracts formalizes testing against a written contract rather than against implementation internals (weak, 0.08; arxiv.org/html/2604.08633v1). No external source describes the exact boundaries vocabulary (always / ask-first / never) or the exact-export-names file contract; those are the source doc's own mechanisms, recorded from the jev builds.

## Why the SPEC is the pipeline's spine

The lane rules make the SPEC load-bearing in a concrete way: lane prompts must include a "read-the-spec instruction" and the advisor lane reconciles against the same document. If the SPEC were advisory, the advisor's integration report would be an argument; because it is the contract, the advisor's job is mechanical comparison. The skill's history section (validated on the jev-orchestrator and Jev Automations builds, steady-orbit worker, 2026-10-01) is the record that this structure survived 2 real builds with 4 to 5 parallel lanes each.

## Practical authoring rules

Three rules follow from the doc's own emphasis. 1: write the SPEC only after the capability map is approved, never in parallel with map drafting (the approval gate is cheap exactly because the spec does not exist yet). 2: keep every contract section falsifiable: an export name, an endpoint path, a column type, a boundary level. Vague SPEC lines produce exactly the interface mismatches the advisor exists to catch. 3: keep the doc single: one file, referenced by path from every lane prompt, so there is exactly one version of the truth during the parallel phase.
