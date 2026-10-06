# Overview: why a written quality bar

Scope: why prose standards do not hold, why agents changed the calculus, and where this skill sits next to spec-driven and test-driven development. Primary source: the skill's Overview section in `yubi-OS/yubiOS skills/constraint-driven-development/SKILL.md`.

## The problem the skill exists to solve

The source doc states the core observation plainly: sibling skills describe what good looks like, `code-review-and-quality` gives five review axes, `test-driven-development` gives a cycle, `security-and-hardening` gives a threat list, but all of that lives in prose the agent reads and may or may not follow, and none of it survives the end of the session (source doc). The skill's answer is to produce a written record of this project's bar, with numbers, that outlives the conversation and can be checked mechanically (source doc).

The quality-gate framing is well established outside this skill. SonarSource defines a quality gate as a set of boolean conditions a project must pass before being considered releasable, and traces the idea to manufacturing quality control (https://www.sonarsource.com/resources/library/quality-gate/, jev weight 0.44, weakly backed). A 2026 practitioner guide to CI/CD quality gates argues the same point in pipeline terms: gates convert opinions about quality into pass/fail checks that run without a human (https://beefed.ai/en/quality-gates-ci-cd-design-best-practices, jev weight 0.14, weakly backed). This corpus treats those sources as corroboration of the mechanism, not as the standard itself; the standard here is the source doc.

## The agent-volume problem

The source doc's argument for why this matters now: when you wrote the code, reading it told you whether it was any good. An agent writes more in an afternoon than you will read that week, so the judgement moves out of your head and into checks that run around the loop. Those checks need to exist, they need numbers you actually chose, and they need to fire close enough to the work that the agent fixes its own output (source doc).

External corroboration for the volume claim: a 2026 industry piece describes AI-generated pull requests as a review bottleneck teams did not budget for, with reviewers unable to keep up with machine output (https://www.pura.sh/blog/reviewing-ai-generated-code, jev weight 0.15, weakly backed), and another collects 2026 bottleneck numbers on the same theme (https://www.flowverify.co/blog/ai-code-review-bottleneck-2026-data, jev weight 0.09, weakly backed). The source doc's inference, that review-by-reading fails at agent volume and mechanical checks must carry the bar, is the load-bearing claim; the dig sources support the premise, not the conclusion.

## Where it sits: spec, test, constraint

The source doc positions the three skills as a division of labor: spec-driven development says what to build, test-driven development proves it works, constraint-driven development defines what good enough to ship means, before anyone argues about it in a pull request (source doc). Two properties distinguish the artifact from the prose skills: it survives the session (a file in the repo), and it is mechanically checkable (every dimension names the command that produces its verdict). A threshold without a command behind it is an aspiration, not a constraint (source doc).

## What "good enough to ship" means here

Three design choices follow from the overview and recur through the corpus. First, the bar is per-project, not universal: the skill interviews the user about which dimensions matter and holds today's numbers rather than inventing ideals (source doc, expanded in 03 and 08). Second, the bar must fire close to the work, which drives the BUILD/VERIFY/REVIEW/SHIP phase placement covered in 06. Third, because agents also write the checks, the bar needs a guard against the agent weakening it, which is the diff-watch mechanism covered in 07.
