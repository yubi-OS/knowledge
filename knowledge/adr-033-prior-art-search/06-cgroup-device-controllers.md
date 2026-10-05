# 06 - cgroup device controllers as resource-based cut-off

Scope: device-level cut-off via cgroups: the legacy devices cgroup controller, the BPF_CGROUP_DEVICE program that replaced it in cgroup v2, and the DRM memory cgroup work for VRAM caps.

## cgroup v1 devices controller and its v2 replacement

The cgroup v1 devices controller exposed devices.allow and devices.deny files. cgroup v2 dropped the devices controller entirely and relies on BPF_CGROUP_DEVICE instead; container runtimes like runc generate the corresponding BPF programs (https://kernel-internals.org/cgroups/cgroup-bpf/, weight 0.56). The mechanism is therefore still device-level allow/deny, but implemented as an attachable program rather than a filesystem interface.

The program type is documented precisely: cgroup device programs are executed when a process in the cgroup to which the program is attached wishes to utilize a device, and the program decides whether or not to allow the operation (https://docs.ebpf.io/linux/program-type/BPF_PROG_TYPE_CGROUP_DEVICE/, weight 0.88). The Isovalent eBPF documentation adds the failure semantics: the program is called with a context describing the access attempt; if the program returns 0, the attempt fails with EPERM, otherwise it succeeds (https://github.com/isovalent/ebpf-docs/blob/master/docs/linux/program-type/BPF_PROG_TYPE_CGROUP_DEVICE.md, weight 0.77).

Tooling exists to operate this layer from the CLI: devcgprog configures the cgroupv2 devices controller using BPF programs, a pure-Go implementation using the cilium/ebpf library with no other compilers or kernel sources needed (https://github.com/vpsfreecz/devcgprog, weight 0.29, weak backing). A tutorial walks cgroup hooks for network connections, device access, and sysctl reads and writes, each checking a configured blocking rule and reporting an event (https://eunomia.dev/tutorials/cgroup/, weight 0.44, weak backing). bpftool cgroup documentation covers attaching, detaching, and inspecting BPF programs on cgroup v2 hooks (https://deepwiki.com/libbpf/bpftool/3.10-cgroup-commands, weight 0.16, weak backing).

## The DRM memory cgroup: per-workload VRAM caps

The device-memory story for GPUs runs through the DRM subsystem. The LWN coverage of the cgroup support for GPU devices patch series describes patch 8 introducing DRM support for associating GEM objects with a cgroup, and patch 9 implementing i915 changes to use cgroups for device memory charging and enforcing device memory allocation limits (https://lwn.net/Articles/844199/, weight 0.83).

The earlier proposal thread argued for a drm cgroup controller to enable alternate, fine-grain, sub-GPU resource management in addition to what GPU virtualization provides (https://lwn.net/Articles/812540/, weight 0.62). An Igalia writeup reviews the DRM scheduling cgroup controller design across its repeated proposals (https://blogs.igalia.com/tursulin/drm-scheduling-cgroup-controller/, weight 0.69). The dmem cgroup controller landed for device memory: a pull request ahead of Linux 6.14 introduced the notion of device memory DMEM to cgroup, with the main intended use being to restrict device memory usage based on the cgroup hierarchy, such as for graphics cards (https://www.phoronix.com/news/DMEM-cgroup-vRAM-Control, weight 0.39, weak backing). Later revision threads add reclaim to the dmem cgroup controller (https://www.mail-archive.com/dri-devel@lists.freedesktop.org/msg618008.html, weight 0.77).

## What this family does and does not cover

The cgroup device family answers a different question than ADR-033's behavioral ladder:

1. Trigger is resource identity, not behavior. BPF_CGROUP_DEVICE evaluates a device-use attempt (type, access mode); the DRM memory cgroup evaluates memory quantity. Neither observes patterns over time.
2. Response is binary. Allow or EPERM; cap or deny. There is no warn tier and no state capture.
3. It is a strong complementary enforcement point. A VFIO/vfio-user policy engine deciding to throttle or sever can sit above a cgroup device program that enforces the hard floor, and the two layers fail independently.

## Sources considered

| source | weight |
|---|---|
| https://docs.ebpf.io/linux/program-type/BPF_PROG_TYPE_CGROUP_DEVICE/ | 0.88 |
| https://lwn.net/Articles/844199/ | 0.83 |
| https://github.com/isovalent/ebpf-docs/blob/master/docs/linux/program-type/BPF_PROG_TYPE_CGROUP_DEVICE.md | 0.77 |
| https://www.mail-archive.com/dri-devel@lists.freedesktop.org/msg618008.html | 0.77 |
| https://blogs.igalia.com/tursulin/drm-scheduling-cgroup-controller/ | 0.69 |
| https://lwn.net/Articles/812540/ | 0.62 |
| https://kernel-internals.org/cgroups/cgroup-bpf/ | 0.56 |
| https://eunomia.dev/tutorials/cgroup/ | 0.44 (weak) |
| https://www.phoronix.com/news/DMEM-cgroup-vRAM-Control | 0.39 (weak) |
| https://github.com/vpsfreecz/devcgprog | 0.29 (weak) |
| https://deepwiki.com/libbpf/bpftool/3.10-cgroup-commands | 0.16 (weak) |
| https://windowsforum.com/news/linux-7-3s-low-vram-drm-changes-what-they-do.443845/ | 0.14 (weak) |
