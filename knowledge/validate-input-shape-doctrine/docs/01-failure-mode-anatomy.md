# Failure-Mode Anatomy: The Five Dispatch Contract Failures of Late July 2026

Scope: the five concrete failures between 2026-07-26 and 2026-07-30 that produced the validate-input-shape doctrine, the incident evidence for each, and the shared meta-pattern that made them cluster.

## The incident record

Between 2026-07-29 and 2026-08-01 the yubiOS CI dispatcher chain produced four distinct input-shape failures, three of them in the same week, with each fix surfacing a second previously hidden variant. A fifth failure (a registry tag gap) belongs to the same family. The record below cites the fix commit for each row (source doc evidence, no dig weight).

**Row 1: undeclared input key.** Commit `2f643ab7` (2026-07-29, https://github.com/yubi-OS/yubiOS/commit/2f643ab752cacfe08536f6634a00dcfbe224731c). CI #405 failed in 3 seconds at step 2 with `curl: (22) The requested URL returned error: 422`. The dispatcher at `5e601e2f` sent `inputs: {reason, Docker_push}` to every workflow in the `fetches` group, but `fetch-dhi-manifest.yml` (and its two siblings) only declared `reason` plus legacy `ci_*` callback inputs. `set -euo pipefail` killed the loop after the first curl, so 2 of the 3 fetches workflows were never even attempted.

**Row 2: wrong JSON value type.** Commit `b0a96a11` (2026-07-29, https://github.com/yubi-OS/yubiOS/commit/b0a96a11d2917c603386840befe567e0b4b4dd7a). On the CI #421 to #426 retest, 3 of 6 groups failed with the same 422 pattern. `yubiOS-ci.yml` declares `Docker_push: type: boolean`; the dispatcher serialized `"true"`/`"false"` as JSON strings. GitHub rejects a type mismatch with the same 422. The upstream behavior is documented: the GitHub CLI fails with `HTTP 422: Preview... could not create workflow dispatch event` on boolean dispatch payload problems (https://github.com/cli/cli/issues/5246, jev weight 0.73, high).

**Row 3: undeclared key, second variant.** Same commit `b0a96a11`. The same retest failed a second time because `reason` was forwarded to `ci_test_rootless-docker.yml`, `ci_test-vm.yml`, and `yubiOS-ci.yml`, none of which declare it. Some workflows declare `reason`, some do not, and the no-chain dispatcher cannot tell.

**Row 4: lex-sort filename shape.** Commit `f92c6010` (2026-07-30, https://github.com/yubi-OS/yubiOS/commit/f92c6010db9d19ed439ebfe80d84a1afb2f562bd). OMN-149: `ci_test-vgpu-vm.yml` arm64 failed at step 21 because a tmpfiles drop-in named `53-yubiOS-no-static-vfio.conf` fired BEFORE the upstream `static-nodes-permissions.conf` instead of after it. systemd-tmpfiles sorts configuration files lexicographically by filename (https://www.man7.org/linux/man-pages/man5/tmpfiles.d.5.html, jev weight 0.79, high), so the byte value of `53` (0x35) sorts before `s` (0x73) and the override was silently negated on every boot for 4 days (introduced in `59f4332`, 2026-07-26).

**Row 5: short-SHA tag missing.** Commit `95565a0e` (user-supplied reference, not independently re-verified). `ci_dev_image.yml` merge-manifest pushed `:dev-<full-sha>` and floating `:dev` but not `:dev-<short-sha>`, the form dispatchers naturally use. Three dispatches of `ci_test-vgpu-vm` at `d2646452` failed at the podman pull step with `manifest unknown`. A missing tag produces exactly this failure: pulling an image reference whose manifest is not in the registry yields the `manifest unknown` error (weak dig backing, jev weight 0.07 to 0.08 across Stack Overflow threads, labeled weak per https://stackoverflow.com/questions/41810104/docker-manifest-unknown-manifest-unknown).

## Why the failures cluster

All five rows share three properties (source doc analysis):

1. **The contract was implicit.** Workflow authors declared `workflow_dispatch.inputs`; dispatcher authors wrote scripts; the two never agreed in code on what counts as a valid input. Rows 1, 2, and 3 are all "dispatcher sent what it thought was fine, workflow rejected it". Row 4 is "file author picked a name, systemd interpreted the name by a different rule than assumed". Row 5 is "push author picked a tag form, dispatcher author picked a different form".

2. **The failure was silent until the operator noticed.** The first curl exited 22 and killed the loop before siblings ran. Every boot silently re-created `/dev/vfio` until a step-21 test noticed. Every pull failed with `manifest unknown` until a log line was read. None would have been caught by actionlint, which checks workflow syntax and `with:`/`outputs` usage but does not know about runtime dispatch contracts (https://github.com/rhysd/actionlint, jev weight 0.41, weak: it documents the checker's static scope, not its limits).

3. **The fix was narrow and missed siblings.** `2f643ab7` fixed the undeclared `Docker_push` but missed that `reason` was also forwarded to non-declarers. `b0a96a11` fixed `reason` and the boolean type but did not introduce per-workflow input detection. `f92c6010` fixed one lex-sort bug without a naming-convention enforcement. `95565a0e` fixed the short-sha gap without a "every requested tag must be pushed" contract.

## The meta-pattern

The same contract shape appears in different domains: a contract that lives in one operator's head, enforced by no machine, validated by no test. That is the single observation the validate-input-shape doctrine and its CI gate are built to close: make the contract explicit (the doctrine) and unforgeable (the gate), so the next wrong input fails the PR, not the dispatch.

One confirming detail from the wider ecosystem: boolean dispatch inputs behave differently across contexts, acting as strings under `workflow_dispatch` but as real booleans under `workflow_call` (https://github.com/orgs/community/discussions/9343, jev weight 0.52, high; comparison semantics pinned in https://github.com/actions/runner/issues/3571, jev weight 0.71, high). This is why the doctrine treats serialization as its own rule rather than an implementation detail.
