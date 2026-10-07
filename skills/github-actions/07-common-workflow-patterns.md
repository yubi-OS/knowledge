# 07 - common workflow patterns

Scope: the four pattern families the SKILL.md teaches for composing yubiOS workflows: conditional steps, matrix builds, secrets, and job dependencies.

## Conditional steps

The SKILL.md's two examples gate steps on ref and event:

```yaml
- name: Deploy (main only)
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: ./deploy.sh

- name: Only on PRs
  if: github.event_name == 'pull_request'
  run: echo "PR #${{ github.event.pull_request.number }}"
```

The `if` conditional is available at job and step level and accepts any supported context and expression (https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions, w 0.97). The contexts reference documents the exact semantics behind both examples: `github.ref` carries the branch or tag ref (so the comparison against `refs/heads/main` is a string equality against that shape), and `github.event_name` distinguishes the trigger event, which is how a workflow that fires on both push and pull_request keeps deploy steps out of PR runs (https://docs.github.com/en/actions/reference/workflows-and-actions/contexts, w 0.97).

A pattern to avoid, visible in community threads: computing state across steps via fragile condition chains. The supported mechanism is a job output or `GITHUB_ENV`, evaluated with plain expressions (https://stackoverflow.com/questions/72101452/in-a-github-action-how-to-conditionalize-a-step-based-off-the-previous-steps-ou, w 0.12, weak backing: Stack Overflow). The yubiOS style in the SKILL.md keeps conditions declarative and one-liner, no cross-step state.

## Matrix builds

The SKILL.md example fans a test job across architectures:

```yaml
jobs:
  test:
    strategy:
      matrix:
        arch: [amd64, arm64]
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building for ${{ matrix.arch }}"
```

The matrix strategy runs one copy of the job per combination and is documented as the mechanism for job variations, including `include`/`exclude` refinement of the generated combinations (https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/run-job-variations, w 0.97). In yubiOS the canonical use is the amd64/arm64 build in the CI template (doc 06), which builds both platforms in one step rather than via matrix; matrix appears where per-arch jobs need separate runner lifecycles (source doc). Advanced fan-out via `fromJSON` for dynamic matrices exists in the wider ecosystem (https://devopsdirective.com/posts/2025/08/advanced-github-actions-matrix/, w 0.15, weak backing: personal blog), and workflow-wide matrix behavior can be approximated with reusable workflows (https://stackoverflow.com/questions/75318609/matrix-strategy-over-entire-workflow-in-github-actions, w 0.08, weak backing: Stack Overflow). Neither is part of the SKILL.md's repertoire.

## Secrets

The SKILL.md's rule: secrets are available as context expressions, either consumed directly in a run command or exported through `env:`:

```yaml
- run: echo "${{ secrets.DOCKER }}" | docker login dhi.io -u 0mniteck42 --password-stdin

env:
  DOCKER_TOKEN: ${{ secrets.DOCKER }}
```

The dhi.io registry login is the canonical yubiOS consumer (doc 06 pulls the credential into the job's container block the same way, via `password: ${{ secrets.DOCKER }}`). One matrix nuance worth recording because it bites: matrix parameters must be literal values and cannot themselves reference secrets, though a secret name can be placed in the matrix and resolved inside the job via `secrets[matrix.name]` (https://stackoverflow.com/questions/75386396/what-is-the-correct-way-of-using-secrets-in-strategy-matrix-pattern-in-github-ac, w 0.1, weak backing: Stack Overflow; https://github.com/orgs/community/discussions/26302, w 0.15, weak backing: community discussion). The SKILL.md's yubiOS examples avoid the pattern entirely, so this is a guardrail rather than a recommended technique.

## Job dependencies

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    needs: build   # waits for build to complete
    runs-on: ubuntu-latest
    steps: [...]
```

`needs:` serializes jobs: the dependent job does not start until the dependency completes (source doc). Combined with conditionals, `needs` plus `if` is how deploy chains stay off failed builds; the conditional doc above confirms job-level `if` is evaluated with the full context set (https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-jobs-with-conditions, w 0.97).

## How these compose in yubiOS

The canonical CI workflow (doc 06) uses three of the four patterns without ceremony: one conditional (`if: always()` on the artifact upload), no matrix (the buildx step handles both platforms inline), one secret (the dhi.io login), and no `needs` chain (a single build job). The patterns become load-bearing as workflows grow: a deploy job would add `needs: build` and a `github.ref` guard; a per-arch test harness would add the matrix. The SKILL.md's guidance is to reach for the smallest pattern that satisfies the workflow, keeping everything inside the pinned-action and approved-container constraints (source doc).
