# 03 - Statically analyzing workflow YAML in Python

Scope: parsing and statically analyzing workflow YAML in Python: safe loading, the YAML 1.1 on-key-as-boolean quirk, walking jobs and steps, and scanning for secrets references.

## Why static analysis, and what it must see

A workflow file is code with credentials attached: the CI environment holds the repository's secrets and, usually, a write-scoped token, and the workflow runs on input from strangers (https://github.com/Krishna89287/github-actions-auditor, weight 0.42, weak backing, but the framing matches the OWASP guidance below). OWASP's GitHub Actions cheat sheet makes the audit-relevant priorities explicit: try to eliminate all static credentials from your workflows, and secure handling of static credentials when elimination is unavoidable (https://cheatsheetseries.owasp.org/cheatsheets/GitHub_Actions_Security_Cheat_Sheet.html, weight 0.94). For a token-scope audit this translates into three things a parser must extract from every `.github/workflows/*.yml` file: the `permissions` blocks, the effective per-job overrides, and every `secrets.*` reference, wherever it appears (top-level `env`, job `env`, and per-step `env` included).

## The YAML 1.1 boolean quirk

The single most dangerous parsing detail for a Python workflow auditor is that `on:` is not a string. YAML 1.1 parsers (PyYAML included) interpret the unquoted key `on` as the boolean `true`, because `on`/`off`/`yes`/`no` are in the YAML 1.1 boolean vocabulary, the same family as the classic Norway problem where `NO` parses as `false` (https://py.omnist.dev/examples/github-actions/, weight 0.33, weak backing; the phenomenon itself is observable directly in PyYAML). The practical consequence: `data['on']` raises KeyError while `data[True]` contains the trigger configuration. The yubiOS audit pseudocode therefore reads the trigger config as `data.get(True, {})`, and any robust implementation must handle both `data['on']` and `data[True]` since tools like ruamel.yaml (chosen by some workflow-migration tooling for quote preservation) do not behave identically to PyYAML here (https://stackoverflow.com/questions/76015643/ruamel-yaml-trying-to-parse-a-github-actions-workflow-file, weight 0.05, weak backing).

## Walking the workflow structure

After safe-loading (`yaml.safe_load`, never plain `load`), the audit walks:

1. Top level: `permissions` block, `env` block, `jobs` mapping.
2. Per job: `permissions` override, `steps` list, each step's `env` mapping and `uses`/`run` strings.
3. Secret references: any occurrence of `secrets.` inside a string value, collected with the file and line so the report is actionable.

Python's standard library plus PyYAML is sufficient for all of this; no additional audit-specific dependencies are needed, and the existing ecosystem of Python-based workflow tools demonstrates the pattern works (https://github.com/Krishna89287/github-actions-auditor, weight 0.42, weak backing).

## What the walk can and cannot catch

Static analysis of workflow files catches declared properties: what permissions are declared, what secrets are referenced, what actions are pinned or floating. Tools like scharf demonstrate the complementary static checks this walk makes possible, detecting and updating mutable action tags to their corresponding SHAs directly from CLI (https://github.com/cybrota/scharf, weight 0.71). Academic work on Actions scanners formalizes the space: static analysis tools search workflows for security weaknesses across different scopes and detection capabilities (https://arxiv.org/html/2601.14455v2, weight 0.56).

What a static walk cannot catch: the actual runtime privilege a step exercises (a `run:` block can do anything the token allows), the existence of a secret (that requires the API or an allowlist, covered in doc 05), or semantics of third-party actions. GitHub's own features page positions secrets storage at repository, environment, or organization level as the platform primitive (https://github.com/features/actions, weight 0.81), and the audit treats the workflow-declared half of that contract as its domain.

## Design rule for the script

The parsing layer should be deliberately boring: safe-load, normalize the `on`/`True` key, walk mappings recursively for `secrets.` occurrences, and emit findings with file, line, code, and message. Everything interesting (severity assignment, allowlist policy, output formats) lives in the layers above so the parser stays trivially testable. This is the structure the yubiOS `audit_workflow_file(path)` pseudocode follows.
