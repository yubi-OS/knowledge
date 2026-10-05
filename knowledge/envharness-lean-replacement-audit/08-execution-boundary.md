# the execution boundary

Scope: Tier 3 of the audit: what a Lean formalization cannot and should not replace (bridges, LLM calls, checkpoint IO, compiled model-written code), and the gating posture for the one genuinely dangerous piece.

## The rows marked NO

The audit's component table ends with two NO rows, both marked out of scope by design:

1. **`bridges/*`, `infra/llm.py`, `agents/*`, and the orchestration runtime.** These run real environments (webarena, swebench), subprocesses, and model calls. Lean does not run webarena. No theorem can stand in for an HTTP call to a live environment, and the audit does not try.
2. **`core/code_loader.py` (exec of LLM-written Python).** The audit's verdict is sharper here: NO, and should not be. Model-emitted code is a supply-chain surface, not a theorem. The program's posture is to gate it with policy and sandbox (the yubiOS.rego pattern), never to prove it safe.

The reasoning behind row 2 deserves unpacking. A theorem quantifies over a defined domain. Model-written Python has an unbounded, adversary-influenced domain: the emitting model, its prompt, and its training distribution are all outside the system's control. Proving safety properties of arbitrary received code is not a hard open problem, it is a category error. The industry's answer is the same. LLM Sandbox documents a security-policy system for pre-execution code analysis plus runtime isolation as the two halves of safely executing untrusted code [1] (weight 0.880). Hydra-sandbox is built as a hardened Python execution sandbox specifically for running untrusted code from LLM agents, code review bots, and online coding platforms [2] (weight 0.725). Extism's approach wraps generated code in a WebAssembly sandbox so the host decides what the code can touch [3] (weight 0.758). Cloudflare's AI code executor tutorial makes sandboxed execution the default path for model-generated code [4] (weight 0.921, collected in the 02 dig). Every one of these is a containment mechanism, not a proof of the contained code.

## Why the boundary falls where it does

The boundary is not "things Lean is bad at". It is the same boundary the surrounding program already enforces: proofs live in CurvedCorpus.lean, seeded executable measurements live in verify_claims.py, and the two meet at a fixed interface. Formal verification's value proposition, stated by its practitioners, is adherence to a specification over the entire input space [5] (weight 0.638); runtime verification, the complementary discipline of checking behavior against properties during execution, is a separate technique for the parts that cannot be specified ahead of time [6] (weight 0.291, weak backing, labeled). The thesis-level treatment of the same split (tested, verified, and formalized as three distinct efforts with different coverage) [7] (weight 0.509) describes exactly the three-way division the audit applies.

Applied to envharness:

- The wrapper algebra, the Blocked invariant, the budget termination, and the band test have specifiable domains: these became theorems (Tier 1).
- The acceptance statistics have a provable null but require real measured data: these became the curveball gate executed by a measurement script (Tier 2).
- The bridges, the LLM calls, and the compiled model code have no specifiable domain: these stay execution-side with sandboxing as the control (Tier 3).

## What "not replaceable" does not mean

The audit is careful that NO does not mean untouched. The Tier 2 swap changes what the loop does with execution output (traces become the incidence matrix feeding a curveball gate), and the weights fix changes a value the execution side produces. The boundary is about where formal reasoning stops, not about leaving the execution side unimproved. It also does not mean the execution side is unverified in the engineering sense: the deterministic-replay and checkpoint follow-ups (see the follow-ups doc) are properties of execution-side code that can still be stated as algebra, they are just not yet modeled.

## Verdict

The execution layer is out of scope by design, and the audit's strongest claim is that this is correct design, not a limitation of the formal program: gating untrusted generated code with policy and sandbox is the right control, and trying to prove it safe would be the wrong one.

## Sources

1. https://vndee.github.io/llm-sandbox/security/ (weight 0.880)
2. https://github.com/akaradje/hydra-sandbox (weight 0.725)
3. https://extism.org/blog/sandboxing-llm-generated-code/ (weight 0.758)
4. https://developers.cloudflare.com/sandbox/sdk/tutorials/ai-code-executor/ (weight 0.921, collected in the 02 dig)
5. https://runtimeverification.com/formal-verification (weight 0.638)
6. https://en.wikipedia.org/wiki/Runtime_verification (weight 0.291, weak backing, labeled)
7. https://people.cs.nott.ac.uk/pszgmh/handley-thesis.pdf (weight 0.509)

The two NO rows, the yubiOS.rego posture, and the CurvedCorpus.lean / verify_claims.py boundary derive from the source audit of google-research/envharness at HEAD (2026-08-21); repository identity confirmed at https://github.com/google-research/envharness (weight 0.848, collected in the 01 dig). A general sandbox documentation landing page (0.310), an untrusted-code guide (0.403), a runtime-versus-formal guide (0.422), a verification-gap essay (0.234), and two dictionary pages (0.026, 0.077) from the dig were not used.
