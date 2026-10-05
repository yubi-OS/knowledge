# Validator Testing Strategy: Fixtures, Layers, and Adversarial Edge Cases

Scope: how a static CI validator proves itself: the fixture suite mirroring known failures, the unit/integration/regression/adversarial layers, and the YAML parser edge cases that decide whether the validator survives contact with real workflows.

## Golden files and fixtures as the core pattern

A static validator is deterministic by design, which makes it a textbook candidate for fixture-and-golden-file testing: a fixture is an input the test loads from a file instead of constructing in code, and a golden file is an expected output the test compares results against (https://vinterstrom.com/resources/fixtures-and-golden-files, jev weight 0.58, high; the same record/replay framing appears at https://gophertrunk.org/learn/testing/golden-files-and-fixtures/, jev weight 0.52, high). The validate-input-shape gate uses this in two directions:

1. **Bad fixtures must fail.** Each of the five known failure rows has a fixture mirroring the pre-fix state, and the validator must produce the corresponding rule finding against it.
2. **Good fixtures must pass.** A workflow that satisfies all eight rules must produce zero errors and warnings.

The `--check-fixtures` mode runs both assertions, which is CI for the validator itself: the validator's own correctness is enforced on every run of the test suite.

## The four test layers

- **Unit tests** (`tests/unit/`): one test per rule (R1 through R8), and for each rule three cases: pass, fail with clear evidence, fail with ambiguous evidence. Fixtures in `.github/actions/validate-input-shape/fixtures/` are the test inputs.
- **Integration tests** (`tests/integration/`): clone the live repository to a temp directory, run the validator against its real `.github/workflows/` tree, and assert the run completes in under 30 seconds, produces a JSON report, and that `summary.files_scanned` matches the actual count of workflow YAML files in the clone.
- **Regression tests** (`tests/regression/`): one test per known failure row. Row 1 asserts an R4 plus R5 finding on the pre-`2f643ab7` dispatcher shape; row 2 asserts R5 on the pre-`b0a96a11` boolean-string shape; row 3 asserts R4 for the `reason` variant; row 4 asserts R6 on the `53-yubiOS-...` lex-sort shape; row 5 asserts R7 on the missing `:dev-<short-sha>` form.
- **Adversarial tests** (`tests/adversarial/`): edge cases run weekly, described below.

The layering matches standard static-analysis practice: a curated index of static analysis tools exists for comparison and ecosystem grounding (weak backing, jev weight 0.23, https://github.com/analysis-tools-dev/static-analysis).

## Adversarial edge cases

The adversarial layer encodes the ways real workflow YAML defeats naive parsers (source doc test strategy):

- `on:` as a YAML 1.1 boolean key: the bare `on` key parses as boolean `True` in YAML 1.1 parsers, so the validator must look up `f.get('on') or f.get(True)`. The validator must not crash.
- Anchored YAML aliases (`&ref` / `*ref`) in the inputs block must resolve correctly rather than appearing as opaque nodes.
- Multi-line string inputs (folded or block scalars) must have their type read from the first non-blank line.
- `workflow_dispatch: null` and `workflow_dispatch: {}` must produce info-level findings, not errors.
- `type: environment` for a non-existent environment must produce a warning, not an error, because existence cannot be verified without the API.
- Circular YAML anchors must produce a parser error and a skipped file, never a crash.
- Two workflows with the same input name but different types must produce per-file findings with no cross-contamination.
- A dispatcher with dynamic input computation must produce a heuristic warning, not a false pass or false fail.
- A drop-in directory with no upstream files must produce no finding (no contradiction to check).
- A drop-in directory with a same-prefix upstream file (for example `static-yubiOS-...`) must verify ordering at lint time and warn that future upstream packages in the same prefix could re-break ordering.

The general YAML edge-case space is well mapped by the yaml-test-suite project, which catalogs boundary cases including directive handling, flow collections, and syntax-character interpretation (https://deepwiki.com/yaml/yaml-test-suite/4.1-edge-cases-and-directive-handling, jev weight 0.50, high).

## Regression policy

New failure modes discovered after rollout need new fixtures, and the owner is whoever discovers the failure: fix the root cause by adding the fixture and the rule coverage, not by editing the validator to silence the finding. The five initial fixtures are a floor, not a ceiling (source doc open question 6 and carryover gap 5).

## Why the testing strategy is load-bearing

The gate's authority depends on it being right about other people's YAML. A validator that crashes on an anchor or misreads a block scalar either blocks good PRs (false positive cost: maintainers disable it) or passes bad ones (false positive in reverse: the doctrine silently fails). Linter rules in general carry known false-positive trade-offs and must be selected per context (https://dart.dev/tools/linter-rules, jev weight 0.85, high). The fixture suite is the mechanism that keeps the validator's trust level explicit: every rule claim is backed by a fixture, every known failure is pinned by a regression test, and the adversarial suite documents exactly where the parser stops being trustworthy.
