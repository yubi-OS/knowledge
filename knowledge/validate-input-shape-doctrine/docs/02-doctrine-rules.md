# The Eight Doctrine Rules

Scope: the eight numbered rules every yubiOS workflow input, dispatch payload, and lex-sort-participating config filename must satisfy, ordered as they apply at dispatch time.

## Rules 1 to 3: the workflow side

**Rule 1: every workflow declares its inputs explicitly.** Every `.github/workflows/*.yml` contains a `workflow_dispatch` block, either with `inputs:` or as an empty `workflow_dispatch: {}` for trigger-only workflows. A workflow that intentionally accepts no inputs declares `workflow_dispatch: null`; the validator treats that as "no inputs allowed". The yubiOS posture is workflow_dispatch-only CI (all 16 CI-test workflows dispatchable, per RECENT_ACTIVITY line 339), which makes the `workflow_dispatch.inputs` block the single source of truth for what a workflow accepts. Manual dispatch requires the workflow to be configured for the `workflow_dispatch` event on the default branch (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow, jev weight 0.92, high).

**Rule 2: every input declares an explicit type.** GitHub supports four input types for manual workflows: `string` (the default), plus `choice`, `boolean`, and `environment`, added in 2021 (https://github.blog/changelog/2021-11-10-github-actions-input-types-for-manual-workflows/, jev weight 0.91, high). The doctrine adds policy: `boolean` is the only accepted type for a yes/no decision; `choice` is required for any enumerated value; `string` is the default for free-form audit text; `environment` is reserved for protected-environment dispatches. Anti-patterns: `type: string` for a yes/no decision forces in-shell re-validation and accepts `"no"` as truthy; omitting `type` entirely silently defaults to string and masks type errors.

**Rule 3: every input declares `required` and a safe default.** `required: true` is reserved for inputs the workflow cannot run without. `reason` (audit trail) is `required: false` with `default: ''`: a missing reason is acceptable, an empty reason is auditable. `Docker_push` is `required: false` with `default: false`: the safe state is "do not push to the public registry" until an operator opts in, because the `:latest` and `:<commit-sha>` tags on the public image are published only when `Docker_push=true`. Safe defaults: `false` for booleans, `''` or the shortest non-action sentinel for strings, the option that does the least for choices.

## Rules 4 and 5: the dispatcher side

**Rule 4: dispatchers send only declared keys.** A dispatcher (parent workflow, operator script, third-party tool, MCP server) must intersect the dispatch payload with the target workflow's declared `workflow_dispatch.inputs` keys before sending. Undeclared keys produce HTTP 422 from GitHub. Mechanics: read the target workflow's YAML (or fetch its declared inputs from the GitHub API), compute `payload = caller_inputs AND target_declared_inputs`, send only `payload`. The intersection was retrofitted after the 2026-07-29 failures; the doctrine specifies it as the primary contract.

**Rule 5: dispatchers serialize values to match declared types.** For `type: boolean`, send JSON literals `true` or `false`, never the strings `"true"`/`"false"`. For `type: choice`, send one declared `options:` value, case-sensitive exact match. For `type: string`, send a JSON string. For `type: environment`, send a repo environment name. The serialization rule exists because of a real quirk: boolean inputs are compared as strings in `workflow_dispatch` context but as booleans in `workflow_call` context (https://github.com/actions/runner/issues/3571, jev weight 0.71, high). A dispatcher whose jq pipeline emits `"Docker_push": "true"` (quoted) fails the declared boolean contract; the fix emits `"Docker_push": true` (unquoted).

## Rule 6: lex-sort naming

Config filenames that participate in lex-order chains must lex-sort to match their declared intent. Affected directories: `usr/lib/modprobe.d/*`, `usr/lib/dracut.conf.d/*`, `usr/lib/tmpfiles.d/*`, `usr/lib/systemd/*.service.d/*.conf`, `usr/lib/udev/rules.d/*`. Drop-in overrides whose intent is "fire after upstream" must use a prefix that lex-sorts after every upstream package file in the same directory (for example `vfio-yubiOS-...`); drop-ins whose intent is "fire before" keep a low numeric prefix. Verification recipe: `ls -1 usr/lib/<dir>/ | sort -u` and confirm ordering after each rename. The ordering semantics are documented upstream: tmpfiles.d files are "sorted by their filename in lexicographic order" (https://www.man7.org/linux/man-pages/man5/tmpfiles.d.5.html, jev weight 0.79, high), dracut conf.d files "are then read in alphanumerical order" (https://www.man7.org/linux/man-pages/man5/dracut.conf.5.html, jev weight 0.78, high), and modprobe blocklists live in modprobe.d files read by modprobe (https://access.redhat.com/solutions/41278, jev weight 0.72, high).

## Rule 7: tag coverage

The set of image tags pushed by build workflows must be a superset of the tag forms dispatchers will request. In-scope forms at spec time: `:dev`, `:dev-<full-sha>`, `:dev-<short-sha>`, `:latest`, `:<commit-sha>`, `:firmware`, `:firmware-<sha>`, `:installer`. The contract is cross-workflow: the build's push set includes the dispatch's request set, because a tag the dispatcher requests but the build never pushed yields `manifest unknown` at pull time.

## Rule 8: the audit echo

The dispatcher's own log is the only place where undeclared inputs are allowed. An operator-supplied `reason` is echoed in the dispatcher's step log (`REASON: ${{ inputs.reason }}` from an `env:` block) but must not be forwarded to any inner workflow that does not declare it. This is the formalization of the `b0a96a11` fix: keep it only in the dispatcher's own audit echo.

## Why eight rules

The rules are numbered in the order they apply at dispatch time, top-down, not by perceived importance: declare (1), type (2), default (3), intersect (4), serialize (5), then the two non-input contract shapes that failed the same way (6 lex-sort, 7 tags), then the one sanctioned escape hatch (8). Each rule maps to at least one real incident row, and each rule has a corresponding validator check.
