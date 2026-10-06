# Detect before you ask: the four-question interview

Scope: Step 1 (gather what the repo already says before asking anything) and Step 2 (four questions, each with a default). Primary source: the skill's The Process section, Steps 1 and 2.

## Detect before you ask

The source doc's rule is never ask what you can read. Before the first question, gather six things (source doc): language and stack from `package.json`, `pyproject.toml`, `go.mod`, or `Cargo.toml`; the test runner from dev dependencies, the test script, and existing test files; existing linters from `eslint.config.*`, `biome.json`, `.ruff.toml`; current coverage from `coverage/` output or by running the suite once; CI from `.github/workflows/` or `.gitlab-ci.yml`; and the agent harness from `.claude/`, `.codex/`, `AGENTS.md`. Report what you found in 2 lines, then ask only what is left.

This is standard requirements-elicitation practice applied to a repo: general elicitation guidance lists studying existing artifacts before interviewing stakeholders as the first technique (https://www.geeksforgeeks.org/software-engineering/software-engineering-requirements-elicitation/, jev weight 0.15, weakly backed; https://www.koji.so/docs/requirements-gathering-interviews-guide, jev weight 0.16, weakly backed). The skill's contribution is the specific lookup table mapped to quality-bar inputs.

## Four questions, each with a default

The interview follows the one-question-at-a-time discipline from the `interview-me` skill with one change: every question here has a default, so I don't know is a complete answer that still produces a working config (source doc).

- Q1 scope: beyond the floor, which dimensions to enforce (coverage on new code, security scanning, performance budgets, accessibility, architecture boundaries). Guess and default: coverage and security, because a test runner already exists and user input is being handled. The doc says to state each pick's cost: performance and accessibility need a running URL, architecture boundaries need a rules file written (source doc).
- Q2 teeth: when a check fails mid-task, block or warn? Guess and default: block on the floor, warn on everything else for the first 2 weeks, on the reasoning that a warning nobody reads is a warning (source doc).
- Q3 numbers: target numbers in mind, or measure today and hold the line? Guess and default: measure and hold, because most teams have no number and an invented one gets ignored. This routes to the ratchet mechanism (source doc, expanded in 08).
- Q4 latency: the slowest check tolerated before the agent hands work back. Guess and default: about 90 seconds at task end, unlimited in CI (source doc).

## Stop at 4

The source doc is explicit: stop at four questions. A 12-question intake produces a config nobody understands and a user who regrets starting (source doc). The red flags section later turns this into a check: an interview that ran past 4 questions, or produced a config the user cannot explain, is a stop signal (source doc, see 09).

External corroboration on defaults: coverage-gate guidance recommends starting from measured current coverage and gating trend rather than an aspirational absolute (https://nhimg.org/faq/how-should-teams-combine-coverage-reporting-with-quality-gates-and-trend-analysi/, jev weight 0.12, weakly backed). That matches Q3's measure-and-hold default.
## The harness check

The agent-harness row (`.claude/`, `.codex/`, `AGENTS.md`) is the one item a human interviewer would not think to look for, and it does double duty: it tells the interview which surfaces already carry instructions (so the later pointer line in `AGENTS.md` and `CLAUDE.md` lands where the harness reads), and it tells the skill whether the repo is already wired for an autonomous loop, which raises the stakes of Q2's block-or-warn answer (source doc).

## Why defaults make the interview safe

A normal elicitation interview stalls when the stakeholder has no opinion; the defaults convert I don't know into a working config while preserving the option to override. The four defaults are ordered so that the cheapest correct answer is also the recommended one: coverage plus security for scope (the 2 dimensions whose tools already exist in most repos), block on floor and warn elsewhere for 2 weeks, measure and hold for numbers, and 90 seconds for task-end latency. The cost statements the doc requires with Q1 (performance and accessibility need a running URL, architecture boundaries need a rules file) are themselves defaults of a kind: they tell the user what accepting a dimension will obligate before they accept it (source doc).

The elicitation literature backs the technique list generally: catalogs of requirements-elicitation techniques include interviews, document study, and observation as the standard trio (https://www.softwaretestinghelp.com/requirements-elicitation-techniques/, jev weight 0.14, weakly backed), and interview-method guides stress asking open questions one at a time with follow-ups grounded in what the subject already does (https://www.koji.so/docs/requirements-gathering-interviews-guide, jev weight 0.16, weakly backed). The skill's contribution is compression: 4 questions, all with defaults, all grounded in what Step 1 read rather than in opinion.
