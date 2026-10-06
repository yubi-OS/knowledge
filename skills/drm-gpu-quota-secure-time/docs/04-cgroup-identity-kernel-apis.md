# 04. Cgroup identity: real kernel APIs and the accounting pattern

Scope: the real cgroup v2 kernel APIs for identifying which control group a task belongs to, the invented names to avoid, and the cgroup-id-keyed accounting structure the skill recommends.

Primary source: yubi-OS/yubiOS skills/drm-gpu-quota-secure-time/SKILL.md (the "source doc").

## The invented names to reject

The chat-derived skeletons in the skill's source material used `task_cgroup(current, 0)` and a bare `get_cgroup(cg)`. The source doc states these are not the current cgroup v2 kernel API surface (source doc, section 3). They are exactly the kind of plausible names the skill exists to catch; doc 01 of this corpus covers the general discipline.

## The real pattern

As of recent kernels, the idiomatic pattern for cgroup v2 default-hierarchy membership is via `task_css_set()` / `task_dfl_cgrp()` / `cgroup_id()`, with `cgroup_get()` / `cgroup_put()` for refcounting (source doc, section 3). The source doc immediately qualifies this: confirm the exact names for the target kernel major version before committing to a design, and do not trust either the skill or an LLM chat log as the final source; check `include/linux/cgroup.h` in the actual tree being built against.

The surrounding architecture is stable and well documented. A `css_set` contains a set of reference-counted pointers to `cgroup_subsys_state` objects, one for each cgroup subsystem registered in the system, and there is no direct link from a task to the cgroup it belongs to in each hierarchy; membership is determined by following pointers through the `cgroup_subsys_state` objects (jev 0.86, https://www.kernel.org/doc/html/v5.4/admin-guide/cgroup-v1/cgroups.html). A third-party writeup of cgroup internals confirms the same shape from the other direction: `task_struct` has a `cgroups` field pointing to a `struct css_set` that contains the process's cgroup information (jev 0.08, weak backing, https://terenceli.github.io/%E6%8A%80%E6%9C%AF/2020/01/05/cgroup-internlas).

## Why the default hierarchy matters

In cgroups v2, all mounted controllers reside in a single unified hierarchy, and a v2 controller is available only if it is not currently in use via a mount against a cgroup v1 hierarchy (jev 0.76, https://man7.org/linux/man-pages/man7/cgroups.7.html). The v2 API differs from v1, so applications that access the cgroup filesystem directly need v2-aware code (jev 0.8, https://kubernetes.io/docs/concepts/architecture/cgroups/). The admin guide documents the transition mechanics, including the `cgroup_no_v1=` kernel parameter that disables controllers in v1 and makes them always available in v2 (jev 0.91, https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html). A GPU quota implementation that keys accounting per cgroup should assume the v2 default hierarchy, which is what `task_dfl_cgrp()` targets.

## The accounting structure

The source doc gives an identity-agnostic accounting shape that is safe to build now:

```c
struct gpu_cg_quota {
    u64 id;            /* cgroup_id(), stable identifier */
    u64 vram_used;
    u64 vram_limit;
    struct list_head node;
};
```

The key design decision: key the accounting table off `cgroup_id()` (a stable u64), not off the `struct cgroup *` pointer. Keying off the pointer would require holding a reference that must be managed across the lifetime of every tracked allocation; keying off the id avoids that (source doc, section 3). Combined with `cgroup_get()` / `cgroup_put()` refcounting for the cases where a pointer must be held, the pattern keeps lifetime management explicit rather than incidental.

## Verification burden

The source doc's own caveat is the load-bearing part of this doc: cgroup internals move between kernel versions, and the skill explicitly declines to be the final authority. The pre-implementation check is to resolve `task_css_set`, `task_dfl_cgrp`, `cgroup_id`, `cgroup_get`, and `cgroup_put` in `include/linux/cgroup.h` for the exact kernel version yubiOS ships, using `elixir.bootlin.com/linux/v<X>/A/ident/<symbol>` (source doc, section 3; re-check list in doc 08).
