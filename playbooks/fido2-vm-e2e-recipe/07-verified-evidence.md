# 07 Verified evidence

Scope: the runs, PRs, blocker records, and Linear items that certify the recipe, recorded as internal facts of the yubiOS project.

This is an internal-record subtopic: every fact below comes from the source doc yubi-OS/yubiOS `playbooks/fido2-vm-e2e-recipe.md` (2026-08-01), Verified working section. No external dig was run for this doc, and none is needed: the evidence is the project's own CI and tracking history.

## The anchor run

Run 30139433902, job 89629762908 (dated 2026-08-01 in the source doc), proves the whole chain with no skips (source doc): host `bcvk --swu2f` uhid load, in-guest `passless`, `/dev/hidraw0` CTAP2 `hmac-secret` enumeration, LUKS2 FIDO2 enroll and unlock PASS, systemd-homed FIDO2 home create PASS, `pamu2fcfg` registration OK, and `ssh-keygen -t ed25519-sk` OK. Both scripts report PASS (source doc). The run is linked from the playbook at https://github.com/yubi-OS/yubiOS/actions/runs/30139433902.

Per doc 04's discipline, the load-bearing qualifier is "no skips": the run's conclusion is accepted only because the inner runs were read and no assertion was skipped.

## The two real bugs behind it

Two real bugs had to be fixed to reach that state (source doc):

1. `pamu2fcfg` missing from the built image. Fedora Rawhide splits `pamu2fcfg` into a separate subpackage from `pam-u2f`. An earlier fix to the wrong build path (`mkosi.conf`, PR #102) had no effect because that path does not ship the image; the fix that worked was PR #125, adding the subpackage in the production `Containerfile`.
2. `homectl create` hanging about 5 minutes on an empty `NEWPASSWORD=`. Fixed with `--enforce-password-policy=no` (PR #102).

Note the split attribution: PR #102 carries the homectl fix, and PR #125 carries the correct packaging fix after the first packaging attempt failed for a structural reason. This history is why the triage table (doc 06) points at the production `Containerfile` and refuses `mkosi.conf` as a fix location.

## Blocker and tracker records

- `B-VM-CTAP2` is RESOLVED as of 2026-07-25 in `docs/BLOCKERS.md`, with Linear item OMN-48 marked Done (source doc).
- Related blockers `B-VM-SSH` and `B-VM-BOOTLOADER-UPDATE` were retired by run 29872832727 (source doc, linked at https://github.com/yubi-OS/yubiOS/actions/runs/29872832727).

The source doc also lists run 29525332901 as superseded ARM64 evidence (source doc): it predates the current recipe's canonical proof and is retained for history, not as the anchor.

## What this evidence certifies, and what it does not

The evidence certifies the software lane exactly as scoped in doc 01: interface behavior of the code path, exercised with a software authenticator and swtpm. It does not certify physical presence, firmware ownership, or RPMB freshness; those are `B-REAL-FIDO2` (open) and are covered in doc 08. The playbook's rule stands: a green run of this lane is never production confidence (source doc).

## How to cite the evidence

When a change to the lane needs justification, cite the anchor run and job id, the blocker resolution date, and the PRs: run 30139433902 / job 89629762908, `B-VM-CTAP2` RESOLVED 2026-07-25, PRs #102 and #125, Linear OMN-48 Done. Any later re-verification should produce a new run with the same no-skips property and be recorded the same way, extending rather than replacing this record.
