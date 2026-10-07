# 05: Error-contract catalogs: sysexits.h, errno, and the native-signal rule

Scope: the exit-code and errno catalogs the source doc binds failure modes to, and the rule that a consumer must be able to route a failure without reading the implementation.

## The rule: preserve the native signal

Guideline 5 in the source doc: errno, exit code, exception type, and HTTP status are the upstream contract. Map them to the project taxonomy; do not erase them. exit 1 for every failure is the worst-case error contract, because a consumer that cannot tell validation errors from transient failures from internal defects cannot route the failure to the right recovery path [source doc].

The red-flag table makes exit 1 for every failure an observation that means sysexits.h is not used [source doc, Red flags], and the anti-patterns section calls it out directly: use sysexits.h or document the deviation [source doc].

## sysexits.h: the BSD catalog

sysexits.h is a catalog of pre-defined exit codes that some commands use to describe the nature of a failure condition; the FreeBSD manual page describes it as legacy exit status codes for system programs (weight 0.85, https://man.freebsd.org/cgi/man.cgi?sysexits) [primary]. The catalog is documented across the BSD family: OpenBSD sysexits(3) (weight 0.84, https://man.openbsd.org/sysexits), NetBSD sysexits(3) (weight 0.86, https://man.netbsd.org/sysexits.3), and the Ubuntu manpage for sysexits.h (weight 0.68, https://manpages.ubuntu.com/manpages/noble/man3/sysexits.h.3head.html) [primary].

Values the source doc uses in its examples are defined in these pages: EX_NOINPUT (66), an input file could not be opened or read; EX_NOPERM (77), insufficient permission, which the BSD pages explicitly say is not intended for filesystem problems (those should use EX_NOINPUT or EX_CANTCREAT) but for higher-level permissions; EX_PROTOCOL (76), the remote system returned something not possible during a protocol exchange; and EX_CONFIG (78), something found in an unconfigured or misconfigured state (weights 0.84 and 0.86, OpenBSD and NetBSD sysexits(3)) [primary].

The catalog has crossed the platform line: Linux man-pages now ships sysexits.h(3head), dated 2025-09-21 in man-pages 6.19 (weight 0.74, https://www.man7.org/linux/man-pages/man3/sysexits.h.3head.html) [primary]. A project on a Linux base can therefore use the BSD catalog and cite the same page family as its contract.

## errno: why the numbers do not travel

The errno(3) Linux man page records the portability trap: the error numbers that correspond to each symbolic name vary across UNIX systems and even across architectures on Linux, so numeric values are not portable; programs must use the symbolic names, and perror(3) or strerror(3) convert names to text (weight 0.92, https://www.man7.org/linux/man-pages/man3/errno.3.html) [primary].

This is the mechanical reason behind the source doc's detection-field discipline: a detection signal recorded as a bare number will not survive an architecture change or a cross-platform port. The detection field should carry the symbolic name (ENOENT, EACCES, ENOSPC) plus the observable artifact (exit code, log line, exception).

## Mapping errno to exit codes in practice

The source doc's shell example pairs them: an absent input file exits 66 (EX_NOINPUT) with a stderr line naming the missing path; a mid-run permission failure exits 77 (EX_NOPERM) with EACCES in stderr [source doc, Example 2]. A mid-run filesystem error and a top-level permission denial therefore land on different exit codes and different errno names, and a consumer can route each one.

A Linux errno reference table exists as a convenience index (Chromium OS developer library, weight 0.45, https://www.chromium.org/chromium-os/developer-library/reference/linux-constants/errnos/) [weak]; treat such tables as lookup aids, with errno(3) and the sysexits(3) pages as the citable contracts.

## What the catalog buys the failure-mode table

With the catalog in place, the record schema's detection field becomes checkable: every row's detection either names a real exit code, errno, exception, log line, metric, or invariant, or the row must declare an evidence_gap [source doc, Constraints; Verification point 4]. That is the difference between a failure-modes section that routes an operator and one that merely reassures them.
