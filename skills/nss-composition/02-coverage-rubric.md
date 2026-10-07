# 02. Coverage rubric: the 0 to 5 levels

Ground source: yubi-OS/yubiOS skills/nss-composition/SKILL.md (source doc). This subtopic is an internal-record subtopic, no dig: the rubric is embedded in the source doc and is the corpus's authoritative definition.

## The principle

Coverage is scored by the highest level whose structural relationship map is actually evidenced (source doc). Breadth AND correctness both count. A file can list many edges and still score low if the edges are untyped, unowned, or unsourced (source doc).

## The levels

| Level | Label | What the file demonstrates (source doc) |
|---|---|---|
| 0 | Absent | No callers, callees, dependencies, integration points, or module boundaries named; the file exists as an island. |
| 1 | Nominal | Mentions 1 or 2 names (a parent workflow, a sibling skill) without defining edge type, direction, ownership, or rationale. |
| 2 | Basic | Covers at least 2 composition directions (callers OR callees OR integrations) with usable names and entry points. Handles the happy path but not the static-vs-runtime distinction. |
| 3 | Operational | Covers the full composition surface: callers, callees, integration points, sibling files, module boundaries, AND distinguishes static-import from runtime-call from configuration-discovered edges. A reader can answer "what changes if I modify this?". |
| 4 | Production-grade | The full surface plus the allowed/forbidden dependency rules, the integration scenarios (happy path and failure), AND each composition fact linked to a source path or build/CI artifact. ADR-driven composition decisions are explicit. |
| 5 | Exemplary | A compact reusable composition model with explicit node-and-edge vocabulary (contains / imports / calls / publishes / subscribes / reads / writes / deploys-with / depends-on), a tool-derived dependency report, machine-enforceable dependency rules (dependency-cruiser-style), per-integration scenario table, AND CI checks that surface composition drift. |

Level 5 is the only level that requires machine enforcement. It combines a tool-derived report with a machine-checkable rule set and CI drift detection (source doc).

## From dimension score to level

The 10 scoring dimensions (covered in subtopic 03) produce a 0 to 20 total. The source doc fixes the conversion bands (source doc):

- 0 to 3: Narrow
- 4 to 7: Emerging
- 8 to 12: Useful
- 13 to 16: Strong
- 17 to 20: Comprehensive

## Worked examples from the source doc

The source doc scores 4 worked examples (all attributed to the source doc):

1. A Containerfile that FROMs an image, adds packages, and never names its build callers, its callees, its sibling Containerfile variants, or its boundary scores 1/20 (Narrow). Only cross-context visibility is partially present: the maintainer sees the choice, operator, developer, and CI do not.
2. A systemd Type=simple unit that runs /usr/bin/yubiOS-foo without Wants=, Requires=, After=, or Before= scores 5/20 (Emerging). It has a static reference (the binary), partial ownership (systemd owns lifecycle), and a named path. Naming the Wants=, After=, and Required units would push it to Useful.
3. A refs/*.md research note that recommends approach A without listing affected files scores 6/20 (Emerging). Adding a `## File impact` section listing changed files and affected units, workflows, and tests lifts it to 12 to 14 (Useful).
4. A shell script running set -e then curl, jq, mount with no named dispatcher, runner, or secrets scores 5/20 (Emerging). Naming the dispatching workflow, the runner label, and the secrets pushes it to Useful.

The pattern across all 4: the cheapest score gains come from naming callers with entry points, typing the edges, and linking claims to paths, not from adding more prose (source doc).

## What moves a file up a level

Derived from the source doc's examples and dimension list:

- Level 0 to 2: name callers and callees with entry points and edge types.
- Level 2 to 3: add the static-import vs runtime-call vs configuration-discovered distinction and the module boundary.
- Level 3 to 4: add allowed/forbidden dependency rules, integration failure scenarios, and a source link per composition fact.
- Level 4 to 5: add a tool-derived dependency report, machine-enforceable rules, a per-integration scenario table, and CI drift checks.

## Constraints the rubric imposes

The source doc fixes 3 constraints on scoring (source doc): the rubric is binary per dimension (0/1/2) with no fractional scores; scoring behavior, not keywords (a "depends on" token earns partial credit at most); and measurement is local only, with no network access.
