# 02. Tag types reference

**Scope:** The tag-generation rules metadata-action evaluates: type=ref for branches and PRs, semver patterns, type=sha short and long, type=schedule, and type=raw latest.

## The rule table

The source doc (yubi-OS/yubiOS skills/docker-metadata-action/SKILL.md) defines the tag types used across yubiOS CI:

| Type | Trigger | Example output |
|---|---|---|
| `ref,event=branch` | push to branch | `main`, `feat-fido2` |
| `ref,event=pr` | PR open | `pr-42` |
| `semver,pattern={{version}}` | tag `v1.2.3` | `1.2.3` |
| `semver,pattern={{major}}.{{minor}}` | tag `v1.2.3` | `1.2` |
| `sha` | any push | `sha-a1b2c3d` (short) |
| `sha,format=long` | any push | `sha-a1b2c3d4e5f6...` (full) |
| `schedule` | cron trigger | `nightly` |
| `raw,value=latest` | any push | `latest` (use sparingly) |

Every entry is a rule in a `tags:` block; all matching rules fire for a given event, so a single run can emit several tags at once.

## What each type reads from Git and GitHub

The action derives these values from Git reference and GitHub event context. The upstream README documents the underlying GitHub context values the tag rules read (https://github.com/docker/metadata-action, weight 0.95):

- The tag name that triggered the workflow run, which is empty when the run was not started by a tag reference. This is what `type=semver` consumes.
- The short commit SHA that triggered the run, for example `90dd603`. This is what `type=sha` consumes in its default short form.
- The base ref or target branch of the pull request that triggered the run. This is the pull-request half of `type=ref`.

The same context values are listed on the GitHub Marketplace page for the action (https://github.com/marketplace/actions/docker-metadata-action, weight 0.52).

## Branch and PR refs

`type=ref,event=branch` turns a branch name into a tag, so a push to `main` produces the tag `main` and a push to `feat-fido2` produces `feat-fido2` (source doc). `type=ref,event=pr` turns a pull request number into `pr-42` for PR 42 (source doc). This gives every in-flight branch and PR a moving, isolated tag namespace without any per-branch workflow configuration.

## Semver patterns

On a version tag such as `v1.2.3`, `type=semver,pattern={{version}}` produces `1.2.3` and `type=semver,pattern={{major}}.{{minor}}` produces `1.2` (source doc). The two-line combination is the standard release pattern: the exact version for reproducibility plus the minor line for a rolling pointer.

## sha: short and long

`type=sha` emits `sha-a1b2c3d` (7-character short form) and `type=sha,format=long` emits the full `sha-a1b2c3d4e5f6...` form (source doc). The yubiOS supply-chain pattern in the source doc explicitly selects `type=sha,format=long` "for digest pinning", and its Notes section states that long-form sha tags are "preferred over `:latest` for supply chain compliance (yubiOS.rego)". The distinction matters because a policy gate that pins by immutable digest reference needs the full SHA, not the 7-character abbreviation.

## schedule and raw

`type=schedule` emits `nightly` on cron-triggered runs (source doc). `type=raw,value=latest` emits the literal `latest` tag on any push; the source doc marks it "use sparingly". That caution aligns with the yubiOS supply-chain stance: `latest` is a mutable pointer that digest-pinning policies cannot bind to.

## What a full evaluation produces

When all matching rules run, one event produces a tag set. The upstream README's bake-file example for a run on `refs/tags/v1.2.3` shows the resulting tag list: `name/app:1.2.3`, `name/app:1.2`, `name/app:sha-90dd603`, and `name/app:latest` (https://github.com/docker/metadata-action, weight 0.95). That is the semver exact tag, the semver minor tag, the short sha tag, and latest, all from a single evaluation, with one image base name. Each `images:` entry is prefixed with the same tag set, so multi-registry setups get identical tag lists per registry (source doc).

## Event coverage

The documented reference workflow enables the triggers these types need: schedule (cron `0 10 * * *`), push on all branches (`"**"`), push on tags matching `v*.*.*`, and pull_request (https://docs.docker.com/build/ci/github-actions/manage-tags-labels/, weight 0.91). A workflow missing one of these trigger blocks silently drops the corresponding tag type: semver rules never fire if `tags: v*.*.*` is not in `on:`, and pr rules never fire without the pull_request trigger.
