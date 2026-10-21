# 06. Integration and operational governance

**Scope:** Integration with yubiOS and Steady Orbit /jev/ endpoints, policy versioning, and audit trail. Internal-record subtopic, no dig.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/2026-10-07_Autoinstall_Spec_Notes.md, no external web dig

## Where the seed files sit in yubiOS

The autoinstall seeds are the provisioning entry point for Ubuntu-based yubiOS images: they install the base system, configure apt sources, install packages (including the FIDO2 tooling), and apply boot-asset customizations in `late-commands`. They live at `Deploy/ubuntu/` and are replicated across three branches (Docker, oem-2026, Docker-Dev-26.04), with oem-2026 carrying an additional `user-data-arm64-desktop-minimal-2026` variant. The spec notes are dated 2026-10-07 and land in `refs/` as the durable record of this audit.

## Governance model: one source of truth, pinned by date

The audit's governance rule is explicit pinning. Every verdict references canonical/subiquity `doc/reference/autoinstall-reference.rst` at a named head (main, 2026-09-30, targeting 26.04 development). This creates three obligations:

1. **Re-audit on upstream movement.** When the reference changes materially (a new field, a default change, a format version), a new dated spec-notes record should be produced rather than editing this one.
2. **Record the head date with every verdict.** A verdict without a pinned head is unfalsifiable because no one can tell which spec it was checked against.
3. **Keep the field table cumulative.** The 13-row table records the date each field was added, so a future audit can diff only the rows after 2026-09-30.

## Branch replication

Because the four seed files are identical across three branches, any change should be applied to all three in one change set, and the oem-2026 variant should be reviewed alongside. Divergence between branches would invalidate the audit's "identical across" premise and multiply the review surface. The `reset-partition` field is the one item the audit marks as directly relevant to a single branch (oem-2026 provisioning), so it is the most likely source of intentional divergence and should be documented if adopted.

## Change control for the adjacent flags

The five content flags map to different owners and actions:

| Flag | Owner implied by the source | Governance action |
|---|---|---|
| WARP suite pin | Provisioning maintainers | Record an explicit decision (pin and document, or switch to `.deb`) |
| Duplicate `cloudflare.sources` writers | Provisioning maintainers | Remove one writer; document which mechanism owns the file |
| `libpam-u2f` without PAM wiring | yubiOS auth side | Confirm the auth layer wires PAM; reference that location |
| `error-commands` to `/target` | None | Keep; note as verified |
| Shim hold plus EFI overwrite | Boot-chain maintainers | Keep; re-check if the schema changes around boot assets |

## Validation in CI

The upstream validation model supports a straightforward CI gate: pre-validate every seed file against the published autoinstall JSON schema on each change, and fail the job on any warning about unrecognized keys. That converts failure mode F1 (typo becomes fatal in a future version) into an immediate, cheap failure today. A second gate can assert the explicit opt-outs the audit recommends, for example that `kernel-crash-dumps.enabled` is set when the target is a small SBC.

## Relationship to the Steady Orbit /jev/ surface

The source does not route this audit through any `/jev/` endpoint. Its integration with the Steady Orbit tooling is indirect: the spec notes are a `refs/` document that this corpus mints into `yubi-OS/knowledge`, where the outline was validated with the clef `score` metric and the dig results were weighted with clef `noul` through `/api/decide`. The research summary in the README records that provenance. If the seed audit is later automated, the natural fit is the jev orchestrator's gated-action pattern: the re-audit is a read-only check, but applying a fix to three branches is a write that should pass through approval.

## Audit trail

The durable trail for this subject consists of:

1. The dated spec-notes record in `refs/` (2026-10-07).
2. The pinned upstream reference URL and head date.
3. This minted corpus, with its research DB (outline scores, dig results, clef weights, preflight).
4. Any follow-up change sets that act on the adjacent flags, each referencing the flag number.

## Review cadence

The audit implies a cadence tied to upstream rather than the calendar: re-run when Subiquity's reference advances past the pinned head with field or default changes, when a new Ubuntu release becomes the target suite, or when the provisioning branches change their seed files. The questing target (25.10) and the 26.04 development reference make the next LTS transition the most likely trigger.
