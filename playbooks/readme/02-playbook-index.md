# 02. Playbook Index: the 7 Indexed Runbooks and Their Triggers

## Scope

This doc records the 7 playbooks indexed in the yubiOS playbooks/README.md, the read-when trigger each one carries, and the provenance each one cites. Internal-record subtopic, no dig: every claim here comes from the source doc (https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md), which is the primary source of record.

## The index

The source doc's Index table has 3 columns: Playbook, Read when, Source.

| Playbook | Read when | Source |
|---|---|---|
| drop-in-override-naming | adding/renaming a drop-in under `usr/lib/{modprobe,dracut,tmpfiles,systemd/*.service.d,udev/rules}.d/` | OMN-149, `59f4332` to `f92c6010` |
| digest-bump-recovery | `quay.io/fedora/fedora-bootc:45@sha256:…: not found` | OMN-139 + 2 re-resolutions in 7 days |
| dispatch-chain-verification | about to report any dispatch/chain/merge green | PR #150 cycle |
| hw-device-and-allow-real-u2f | dispatching `ci_test-vm.yml` / `ci_test-vgpu-vm.yml` self-mode | PR #144, `5200f0b`, `5342867` |
| github-token-vs-secrets | writing any `token:` / `GH_TOKEN:` line | PR #148, `a49e95db` |
| sealed-uki-vm-debug | `ci_test_sealed-uki-vm.yml` fails | V25 to V39 journal, PR #154 + PR #155 |
| fido2-vm-e2e-recipe | the FIDO2/LUKS2/homed VM lane regresses | run 30139433902 |

## Trigger styles

The 7 read-when entries fall into 3 styles:

1. Symptom-string triggers. digest-bump-recovery triggers on a literal error message (`... not found`), the most precise trigger style: paste the error, match the playbook.
2. Task triggers. drop-in-override-naming (adding/renaming a drop-in), github-token-vs-secrets (writing a `token:` line), hw-device-and-allow-real-u2f (dispatching a specific workflow self-mode). These fire before a mistake happens, not after.
3. State triggers. dispatch-chain-verification ("about to report any dispatch/chain/merge green") and sealed-uki-vm-debug ("fails") and fido2-vm-e2e-recipe ("regresses"). The first is unusual: it triggers on an intent to claim success, which encodes the verify-before-claim doctrine (see 04-coverage-boundaries.md).

## Provenance styles

The Source column carries the evidence trail each playbook was minted from. 4 styles appear:

- OMN issue numbers (OMN-149, OMN-139), pointing at Linear items.
- Commit SHAs and ranges (`59f4332` to `f92c6010`, `5200f0b`, `5342867`, `a49e95db`).
- PR numbers (PR #144, PR #148, PR #150 cycle, PR #154 + PR #155).
- A GitHub Actions run ID (run 30139433902) and a debugging journal range (V25 to V39).

This is the index-level expression of the format spec's hard rule that every playbook must name at least 1 commit/run/PR under Verified working (see 05-format-spec.md). digest-bump-recovery's provenance ("+ 2 re-resolutions in 7 days") is the two-fire qualification threshold visible in the index itself.

## Reading the index as a coverage map

The 7 entries cluster on CI/CD: 5 of 7 trigger on GitHub Actions workflows, workflow files, or CI failure strings; drop-in-override-naming triggers on image-content work; fido2-vm-e2e-recipe triggers on a hardware-emulation test lane. That matches the source doc's own coverage statement (see 04-coverage-boundaries.md): the collection covers CI/CD failure modes that have fired at least twice, plus the verify-before-claim doctrine.

## Sources

- Source doc (sole source, internal-record subtopic, no dig): https://github.com/yubi-OS/yubiOS/blob/main/playbooks/README.md
