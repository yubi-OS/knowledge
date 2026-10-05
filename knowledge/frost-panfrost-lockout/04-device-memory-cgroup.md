# Device memory cgroup accounting

Scope: the cgroup v2 dmem controller for device memory regions and DRM/TTM memory accounting, and why Panfrost dmem accounting is unproven prototype work rather than an existing dependency.

## What the dmem controller is

The dmem controller regulates the distribution and accounting of device memory regions. Because each region may have its own page size that need not match the system page size, all units are bytes (source: https://docs.kernel.org/admin-guide/cgroup-v2.html, jev weight 0.86). Kernel configuration databases describe the same controller as allowing compatible devices to restrict device memory usage based on the cgroup hierarchy, with VRAM usage for DRM applications given as the example (source: https://cateee.net/lkddb/web-lkddb/CGROUP_DMEM.html, jev weight 0.35, weak backing).

The driver-facing API is registration based: drivers register a dmem cgroup region with dmem_cgroup_register_region and later unregister it; unregistration drains in-flight reclaim callbacks before returning so the caller can safely free the registered resources (source: https://docs.kernel.org/next/core-api/cgroup.html, jev weight 0.76). The DRM documentation mirror carries the same API text (source: https://dri.freedesktop.org/docs/drm/core-api/cgroup.html, jev weight 0.47, weak backing).

## Which drivers implement it

The controller landed with a driver adoption story that does not include Panfrost. LWN's patch index for the series records the components: kernel/cgroup adds the dmem memory accounting cgroup, drm/ttm handles cgroup based eviction in TTM, drm/xe implements cgroup for vram, and drm/amdgpu adds a cgroups implementation (source: https://lwn.net/Articles/1000744/, jev weight 0.79). On the TTM side, when a dmem cgroup region is valid, TTM stores it in the memory manager's cg field so that TTM can look up the associated pool during charging and eviction-target selection; a NULL region detaches it (source: https://docs.kernel.org/gpu/drm-mm.html, jev weight 0.77). The mainline DRM memory management documentation describes the two underlying managers: TTM as the memory manager for accelerator devices with dedicated memory, and GEM for shmem-backed buffer objects (source: https://www.kernel.org/doc/html/latest/gpu/drm-mm.html, jev weight 0.77). A generated wiki overview of GEM and TTM scored below threshold (source: https://deepwiki.com/allbilly/linux_drm/2.2-gem-memory-management-and-ttm, jev weight 0.13, weak backing).

## The Panfrost gap

Current Panfrost memory evidence is GEM/SHMEM-oriented. Panfrost allocates buffer objects through its GEM paths and has no observed dmem region registration in the controller documentation or driver evidence reviewed in this pass. The dmem documentation's region-keyed control files are shown only for an Intel xe example region; no Panfrost region appears. This matches the source design's determination: device-memory cgroup accounting for Panfrost is not proven and must be treated as prototype work, not an existing dependency.

What a Panfrost dmem implementation would need, based on the pattern above: a dmem_cgroup_register_region call for the GPU's memory region, charging on BO create and import, uncharging on free, and TTM-style pool integration only if Panfrost ever moves onto TTM. The PRIME import path needs a dedicated pass in any such design so imported buffers cannot bypass accounting.

## Consequences for the lockout stages

Because dmem accounting does not exist for Panfrost today, memory-based lockout triggers (GPU buffer usage exceeding a per-cgroup limit) cannot be claimed as a current capability. The staged design therefore keys its current claims on submit-path gating and device access control, and treats memory accounting as a later prototype with its own proof obligation.
