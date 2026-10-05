# the implicit trust story

Scope: the five invariants envharness states but never machine-checks, why prose contracts are a known risk class, and what it took to replace them with theorems.

## The five claims

The audit (2026-09-01, from source at HEAD) collects the trust story into one list. Everything envharness's contract layer promises lives in docstrings or in the construction of one code path, and none of it is machine checked:

1. "harnesses stack arbitrarily" (composition is associative, identity is neutral).
2. "a Blocked action leaves the env unchanged" (reward 0, not terminated).
3. "the loop terminates" (under every budget policy).
4. "weights are normalized" (failure-axis weights sum to 1).
5. "success rate in the target band" (DifficultyZone band membership).

The audit's point is not that these claims are false. Claim 2 is true of the one code path that implements it; claim 3 is true of the policies as written. The point is that nothing distinguishes a docstring that happens to be true from one that is subtly wrong, and downstream users (or a downstream formalization) cannot tell which they are standing on.

## Prose contracts as a known risk class

The software-verification literature treats this exact situation as a risk pattern. An analysis of informal specification practice argues that informal specifications create systemic risk by allowing divergent implementations and hidden vulnerabilities, and calls them technical debt: verbal agreements or incomplete records that different readers resolve differently [1] (weight 0.557). A critical study of formal methods' influence on software engineering emphasizes that their distinctive contribution is rigorous verification against an explicit contract, which is precisely what a docstring cannot provide [2] (weight 0.844). And the long history of process-as-substitute-for-verification is cautionary: decades of effort found that no amount of documentation, process, or procedure was capable of wrestling development into predictability on its own [3] (weight 0.537).

None of these sources is about envharness, and the doc does not claim they are. The claim being made is structural: a harness whose safety story lives in prose has the same failure mode as any other system whose spec is prose, namely that two implementers (or an implementer and a formalizer) can both comply and disagree.

## What machine-checking the story took

The audit's section 15 turns each of the five prose claims into a kernel-checked theorem, and in doing so found one that is false as stated: "weights are normalized". The fixed-precision emission `round(v/s, 3)` produces weight vectors that need not sum to 1 (the kernel-checked instance: counts (0,0,0,0,1) give per-mille floors summing to 999). This is the concrete payoff of replacing the trust story: a docstring that is false is indistinguishable from one that is true, but a theorem statement that is false is not a theorem. The other four claims survived as theorems, two of them (`blocked_is_noop`) in a strictly stronger form than the docstring asserted: the no-op property holds over every transition function, not just the shipped code path.

The general lesson the audit draws matches the specification literature: the value is not only in catching the false claim, but in discovering that one of five "obvious" properties needed an extra condition (a remainder-distribution rule) before it could be stated truthfully [1][2].

## Verdict

The trust story is the boundary between Tier 1 and everything else in the audit. It is fully replaceable, and the replacement is the cheapest part of the program: the theorems are short, and one of them earned its keep immediately by failing.

## Sources

1. https://chainscorelabs.com/blog/smart-contract-auditing-and-best-practices/formal-verification-and-specification/why-informal-specifications-are-a-ticking-time-bomb (weight 0.557)
2. https://dl.acm.org/doi/10.1145/3841633 (weight 0.844)
3. https://logicmag.io/clouds/agile-and-the-long-crisis-of-software/ (weight 0.537)

The five-claim list, the section 15 outcomes, and the weights finding derive from the source audit of google-research/envharness at HEAD (2026-08-21); the repository identity is confirmed at https://github.com/google-research/envharness (weight 0.848, collected in the 01 dig). Results below the 0.5 threshold collected in this dig (a docstring-engineering topic page at 0.228, a definition dictionary page at 0.312, a Trail of Bits author index at 0.190, a specification-generator marketplace listing at 0.191) were not used.
