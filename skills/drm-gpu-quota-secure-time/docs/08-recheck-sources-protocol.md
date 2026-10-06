# 08. The pre-implementation re-check protocol

Scope: the four sources the skill requires re-checking before implementation, why each one exists, and the drift risk each one guards against.

Primary source: yubi-OS/yubiOS skills/drm-gpu-quota-secure-time/SKILL.md (the "source doc").

## The four checks

The source doc ends with a list titled "Sources to re-check before implementing" (source doc):

1. `lore.kernel.org/dri-devel`, searched for "dev cgroup" and "DRM scheduling cgroup", for the current patchset state. Do not assume the interface names in the source doc are final.
2. `elixir.bootlin.com/linux/latest/source/drivers/gpu/drm/panfrost/panfrost_drv.c`, to confirm hook signatures against the kernel version yubiOS actually ships.
3. `github.com/OP-TEE/optee_os/blob/master/core/arch/arm/plat-rockchip/conf.mk`, to confirm the `CFG_SECURE_TIME_SOURCE_CNTPCT` force-on still holds for the OP-TEE version pinned in the firmware stack.
4. The ARM SMCCC spec (`developer.arm.com`, "SMC Calling Convention"), to confirm the SiP range before allocating a real function ID.

## Why each check exists

Check 1 guards against a moving target. The `dev` cgroup controller is not merged; its field names and file names are proposals until they land (doc 02). The dri-devel list index is the canonical current view (jev 0.7, https://lore.kernel.org/dri-devel/). The dig record shows the state is genuinely in motion: LWN's coverage of the DRM scheduling cgroup controller describes wiring examples for amdgpu and for the firmware-scheduler Intel Xe driver, a different effort from the memory-accounting one (jev 0.53, https://lwn.net/Articles/1036627/). Distinguishing the two efforts is part of the search discipline.

Check 2 guards against version drift in the hook points. The Panfrost functions the quota design charges (`panfrost_ioctl_create_bo`, `panfrost_lookup_bos`, `panfrost_gem_free_object`) are real today, but signatures and helper names change between kernel releases (doc 03). The check is against the exact tree yubiOS ships, not master and not "latest".

Check 3 guards against the OP-TEE pin. The `conf.mk` force-on line is in the current master of optee_os (jev 0.75, https://github.com/OP-TEE/optee_os/blob/master/core/arch/arm/plat-rockchip/conf.mk), but yubiOS pins a specific OP-TEE version in its firmware stack, and the check is whether the pinned version's `plat-rockchip` config carries the same force-on. The optee_os build documentation describes how platform configuration flows through the build system, which is what makes a per-version check meaningful (jev 0.78, https://optee.readthedocs.io/en/latest/building/gits/optee_os.html); the project's pull-request stream is where platform config changes surface (jev 0.61, https://github.com/OP-TEE/optee_os/pulls).

Check 4 guards against allocating a colliding or out-of-range SMC function ID. The SMCCC spec is the authority on range ownership, and the SiP sub-range allocation is exactly the kind of detail that gets misremembered (doc 05).

## The protocol shape

All four checks share a shape: take a specific artifact (a patchset, a source file, a config line, a spec section) and read it in the exact version yubiOS will build against. None of them accept "a chat transcript said so" or "the skill said so"; the skill itself disclaims final authority on cgroup symbol names and says not to trust it as the source (source doc, section 3). The protocol is cheap: 4 lookups, each resolvable in minutes with Elixir, lore.kernel.org, GitHub, and the SMCCC PDF.

## Primitive-coverage entries in the source doc

The source doc also carries corpus-audit sections: least-privilege coverage (curve-guided-rsi cycle 4), immutability coverage with fit coordinates from cycle 5, a cycle-5 cryptographic-identity primitive closure, a cycle-6 declarative-policy note, and a cycle-7 no-gap audit, plus a 2026-09-17 coverage note that removed an unsupported template paragraph. These are internal-record subtopics describing yubiOS's own corpus-audit bookkeeping; no web dig was run for them, and they are attributed to the source doc alone.
