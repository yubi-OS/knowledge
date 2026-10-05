# Userspace observability (Stage 1)

Scope: fdinfo and debugfs observability of open DRM files and engine usage, and the Stage 1 pattern of attributing suspected GPU load to a process or cgroup and then isolating or terminating the owner-selected process group from userspace.

## The standard interface

DRM drivers export partly standardized text output through fops->show_fdinfo() in the file operations registered with the DRM core (source: https://docs.kernel.org/gpu/drm-usage-stats.html, jev weight 0.92). The per-client stats include engine time counters: drm-engine-<keystr> holds a value in nanoseconds, with GPUs carrying multiple execution engines each identified by a unique key string (source: https://www.kernel.org/doc/html/v6.6/gpu/drm-usage-stats.html, jev weight 0.83). Newer kernel documentation adds cycle counters whose timestamp lives in GPU-unspecified units matching the update rate of drm-cycles-<keystr>, so engine utilization can be computed entirely in the GPU clock domain without considering CPU sleep time (source: https://docs.kernel.org/6.16/gpu/drm-usage-stats.html, jev weight 0.88). Older mirrors of the same documentation scored lower and are cited only as corroboration (source: https://mjmwired.net/kernel/Documentation/gpu/drm-usage-stats.rst, jev weight 0.27, weak backing).

## Panfrost implements it

The drm/Panfrost driver implements the DRM client usage stats specification, with documented example output showing the implemented key value pairs (source: https://docs.kernel.org/gpu/panfrost.html, jev weight 0.91). The fdinfo support patch series for Panfrost describes the concrete location: a series of key:value pairs under /proc/pid/fdinfo/fd for render processes that open the Panfrost DRM file, containing engine and memory region information readable by a privileged user (source: https://lwn.net/Articles/944282/, jev weight 0.77). One operational caveat matters for any polling agent: engine and cycle sampling are disabled by default because of power saving concerns, and fdinfo consumers must first toggle the driver's job profiling status before the values populate (source: https://www.kernel.org/doc/html/v7.3-rc2/gpu/panfrost.html, jev weight 0.72).

## Complementary tracing

Mesa ships tracing support beyond fdinfo: a systemwide pps-producer daemon collects global performance counters, and a per-process producer inside Mesa captures render-stage traces on the GPU timeline alongside CPU timeline events (source: https://github.com/omacom/mesa/blob/main/docs/perfetto.rst, jev weight 0.84). For attribution disputes, fdinfo answers who holds the GPU busy; Perfetto-style traces answer what they were doing.

## Stage 1 design

Stage 1 is userspace-only. A Frost agent enumerates open DRM files (via /proc and the fdinfo entries), reads per-client engine and memory counters, and attributes suspected load to a pid and its cgroup. When the owner's policy calls for isolation, the agent terminates or moves the owner-selected process group from userspace; the GPU driver itself is untouched. This stage inherits the same limitation that Stage 0 has: it acts on processes, not on the driver's job queue, so a process that re-opens the render node after Stage 0 denial should fail, but nothing in Stage 1 prevents an already-open fd from submitting.

## False-positive hygiene

Attribution quality decides whether lockout actions are safe. Mesa's own benchmarking guidance notes that reproducible timings on Mali systems require active cooling to eliminate thermal throttling (source: https://docs.mesa3d.org/drivers/panfrost/benchmarking.html, jev weight 0.67), a direct warning that clock and thermal effects can masquerade as workload anomalies. A Stage 1 agent must therefore treat engine-time evidence as one signal alongside reset counts and fault reports, and the test plan's false-positive case (benign GPU load must not trigger lockout) is the check that keeps this honest.
