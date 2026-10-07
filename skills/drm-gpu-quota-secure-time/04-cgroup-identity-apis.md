Scope: which cgroup identity APIs are real, which are invented, and the identity-agnostic accounting shape that is safe to build now.

## The invented symbols

The chat-derived skeletons this skill corrects used task_cgroup(current, 0) and a bare get_cgroup(cg). Those are not the current cgroup v2 kernel API surface ("source doc"). They are plausible-sounding fabrications: the kind of symbol name that survives in transcripts because it reads correctly, not because it exists. The source doc's rule is blunt: before writing real code, verify against the exact kernel version you are targeting, using https://elixir.bootlin.com/linux/v<X>/A/ident/<symbol>, because cgroup internals move.

## The real surface, as of recent kernels

The idiomatic pattern for cgroup v2 default-hierarchy membership is task_css_set(), task_dfl_cgrp(), and cgroup_id(), with cgroup_get() and cgroup_put() for refcounting ("source doc"). The include file to confirm against is include/linux/cgroup.h in the actual tree being built against. The dig surfaced the current header (https://github.com/torvalds/linux/blob/master/include/linux/cgroup.h, weight 0.40 weak), which documents adjacent symbols such as cgroup_on_dfl() and references task_css_set_check(), consistent with the source doc's picture of the surface. The weight is weak, so the instruction stands: the source doc itself refuses to be the final authority here, and neither does this corpus.

For background on what the hierarchy is: cgroup v2 organizes processes hierarchically and distributes system resources along the hierarchy in a controlled and configurable manner, composed of a core and controllers (https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html, weight 0.37 weak; the user-space view is in https://www.man7.org/linux/man-pages/man7/cgroups.7.html, weight 0.35 weak). A GPU quota design that keys accounting per cgroup is piggybacking on exactly that hierarchy.

## The accounting shape

The practical, identity-agnostic shape the source doc gives is:

struct gpu_cg_quota {
    u64 id;            /* cgroup_id(), stable identifier */
    u64 vram_used;
    u64 vram_limit;
    struct list_head node;
};

Key the accounting table off cgroup_id(), a stable u64, not off the struct cgroup * pointer ("source doc"). The reason is lifetime: keying off the pointer means holding a reference you have to acquire, track, and release across the lifetime of every tracked allocation, which multiplies refcounting bugs by the number of outstanding GPU buffers. Keying off the numeric id means the table entry outlives pointer churn and cgroup_get()/cgroup_put() only bracket the table entry itself.

The same discipline mirrors the free-path rule in doc 03: the identity used at charge time is the identity used at uncharge time. A quota table keyed inconsistently at the two ends is a quota leak by construction.

## What this section does not settle

The source doc is explicit that even its own list of "current" names is not the final source: confirm the exact names for your target kernel major version before committing to a design, and do not trust this skill or an LLM chat log as the final source ("source doc"). The corpus keeps that stance. elixir.bootlin.com plus the tree's own cgroup.h is the arbiter; this document is the map to it.

## Why the invented symbols are dangerous specifically here

A quota system's enforcement decision is only as trustworthy as its subject identification. If the charge and the enforcement are keyed off a symbol that does not exist, the code does not compile and the failure is loud. The subtler failure is the near-miss: a helper that exists but with different semantics, so quota charged against one identity is enforced against another. That is why the source doc's advice is not just "verify the names" but "verify against the exact kernel version you are targeting" ("source doc"): the same name has carried different semantics across cgroup development, and a design copied from a transcript of a different era can compile and still charge the wrong subject.

## How the identity flows through the design

The end-to-end chain the source doc implies is: at charge time (panfrost_ioctl_create_bo, doc 03), resolve the current task's cgroup membership to a stable id; at enforcement time, compare vram_used plus the requested size against vram_limit for that id; at uncharge time (panfrost_gem_free_object), decrement the same row. cgroup_id() is the pivot because it is stable across the table's lifetime while pointers are not ("source doc"). The struct's list_head node means rows are linked, so cleanup on cgroup destruction is a list walk rather than a table scan keyed by dangling pointers.

One design boundary the source doc leaves open and this corpus will not invent: the locking around the table, and the policy for which cgroups get a limit at all. Both are real questions, and both are left for the implementation ADR rather than settled by assertion here. What the source doc settles is the identity layer, and it settles it by pointing at include/linux/cgroup.h in the tree being built against, not at itself ("source doc").

## Relation to the upstream controller

Doc 02 describes the pending dev controller's own accounting model. The gpu_cg_quota shape here is deliberately independent of it: the struct is driver-local, the id is the generic cgroup_id(), and neither assumes the dev.region files exist ("source doc"). That is the same swap-later posture as the hook points: build the accounting against what exists today, keep the identity layer generic enough that the upstream controller can replace the limit-source without replacing the whole table.
