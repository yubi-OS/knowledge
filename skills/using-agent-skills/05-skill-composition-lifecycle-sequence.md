# 05 - Skill Composition and Lifecycle Sequence

Scope: the 4 skill rules, the 16-step lifecycle sequence for a complete feature, how skills chain in sequence, and tailoring to smaller tasks like bug fixes.

## Grounding spine

Source doc: `yubi-OS/yubiOS skills/using-agent-skills/SKILL.md`, sections "Skill Rules" and "Lifecycle Sequence". This is an internal-record subtopic: the content is the source doc's own rules and sequence, so no searXNG dig was run.

## The 4 skill rules

The source doc states 4 rules (Skill Rules):

1. "Check for an applicable skill before starting work. Skills encode processes that prevent common mistakes."
2. "Skills are workflows, not suggestions. Follow the steps in order. Don't skip verification steps."
3. "Multiple skills can apply. A feature implementation might involve idea-refine, spec-driven-development, planning-and-task-breakdown, incremental-implementation, test-driven-development, code-review-and-quality, code-simplification, shipping-and-launch in sequence."
4. "When in doubt, start with a spec. If the task is non-trivial and there's no spec, begin with spec-driven-development."

Rule 1 is the discovery obligation the meta-skill exists to discharge. Rule 2 is the compliance obligation: a skill is a procedure, and skipping its verification step voids the skill's guarantee. Rule 3 is the composition obligation, and rule 4 is the default when the tree is ambiguous: spec first.

## The 16-step sequence

For a complete feature, the source doc prescribes this order (Lifecycle Sequence), with each step's purpose as the doc states it:

1. interview-me: extract what the user actually wants.
2. idea-refine: refine vague ideas.
3. spec-driven-development: define what we're building.
4. planning-and-task-breakdown: break into verifiable chunks.
5. context-engineering: load the right context.
6. source-driven-development: verify against official docs.
7. incremental-implementation: build slice by slice.
8. observability-and-instrumentation: instrument as you build; the doc notes it "runs parallel with 7-9, not after".
9. doubt-driven-development: cross-examine non-trivial decisions in-flight.
10. test-driven-development: prove each slice works.
11. code-review-and-quality: review before merge.
12. code-simplification: reduce unnecessary complexity while preserving behavior.
13. git-workflow-and-versioning: clean commit history.
14. documentation-and-adrs: document decisions.
15. deprecation-and-migration: retire old systems and move users safely when needed.
16. shipping-and-launch: deploy safely.

The sequence encodes the development loop the skills collection was organized around. Two structural details are worth reading carefully. First, step 8 is explicitly parallel: instrumentation overlaps build, doubt-driven review, and testing rather than following them. Second, the ordering places doubt-driven-development (9) after implementation begins (7), reflecting that it operates on decisions already made, in-flight, rather than as a pre-approval gate.

## Tailoring: not every task needs every skill

The source doc is explicit: "Not every task needs every skill. A bug fix might only need: debugging-and-error-recovery, test-driven-development, code-review-and-quality" (Lifecycle Sequence). The bug-fix chain is a 3-skill projection of the 16-step sequence: diagnose (debugging-and-error-recovery), prove (test-driven-development), review (code-review-and-quality). The definition, planning, and shipping phases collapse or vanish because a bug fix starts from a known-bad state and lands in a reviewed patch.

The routing tree (doc 01) plus this tailoring rule give the agent its full strategy: route by phase, then include only the phases the task actually spans.

## Composition mechanics

Rule 3's example chain and the lifecycle sequence agree on the mechanism: skills compose by handing off artifacts. interview-me produces the extracted intent that idea-refine diversifies; spec-driven-development consumes the refined concept into requirements and acceptance criteria; planning-and-task-breakdown decomposes the spec into verifiable chunks; incremental-implementation consumes chunks one at a time. Each skill's output is the next skill's input, which is why the doc calls the sequence "the typical skill sequence" rather than a menu.

The chain also has feedback edges the linear list implies: test-driven-development's failing tests (step 10) send work back to incremental-implementation (7), and code-review findings (11) send work back to implementation or simplification. The lifecycle is a loop with a review exit, not a waterfall.

## The 4-rule contract in practice

Read together with the tree (doc 01), the rules produce this operating contract:

1. On task arrival, run the discovery tree (rule 1 via doc 01).
2. If the tree is ambiguous on a non-trivial task, default to spec-driven-development (rule 4).
3. Follow the selected skills' steps in order, including their verification steps (rule 2).
4. When the task spans multiple phases, chain the skills in lifecycle order, including parallel steps where the sequence marks them (rule 3).

## Verification at the seam

The lifecycle interacts with the verification behavior (doc 07) at every step boundary: the sequence works because each step's output is checkable before the next step consumes it. A spec is checkable against the extracted intent, tasks are checkable against the spec, slices are checkable by tests, and the final change is checkable by the Definition of Done. The source doc's rule 2 ("don't skip verification steps") is what keeps the handoffs honest; a skipped verification at one step poisons every downstream step that trusted its output.
