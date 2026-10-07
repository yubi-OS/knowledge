# 05. Lens format: the cycle-16 patch generator

Ground source: yubi-OS/yubiOS skills/nss-composition/SKILL.md (source doc). This subtopic is an internal-record subtopic, no dig: the lens schema and its constraints are embedded in the source doc.

## Scope

Every cycle-16 patch is one lens per file. The lens is a structured experiment record, not prose about the file. The source doc fixes the shape (source doc):

```
L<N> -- <short-name>
  hypothesis:  <testable claim about this file's composition surface>
  method:      <how to verify>
  parameters:  {axis: composition, dim_scores: {callers_named:1, ...}, total: X/20}
  delta:       {comp_gaps_before, comp_gaps_after, dim_closed, callers_count, callees_count, integrations_count, edges_typed_count}
  verdict:     YES | PARTIAL | NO
  score:       0-50
  caveat:      <what was NOT measured>
```

The patch is the lens. No `## Composition -- cycle 16` section ships without hypothesis, method, parameters, delta, verdict, score, and caveat (source doc). This is the hard gate against the templated-section anti-pattern: a section added by reflex, with no experiment behind it, fails the format.

## The schema invariants

The source doc's Verification section states the machine-checkable invariants for lens output (source doc):

- Every field present: lens, file, hypothesis, method, parameters, delta, verdict, score, caveat.
- verdict is one of YES, PARTIAL, NO.
- score is in the range 0 to 50.
- parameters.axis equals "composition".

The parameters object embeds the per-dimension scores from the 10-dimension rubric (dim_scores) and the total out of 20 (source doc). The delta object carries the before-and-after measurement: comp_gaps_before, comp_gaps_after, dim_closed, callers_count, callees_count, integrations_count, and edges_typed_count (source doc).

## What the verdicts mean

The source doc does not assign prose meanings to YES, PARTIAL, and NO beyond the schema itself; the constraint it does impose is that the verdict must be backed by a measured delta. The red flags section makes this explicit (source doc):

- A lens with `delta: {}` or `score: 0` means the experiment did not run. The lens is aspirational.
- 40 or more lenses all verdict=YES and score=50 means the experiment is degenerate. A sweep in which every file scores perfectly is evidence that nothing was actually measured.

## Discipline constraints

The source doc's Constraints section applies directly to lens production (source doc):

- LOCAL ONLY for the rubric; no network for measurement.
- The rubric is binary per dimension (0/1/2). No fractional scores.
- Lens output carries its own experimental design; the patch is the lens, not prose about the file.
- The edge-typed vocabulary is fixed: contains / imports / calls / publishes / subscribes / reads / writes / deploys-with / depends-on.

Guideline 9 adds the sweep-level rule: lens-format patches only for cycle-16, one lens per file patch, no templated `## Composition` sections (source doc).

## How the lens composes with the sweep machinery

The source doc's Composition section ties lens production to the wider corpus machinery (all attributed to the source doc):

- curve-compass-skill provides the lens-format patch generator and the Sigma ladder; nss-composition emits 1 lens per file in the same JSON shape (bidirectional).
- github-api defines the Git Data API commit pattern used to apply roughly 40 file patches in 1 commit (nss-composition -> github-api).
- recursive-self-improvement closes the loop: nss-composition proposes gaps; RSI applies the per-file patch (nss-composition -> recursive-self-improvement).
- context-isolation requires running each file's lens in a fresh-context subagent so author bias from prior cycles does not re-anchor (context-isolation -> nss-composition).

## Verification

The source doc gives concrete verification steps (source doc): a Python check that the SKILL.md frontmatter matches the name and description contract, the lens-output schema checks listed above, and a YAML frontmatter validation asserting the name matches `^[a-z0-9-]+$` and the description is between 1 and 1024 characters without angle brackets.
