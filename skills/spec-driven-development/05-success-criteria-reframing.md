# 05 - Reframing Vague Requirements as Success Criteria

Scope: turning vague instructions into specific, testable conditions so loops, retries, and reviews target a measurable goal.

## The source-doc move

The source doc (yubi-OS/yubiOS skills/spec-driven-development/SKILL.md) names the pattern: reframe instructions as success criteria. When receiving vague requirements, translate them into concrete conditions, then put the translation back in front of the human with one question: are these the right targets?

Its worked example takes the requirement "make the dashboard faster" and reframes it as three criteria: dashboard LCP under 2.5 seconds on a 4G connection, initial data load completing in under 500 milliseconds, and no layout shift during load with CLS under 0.1. The payoff the doc states for the loop: this lets you retry and problem-solve toward a clear goal rather than guessing what "faster" means (source doc).

## The measurability bar

The dictionary bar is simple: measurable means capable of being measured, able to be described in specific terms (weight 0.85, https://www.merriam-webster.com/dictionary/measurable). The source doc's checklist makes that a gate rather than an aspiration: success criteria must be specific and testable before implementation proceeds (source doc).

## Practitioner convergence (weak)

The dig shows agile and quality-management practitioner guides converging on the same shape, all at weak weight: acceptance-criteria guides push for specific, testable statements (weight 0.19, weak, https://kollabe.com/posts/how-to-write-acceptance-criteria; weight 0.18, weak, https://quackback.io/blog/acceptance-criteria; weight 0.22, weak, https://usethinkr.com/blog/testable-acceptance-criteria), including for AI features where vague ideas must become verifiable conditions (weight 0.20, weak, https://www.institutepm.com/knowledge-hub/ai-acceptance-criteria). Six Sigma practice defines project success criteria around measurable outcomes (weight 0.21, weak, https://www.6sigma.us/project-management/project-success-criteria/), and software-consultancy guidance frames success measurement as explicit criteria set before delivery (weight 0.14, weak, https://www.scnsoft.com/software-development/about/how-we-work/success-measureme). The corpus records this convergence as corroboration only; the source doc carries the operative rule.

## Why reframing beats asking for more detail

Two source-doc rules work together here. First, assumptions are the most dangerous form of misunderstanding (source doc, doc 03): a vague requirement left unreframed becomes a hidden assumption. Second, the reframe is presented back as a question, which keeps the human in the loop rather than locking in the agent's guess. The refactored requirement is cheap to correct (three lines) while a wrongly implemented "faster" dashboard is expensive to discover late.

The related red flag: asking "should I just start building?" before clarifying what "done" means (source doc). Reframing is the alternative: define "done" as testable criteria, get them confirmed, then build.

## Where the criteria land

The spec template places the reframed criteria under Success Criteria as specific, testable conditions (source doc, doc 04). Downstream, Phase 3 tasks carry acceptance criteria derived from them, and the Phase 2 plan defines verification checkpoints between phases against them (source doc, doc 06).
