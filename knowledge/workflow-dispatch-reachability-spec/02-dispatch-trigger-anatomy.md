# 02 - workflow_dispatch trigger anatomy: what the parser must handle

Scope: how the `workflow_dispatch` trigger is declared (inputs, choice types), the YAML 1.1 `on:` boolean gotcha that breaks naive parsers, and the runtime behavior any reachability assertion has to model.

## Declaration and inputs

`workflow_dispatch` shipped on 2026-07-06 as GitHub's manual trigger event; adding it to the `on:` block surfaces a "Run workflow" button in the UI (https://github.blog/changelog/2020-07-06-github-actions-manual-triggers-with-workflow_dispatch/, weight 0.79). To run a workflow manually, the workflow must be configured to run on the `workflow_dispatch` event; this is the same precondition the REST dispatches endpoint checks (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow, weight 0.73).

The trigger accepts an `inputs` block with typed fields. The events reference documents typed inputs including `choice` options, which is exactly the shape the yubiOS `ci_dispatch-reachability.yml` gate uses for its `fail_on` input (`options: [ERROR, WARN, NEVER]`, per the yubiOS spec). The events reference covers `workflow_dispatch` inputs among its trigger types (https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows, weight 0.86); a third-party walkthrough of input options exists but with weak backing (https://oneuptime.com/blog/post/2025-12-20-workflow-dispatch-inputs-github-actions/view, weight 0.10).

## The YAML 1.1 boolean gotcha

The parser hazard is YAML 1.1, not GitHub. In YAML 1.1, the unquoted scalar `on` is a boolean, so a 1.1-compliant loader such as PyYAML `safe_load` parses the top-level key `on:` as `True`, not the string `"on"`. A deterministic fixture dedicated to exactly this trap exists (https://www.testaroo.com/pipelines/github-actions/github-actions-on-key-yaml-boolean-trap, weight 0.54), and the gh-aw project documents YAML version gotchas including this one, though with weak backing (https://github.com/github/gh-aw/blob/main/scratchpad/yaml-version-gotchas.md, weight 0.33).

For the reachability assertion the consequence is concrete: when walking workflow files, the trigger check must test both `data.get('on')` and `data.get(True)`. A script that only looks up the string key reports every workflow as non-dispatchable and the assertion flags nothing. This is the first bug any implementation should test for.

## Runtime dispatch semantics

Three runtime facts matter for the assertion's error model:

1. Dispatch requires the workflow file on the default branch (https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows, weight 0.97). A reachability gap on a feature branch is invisible to the live dispatch API; only the file-tree assertion catches it before merge.
2. Runs fired through the API surface as "manually triggered" in the UI, which is why dispatch tooling that fires workflows programmatically reports them as manual (https://github.com/marketplace/actions/workflow-dispatch, weight 0.94).
3. `workflow_dispatch` is additive to other triggers: a workflow can be both `push`-triggered and dispatchable, so presence of the trigger, not the absence of other triggers, is the membership predicate.

## What the assertion detects

Putting it together, the trigger predicate is: the parsed YAML has an `on` (or `True`) key whose value includes `workflow_dispatch` (as a bare string key, or as a mapping with input definitions). Everything else, inputs, defaults, required flags, is payload the reachability check can ignore. The yubiOS spec's algorithm uses exactly this predicate and nothing finer, which keeps the assertion stable across workflow-file style drift.

