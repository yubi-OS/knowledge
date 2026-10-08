# 06 - Anti-Patterns and Red Flags

Scope: the 14 anti-patterns and 13 red flags the skill enumerates, grouped by what they protect, with the outside literature that names the same failure classes.

Ground spine: `yubi-OS/yubiOS skills/recursive-self-improvement/SKILL.md` (source doc).

## Group 1: protecting the hypothesis discipline

- **Editing without a hypothesis.** "Let me just tidy this up" produces cosmetic-only edits; every cycle needs the hypothesis step.
- **Producing a changelog entry without a hypothesis preceding it** (red flag), and **a changelog that reads like a status report** rather than hypothesis, edit, result (red flag).
- **Improvement theater:** a changelog entry that does not actually close the gap it claims to close.
- **Cosmetic-only edits marked as improvements** (red flag): no scope or behavior change, no cycle.
- **Polishing prose instead of closing gaps.** If a cycle produces a prettier skill that closes no gap, it failed. Prose polish belongs to `code-simplification`.

These all attack the same weakness: motion mistaken for progress. The general software literature catalogs this class as process anti-patterns; the Wikipedia list of software anti-patterns (https://en.wikipedia.org/wiki/List_of_software_anti-patterns, jev weight 0.58) defines anti-patterns as commonly used ways of doing software engineering that are not useful or cause more issues than they solve, and an academic catalogue project collecting software process anti-patterns for detection from project data (https://github.com/ReliSA/Software-process-antipatterns-catalogue, jev weight 0.35, weak backing) treats them as recurring solutions with known negative effects, the same epistemic status the skill gives its own list.

## Group 2: protecting the file mechanics

- **Editing the frontmatter block naively.** Use `@tool/edit` with hashline anchors; never touch the opening `---`, `name:`, or `description:` lines without re-reading the spec.
- **Validating with regex instead of js-yaml.** A naive angle-bracket scrub once corrupted a `>-` block indicator in a YAML description. Parse, don't grep (see 07-frontmatter-validation).

## Group 3: protecting loop integrity

- **Skipping the re-map.** The fixpoint rule is meaningless without a fresh gap map after each edit.
- **Running the loop forever.** The 3-cycle bound exists; past that, escalation to the user.
- **Mixing edit types in one cycle** without a hypothesis justifying each (red flag).
- **Closing gaps the author chose to leave open.** Intentional narrow scope is a feature; read the skill's "When NOT to use" or Scope section before flagging a missing capability as a real gap.
- **Improvement mode applied to a skill the user did not ask to improve** (red flag).

## Group 4: protecting self-mode integrity

- **Self-mode without fresh context on every cycle.** Main-thread context in cycle 2 or later re-introduces the bias cycle 1 mitigated.
- **Treating `doubt-driven-development` as a substitute for the subagent requirement.** DDD is a per-hypothesis supplement that never replaces cycle-level isolation; "I ran DDD so I do not need a subagent" is a documented anti-pattern.
- **Editing the same skill in 2 concurrent sessions.** 2 parallel loops produce 2 different changelogs and 1 of them will be wrong. Coordinate first.

## Group 5: protecting trigger fidelity

- **Treating description drift as cosmetic.** The trigger match silently degrades and downstream skills do not fire when they should. Drift is a real gap with its own edit type (see 02-edit-taxonomy).

## Group 6: stochastic-extension anti-patterns

- **Picking all co-travel clusters in one cycle.** Cluster batching destroys the single-intent protocol; if 5 clusters close in cycle N, the loop is being driven by vibes.
- **Setting alpha to 0 in retro-preferential trajectory before the fixpoint rule fires.** The walk needs some exploration to escape habit local minima; alpha 0 freezes the loop on whatever corpus item it last edited.

## The cargo-cult parallel

The nearest outside term for the whole list is cargo-culting. An architecture anti-patterns catalogue entry (https://architecture-antipatterns.tech/patterns/cargo_culting.html, jev weight 0.40, weak backing) defines it as adopting processes, technologies, or methodologies without understanding why and how they work, in expectation of the same benefits as the role model. The skill's anti-patterns are the inverse discipline: every motion is tied to a stated hypothesis, a measured gap, and an auditable result, precisely so the loop cannot become ritual.

## How the lists are used

The Anti-patterns section and the Red Flags section overlap heavily but serve 2 audiences: anti-patterns are prohibitions to check while planning a cycle, red flags are symptoms to check while reviewing one. The Verification checklist turns the load-bearing ones into checkboxes: hypothesis written before edit, frontmatter preserved and js-yaml validated, re-map run, cycle bound honored, one edit type per cycle, fresh-context subagent in self-mode, changelog line per cycle, and the 2 stochastic-extension conditions.

## Summary

14 prohibitions, 13 symptoms, 6 protective groups. The common denominator is that every failure mode quietly removes a control the loop depends on: the hypothesis, the parse, the re-map, the cap, the fresh context, the trigger, or the single intent.
