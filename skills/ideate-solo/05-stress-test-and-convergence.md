# 05 Stress-Test and Convergence

Grounding spine: yubi-OS/yubiOS `skills/ideate-solo/SKILL.md` (source doc).

## Scope

Stress-testing the top 2 to 3 finalists (strongest critique, second-order effects, un-testable bet), the convergence tiebreak, and the idea-kill handoff.

## The stress-test protocol

Per the source doc, each finalist gets exactly three named examinations:

- **The strongest critique**, steelmanned: what is wrong with this idea, stated in its strongest form.
- **Second-order effects**: if this works, what else happens, both good and bad.
- **The un-testable bet**: what must be true that we cannot easily verify. If this bet is large enough to kill the idea, the finalist surfaces as an idea-kill candidate.

The strongest critique must be steelmanned rather than strawmanned. Steelmanning is the discipline of stating the strongest version of a view you disagree with before responding to it, the opposite of attacking the weakest or most convenient form (Umbrex, https://umbrex.com/resources/tools-for-thinking/what-is-steelmanning/, jev weight 0.33, weak backing; Thinking Framework Skills, https://thinking-framework-skills.productonpurpose.com/library/steelmanning/, weight 0.23, weak backing).

**Second-order effects** is a named discipline, not an ad-hoc musing: second-order thinking refuses to stop at the immediate, obvious result of a decision and asks one more question, "and then what?" (Thinking Framework Skills, https://thinking-framework-skills.productonpurpose.com/library/second-order-effects/, weight 0.24, weak backing). Product managers use it to anticipate long-term and indirect impacts and to plan mitigation before they arrive (Statsig, https://statsig.com/perspectives/understanding-second-order-effects-in-product-development, weight 0.21, weak backing).

**The un-testable bet** is the premortem move: a premortem is a managerial strategy in which a team imagines the project has already failed, then works backward to determine what could lead to that failure (Wikipedia, https://en.wikipedia.org/wiki/Pre-mortem, weight 0.33, weak backing). The technique originates with Gary Klein's Harvard Business Review article "Performing a Project Premortem", which argues that projects fail at a spectacular rate partly because people are reluctant to speak up about their reservations during the planning stage (Harvard Business Review, https://hbr.org/2007/09/performing-a-project-premortem, weight 0.62, strong backing). Practitioner guides describe the same backward-from-failure mechanics: start by imagining the project failed and work backward to find possible risks, then assess how likely and serious each is (Asana, https://asana.com/resources/premortem, weight 0.20, weak backing; PM Study Circle, https://pmstudycircle.com/project-premortem/, weight 0.16, weak backing). In a solo run there is no team to voice dissent, so the un-testable-bet step is the structured substitute for the premortem's "everyone speaks up" moment.

## Why the un-testable bet is the most important finding

The source doc's anti-patterns say it directly: the finalist's un-testable bet is the most important finding, and skipping the stress-test produces a one-pager that looks strong but is not. The logic: a scored variation can look excellent on all four heuristics while resting on an assumption that no cheap test can reach. That assumption is invisible until it is named, and naming it is the stress-test's output.

## The idea-kill handoff

If a finalist's un-testable bet is large enough to kill the idea, the skill does not kill it itself. It surfaces the finalist as an idea-kill candidate. This preserves the separation of powers: ideate-solo generates and ranks hypotheses, idea-kill delivers the verdict. The source doc's Loading Constraints section makes this a hard boundary: the skill stops at the one-pager.

## The convergence rule

One variation wins. If two are tied, the source doc gives a mechanical tiebreak: prefer the more testable one, because it is cheaper to fail. This is consistent with the testability heuristic in 04-scoring-heuristics.md and with MVP thinking: the smallest product that tests the riskiest assumption is the canonical MVP definition (Nextolive, https://nextolive.com/free-tools/mvp-requirements-template/, weight 0.14, weak backing). A tie means the scoring model cannot distinguish the finalists, so the tiebreak falls back to the cheapest source of new information: a real test.

## Related reading

- 04-scoring-heuristics.md: how finalists were selected.
- 06-one-pager-output.md: where the stress-test output lands (Generation log).
- 08-skill-composition-and-constraints.md: the idea-kill boundary in full.
