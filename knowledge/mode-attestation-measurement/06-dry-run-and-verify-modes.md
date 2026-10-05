# Dry-run and verify-only modes: what each proves about the artifact, not the machine

Scope: the dry-run family, sbverify --list, veritysetup verify, CHIPSEC's module result vocabulary, and Tetragon's policy validation, with the dividing line between what a dry-run proves in CI and what it cannot prove about a booted system.

## The pattern

Every one-shot verifier in the chain has a mode that examines an artifact without enforcing anything: a listing mode, a userspace-only verification, a schema check. These modes exist so CI can exercise the same logic the boot path will use, without booting. Their common property: they prove properties of the artifact (well-formed, signed, matching a hash) and nothing about the machine that will later run it.

## sbverify --list versus --cert

`sbverify --list <image>` parses the UEFI image and lists all signatures but does not verify them; `--cert <certfile>` performs the actual cryptographic verification against a certificate (Arch sbverify man page, weight 0.85: https://man.archlinux.org/man/sbverify.1). The Debian man page states the same split: --list lists all signatures without verifying, --no-verify skips certificate verification, --detached reads the signature from a sidecar file (Debian sbsigntool man page, weight 0.91: https://manpages.debian.org/bookworm/sbsigntool/sbverify.1.en.html).

What --list proves: the image carries a signature table, with which issuers and how many signatures. What it cannot prove: that any of those signatures chains to a key you trust. In CI, --list is an inventory check and --cert is the gate. An unsigned or re-signed image can pass --list and fail --cert, which is the entire difference between the two modes.

## veritysetup verify: userspace only

`veritysetup verify` performs verification in userspace and creates no kernel device (Ubuntu veritysetup man page, weight 0.89: https://manpages.ubuntu.com/manpages/xenial/man8/veritysetup.8.html). This is the dry-run of the dm-verity path: the CI job confirms the hash device and root hash are mutually consistent, and the boot path later enforces the same relationship inside the kernel (kernel.org dm-verity guide, weight 0.90: https://www.kernel.org/doc/html/latest/admin-guide/device-mapper/verity.html). The gap between the two runs is the gap between artifact and machine: verify passes in CI, and the boot still fails if the kernel command line carries a different root hash or the devices are swapped.

## CHIPSEC: result vocabulary and exit bitmask

CHIPSEC is a framework for analyzing platform security, including hardware, firmware, and platform components (chipsec GitHub, weight 0.96: https://github.com/chipsec/chipsec). Its batch mode has a documented per-module result vocabulary: PASSED means a mitigation was detected, FAILED means a known vulnerability was detected, WARNING marks an inconclusive result needing manual analysis, ERROR marks a framework problem, plus NOT_APPLICABLE and INFORMATION (CHIPSEC docs, Interpreting Results, weight 0.74: https://chipsec.github.io/usage/Interpreting-Results.html).

The whole-run exit code is a bitmask over all run modules: bit 0 SKIPPED, bit 1 WARNING, bit 2 DEPRECATED, bit 3 FAIL, bit 4 ERROR, bit 5 EXCEPTION, with 0 meaning clean (chipsec_main.py source, weight 0.47, weak backing: https://github.com/chipsec/chipsec/blob/272a3c7cf8435a341dc9083f1f1c60349bab9322/chipsec_main.py). The bitmask is the machine-readable summary that a provisioning script gates on: any FAIL bit blocks provisioning.

The dry-run shape here is enumerating and validating modules rather than executing the checks, and the DEPRECATED result exists precisely because module APIs age: a module that no longer inherits BaseModule reports DEPRECATED instead of running (CHIPSEC docs, weight 0.74: https://chipsec.github.io/usage/Interpreting-Results.html).

## Tetragon: validation at decode

Tetragon validates TracingPolicy YAML when it decodes it, and standalone Tetragon now applies the same validation and defaulting as the Kubernetes CRD path, so a policy passed at startup or loaded through the tetra gRPC CLI is schema-checked before it takes effect (cilium/tetragon PR 1521, weight 0.40, weak backing: https://github.com/cilium/tetragon/pull/1521). This puts the "dry-run" inside the daemon: the validation step exists, but it is coupled to the daemon's own load path rather than being an independent CI command.

## What the dry-run cannot prove

The shared limitation is the boot gap. A dry-run proves the artifact is internally consistent and passes the same algorithm the enforcement path will use. It cannot prove that the booted system loaded this artifact, that the firmware's keys match CI's keys, or that a daemon actually attached the policy it validated. Closing that gap is the job of the other modes: the one-shot at boot refuses to proceed, the daemon streams evidence, and the quote answers "prove it now". A corpus that documented only the dry-run modes would document CI and silently omit everything that happens after boot.
