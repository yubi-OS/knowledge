# 02. The real upstream state of DRM device-memory accounting

Scope: what actually exists upstream for per-device GPU memory accounting as of the skill's mid-2026 snapshot, what never existed, and what that means for a Panfrost-based design.

Primary source: yubi-OS/yubiOS skills/drm-gpu-quota-secure-time/SKILL.md (the "source doc").

## What does not exist

There is no merged "drmcg" controller and no `drmcg_try_charge()` / `drmcg_uncharge()` kernel functions (source doc, section 1). Those names came from 2021 to 2023 RFC threads (`drmcg`, exposing `drm.max`/`memory.max`) that were abandoned in favor of a redesign. The source doc's instruction is blunt: do not build against those symbols.

The dig record confirms the RFC lineage is real, which is what makes it dangerous: the 2023 RFC patch series genuinely introduced `drmcg_try_charge`, described as the call a driver uses to check whether it can allocate a chunk of memory, alongside a device registration call (jev 0.68, https://lkml.iu.edu/hypermail/linux/kernel/2305.0/01904.html). An earlier LWN thread covered the original "new cgroup controller for gpu/drm subsystem" proposal in the context of existing controllers such as cpu, memory, io, and rdma (jev 0.56, https://lwn.net/Articles/812540/). So the invented-looking names were real RFC symbols; the trap is that RFC symbols are not shipped-kernel symbols.

## What is live: the "dev" controller

The live effort is the generic `dev` cgroup controller (also called `devcg`), distinct from the old device-access `devices` controller (source doc, section 1). Its patchset is titled `kernel/cgroup: Add "dev" memory accounting cgroup` and circulated on the dri-devel list, most recently revised late 2024/2025. The source doc is explicit that it is not in mainline as of that writing and is a moving target: re-check `lore.kernel.org/dri-devel` before depending on exact field names.

The dig record corroborates both the revision cadence and the rename. A November 2024 posting of "PATCH 1/7 kernel/cgroup: Add "dev" memory accounting cgroup" is on the dri-devel archive and shows the interface shape: `dev.region.current` as a read-only file describing current resource usage, with values keyed like `drm/0000:03:00.0 vram0=8514437120 stolen=67108864` (jev 0.59, https://lists.freedesktop.org/archives/dri-devel/2024-November/477635.html). A later LWN submission record for the same patchset notes that documentation was added for each call and that the renaming from drm cgroup to dev cgroup was integrated based on Maxime Ripard's work, with testing against dma-buf heaps and v4l2 as well as DRM (jev 0.61, https://lwn.net/Articles/995312/).

## Interface shape, subject to change

Per the source doc, the interface is nested-keyed files under `/sys/fs/cgroup/`: `dev.region.max`, `dev.region.current`, and `dev.region.capacity`, keyed by a device-plus-region string (for example `drm/0000:03:00.0 vram0=...`), not a flat `dev.memory.max`. The dig example above matches that shape (jev 0.59, https://lists.freedesktop.org/archives/dri-devel/2024-November/477635.html). The source doc warns the shape is subject to change pre-merge.

## The parallel DRM scheduling cgroup

A separate, parallel effort is the DRM scheduling cgroup controller: an RFC v8 from Tvrtko Ursulin, September 2025, still in flight per the source doc. The dig record shows this controller concerns how DRM-scheduler-based drivers wire into cgroups, with example wiring for amdgpu (scheduler-based) and a more involved variant for firmware-scheduler drivers such as Intel Xe (jev 0.53, https://lwn.net/Articles/1036627/). This is a scheduling-time resource problem, not a memory-quota one; the two efforts are complementary but distinct.

## Why TTM matters, and the Panfrost implication

The `dev` controller is aimed at drivers with distinct memory regions, which in practice means TTM-based drivers such as Xe and AMDGPU (source doc, section 1). The DRM memory-management documentation describes the two core memory managers: TTM, the first DRM memory manager, designed as a one-size-fits-all solution, and GEM (jev 0.89, https://docs.kernel.org/gpu/drm-mm.html). Panfrost sits on the GEM/shmem side and does not yet have a wired region for the controller to key on.

The source doc's conclusion for yubiOS on Rockchip: do not block a v0 GPU-quota design on this controller landing or applying cleanly to Panfrost. Build the own-accounting hook described in section 3 of the source doc now, and plan to swap to the upstream controller later if and when Panfrost gains a `dev` region.

## Re-check protocol

Because none of this is merged, every field name and file name in this doc is provisional. The re-check procedure in doc 08 of this corpus lists the dri-devel search and the other pre-implementation checks. Treat this doc's interface names as a snapshot with a short shelf life, dated to the source doc's mid-2026 framing.
