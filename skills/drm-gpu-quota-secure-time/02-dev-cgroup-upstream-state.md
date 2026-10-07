Scope: where the real upstream work on DRM device-memory accounting stands, what interface shape it proposes, and why a Panfrost-based design must not block on it.

## The dead end: no merged drmcg

The source doc is categorical: there is no merged "drmcg" controller and no drmcg_try_charge() or drmcg_uncharge() functions in any shipped kernel ("source doc, yubi-OS/yubiOS skills/drm-gpu-quota-secure-time/SKILL.md (source doc)"). Those names came from 2021-2023 RFC threads that proposed a DRM cgroup controller exposing drm.max and memory.max, and the threads were abandoned in favor of a redesign. Building against those symbols is cargo-culting: they exist only in stale mailing-list prose and in LLM chat transcripts that quote it.

## The live effort: the generic dev cgroup

The live upstream effort is the generic "dev" cgroup controller, also called devcg, which is distinct from the old device-access "devices" controller ("source doc"). The dig corroborates that this is a real, active patch series: a 7-patch set titled "kernel/cgroups: Add 'dev' memory accounting cgroup" by Maarten Lankhorst was posted to dri-devel in October 2024 and revised in November 2024 (https://lists.freedesktop.org/archives/dri-devel/2024-October/475286.html, weight 0.24 weak; https://lists.freedesktop.org/archives/dri-devel/2024-November/477635.html, weight 0.27 weak; patchwork series https://patchwork.kernel.org/project/dri-devel/list/?series=902097, weight 0.42 weak). An LWN summary of the series lists its DRM-side members: cgroup-based eviction handling in TTM, a vram cgroup implementation for Xe, and a cgroups implementation for AMDGPU (https://lwn.net/Articles/995312/, weight 0.19 weak). That membership is exactly the shape the source doc predicts: the controller is aimed at TTM-based drivers with distinct memory regions.

One thread of the series' history is worth knowing before porting its ideas: the initial version borrowed its accounting code from the rdma and misc controllers, and the current version is a rewrite on top of a page counter using the same min/low/max semantics as the memory controller (https://www.mail-archive.com/dri-devel@lists.freedesktop.org/msg517166.html, weight 0.25 weak).

## The parallel scheduling cgroup

A separate effort, the DRM scheduling cgroup controller by Tvrtko Ursulin, proposes a weight-based hierarchical GPU usage budget, conceptually similar to the CPU weight model (https://lkml.org/lkml/2022/11/9/819, weight 0.48 weak; LWN coverage at https://lwn.net/Articles/937991/, weight 0.36 weak). The source doc records that this RFC reached v8 in September 2025 and is still in flight. The two efforts answer different questions: dev is about memory accounting, the scheduling cgroup is about GPU time. A quota design needs the first, not the second.

## Interface shape, and how final it is not

The proposed interface is nested-keyed files under /sys/fs/cgroup/: dev.region.max, dev.region.current, dev.region.capacity, keyed by a device plus region string such as "drm/0000:03:00.0 vram0=..." ("source doc"). This is explicitly subject to change pre-merge. The dig results do not confirm the exact file naming, and the source doc itself instructs re-checking lore.kernel.org/dri-devel for "dev cgroup" and "DRM scheduling cgroup" before depending on exact field names. Treat the naming as a design sketch, not an API contract.

The controller is not in mainline as of the source doc's mid-2026 snapshot ("source doc"). Nothing in the dig contradicts that.

## Implication for yubiOS on Rockchip

Panfrost has no discrete VRAM region: its GEM objects are backed by shmem, so there is no region for dev to key on once it lands ("source doc"). Even a merged dev controller would not apply cleanly to a Panfrost board until Panfrost grows a wired region. The practical directive from the source doc: do not block a v0 design on this controller landing or applying; build your own accounting hook now (the hook points are in doc 03) and plan to swap to the upstream controller later if Panfrost gets a dev region. The LWN summary's Xe/AMDGPU focus corroborates the "aimed elsewhere" reading, though at weak weight (https://lwn.net/Articles/995312/, weight 0.19 weak).
