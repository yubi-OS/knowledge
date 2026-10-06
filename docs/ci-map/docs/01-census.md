# 01 Census: the 40-file YAML surface, counted

**Scope:** the yubiOS CI architecture map opens with a census. This doc explains what the census counts, why the numbers are stated as they are, and how the census is kept honest against the live repo tree. It is an internal-record subtopic: the census describes this repository's own automation surface, so no external web dig was run and every claim below is grounded in the source doc (yubi-OS/yubiOS docs/CI_MAP.md, https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md).

## The headline counts

The source doc (source doc) regenerates from main at commit `e46a3cb817c988185f97ff210c9b5577d8f83500` (tree `d45dd6f5915c20f1644ee7f8a18192c8a1041e02`) and reports these measures:

| Measure | Count |
|---|---|
| `.yml` files in the repo | 40 |
| GitHub Actions workflows | 39 |
| Non-workflow YAML (`.github/FUNDING.yml`) | 1 |
| Workflows with `workflow_dispatch` | 39 |
| Scheduled workflows (`schedule:` cron) | 7 |
| Push-triggered workflows (branch/path-scoped) | 3 |
| Pull-request-triggered workflows (path-scoped) | 6 |
| `workflow_call`-callable workflows | 1 (`ci_test_sealed-uki-vm.yml`) |
| Total declared jobs across all workflows | 87 |
| Workflows in the ci.yml group taxonomy | 38 |
| Workflows outside ci.yml's own group lists | 1 (`ci.yml` itself) |
| ci.yml `all` group size (independent dispatches) | 38 |
| Largest workflow file | `ci_firmware-rk.yml` (69,375 B) |

(source doc)

Three structural facts fall out of the table. First, every single workflow (39 of 39) declares `workflow_dispatch`, which is what makes the orchestrator-dispatch model in doc 02 possible: nothing on main is dispatch-only-by-accident, everything is deliberately dispatchable. Second, the automatic triggers are the minority: 7 crons, 3 push lanes, 6 pull-request paths, and exactly 1 `workflow_call` entry point. Third, the 38/1 split means the group taxonomy in ci.yml covers every workflow except the orchestrator itself, which by definition is not a member of its own groups (source doc).

## Why the census is regenerated, not counted by hand

The source doc (source doc) is explicit that the census and inventory blocks are generated from the workflow YAMLs themselves, and that the ci-launchpad `/api/yml-inventory` endpoint can produce the same 40-file census on demand from a single git-tree call. Any session that touches a workflow file re-runs the census and appends a dated drift note if counts moved. This replaces an older pattern: the 2026-09-18 drift-check addendum, which flagged count mismatches and deferred the fix to a later pass (source doc).

## The supersede history

The current map supersedes two prior records (source doc):

1. The 2026-09-18 drift-check addendum, which flagged the map's counts versus the 39-workflow census and deferred the content pass. This document is that pass.
2. The 2026-10-05 map (main `a8959116`). Since then, ci.yml's group taxonomy gained the `audits` and `research` choices, and the pull-request trigger count was corrected from 7 to the actual 6: only six workflows declare `pull_request` triggers.

## Cross-check against the live tracker

At regeneration time the source doc (source doc) cross-checks the census against ci-launchpad, the Sauna app that tracks every `.yml` file in the repo via a full-repo git-tree census:

| Measure | Count |
|---|---|
| `.yml` files in repo census | 40 |
| Workflows run-tracked by ci-launchpad | 39 |
| Non-workflow YAML inventoried (not run-tracked) | 1 |
| Files in the app's group taxonomy | 39 (38 dispatchable members + ci.yml) |
| Files reachable via taxonomy + auto-adoption | 39 |
| Doc-only entries (documented, not on main) | 0 |
| Code-only entries (on main, undocumented here) | 0 |

The zero/zero on the last two rows is the point of the cross-check: the map's inventory and the repo's tree agree exactly, in both directions (source doc). The app auto-adopts every `.github/workflows/*.yml` it finds on main into run tracking on the next status poll, so a new workflow file cannot silently escape the census (source doc). Non-workflow YAML like `.github/FUNDING.yml` is inventoried in the app's `/api/yml-inventory` endpoint with kind, path, and blob sha, but is not run-tracked because it has no Actions surface (source doc).

## Why a census section belongs in an architecture map

A CI map's most common failure mode is silent drift: a workflow is added, the prose description goes stale, and six weeks later the map describes a repo that no longer exists. The census design counters this three ways (source doc): the numbers are generated rather than hand-written, the largest consumer (ci-launchpad) derives its own view from the same git-tree source so both sides move together, and the count of declared jobs (87) gives a second, coarser checksum that any accidental deletion of jobs would break. The 69,375 B size of `ci_firmware-rk.yml` is recorded for the same reason: it is the file most likely to grow unboundedly, and the census makes that growth visible on every regeneration.

## What the census does not cover

The census counts files, triggers, and jobs. It does not judge what any workflow does; that is the capability map's job (doc 02 through doc 09). It also does not include the historical callback-contract machinery, which the source doc preserves separately and marks as no longer firing after PR 145 (source doc).
