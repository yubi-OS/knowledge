# yubiOS file-type surfaces: scripts, systemd, GitHub Actions, Containerfile, mkosi

**Source doc:** yubi-OS/yubiOS `skills/nss-outputs/SKILL.md` (ground source, fetched 2026-10-06). **Subtopic:** how the seven-channel taxonomy translates into each file type the yubiOS corpus contains, with the official mechanisms each surface depends on.

## Scope

Every yubiOS file has an Outputs surface, and "declaring it is the single highest-leverage move for each NSS-outputs Extend gap" (source doc). The source doc groups the corpus's file types into six surfaces: scripts, systemd units, GitHub Actions workflows, Containerfiles, mkosi configs, and refs/notes. Each has its own mechanism vocabulary, and an Outputs section must speak that vocabulary in the file's own comment syntax (source doc, verification item 1).

## Systemd units

The systemd surface declares three things: where log records go, when the unit counts as started, and which exit codes count as success.

- `StandardOutput=journal` is the default; `StandardOutput=file:/path` "writes a declared file with declared mode". The source doc's yubiOS convention for such files: mode 0640, `systemd-tmpfiles` rotation, never world-readable logs (source doc).
- `Type=oneshot` runs to completion and exits; `Type=notify` waits for `sd_notify(READY=1)`; `Type=simple` runs in foreground; `Type=forking` expects fork-and-detach. For `Type=notify`, failures are "reported via sd_notify(ERRNO=...) and journald MONOTONIC_USEC=..." (source doc).
- `SuccessExitStatus=` accepts additional exit codes as success; when present, document them and the rationale, for example `cryptenroll` exit 5 with `--token-only` meaning "slot already enrolled" (source doc).

The upstream mechanisms are well documented. The systemd.service(5) manual page is the normative reference for `Type=`, `StandardOutput=`, and `SuccessExitStatus=` (https://man7.org/linux/man-pages/man5/systemd.service.5.html, weight 0.55, strong backing). The freedesktop sd_notify(3) page documents the notification socket protocol that `Type=notify` depends on, including `NotifyAccess=` in the unit file (https://www.freedesktop.org/software/systemd/man/latest/sd_notify.html, weight 0.53, strong backing). The systemd project's own site and source describe the manager's role (https://systemd.io/, weight 0.63, strong backing; https://github.com/systemd/systemd, weight 0.75, strong backing). A practical walkthrough of systemd-notify shows a shell script service with `Type=notify` sending its own notification messages (https://www.baeldung.com/linux/systemd-notify, weight 0.11, weak backing).

The example 3 unit declares: `SuccessExitStatus=0 2` where exit 2 means "already configured" and is promoted to success so idempotent retries converge; side effects of applying a yubiOS-no-vfio override on /sys and /usr/lib marked idempotent; `partial_output_on_failure: forbidden` because the override is a single kernel write; and `determinism: byte_identical` (same inputs produce the same sysfs state) (source doc).

## GitHub Actions workflows

For reusable workflows, declare `outputs:` in the `workflow_call` or `workflow_dispatch` block "with name, description, and value. Each output is typed implicitly (string) and flows to consumers via `${{ needs.<job>.outputs.<name> }}`" (source doc). GitHub's own reuse-workflows documentation covers declaring reusable workflow inputs and secrets and consuming job outputs (https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows, weight 0.34, weak backing).

The yubiOS CI chain runs `ci.yml` as the orchestrator, and inner workflows (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`, `fetch-*.yml`) report via exit codes (0 green, non-zero red) and the dispatcher's `conclusion=success` field. The source doc warns: "Never assume the dispatcher's outer conclusion matches the inner chain's actual conclusion; read inner run logs (per PROJECT_RULES.md PR #150 doctrine)" (source doc). Example 4 declares outputs `digest`, `build_id`, and `rerun_cmd`, with `digest` empty meaning "failed to resolve; consumers should fail closed rather than retry" (source doc).

## Containerfiles

`ENTRYPOINT` and `CMD` produce a process whose exit code is the image's success/failure signal; the declared exit codes and partial-output policy go in the Outputs section (source doc). Image labels are the provenance record: the yubiOS pattern is `io.yubios.commit=<sha>` and `io.yubios.build-ts=<rfc3339>`, declared in the Containerfile so every layer carries them (source doc). `SOURCE_DATE_EPOCH=<unix-ts>` marks the build reproducible; "without the label, treat the image as non-reproducible" (source doc). Example 5 splits idempotency honestly: `inherently_idempotent for build (cached layers); NOT idempotent for push (each push creates a new tag)` (source doc).

## mkosi configs

`Format=disk` produces a raw disk image at the declared `Output=<path>`; `Format=oci` produces an OCI image at `ImageId=<name>`; `Format=directory` produces a rootfs tree (source doc). The mkosi man page is the normative reference for `Output=` and `ImageId=`: "Output=, --output=, -o: Name to use for the generated output image file or directory. Defaults to image or, if ImageId= is specified, it is used as the default output name" (https://github.com/systemd/mkosi/blob/main/mkosi/resources/man/mkosi.1.md, weight 0.69, strong backing).

The source doc requires documenting the side effects adjacent to the image: mkosi writes a build manifest at `<output>.manifest.json` (source doc), and example 6 enumerates the artifact set: `yubios.raw.zst` (compressed artifact), `yubios.raw.manifest` (build provenance, sha256 of inputs), and `yubios.raw.checksums` (sha256 of image, zst, and manifest), with `partial_output_on_failure: valid_and_marked` because the checksums file reports which artifacts succeeded (source doc).

## Refs and notes

A research note has "no runtime output, but it has deliverable outputs": a trailing `## Decisions` / `## Risks` / `## Followups` triple, one per note, kept current on review (source doc). Example 7 shows the validation rule: each decision or followup must be cited by ADR number or OMN issue; "a note that names a decision without an ADR/OMN link is not auditable; flag as Extend gap" (source doc).

## Comment syntax per file type

Verification item 1 names the file-type-aware equivalents (source doc): `# Outputs` for Containerfile and Makefile, `#` triple-quoted docstring for Python, `#` comments for shell, `<!-- Outputs -->` HTML comment for markdown when a section is not appropriate, and `<!-- Outputs (workflow_call outputs:) -->` for GitHub Actions YAML.

## Cross-surface invariants

Whatever the surface, the same four declarations recur: exit semantics (with surface-appropriate vocabulary: sysexits for scripts, Type= and SuccessExitStatus for units, conclusion for workflows), stream and sink ownership, side effects with idempotency class, and determinism class with canonicalization. A surface-specific Outputs section is a translation of the seven-channel table into the file type's native vocabulary, not a replacement for it (source doc, guideline 10).
