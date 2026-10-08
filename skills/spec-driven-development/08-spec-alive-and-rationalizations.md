# 08 - Keeping the Spec Alive, Rationalizations, and Red Flags

Scope: the living-document rules, the seven common rationalizations, the red-flag list, and the pre-implementation verification checklist.

## Keeping the spec alive

The source doc (yubi-OS/yubiOS skills/spec-driven-development/SKILL.md) makes the spec a living document, not a one-time artifact, with four rules: update it when decisions change (if the data model needs to change, update the spec first, then implement); update it when scope changes (features added or cut are reflected in the spec); commit the spec (it belongs in version control alongside the code); and reference it in PRs (link back to the spec section each PR implements) (source doc).

The dictionary senses anchor the terms: living means having life (weight 0.8, https://www.merriam-webster.com/dictionary/living), and a specification is the act or process of specifying (weight 0.84, https://www.merriam-webster.com/dictionary/specification). A living specification is one that keeps specifying as the system changes.

## Weakly-backed context

Practitioner literature on living specs exists: living specs are described as specifications that update with the code (weight 0.18, weak, https://paelladoc.com/blog/living-specs/), guides contrast living specs against frozen specs and argue docs die when they stop matching reality (weight 0.38, weak, https://tekk.coach/spec-driven-development/living-specs-vs-frozen-specs/), and software-architecture practices promote living specifications (weight 0.25, weak, https://asdlc.io/practices/living-specs/). Documentation-strategy writeups cover keeping docs current (weight 0.23, weak, https://amrutadeshpande.substack.com/p/keeping-documentation-up-to-date). IBM's spec-first variant notes the contrary posture, that a spec's primary purpose may be initial clarity without continued maintenance (weight 0.52, https://www.ibm.com/think/topics/spec-driven-development, doc 01). The source doc's four rules are the operative posture for yubiOS work.

## The seven rationalizations

The source doc tabulates seven rationalizations and the reality against each (all source doc):

1. "This is simple, I do not need a spec." Simple tasks do not need long specs, but they still need acceptance criteria. A 2-line spec is fine.
2. "I will write the spec after I code it." That is documentation, not specification. The spec's value is in forcing clarity before code.
3. "The spec will slow us down." A 15-minute spec prevents hours of rework.
4. "Requirements will change anyway." That is why the spec is a living document. An outdated spec is still better than no spec.
5. "The user knows what they want." Even clear requests have implicit assumptions. The spec surfaces those assumptions.
6. "It is one big feature; splitting it is overhead." If acceptance criteria cluster into independently testable groups, a monolithic spec forces every downstream task to reason over the whole contract. A 10-line capability map is the cheap alternative.
7. "I will decompose during planning." Planning slices tasks within a spec. By then the oversized artifact already exists; module boundaries and dependency direction must be decided before the spec is written, not after.

## Red flags

The source doc lists seven: starting to write code without any written requirements; asking "should I just start building?" before clarifying what "done" means; implementing features not mentioned in any spec or task list; making architectural decisions without documenting them; skipping the spec because "it is obvious what to build"; one spec whose requirements span several independently testable capabilities; and module boundaries or build order decided implicitly during implementation because no capability map was approved up front (source doc).

Anti-pattern writeups in the dig cover similar ground at weak weight (weight 0.20, weak, https://jmlopezdona.github.io/ai-coding-agents-sdd/11-anti-patterns/; weight 0.19, weak, https://sddplanner.com/spec-driven-design-anti-patterns/), corroborating that the anti-pattern framing is common but carrying no operative rule.

## The pre-implementation checklist

Before proceeding to implementation, the source doc requires confirmation of 5 base items: the spec covers all 6 core areas; the human has reviewed and approved the spec; success criteria are specific and testable; boundaries (Always, Ask First, Never) are defined; and the spec is saved to a file in the repository (source doc). The capability-map extension adds 2 more: if the request bundles several independently testable capabilities, a capability map (module ids, dependency direction, build order) was approved before any module spec was written, and every module spec traces to a module id in the approved map (source doc).

## Continuous coverage note

The source doc's RSI appendices record that this skill contributes to the declarative-policy primitive (specs are policy-as-data), that changes should be reviewed for impact on continuous/adaptive coverage, and that cycle-5 to cycle-7 primitive closures (segmentation, cryptographic identity, trust chain) were additive keyword closures in the curve-guided-rsi corpus audit (source doc). Those appendices are internal-record content: no dig was run against them, and they stand on the source doc alone.
