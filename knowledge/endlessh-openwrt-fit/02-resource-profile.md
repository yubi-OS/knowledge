# 02 - Resource profile

Scope: endlessh runtime resource profile: memory, CPU, connection model, MaxClients behavior, the SO_RCVBUF guard, and what all of it means for embedded routers.

## Design goal: negligible steady-state cost

Endlessh is built around the assumption that most of its life is spent doing nothing. The implementation is described as having minimal memory usage where each client connection requires only a small client structure, low CPU utilization where most of the time is spent waiting in poll(), and a minimal receive buffer setting (weak backing, from the third-party DeepWiki analysis of the upstream source at https://deepwiki.com/skeeto/endlessh, jev weight 0.2026, and https://deepwiki.com/skeeto/endlessh/6-performance-considerations, jev weight 0.3403). The primary repository itself documents the same shape: one standalone C binary, no daemonization machinery, no crypto libraries, event driven I/O (source: https://github.com/skeeto/endlessh, jev weight 0.9624 and 0.9273).

The bandwidth cost is also structurally small. The tarpit sends one banner line per configured delay interval per connected client. With the default 10000 ms delay and a 32 byte maximum line length, a client costs on the order of 3 bytes per second of actual payload, plus TCP overhead. The real cost is connection state, not throughput.

## The connection model and MaxClients

Endlessh supports a bounded number of concurrent clients. The upstream default for MaxClients is 4096, configurable in the config file (source: https://github.com/skeeto/endlessh, jev weight 0.9273; corroborated by the Ask Ubuntu report showing a stock config of Delay 10000, MaxLineLength 32, MaxClients 4096, LogLevel 0, BindFamily 0 at https://askubuntu.com/questions/1471717/tarpit-endlessh-monitors-port-2222-instead-of-port-22, weak backing, jev weight 0.0438).

The important behavior is at the ceiling: when MaxClients is reached, the main loop stops accepting new connections until an existing client disconnects (source: https://github.com/skeeto/endlessh, jev weight 0.9273, from the upstream implementation). This is a deliberate resource guard. It means the worst case memory footprint is bounded by a per-client structure times the configured ceiling, and it means an operator can cap the tarpit's worst case explicitly. For embedded routers the ceiling is the primary tuning knob: a small router should run a ceiling 1 or 2 orders of magnitude below 4096.

## The SO_RCVBUF guard

Tarpit clients do not send useful data, but a TCP connection still has a receive buffer, and 4096 stalled connections with default buffer sizes would allocate real memory on a small router. Endlessh sets a very small SO_RCVBUF on client sockets specifically to reduce receive buffer pressure (source: https://github.com/skeeto/endlessh, jev weight 0.9273, from the upstream implementation). SO_RCVBUF is the per-socket kernel receive buffer that holds data until the application reads it (source: https://learn.microsoft.com/en-us/windows-hardware/drivers/network/so-rcvbuf, jev weight 0.8458, a primary vendor reference on the socket option itself). Shrinking it per socket is the correct mechanism for bounding per-connection kernel memory, which is exactly the failure mode that would otherwise hurt on an embedded target.

## What is actually measurable

Per-connection memory is small, CPU is dominated by the poll wait, and network output is throttled by the delay knob. The remaining risks on a router are the ones endlessh does not control:

- Kernel-level connection state for however many clients are admitted (file descriptors, sockets), which scales with the MaxClients ceiling, not with endlessh's own structures.
- Log volume if verbose logging is enabled during a scan; each accept and close becomes a syslog line.
- Syslog handling on the router itself, which is a separate consumer of RAM and flash that the operator must size.

None of the dig results provide concrete RSS measurements on OpenWrt hardware, so any specific memory figure for a router deployment would be unsupported. What is supported is the structural claim: cost is bounded by configuration (client ceiling, delay, line length), and the implementation actively minimizes the two kernel-side costs it can control, per-connection buffers and accept pressure (source: https://github.com/skeeto/endlessh, jev weight 0.9624; weak backing for the per-structure detail at https://deepwiki.com/skeeto/endlessh/6-performance-considerations, jev weight 0.3403).

## Evaluation for edge devices

For router-class hardware the profile is favorable: a single small binary, event driven, no threads, bounded worst case through configuration, and explicit kernel buffer minimization. The open question for any specific device is empirical: what client ceiling keeps file descriptors and logging comfortable on the target's RAM. That is a per-device test, not a property of the tarpit.
