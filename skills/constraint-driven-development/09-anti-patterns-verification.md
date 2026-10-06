# Rationalizations, red flags, verification, and boundaries

Scope: the source doc's Common Rationalizations, Red Flags, Verification, See Also, and Guidelines sections. This is an internal-record subtopic, no dig: the content is the source doc's own taxonomy, cited to it throughout.

## Common rationalizations

The source doc answers 6 excuses in a 2-column table (source doc):

| Excuse | Reality |
|---|---|
| We will add constraints once the code settles | Code settles around whatever was allowed while it was moving |
| The tests are the constraints | Tests you wrote prove you agree with yourself; they say nothing about coverage of new code, dependency risk, or bundle growth |
| We cannot hit 80 percent coverage | Then do not set 80 percent. Set today's number and hold it |
| This will slow the agent down | Only if you put slow checks in the fast loop. That is a placement error, not an argument against constraints |
| I will remember what our standards are | The agent will not, and it is writing most of the code |
| Constraints will block us shipping | An exception with an owner and a date unblocks you. Deleting the constraint unblocks everyone forever |

## Red flags

Stop and reconsider if you notice any of these (source doc): the interview ran past 4 questions or produced a config the user cannot explain; a budget was set that the codebase fails today with no plan to reach it; a dimension was written into `CONSTRAINTS.md` with a number but no tool behind it; a checker was hand-rolled when a de facto one exists, ignoring the team's existing config; every constraint is checked by the project's own test suite with no external opinion; `CONSTRAINTS.md` changed in the same commit as the feature that was failing; an exception has no owner or an expiry more than a year out; the agent proposed relaxing a threshold instead of fixing the code; slow checks landed in the edit loop and someone started passing `--no-verify`; nobody has opened `CONSTRAINTS.md` since it was written.

Note how the red flags map back to the earlier sections: threshold-relaxation and same-commit edits are the diff-watch moves of 07; number-with-no-tool is the aspiration rule of 04; missing external opinion is the circularity ranking of 07; and `--no-verify` is the placement failure of 06.

## Verification checklist

The skill was applied correctly when all 9 items hold (source doc): `CONSTRAINTS.md` exists and every number in it has a stated reason; the floor is enforced and passes on the current codebase without changes; every dimension the user picked has a tool installed and a command that runs today; each constraint says where it runs and the fast stage stays under a few seconds; at least one constraint is external, not judged by this project's own tests; measured-only metrics record today's value and a direction; exceptions have an owner and an expiry date; `AGENTS.md` or `CLAUDE.md` points at the file; and a trial run on the current branch produces no failures the user disagrees with.

## See also and boundaries

The source doc's See Also wires 5 sibling skills: `interview-me` for the one-question-at-a-time discipline this intake borrows, `code-review-and-quality` for how to review (this skill decides what the review enforces), `ci-cd-and-automation` for building the pipeline these constraints run in, `test-driven-development` for the suite that coverage and mutation constraints measure, and `security-and-hardening` for what the security dimension should contain (source doc). The Examples section adds an in-repo touchpoint list (Overview, When to Use, Loading Constraints, The Process) and a boundary rule: when the request only names a trigger without the artifact it acts on, route to the owning surface instead of improvising (source doc). Guideline 2 closes the scope: every use stays inside the frontmatter description's scope; anything beyond it is a different skill's job (source doc).
