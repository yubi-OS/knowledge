# 02 - workflow file structure and event triggers

Scope: the anatomy of a GitHub Actions workflow file as yubiOS writes it: name, the `on:` trigger block (push, pull_request, schedule, workflow_dispatch), top-level default permissions, jobs, and the mandatory `.github/workflows/` location.

## Where workflow files live (source doc)

The SKILL.md hard rule is unambiguous: workflow files live at `<repo>/.github/workflows/*.yml`. This is the GitHub standard location; GitHub's workflow syntax reference is the authoritative contract for what the file may contain (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, w 0.98). The retired staging conventions (`<repo>/2026/<name>.yml`, `refs/<name>.yml`) are not workflows and do not run; they were only ever a workaround for the `workflow` scope gap, retired 2026-07-09 (source doc).

## The trigger block

The canonical yubiOS workflow skeleton from the source doc:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'   # every Monday 06:00 UTC
  workflow_dispatch:
    inputs:
      reason:
        description: 'Why are you running this manually?'
        required: false
        default: 'manual'
```

Each trigger maps to a documented event class. The workflow syntax reference specifies that push and pull_request events support branch, tag, and path filtering; path filters are not evaluated for pushes of tags (https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax, w 0.98). The schedule event runs on a cron schedule in UTC, which is why the example pins 06:00 UTC for a Monday cadence (source doc).

The `workflow_dispatch` event is the one yubiOS automation leans on, because it is the only trigger that can be fired on demand through the REST API. GitHub documents that when a workflow is configured to run on workflow_dispatch, it can be run from the Actions tab, the GitHub CLI, or the REST API, and that the workflow must declare the event in its `on:` block for any of those to work (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow, w 0.97). The `inputs:` block shown above is optional; declared inputs are passed through the API or CLI as key-value pairs (source doc; corroborated at https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow, w 0.97).

## Default permissions and the job body

The skeleton places `permissions: contents: read` at the workflow top level, applying the principle of least privilege before any job runs (source doc). Per-job permission overrides are covered in doc 03.

Jobs then declare a runner, optionally a container, and steps. The full annotated example in the source doc shows the four sections in order: triggers, default permissions, jobs, and within a job the container block, checkout step pinned to the approved SHA, a build step invoking `docker buildx build` with the yubiOS Rego policy flag, and an artifact upload step. The container option points at the approved dhi.io image; see doc 01 for the allowlist context.

## Dispatch is also an API surface

Because workflow_dispatch is declared in the file, the same event becomes reachable from code: `POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches` queues a run against a chosen ref (source doc; API reference at https://docs.github.com/en/rest/actions/workflows, w 0.97). That is the mechanism yubiOS agents use to trigger CI without a human in the web UI, and it is covered end to end in doc 05.

## Practical notes

- A workflow file that is not under `.github/workflows/` is inert. The list workflows API returns an empty set with `total_count: 0` for a repo without that directory (source doc).
- Run names come from the workflow `name:` field or `run-name:`; the run list on the Actions tab displays it, and omitting it falls back to the workflow file path (https://github.com/github/docs/blob/main/content/actions/reference/workflows-and-actions/workflow-syntax.md, w 0.95).
- The workflow syntax gained features over time (workflow-level env, defaults) that older examples may not use; the 2019 changelog is the historical marker, current syntax is in the reference (https://github.blog/changelog/2019-10-01-github-actions-new-workflow-syntax-features/, w 0.75).
- Community tutorials summarizing triggers (push, pull_request, schedule, manual) exist (https://runs-on.com/github-actions/triggers/, w 0.12, weak backing: vendor blog), but the docs.github.com references above carry the authoritative wording.
