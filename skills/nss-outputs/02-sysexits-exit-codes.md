# Exit codes and the sysexits.h vocabulary

**Source doc:** yubi-OS/yubiOS `skills/nss-outputs/SKILL.md` (ground source, fetched 2026-10-06). **Subtopic:** the exit-code channel: declared success and failure, the sysexits.h vocabulary, and why a generic exit 1 is an anti-pattern.

## Scope

The exit channel is the coarsest output a process gives its caller: 0 for declared success, non-zero for declared failure. The source doc requires more than that binary: a consumer must be able to route a failure to the right recovery path, which needs a small, stable exit-code vocabulary.

## The source doc vocabulary

The source doc prefers "a small sysexits-aligned vocabulary over a sprawling taxonomy" and lists it verbatim (source doc):

- `0` EX_OK
- `64` EX_USAGE
- `65` EX_DATAERR
- `66` EX_NOINPUT
- `69` EX_UNAVAILABLE
- `70` EX_SOFTWARE
- `74` EX_IOERR
- `75` EX_TEMPFAIL
- `77` EX_NOPERM
- `78` EX_CONFIG

Exit 0 means declared success, with nothing partial (source doc, guideline 2). The mapping between codes and recovery is what makes the vocabulary useful: EX_TEMPFAIL (75) marks a transient failure where "retry with backoff is safe" (source doc, example 1), while EX_USAGE (64) and EX_CONFIG (78) mark caller-fixable conditions that no retry can fix, and EX_SOFTWARE (70) marks an unexpected internal defect (source doc, examples 1 and 2).

## Primary sources on sysexits

The sysexits file predates most of the tooling around it. The OpenBSD manual page records that "Eric Allman invented the sysexits file in 1980" and that it "first appeared in 4.0BSD for use by the delivermail utility, later renamed to sendmail(8)" (https://man.openbsd.org/sysexits, weight 0.73, strong backing; corroborated by https://man.openbsd.org/OpenBSD-5.3/sysexits.3, weight 0.70, strong backing). The NetBSD manual page states the motivation directly: "It is not a good practice to blindly exit with the value 1 on all errors" and offers the sysexits constants as preferable exit codes for programs (https://man.netbsd.org/sysexits.3, weight 0.78, strong backing).

That 1980 motivation is exactly the NSS-outputs argument: a caller that sees only "1" cannot distinguish a usage mistake from a transient upstream failure, so it can neither fix the invocation nor retry it safely.

On exit-status mechanics, the OpenBSD `exit(3)` page notes that exit() calls _exit(2), and that "typically _exit(2) only passes the lower 8 bits of status on to the parent", so negative values have less meaning (https://man.openbsd.org/exit.3, weight 0.68, strong backing). Practical consequence: keep declared exit codes within 0 to 255, and remember that a shell pipeline reports the last command's status unless `set -o pipefail` is in effect.

Linux man-pages carry the same header as sysexits.h(3head) documenting the EX_* constants for POSIX-conforming systems (https://man7.org/linux/man-pages/man3/sysexits.h.3head.html, weight 0.39, weak backing).

## How the yubiOS examples use it

The source doc's shell-script example declares the full vocabulary in a header comment, one exit code per line with its meaning, and adds the partial-output policy next to it: `partial_output_on_failure: forbidden`, with an atomic write via mv(1) so any non-zero exit leaves no partial output file, and `idempotency: not_supported` because each invocation appends a record (source doc, example 1).

The Python example deviates deliberately in one place: `exit 2` for an argparse-rejected invocation, "uses argparse default", and documents the deviation instead of forcing argparse onto 64 (source doc, example 2). The verification checklist accepts a documented deviation: "Exit codes follow sysexits.h vocabulary (or document the deviation explicitly). Generic exit 1 for every failure is a NO verdict" (source doc, verification item 3).

The systemd example extends the vocabulary with `SuccessExitStatus=0 2`, where exit 2 means "already configured" and is deliberately promoted to a success outcome so an idempotent retry converges; the rationale must be documented when SuccessExitStatus is present (source doc, systemd surface and example 3).

## Red flags on the exit channel

The source doc's red-flag table calls out the exit-channel failure modes (source doc):

- A script emits the same exit code for validation and transient failures: sysexits.h is not used, and the consumer cannot route.
- A script exits 0 after committing partial output: the partial-output policy is forbidden but the implementation violates it.
- Generic exit 1 for every failure (anti-patterns section).

## What to declare, minimum

For a script or command, the exit-channel declaration must state (source doc):

1. The complete set of exit codes and one-line meanings.
2. Which code means "retry is safe" (EX_TEMPFAIL) versus "caller must fix" (EX_USAGE, EX_CONFIG).
3. The partial-output policy that pairs with non-zero exits.
4. Any deviations (argparse exit 2, SuccessExitStatus promotions) and their rationale.

A consumer that can read those four lines can wire correct automation without ever reading the implementation. That is the exit channel doing its job in the seven-channel taxonomy.
