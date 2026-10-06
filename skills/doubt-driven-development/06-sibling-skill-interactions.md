# 06 - Interaction with Sibling Skills

Scope: how doubt-driven development composes with code-review-and-quality, source-driven-development, test-driven-development, debugging-and-error-recovery, and the repo orchestration rules. Grounding spine: `yubi-OS/yubiOS skills/doubt-driven-development/SKILL.md` (source doc, Interaction with Other Skills).

## code-review-and-quality / /review

Complementary, not redundant. The source doc: "/review is post-hoc PR verdict; doubt-driven is in-flight per-decision. Use both." The rationalization table makes the timing argument concrete: by PR time, a wrong architectural direction has already accumulated commits around it, and undoing it is expensive. Doubt-driven operates at the decision boundary where a change is still one edit away from being different (source doc). Human code-review research agrees that review is most effective when it targets specific risk classes rather than serving as a generic final gate (weight 0.53, https://www.sciencedirect.com/science/article/pii/S0164121224001055).

## source-driven-development

The source doc draws a precise split: "SDD verifies facts about frameworks against official docs. Doubt-driven verifies your reasoning about the artifact. SDD checks the API exists; doubt-driven checks you used it correctly under the contract." In practice the two run in sequence: SDD grounds the factual substrate of the artifact, then doubt-driven stress-tests the reasoning built on that substrate.

## test-driven-development

The source doc: "TDD's RED step is doubt made concrete - a failing test is a disproof attempt. When TDD applies, that failing test is the doubt step for behavioral claims." This is the strongest composition in the skill: it converts the fresh-context reviewer from a language-model pass into a mechanical one. TDD is the practice of writing a test first, watching it fail, then writing the minimum code to pass (weight 0.59, https://martinfowler.com/bliki/TestDrivenDevelopment.html; weight 0.34, weak backing, https://en.wikipedia.org/wiki/Test-driven_development). A failing test satisfies the fresh-context-review requirement in the Verification checklist for behavioral claims, per the source doc's Interaction section. Practitioner variants of the cycle (RGRC) keep the same test-first falsification structure (weight 0.21, weak backing, http://ardalis.com/rgrc-is-the-new-red-green-refactor-for-test-first-development).

## debugging-and-error-recovery

When the reviewer surfaces a real failure mode, the source doc routes into the debugging skill to localize and fix. The boundary: doubt-driven finds that something is wrong; debugging-and-error-recovery finds where and why, and the fix feeds back through a new doubt cycle if the change itself is non-trivial.

## Repo orchestration rules

The source doc's Loading Constraints defer to `../../references/orchestration-patterns.md`: personas do not invoke other personas (anti-pattern B). Doubt-driven therefore orchestrates from the main session, where Step 3 can spawn a fresh-context reviewer. Inside a subagent, where nested spawn is prevented, the skill surfaces the limitation and prefers escalation; the degraded self-questioning fallback is flagged as not fresh-context review (source doc).

## Composition summary

| Skill | Relationship | Boundary |
|---|---|---|
| code-review-and-quality | Complementary | /review = post-hoc verdict; doubt-driven = in-flight per decision |
| source-driven-development | Sequential | SDD: facts about frameworks; doubt-driven: reasoning about the artifact |
| test-driven-development | Substitution | TDD RED failing test = the doubt step for behavioral claims |
| debugging-and-error-recovery | Handoff | Doubt finds that; debugging finds where and why |
| orchestration-patterns | Constraint | Main-session only; no persona spawning personas |

All boundary claims in the table are source-doc claims; the dig evidence backs only the TDD-cycle description and the review-effectiveness research cited above.

## Why the boundaries are sharp

The source doc's Guidelines end with a scoping rule that governs every row of the table: "Every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job" (source doc). The composition is therefore directional. Doubt-driven does not absorb /review's verdict format, does not do SDD's documentation lookup, does not write the debugging skill's root-cause analysis, and does not replace TDD's test suite. Each sibling keeps its own trigger and output contract; doubt-driven's contribution is the routing decision about which review instrument a given non-trivial decision needs, made at the moment the decision is still cheap to change.

A practical consequence for the orchestrator: when a doubt cycle surfaces a finding, the classification step (doc 04) doubles as the router. A contract misread goes back to the contract; an actionable finding about a wrong framework fact routes to source-driven-development to re-ground, then re-enters the cycle; a behavioral failure mode routes to TDD to become a failing test; a localized bug routes to debugging-and-error-recovery. The skills compose because each hands the next a narrower, better-specified artifact than the one it received.
