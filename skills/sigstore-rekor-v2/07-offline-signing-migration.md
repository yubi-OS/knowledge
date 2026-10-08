# 07 - yubiOS offline signing config migration (no Rekor)

Scope: the yubiOS pattern for signing without a transparency log after cosign v3.x deprecated `--tlog-upload=false`, using `--signing-config` with `rekorTlogUrls` removed. Internal-record subtopic; grounded in the source doc only.

## Why this doc exists

This is an internal-record subtopic: it records a decision and procedure applied inside yubiOS, with no web dig. The source of record is the ground source doc (yubi-OS/yubiOS skills/sigstore-rekor-v2/SKILL.md), and every claim in this doc is a source-doc claim.

## The trigger

cosign v3.x deprecated `--tlog-upload`. The flag `--tlog-upload=false` is no longer accepted alongside `--signing-config` or `--use-signing-config`. The migration path per the cosign error message itself: provide a `--signing-config` file with no transparency log service (source doc).

## The applied pattern (2026-08-05, OMN-157)

The yubiOS migration was applied on 2026-08-05 in OMN-157 commit `25b728ec85fd` (source doc):

1. Commit a JSON signing config at `cosign/signing-config.json` in the repo root, alongside the key file `cosign/yubios-omni157.key`. Generate it from the public sigstore/root-signing `signing_config.v0.2.json` with `jq 'del(.rekorTlogUrls) | del(.rekorTlogConfig)'`. Keep `caUrls`, `oidcUrls`, and `tsaUrls` for config validity; they are ignored when `--key` is used for local-key signing. The committed file was 769 bytes, landed in a single atomic Git Data API commit alongside the workflow patches.
2. In every cosign call site (`cosign attest`, `cosign sign`, `cosign attest-blob`, `cosign sign-blob`), replace `--tlog-upload=false` with `--signing-config cosign/signing-config.json`. Leave `--use-signing-config` (default true) as-is; the explicit file takes precedence over the TUF lookup at runtime.
3. The path `cosign/signing-config.json` is repo-relative and resolves at the workspace root where cosign commands run. Every yubiOS workflow pulls the repo via actions/checkout, so the file is present at cosign runtime.

## Why it works

Three mechanics (source doc):

1. With `--signing-config <file>`, cosign uses the file's URLs instead of TUF. With `rekorTlogUrls` absent, cosign never POSTs to Rekor: no transparency-log entry, no upstream Sigstore dependency.
2. With `--key cosign/yubios-omni157.key`, cosign uses the local private key for signing, with no Fulcio round-trip. The `caUrls` and `oidcUrls` in the config are config-validity ballast, ignored in `--key` mode.
3. The signing result is identical to the old `--tlog-upload=false` flow: an OCI signature layer attached to the image digest, no transparency-log entry. `cosign verify-attestation` continues to work against the local key without needing Rekor for verification.

## Migration anti-patterns

Four anti-patterns specific to this migration (source doc):

1. Replacing `--tlog-upload=false` with `--use-signing-config=false`. Wrong: this disables the signing config entirely. Always pass an explicit `--signing-config <file>`, or rely on TUF discovery if you want transparency-log entries.
2. Removing `caUrls` or `oidcUrls` from the config to minimize it. Cosign validates the config shape; missing URL lists sometimes fail. Keep them as ballast for config validity.
3. Hardcoding the config content in the workflow step, for example writing it via `cat > /tmp/signing-config.json`. Fragile and not reviewable in PRs. Commit the file to the repo and reference it repo-relative.
4. Leaving the old `--tlog-upload=false` in one workflow while migrating the others. This defeats the audit trail; when a future agent asks why one workflow is different there is no good answer. Migrate all call sites in one atomic commit. In OMN-157's case that was 4 files: 1 new file plus 3 workflows covering 12 call sites.

## Verification recipe

Apply after the migration commit (source doc):

1. `grep -c -- '--tlog-upload=false' .github/workflows/*.yml` must return 0.
2. `grep -c -- '--signing-config cosign/signing-config.json' .github/workflows/*.yml` must return 12, across 3 workflows in a 3 + 3 + 6 split.
3. `jq 'has("rekorTlogUrls")' cosign/signing-config.json` must return false.
4. Re-dispatch all 3 workflows with `Docker_push=true` to exercise the full merge-manifest, attest, sign, verify-attest pipeline at the new HEAD.

The OMN-157 verification record: 3 runs dispatched at HEAD `25b728ec85fd` (run ids 31042840157, 31042842063, 31042844544), with poll schedules under `schedules/github-yubios-KS9n5GAT/poll-*-omn157-*/schedule.md` for 2026-08-05T20:35:00Z checking completion (source doc).

## Relationship to Rekor v2

This pattern is the deliberate "no transparency" branch of the routing table in doc 06: for ephemeral or private signing where no public log entry should exist, the pipeline drops Rekor entirely rather than publishing to a tile. It is orthogonal to the v2 migration in doc 05: a pipeline either publishes attestations to Rekor v2 or signs offline with a Rekor-less signing config, and never mixes the two paths for the same artifact.
