# 07 - Edge device constraints

Scope: router-class hardware constraints that bound any additional service: RAM and flash budgets, OOM behavior, swap-less operation, and the memory lessons from existing OpenWrt services.

## The 4/32 floor and why RAM is the binding constraint

OpenWrt's own guidance marks devices with 4 MB flash and 32 MB RAM as effectively obsolete, with an explicit warning page. The documented reasoning: the 32 MB RAM limit is harder than the flash limit, the then-current 5.4 kernel barely works on a 32 MB system, and spikes in memory consumption can easily crash the router with out-of-memory errors (source: https://openwrt.org/supported_devices/432_warning, jev weight 0.9080). For any decision about adding a long-running daemon to a router, this is the anchor fact: the failure mode of an oversized service is not slowdown, it is a kernel OOM kill of the wrong process, or a full device hang.

Modern OpenWrt targets are better provisioned, but the same discipline applies: the base system already consumes a fixed share of RAM, and every resident daemon competes with the wireless stack, connection tracking, and DNS/DHCP for the remainder.

## No swap means the ceiling is real

Consumer routers generally have no swap and no option to add it. A real-world report of OOM kills on a low-RAM OpenWrt router running a tunnel service notes that the router has no swap capability, since there is no USB available (source: https://github.com/erebe/wstunnel/issues/465, jev weight 0.7608). Without swap, there is no soft landing: memory pressure converts directly into OOM kills. This is the single biggest structural difference between sizing a service on a server and sizing one on a router.

The kernel side has the same character. A case study of Wi-Fi driver memory pressure on an IPQ807x mesh shows that halving driver ring buffer sizes took a 4 node mesh from locking up during a single stream to hours of stable streaming; the fix was a small OpenWrt patch capping the footprint (weak backing, https://github.com/enspect/ath11k-ipq807x-rx-buffer-oom-fix, jev weight 0.3966). The lesson generalizes: on these devices, per-connection or per-buffer kernel allocations are the thing that actually runs the device out of memory, and capping them explicitly is the proven remedy.

## What existing services teach about memory ceilings

The banIP service, which maintains nftables sets of blocked addresses, documents the pattern of an OpenWrt service that must budget memory deliberately. Its documentation covers realtime response, set management, and false-positive control as first-class concerns (source: https://openwrt.org/docs/guide-user/services/banip, jev weight 0.9011 and 0.8952). Community reports show the failure mode in practice: memory usage spikes occur when banIP initially loads its lists, distinct from steady-state usage (weak backing, https://forum.openwrt.org/t/high-memory-usage/210766?page=2, jev weight 0.0213, and https://forum.openwrt.org/t/high-memory-usage/144718, jev weight 0.0375).

The transferable design rules from that ecosystem:

- Bound worst-case memory at configuration time, not runtime: set sizes, client ceilings, and buffer counts are all explicit config.
- Beware startup spikes: loading large state at service start is a distinct OOM window from steady-state operation.
- Keep logging volume proportional and capped, because log storage competes for the same constrained resources.

## Where endlessh sits against these constraints

Endlessh's own profile helps here: single-threaded, event driven, minimal per-connection state, and an explicit client ceiling that stops accepts at the configured limit (source: https://github.com/skeeto/endlessh, jev weight 0.9273 and 0.9624). Its active minimization of per-socket receive buffers directly addresses the kernel-allocation failure mode described above. The client ceiling is the operator-facing version of the same discipline: it is a config knob bounding the worst case.

What the wrapper around it must add, per the constraint picture:

- A conservative default client ceiling, far below the upstream default of 4096, sized to the device class.
- Log retention caps, because syslog volume on flash-based routers is a resource concern, not just a privacy one.
- A startup path that does not allocate large state, which endlessh satisfies by construction.
- Awareness that the tarpit's kernel connection state scales with admitted clients, which is why the ceiling, not RAM measurements, is the tuning interface.

## Evaluation criteria this yields for edge services

A deception service is a good edge fit when: its worst case is configuration-bounded; it has no startup spike; it does not store payloads; its logging is optional and rate bounded; and it degrades by refusing new work (stop accepting) rather than by growing. Endlessh meets the first 4 by design and the last by its MaxClients behavior. The residual risk on any specific router is not the tarpit itself but the sum of resident daemons, which is why the deployment decision should be made against the target device's free RAM after the base system is measured, not against vendor specifications.
