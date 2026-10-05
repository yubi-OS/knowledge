# External claim verification: the OpenAI Navier-Stokes attachment

Scope: how the OpenAI Navier-Stokes paper and its Lean repository were audited against primary artifacts and the official Clay formulation before any of their content was allowed near the wayfinding map, and what the audit refused to conclude.

## The claim that arrived

A research attachment pointed at two public artifacts: a paper titled Finite Time Blowup for Navier-Stokes with the byline OPENAI (https://cdn.openai.com/pdf/32d9f210-8b73-45e0-91bc-82a30aef8a9a/navier-stokes.pdf, internal research record), and a Lean repository (https://github.com/openai/NavierStokesAndEuler/tree/f9e8bc5b38b6e212696e8a30e3e91517af887bbd, internal research record). The audit rule was simple: inspect the artifacts themselves, never the summary of them.

## What the paper actually claims

The paper claims: for every positive viscosity there is a smooth compactly supported force and a zero initial velocity such that the velocity-pressure pair is smooth for times below 1, with bounded kinetic energy but unbounded velocity supremum approaching time 1. It claims Clay alternatives (C) and (D), which concern breakdown of smoothness with permitted smooth forcing. The official Clay problem statement permits forcing in exactly those alternatives (Fefferman's formulation, https://www.claymath.org/wp-content/uploads/2022/06/navierstokes.pdf, weight 0.88; Clay Millennium problem page, https://www.claymath.org/millennium/navier-stokes-equation/, weight 0.96; problem summary, https://navier-stokes.org/the-problem/, weight 0.60; equation background, https://mathworld.wolfram.com/Navier-StokesEquations.html, weight 0.84). So the attachment is not a claim of global regularity and not an unforced blow-up construction. Reading the official problem statement first is what prevents mislabeling a conditional breakdown result as a resolution of the full problem.

## What the repository audit found and did not find

Static inspection of the repository at the pinned commit found 4 intentional challenge-placeholder declarations and 1 comment containing the placeholder word, all inside `ComparatorChallenges`, outside the inspected proof-root imports. No such declarations were found in the proof sources. The submission includes comparator statements and printed-axiom requests, and `formalization.yaml` labels the review self-assessed (https://github.com/openai/NavierStokesAndEuler/blob/f9e8bc5b38b6e212696e8a30e3e91517af887bbd/formalization.yaml, internal research record). The toolchain is Lean `4.34.0-rc2` with mathlib pinned through the Lake manifest.

What was not done: the project was not compiled, the external checker was not run, and the correctness or faithfulness of its real-analysis definitions was not adjudicated. Matching declaration lists and placeholder scans are not substitutes for a kernel build or mathematical review. The Lean documentation is explicit that a proof is only as good as what the kernel accepts, not what the sources appear to contain (Theorem Proving in Lean 4, https://leanprover.github.io/theorem_proving_in_lean4/, weight 0.94; Lean 4 architecture and verification survey, https://arxiv.org/pdf/2501.18639, weight 0.51). The Clay status page remained active at retrieval, so the prize itself is unclaimed (https://www.claymath.org/millennium/navier-stokes-equation/, weight 0.96).

The paper's agent-count, timing, and priority discussion was judged irrelevant to the integration decision and given no evidentiary weight.

## The adoption decision

The formalization methodology (explicit statements, printed axioms, comparator discipline) was adopted as useful. The fluid blow-up mechanism was not: it has no defined counterpart in the map's quantity set. Building the external project would require a separate Lean 4.34/mathlib workflow, and that is an independently scoped mathematical audit, not a prerequisite for map fixes.

## Transferable rule

Verify attachments at the artifact level, name the exact commit, state what was checked and what was skipped, and separate "methodology worth borrowing" from "result being claimed". The audit produced a clean split: the discipline carried, the physics did not.

## Sources considered

| source | weight |
|---|---|
| https://cdn.openai.com/pdf/32d9f210-8b73-45e0-91bc-82a30aef8a9a/navier-stokes.pdf (internal research record) | record |
| https://github.com/openai/NavierStokesAndEuler/tree/f9e8bc5b38b6e212696e8a30e3e91517af887bbd (internal research record) | record |
| https://www.claymath.org/millennium/navier-stokes-equation/ | 0.96 |
| https://leanprover.github.io/theorem_proving_in_lean4/ | 0.94 |
| https://leodemoura.github.io/files/CAV2024.pdf | 0.91 |
| https://www.claymath.org/wp-content/uploads/2022/06/navierstokes.pdf | 0.88 |
| https://mathworld.wolfram.com/Navier-StokesEquations.html | 0.84 |
| https://arxiv.org/abs/2409.05977 | 0.60 |
| https://navier-stokes.org/the-problem/ | 0.60 |
| https://arxiv.org/pdf/2501.18639 | 0.51 |
| https://navier-stokes.org/navier-stokes-existence-and-smoothness/ | 0.47 |
| https://www.cs.virginia.edu/~rmw7my/Courses/AgenticAISpring2026/Major%20Breakthroughs | 0.40 (weak) |
| https://auteng.ai/docs/math/verification/lean-theorem-proving | 0.30 (weak) |
| https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_existence_and_smoothness | 0.27 (weak) |
