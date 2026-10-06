# Consistency Flags

Scope: the four standing corrections the maintainer playbook keeps live against the rest of the corpus. Grounding spine: source doc (yubi-OS/yubiOS docs/MAINTAINER.md). External mechanisms (systemd directive naming, v261 release) are dig-backed; this subtopic's dig came back strong, so it is kept under the marginal rule.

## Flag 1: the filesystem-restriction directive name

The source doc states: `RestrictFileSystems=` is the existing BPF-LSM filesystem-type limiter, not the systemd v261 addition. Version v261 introduced `RestrictFileSystemAccess=`.

Dig grounding: the upstream directive index at freedesktop.org lists the configuration directives for current systemd and is the canonical lookup surface for exact directive names (weight 0.9, https://www.freedesktop.org/software/systemd/man/latest/systemd.directives.html). The kernel's BPF LSM documentation confirms the mechanism class involved: BPF programs attach to LSM hooks to implement system-wide MAC policies (weight 0.9, https://docs.kernel.org/bpf/prog_lsm.html). A Kinvolk engineering post documents that `RestrictFileSystems=` is implemented by attaching an eBPF program of type `BPF_PROG_TYPE_LSM` to the `file_open` hook at boot time, staying attached until shutdown (weight 0.4, weak, https://kinvolk.io/blog/2021/02/extending-systemd-security-features-with-ebpf). The v261 release itself is covered by LWN, which lists a long change set including the new Instance Metadata Service subsystem, boot secret support for systems lacking a physical TPM, and Live Update Orchestration / Kexec Handover support (weight 0.61, https://lwn.net/Articles/1078708/), and by Phoronix (weight 0.23, weak, https://www.phoronix.com/news/systemd-261). The systemd NEWS file carries release notes for current releases (weight 0.88, https://github.com/systemd/systemd/blob/main/NEWS).

The flag exists because the two names differ by one word and one is an existing BPF-based limiter while the other arrived in v261. Docs that mix them misstate both the mechanism (BPF LSM versus a different restriction surface) and the version boundary.

## Flag 2: PINNED.md is the live digest source

The source doc states: `PINNED.md` is the live digest source. Historical digests in ADRs and old workflow logs are not current pins. This flag is the pointed application of the source-of-truth map to the most drift-prone artifact in the repo: digests get bumped, and every older document that quoted a digest silently goes stale. The release-hygiene section reinforces it by requiring digest bumps to update `PINNED.md` itself.

## Flag 3: ARM64 is primary

The source doc states: ARM64 is primary for the owner-owned root-of-trust thesis; x86-64 is supported and secondary. This is an architecture-priority statement, not a support statement: both architectures work, but the project's central thesis (root of trust owned by the owner, as realized through the YubiKey-centric design) is argued and validated on ARM64 first. Docs and planning notes should frame work in that order.

## Flag 4: test images stay isolated

The source doc states: TEST-only swu2f/dev images must remain isolated from production tags. Publication classification is handled more fully by the release-hygiene rules (new artifacts need explicit production/test classification before publication), but the flag keeps the standing case visible: the swu2f/dev image family exists for testing only and must never blend into the production tag namespace.

## Why flags are kept in the playbook

The four flags share a shape: each is a place where a plausible but wrong reading of the corpus is likely, and each is cheap to state. Keeping them in the maintainer playbook means any maintainer or agent reading the doc inherits the corrections without re-deriving them, and the research cycle's step 2 (gather primary upstream sources for claims that may have changed) is the tool for refreshing them when upstream moves.
