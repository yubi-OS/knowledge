# Exit-code contracts: the machine-readable surface of each mode

Scope: the exit semantics column of the mode table: what each tool returns on success and failure, how kernel-path and daemon-path "exits" differ from process exits, and why the contract has to be named per step.

## Process exits: the one-shot verifiers

The tools that run as processes have conventional exit contracts, and the man pages state them explicitly.

veritysetup returns 0 on success and a non-zero value on error, with documented error codes: 1 wrong parameters, 2 no permission, 3 out of memory, 4 wrong device specified, 5 device already exists or device is busy (man7 veritysetup, weight 0.65: https://www.man7.org/linux/man-pages/man8/veritysetup.8.html). The same codes appear in the Arch man page (weight 0.83: https://man.archlinux.org/man/veritysetup.8.en).

sbverify exits non-zero when signature verification fails and 0 on success (ManKier sbverify page, weight 0.50: https://www.mankier.com/1/sbverify).

CHIPSEC runs a batch of modules and summarizes them in a bitmask exit code: bit 0 SKIPPED, bit 1 WARNING, bit 2 DEPRECATED, bit 3 FAIL, bit 4 ERROR, bit 5 EXCEPTION; exit 0 means clean, and any FAIL bit is what blocks a provisioning script (chipsec_main.py source, weight 0.47, weak backing: https://github.com/chipsec/chipsec/blob/272a3c7cf8435a341dc9083f1f1c60349bab9322/chipsec_main.py). The per-module vocabulary behind the bits is PASSED, FAILED, WARNING, ERROR, NOT_APPLICABLE, INFORMATION (CHIPSEC docs, Interpreting Results, weight 0.74: https://chipsec.github.io/usage/Interpreting-Results.html).

The important design point: the exit code is not just "did it run", it is a summary of outcomes across modules. A script that treats every non-zero exit identically loses the distinction between "one module failed" (bit 3) and "the framework itself broke" (bit 4 or 5).

## Kernel-path "exits": refusal and I/O error

Two steps in the chain never produce a process exit because they never run as processes.

The UKI signature check runs inside UEFI firmware before the OS exists. Its contract is boot or refuse; there is no exit code for any OS component to read. The first process that could observe a status is already past the check.

The dm-verity check runs inside the kernel at mount and then inside every read. Its failure mode is an I/O error on the affected read when a block cannot be verified against the root hash (kernel.org dm-verity admin guide, weight 0.90: https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html). A provisioning or CI script that wants to test this path therefore tests the userspace mirror (`veritysetup verify`), not the kernel behavior, and must know that the kernel's version of "exit 1" is a read that returns an error.

## Daemon exits: SIGTERM and the restart question

Daemons do not exit as part of their contract; they exit as an incident. Falco's observed exit codes are 1 for general application errors or health probe failures and 139 for a segmentation fault (falco issue 2476, weight 0.23, weak backing: https://github.com/falcosecurity/falco/issues/2476). Under systemd, a unit with Restart=on-failure restarts on any non-zero exit (a representative Falco unit uses Restart=on-failure with RestartSec=15s, weight 0.14, weak backing: https://github.com/juju4/ansible-falco/blob/master/templates/systemd-falco.service.j2), and diagnostics are read from stdout/stderr via journalctl (Falco troubleshooting docs, weight 0.92: https://falco.org/docs/troubleshooting/start-up-error/).

The hazard is the undocumented exit: if nobody has said which exit codes mean "configuration error, do not restart" versus "transient crash, restart me", systemd will restart both, and a daemon with a permanently broken configuration becomes a crash loop that looks alive. The exit contract for a daemon therefore has to name the codes and the restart policy together.

## The quote's contract

In yubiOS the remote attestation quote carries an explicit batch contract: exit 0 for quote verified, exit 2 for quote refused, anything else operational error. It is a project convention layered on top of the quote verification tooling, chosen so that a verifier run in CI can distinguish "the platform answered and failed policy" from "the platform did not answer".

## Why the column exists

The failure classes that motivated the mode table show up directly in exit semantics. A one-shot that is not idempotent (doc 05) and a daemon whose exit semantics are undocumented (this doc) are both silent until something downstream reads the wrong signal. Naming the exit contract per step, in the table, is the cheapest way to make the failure visible before it happens.
