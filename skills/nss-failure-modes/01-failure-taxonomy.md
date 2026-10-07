# 01: The fourteen-channel failure taxonomy

Scope: what the NSS Failure-modes axis treats as the complete failure surface of any file, script, unit, workflow, or API operation, organized as 14 fixed channels.

Grounding: this subtopic is an internal-record subtopic, no dig. Every claim below is grounded in the source doc (yubi-OS/yubiOS skills/nss-failure-modes/SKILL.md) and cites it as the source of record.

## The question the axis asks

The Failure-modes axis (7 of 12 in the negative-skill-space sweep) asks three questions about every artifact: what can go wrong here, how would I know, and what would I do about it. The source doc states the discipline bluntly: a file that documents only its happy path is a file whose recovery path is recoverable only by reading its postmortem history [source doc].

## The 14 channels

The source doc fixes the channel vocabulary. For every file, script, skill, container, workflow, unit, or API operation, Failure modes records the complete surface a caller can fall into, sorted into these channels:

1. Boundary failure: parse or validate rejects, malformed input, absent input, wrong-version input, partial input.
2. Authorization and permission: missing scope, expired credential, wrong principal, rootless-vs-root surprise, capability drop vs denial.
3. Filesystem and IO: ENOENT, EACCES, ENOSPC, EIO, EISDIR, ENOTDIR, EFBIG, EROFS, partial write, lost lock.
4. Process and signal: SIGTERM, SIGKILL, SIGINT, SIGHUP, child reaping, zombie, double-fork pid loss.
5. Network and RPC: timeout, connection refused, DNS failure, TLS handshake failure, partial response, body truncation.
6. Dependency: upstream unavailable, schema drift, version skew, deprecated API, library ABI mismatch.
7. Concurrency: race, deadlock, livelock, starvation, partial commit visible to readers.
8. Resource exhaustion: OOM, fd exhaustion, cgroup quota, disk quota, inode exhaustion, CPU throttle.
9. Time and clock: clock skew, leap second, monotonic clock vs wall clock, NTP step, SOURCE_DATE_EPOCH drift.
10. Configuration: invalid value, missing key, incompatible combination, env-var precedence surprise.
11. State invariant: precondition violated, postcondition not reached, idempotency violation, partial transition.
12. Observability failure: log lost, metric dropped, alert silencer, dashboard drift, telemetry tag absent.
13. Recovery failure: rollback broken, partial cleanup, orphaned temp file, lock leak, stale cache.
14. Security: privilege escalation, secret leakage, TOCTOU (CWE-367), injection, replay, downgrade.

[source doc for all 14 channel definitions]

## Why the channels are fixed

The source doc makes the channel names a constraint, not a menu: a value that arrives via a novel channel needs a new skill, not a new channel name [source doc, Constraints]. This is what makes sweeps comparable across cycles. When the cycle-14 lens scores a corpus, the failure_modes column of the lens corpus maps directly to this 14-channel taxonomy [source doc, Composition with curved-corpus-create].

## The raw signal is not the classification

A second structural claim from the source doc: raw failure, classified failure, and effective contract are three different things. The pipeline it prescribes is: fail, record the native signal (errno, exit code, exception), classify into the project taxonomy, emit a declared payload on a declared stream, declare a partial-output policy, then expose recovery. Detection and classification must never be folded together, and surprising signals must never be silently coerced into exit 1 [source doc].

## What this means for a sweep

When the 12-axis NSS sweep flags failure modes as the top Extend gap for a file, the closure patch is ONE file-type-aware Failure modes section that names at least one concrete row drawn from the relevant channels. A section that lists zero concrete rows is a placeholder and counts as a NO verdict in the cycle-14 verification checklist [source doc, Verification].

## Channel-to-field linkage

Channels and fields do different jobs in the record. The channel answers where a failure comes from; the record schema (doc 02) answers what gets written about it. A single file can produce rows in several channels at once: a build script whose upstream registry rotates digests produces a Dependency channel row, and if the failure alert is also missing, an Observability channel row with its own evidence_gap. Sweeps that score only one channel per file undercount the surface; the cycle-14 lens expects the failure_modes column to be able to hold multiple channels per file [source doc, What Failure modes covers and Composition with curved-corpus-create].
