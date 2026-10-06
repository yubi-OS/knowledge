# 10 Bake graph, full inventory, cross-check, trigger policy, drift discipline

**Scope:** the four closing sections of the CI map: the canonical Docker Bake graph, the full `.yml` inventory, the ci-launchpad cross-check, and the trigger policy and drift discipline that keep the map honest. Grounding spine: source doc (yubi-OS/yubiOS docs/CI_MAP.md, https://github.com/yubi-OS/yubiOS/blob/main/docs/CI_MAP.md).

## Canonical Docker Bake graph

`yubiOS-bake.hcl` owns every Docker build in the non-fork chain. Four hidden targets provide the shared contract (source doc):

- `_policy`: exactly one `yubiOS.rego` with `reset=true, strict=true`.
- `_source-metadata`: source and revision OCI labels.
- `_image-export`: Docker output with provenance and manifest-list mode disabled when `PUSH=false`; registry output with both retained when `PUSH=true`.
- `_yubios-base`: the pinned production Containerfile build.

The graph edges from the source doc (source doc): `_policy` and `_source-metadata` feed `_yubios-base`; the base target feeds production and dev; the exporter feeds prod, dev, firmware, and installer; the policy target feeds installer, firmware, and the cacheonly pq-tls-verify target; smoke variants (`yubios-smoke`, `yubios-dev-smoke`) consume their base targets as target context plus the policy. Publication shape: prod/dev publish per-arch tags through Bake then assemble the multi-arch index with `imagetools`; firmware/installer publish directly with the registry exporter from privileged DHI container jobs on user-scoped `hardened` builders (source doc, doc 03).

The Bake mechanics are standard: bake targets inherit from other targets and can override inherited attributes, which is how the hidden targets generalize (docs.docker.com, "Inheritance in Bake", https://docs.docker.com/build/bake/inheritance/, jev weight 0.37, weak); the bake file reference documents the target/group/check model (docs.docker.com, "Bake file reference", https://docs.docker.com/build/bake/reference/, jev weight 0.43, weak); and `docker buildx imagetools create` builds a new manifest list from source manifests that must already exist in the registry, which is exactly the two-stage publication's second stage (docs.docker.com, "docker buildx imagetools create", https://docs.docker.com/reference/cli/docker/buildx/imagetools/create/, jev weight 0.41, weak).

## Full .yml inventory

The source doc's (source doc) inventory covers every `.yml` file at regeneration time with per-file name, kind, triggers, external input count, and job count. The shape of the table: 39 workflow rows plus 1 non-workflow row. Extremes worth knowing: `ci_firmware-rk.yml` (6 jobs, 69,375 B) and `ci_test-vgpu-vm.yml` (32-step e2e job) are the heavyweights; `ci_test_pq_tls_verify.yml` and `ci_test_rootless-docker.yml` declare 0 external inputs; `diag_sign-matrix.yml`, `zernike-lens.yml`, and `zernike-spectrum.yml` declare inputless `workflow_dispatch: {}` (the inline-brace parser quirk ci-launchpad had to handle, source doc); the 3 research push lanes run on `ubuntu-latest` while every other workflow pins `ubuntu-24.04` or a matrix runner (source doc).

The per-file job trees in the source doc give every job's step count (87 declared jobs total, doc 01), which is the second checksum the census relies on (source doc).

## Documented vs code: the ci-launchpad cross-check

ci-launchpad is the live tracker. Its taxonomy mirrors live ci.yml exactly as of 2026-10-06: what was a hand-maintained 27-file taxonomy with 12 stragglers on 2026-10-05 is now the real group input (source doc). The app derives its workflow set from a full-repo git-tree census (one `GET /repos/yubi-OS/yubiOS/git/trees/main?recursive=1` call filtered to `*.yml`) and auto-adopts every `.github/workflows/*.yml` it finds into run tracking, so a new workflow file becomes tracked on the next status poll after it lands on main (source doc). The cross-check table at regeneration time shows 0 doc-only and 0 code-only entries (source doc, doc 01).

Known issues carried forward (source doc):

1. The 2026-10-05 known issue, the `all` group listing `ci_test_pq_tsl_verify.yml` (`tsl` not `tls`), which killed the dispatch loop after 3 entries under `set -euo pipefail`, is RESOLVED: the live array lists `ci_test_pq_tls_verify.yml`, verified by grep on 2026-10-06.
2. Ten child workflows (`ci_dev_image.yml`, `ci_firmware-rk.yml`, and the eight `ci_fork_*.yml`) still declare the legacy `ci_callback` internal input; ci-launchpad filters it from its trigger UI and the workflows' defaults apply.
3. Open diagnosis items from the 2026-10-06 full CI-path dispatch test: several fork workflows fail at dependencies-install steps and some builder workflows fail during build stages when dispatched across the full path. Both classes are under diagnosis; the dispatch plumbing itself (all 38 group paths) is verified reachable.

## Trigger policy

The source doc (source doc) states the policy as a list:

- 38 group members plus ci.yml: dispatch-driven only (manual or via the app).
- 7 workflows also run on cron: the 3 workflow-file guards (Mondays 09:00 UTC), package-floor and fork-drift-detect (daily 06:00 UTC), bootc-lifecycle and sysext-portable (Mondays 06:00 UTC).
- 3 workflows also run on path-scoped push: lean-check/lean-run (main plus `lean-check-*`), phonon-followups (`phonon-followups-*`).
- 6 workflows also validate on path-scoped pull requests: the 3 guards, package-floor, bootc-lifecycle, sysext-portable, each scoped to its own files/inputs.
- 1 workflow is `workflow_call`-callable: `ci_test_sealed-uki-vm.yml`.
- No workflow dispatches another back; the callback contract is gone (PR #145), and the `ci-callback` jobs still present are legacy no-ops.

## Drift discipline

The document is regenerated, not maintained by hand-edits: the census and inventory blocks are generated from the workflow YAMLs themselves, and ci-launchpad's `/api/yml-inventory` endpoint can produce the same 40-file census on demand from one git-tree call, so the map's counts can be re-verified in a single API call at any time. The 2026-09-18 addendum pattern (a drift record flagging mismatches, deferring the fix) is replaced by: any session touching a workflow file re-runs the census and appends a dated drift note if counts moved (source doc).

The design principle underneath is that the map and the app share one source of truth (the git tree), so they cannot disagree for long: either the census matches and the map is current, or a dated drift note records the delta until the next regeneration (source doc).
