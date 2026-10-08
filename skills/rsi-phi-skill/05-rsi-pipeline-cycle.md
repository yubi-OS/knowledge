# 05 The per-cycle pipeline

Scope: the 5-step cycle shape of rsi-phi-skill: gap-map, deep-research hypothesis, edit, re-map on the sphere basis, fixpoint verdict, with the 3-cycle cap.

## The five steps

The source doc (https://raw.githubusercontent.com/yubi-OS/yubiOS/main/skills/rsi-phi-skill/SKILL.md) states the pipeline follows the recursive-self-improvement 5-step shape, adapted to S2:

1. Gap-map via negative-skill-space: run the 12-axis sweep on the target SKILL.md and list candidate edits.
2. Hypothesis proposal: a deep-research subagent (parallel-deep-research) is dispatched with the gap-map and a Fibonacci-sphere parameter t = i/N; the Fibonacci index is the cycle's t. The subagent proposes ONE single-action edit per cycle, choosing the lobe that flips the most primitive coverage in the 384-D basis.
3. Edit: the human-approved hypothesis is applied to the SKILL.md.
4. Re-map: recompute the corpus's 384-D coverage vectors under the Fibonacci-sphere basis; project to S2 via PCA top-2 then stereographic lift; fit gamma(t) on the real SH basis with L=3 (16 functions) and closed-form ridge lambda = 1e-3; compute chordal residuals per item.
5. Fixpoint rule: if no new gaps opened AND the cycle's edited lobe closed a prior gap AND no new anti-patterns appeared, terminate. Otherwise cycle+1, capped at 3 cycles in default mode.

All five steps are source-doc claims. The human-approval gate in step 3 is explicit: the hypothesis is applied only after human approval (source doc).

## What a deep-research subagent is

The parallel-deep-research pattern dispatches several subagents over independent angles and synthesizes their findings. External descriptions of the general pattern exist but are weakly weighted here: FlowiseAI documents a deep-research agent as a multi-agent system that breaks complex queries into manageable tasks and deploys specialized agents (https://docs.flowiseai.com/tutorials/deep-research, weak, w=0.07), and a Claude Code plugin for autonomous research pipelines advertises evolutionary hypothesis generation over long-running research (https://github.com/danielxmed/ScienceSkill, weak, w=0.15). These back the plausibility of the step, not its specifics; the specifics (one edit per cycle, lobe choice by maximal coverage flip) are source-doc claims.

## The bounded loop

Wikipedia describes recursive self-improvement as a process in which a system rewrites its own code (https://en.wikipedia.org/wiki/Recursive_self-improvement, weak, w=0.28), and a 2026 arXiv paper on RSI of AI research agents observes that when an agent's own code is the object of optimization, each accepted rewrite compounds (https://arxiv.org/abs/2609.26457, weak, w=0.20). That compounding is exactly why the source doc bounds the loop: 3 cycles in default mode, fixpoint termination before the cap when no new gaps opened, the edited lobe closed a prior gap, and no new anti-patterns appeared (source doc). Lilian Weng's harness-engineering post frames bounded self-refinement loops as an engineering harness problem (https://lilianweng.github.io/posts/2026-07-04-harness/, weak, w=0.17), and an arXiv survey places bounded self-refinement at one end of the RSI autonomy continuum (https://arxiv.org/html/2607.07663v1, weak, w=0.29). All weak: the 3-cycle cap itself comes from the parent skill, not the literature.

## The re-map machinery

The re-map step is where the Fibonacci-sphere variant earns its keep (source doc): coverage vectors are recomputed under the 384-lobe basis, projected to S2 by PCA top-2 with a stereographic lift, and fit with the real spherical harmonic curve on the sphere. The closed-form ridge lambda = 1e-3 and chordal residuals per item are inherited unchanged from the curve-fitting skills (source doc names learned-latent-curve as the curve fitter and hyperspherical-harmonic-curve as the S2 basis swap it inherits). The output artifacts are three, like the parent skill: an edited SKILL.md, one changelog line appended to the Changelog section, and an explicit fixpoint-or-continue verdict, never implied (source doc).

## Cycle outputs and the changelog example

The source doc's changelog shows a completed cycle 1 and a not-yet-fixpoint verdict: the hypothesis was that the native (l=3, m=3) to (l=128, m=256) lobe swap under-fills the 384-D basis so the loop sees phase coherence in only 3 lobes; the edit added the per-item basis vector section; the re-map showed new sparse cells at m in {6, 12, ..., 384}, so the loop continued to cycle 2 (source doc). This is the concrete demonstration of steps 1 through 5 running on the skill itself.
