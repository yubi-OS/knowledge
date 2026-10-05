# mode-container-isolation

Knowledge corpus minted 2026-10-05 from `yubi-OS/yubiOS refs/mode-container-isolation-2026-09-01.md`. Topic: isolation boundaries by execution mode, how container, nspawn, VM, and unit modes differ in what they isolate and which threats each boundary answers.

## Docs

| NN | Doc | Scope |
|---|---|---|
| 01 | [01-container-isolation-basics.md](01-container-isolation-basics.md) | What a rootless podman-style container isolates: namespaces, cgroups, seccomp, and which threats the container wall answers. |
| 02 | [02-nspawn-ephemeral-mode.md](02-nspawn-ephemeral-mode.md) | systemd-nspawn as a boundary: user namespace mapping, ephemeral overlay mode with boot-in-container, discard-at-exit semantics. |
| 03 | [03-vm-boundary-kvm.md](03-vm-boundary-kvm.md) | The VM boundary (QEMU/KVM): what it isolates that containers cannot, and how the default libvirt NAT network shapes VM exposure. |
| 04 | [04-unit-sandbox-directives.md](04-unit-sandbox-directives.md) | The systemd unit sandbox as a persistent-daemon boundary: SystemCallFilter, PrivateTmp, RuntimeDirectory, ProtectSystem, NoNewPrivileges. |
| 05 | [05-mode-semantics-cleanup.md](05-mode-semantics-cleanup.md) | Execution modes (one-shot, ephemeral, persistent, destructive one-shot) and what each implies for lifetime, cleanup ownership, and exit propagation. |
| 06 | [06-mode-hazards-idempotency.md](06-mode-hazards-idempotency.md) | Mode-specific hazards: state leaks after interrupted cleanup, restart-state loss under transient directories, and confirmation gates on destructive installs. |
| 07 | [07-privilege-crossings.md](07-privilege-crossings.md) | Privilege model across modes: rootless as the container/nspawn constant, VM escalation, and seccomp applied per row. |
| 08 | [08-observers-and-secrets.md](08-observers-and-secrets.md) | Where runtime-security observers (Falco, Tetragon) run relative to the boundaries, eBPF visibility limits, and the hardware-secret placement gap. |

## Research summary

- Results collected: 108 (96 first pass + 12 from one redo of doc 08).
- Weight split: 51 results at weight >= 0.5 (authoritative), 57 below 0.5 (weak, labeled in text). 0 unweighted.
- Jev requests: 25 total (1 preflight probe, 1 outline validation, 20 weighting batches, 3 redo weighting batches, 1 probe question inside preflight). Usage: 18703 input tokens, 0 output tokens as reported by the endpoint.
- Redo counts: doc 08, 1 redo with 2 replacement queries after the first pass returned only 1 primary source.
- Skipped docs: none. All 8 outline subtopics scored load-bearing or marginal-with-strong-dig and were authored.

Weak-backing discipline: every claim carries its source URL and weight; claims backed only below 0.5 are labeled weak in the text, and unsourced claims were deleted rather than softened. Project-specific items without web grounding (bcvk rc=77 skip semantics, the YubiKey exclusion across boundaries, bcvk privilege requirements, podman default seccomp profile contents) are recorded as explicit open gaps in the relevant docs.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
