# Runtime detection daemons: Falco and Tetragon as streaming services

Scope: Falco and Tetragon as the streaming runtime detection mode, their systemd lifecycle (Type=notify, restart on failure, SIGTERM clean stop), what a stream proves that a one-shot cannot, and the hazards specific to daemon mode.

## The mode

Runtime detection is a daemon mode with a streaming output contract. Falco monitors system calls and container behavior, and Tetragon is the Cilium project's eBPF-based security observability and runtime enforcement tool; both deploy as long-running agents that watch kernel activity continuously (RamNode guide, weight 0.28, weak backing: https://www.ramnode.com/guides/falco-tetragon; NomadX comparison, weight 0.18, weak backing: https://kubernetes.ae/falco-vs-tetragon/). Their primary source-backed behavior is event streaming: Tetragon emits events that all carry a process_exec block identifying the generating process, with TracingPolicy events carrying additional hook data (Tetragon docs, Events, weight 0.95: https://tetragon.io/docs/concepts/events/).

Tetragon's TracingPolicy is a user-configurable policy object that traces arbitrary kernel events and optionally defines actions on a match (Tetragon docs, Tracing Policy, weight 0.93: https://tetragon.io/docs/concepts/tracing-policy/). Writing such policies is programming against the kernel execution path: every policy hooks kernel functions, intercepts system calls, and examines kernel data structures (Cilium blog on kernel fundamentals for Tetragon, weight 0.90: https://cilium.io/blog/2025/09/16/kernel-basics-for-tetragon/).

## Lifecycle: notify, restart, stop

The source unit model for these daemons is systemd Type=notify: the daemon signals readiness when its BPF programs are attached, and systemd treats it as failed if it dies. A representative Falco systemd unit uses Restart=on-failure with RestartSec=15s (ansible-falco unit template, weight 0.14, weak backing: https://github.com/juju4/ansible-falco/blob/master/templates/systemd-falco.service.j2). Restart-on-failure is the right default, but it encodes an assumption that every non-zero exit is a failure to recover from, not a signal to stay dead. Falco's own crash history shows why the distinction matters: exit code 1 is associated with general application errors or health probe failures, and 139 with a SIGSEGV segmentation fault (falco issue 2476, weight 0.23, weak backing: https://github.com/falcosecurity/falco/issues/2476).

This is the failure class that hides in daemon mode: a daemon whose exit semantics are undocumented gets restarted in a loop by systemd and looks alive while measuring nothing. The detection surface is stdout/stderr and journalctl, not exit codes (Falco troubleshooting docs, weight 0.92: https://falco.org/docs/troubleshooting/start-up-error/). A restart loop is visible only if someone watches the journal.

## Validation inside the daemon mode

Because the daemon consumes policy files at runtime, policy validation is part of the daemon's contract rather than a separate CI step. Tetragon validates TracingPolicy YAML at decode time; standalone (non-Kubernetes) Tetragon now runs the same validation and defaulting as the Kubernetes CRD path, so a policy passed via daemon flags or loaded through the tetra gRPC CLI gets schema-checked before it takes effect (cilium/tetragon PR 1521, weight 0.40, weak backing: https://github.com/cilium/tetragon/pull/1521). Policies can be loaded and unloaded at runtime or applied at startup, with each loading method owning its own domain (Tetragon docs, reference, weight 0.75: https://tetragon.io/docs/reference/tracing-policy/), and the tetra CLI drives the daemon over its gRPC socket (Tetragon docs, package install, weight 0.80: https://tetragon.io/docs/installation/package/).

Falco supports hot reload via SIGHUP for configuration changes, but in some versions the SIGHUP handler fails to trigger a restart unless the config-file watcher thread is active (falco PR 3939, weight 0.40, weak backing: https://github.com/falcosecurity/falco/pull/3939). That is the same hazard in miniature: the daemon looks alive, the reload silently did not happen, and the rules in effect are not the rules on disk.

## What the stream proves that a one-shot cannot

A one-shot proves the state of specific bytes at one instant. A streaming daemon proves behavior over time: which processes executed, which syscalls they made, and whether a policy matched. The tradeoffs are the mirror image of the one-shot's. The stream has no total verdict, only events, so "the system is compliant" is never an output; and the daemon's own health is now part of the trust argument, because a dead or policy-less daemon proves nothing while looking operational. Continuous attestation therefore needs the daemon's liveness to be checked by something outside it (systemd, or a remote verifier polling it), which is the interaction covered in doc 09.
