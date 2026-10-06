# 03. Verified Panfrost hook points for quota accounting

Scope: the real, current Panfrost driver functions where per-allocation GPU memory accounting belongs, verified against `panfrost_drv.c`, and the charge/uncharge placement pattern built on them.

Primary source: yubi-OS/yubiOS skills/drm-gpu-quota-secure-time/SKILL.md (the "source doc").

## Panfrost in one paragraph

Panfrost is the open-source Mesa OpenGL ES driver stack for Arm Mali GPUs based on the Midgard and Bifrost microarchitectures; it is conformant on Mali-G52, Mali-G57, and Mali-G610 but non-conformant on other GPUs (jev 0.82, https://docs.mesa3d.org/drivers/panfrost.html). The kernel side of the driver was developed by Collabora and reached a state close to mainline acceptance in early 2019 (jev 0.56, https://www.collabora.com/news-and-blog/blog/2019/03/04/panfrost-update-new-kernel-driver/). Rockchip SoCs such as the RK3399 use Mali Midgard/Bifrost GPUs, which is why Panfrost is the driver that matters for yubiOS GPU quota work.

## Hook point 1: allocation time

`panfrost_ioctl_create_bo(struct drm_device *dev, void *data, struct drm_file *file)` is the `DRM_IOCTL_PANFROST_CREATE_BO` handler in `drivers/gpu/drm/panfrost/panfrost_drv.c` (source doc, section 2). The source doc describes its flow: it reads `struct drm_panfrost_create_bo` (which carries `.size`), calls `panfrost_gem_create()`, and installs a GEM handle. This is the allocation-time hook: charge quota here, before the shmem object is created, and fail with `-ENOMEM` or `-EDQUOT` before calling into `panfrost_gem_create()` if the charge would exceed the limit (source doc, section 2).

The driver source is browsable to confirm the signature against the exact kernel version in use: the master copy of `panfrost_drv.c` is on GitHub (jev 0.83, https://github.com/torvalds/linux/blob/master/drivers/gpu/drm/panfrost/panfrost_drv.c). Independent driver documentation confirms the role of the ioctl: a Panfrost driver deck lists `panfrost_ioctl_create_bo` as the call that "creates Panfrost BO" (jev 0.41, weak backing, https://freebsdfoundation.org/wp-content/uploads/2021/08/The-Panfrost-Driver.pdf). The kernel's own Panfrost documentation page is the canonical reference for the driver's user-facing behavior (jev 0.83, https://docs.kernel.org/gpu/panfrost.html).

## Hook point 2: submission time

`panfrost_lookup_bos(struct drm_device *dev, struct drm_file *file_priv, struct drm_panfrost_submit *args, struct panfrost_job *job)` resolves submit-time handles to GEM objects and bumps refcounts (source doc, section 2). It is the second guard point: reject a submission from an already-over-quota context even if the buffer objects were allocated earlier. This closes the gap where a context allocates under the limit and then blows past it through object reuse.

The historical patch record matches the source doc's description of this function's job: the initial panfrost driver merge commit documents `panfrost_lookup_bos()` as setting up `job->bo[]` with the GEM objects referenced by the job, resolving handles from userspace to BOs and attaching them to the job (jev 0.45, weak backing, https://lwn.net/Articles/782655/).

## Hook point 3: the free path

Free-path accounting belongs in the GEM object's `.free` callback, `panfrost_gem_free_object` in `panfrost_gem.c`: uncharge there, keyed off the same identity used at charge time (source doc, section 2). Charging and uncharging must use the same key or the accounting leaks; the identity question is covered in doc 04 of this corpus.

## Why these two ioctls and not something else

The source doc chose create-bo and submit as the two guard points because they bracket the lifetime of a GPU buffer allocation: allocation time is where quota should be charged (fail before the shmem object exists), and submission time is where reuse can silently exceed the charged total. A quota system that only gates allocation misses the reuse path; a system that only gates submission lets a single context allocate unbounded buffers it never submits. Checking both is cheap and makes the accounting complete.

## Implementation cautions

Three cautions carry over from the source doc. First, verify the exact function signatures against the kernel version yubiOS actually ships, not against any doc or chat transcript, using Elixir or the repo (source doc, "Sources to re-check"; see doc 08). Second, these hooks are upstream kernel functions, so a yubiOS patch implementing quota on top of them is a driver patch, not a firmware change; the recommended v0 scope ships value with zero firmware changes (source doc, section 4). Third, the charge point is deliberately before `panfrost_gem_create()`, so an over-quota failure never leaves a half-created GEM object behind.
