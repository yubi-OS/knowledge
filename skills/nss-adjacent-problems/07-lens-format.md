# 07 - Lens format (cycle-13 patch generator)

**Scope:** The cycle-13 lens-format patch generator: one lens per file with hypothesis, method, parameters, delta, verdict, score, caveat; the lens-is-the-patch rule and the degenerate-experiment red flags. Internal-record subtopic.

## The lens schema

The source doc (`yubi-OS/yubiOS skills/nss-adjacent-problems/SKILL.md`) fixes the per-file patch format for cycle-13:

```
L<N> -- <short-name>
  hypothesis:  <testable claim about this file's adjacent-problems coverage>
  method:      <how to verify>
  parameters:  {axis: adjacent_problems, dim_scores: {related_named:1, ...}, total: X/20}
  delta:       {adj_gaps_before, adj_gaps_after, dim_closed, family_named, alternatives_count}
  verdict:     YES | PARTIAL | NO
  score:       0-50
  caveat:      <what was NOT measured>
```

The patch is the lens. The source doc is explicit: "No `## Adjacent problems -- cycle 13` section without hypothesis + method + parameters + delta + verdict + score + caveat." A section with the heading but no lens fields is an anti-pattern.

## Field-by-field contract

- **hypothesis** - a testable claim about the file's adjacent-problems coverage, not a description. "This ADR scores 4/20 because rejection criteria are missing" is a hypothesis; "this file needs improvement" is not.
- **method** - how to verify the hypothesis, stated so a fresh context could run it.
- **parameters** - `axis` must equal `adjacent_problems` (the verification section checks this literally); `dim_scores` carries the 10 dimension values from doc 03; `total` is the sum out of 20.
- **delta** - the measured change: `adj_gaps_before`, `adj_gaps_after` (gap counts), `dim_closed` (which dimensions moved), `family_named` (whether the problem family got named), `alternatives_count`.
- **verdict** - YES, PARTIAL, or NO. The verification section constrains the value set.
- **score** - 0-50, the lens-level quality score (distinct from the 20-point rubric total).
- **caveat** - what was NOT measured. A lens without a caveat claims omniscience, which the format treats as a defect.

## Verification contract

The source doc's verification section gives a machine check:

```
python3.12 -c "import re; s=open('skills/github-yubios-KS9n5GAT/nss-adjacent-problems/SKILL.md').read(); assert re.match(r'^---\n.*name: nss-adjacent-problems\n.*description: .*', s, re.S); print('OK')"
```

Plus the lens output schema: `lens`, `file`, `hypothesis`, `method`, `parameters`, `delta`, `verdict`, `score`, `caveat` all present; `verdict` in {YES, PARTIAL, NO}; `score` 0-50; `parameters.axis == "adjacent_problems"`.

## Why the lens is the patch

The source doc's constraints: "Lens output (cycle-13) carries its own experimental design; the patch is the lens, not prose about the file." The design intent is to prevent templated documentation. A prose section like "this file covers some related problems" is unfalsifiable and unmeasurable; a lens with a hypothesis, a verification method, and a delta is an experiment. The delta fields force the author to commit to before/after numbers, and the caveat forces honesty about scope.

This is the same discipline the source doc applies to its own history: the changelog records v1.0.0 as built for RSI cycle 13 on PR #207, and the maintainer section records the cycle-7 PR #207 baseline of 391 atomic per-file NSS patches already on the branch. The lens format exists so cycle-13's patches compose with that baseline instead of replacing it with prose.

## Degenerate-experiment red flags

The red-flag table defines 2 lens-specific failure modes:

1. **A lens with `delta: {}` or `score: 0`** - the experiment did not run; the lens is aspirational. A patch was written about what the file should become, without measuring anything.
2. **40+ lenses all verdict=YES score=50** - the experiment is degenerate. If every file in a sweep passes at maximum score, the method did not discriminate; either the scoring was keyword-matching (guideline 1 violation) or the hypothesis set was trivial.

The connection to `curve-compass-skill` provides the shared format: that skill is the lens-format patch generator and the Sigma ladder, and this skill emits one lens per file in the same JSON shape (composition table, source doc). Keeping the shape identical is what lets cross-cycle tooling read both.

## Running the sweep per the composition contract

The `context-isolation` skill supplies the execution rule: "when running the cycle-13 sweep, run each file's lens in a fresh-context subagent so author bias from prior cycles doesn't re-anchor." A scorer that has edited a file in a previous cycle will score its own edit generously; the fresh-context rule is the control. The `recursive-self-improvement` skill closes the loop: nss-adjacent-problems proposes gaps, RSI applies the per-file patch.
