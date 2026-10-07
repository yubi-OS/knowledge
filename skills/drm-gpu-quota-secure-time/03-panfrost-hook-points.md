Scope: the verified Panfrost functions where per-allocation accounting belongs, and what each one is for.

## Verified against the driver source

The source doc states these hook points were verified against panfrost_drv.c, and both files are reachable in the upstream tree for re-verification: drivers/gpu/drm/panfrost/panfrost_drv.c (https://github.com/torvalds/linux/blob/master/drivers/gpu/drm/panfrost/panfrost_drv.c, weight 0.62) and drivers/gpu/drm/panfrost/panfrost_gem.c (https://github.com/gregkh/linux/blob/master/drivers/gpu/drm/panfrost/panfrost_gem.c, weight 0.62). These are the two highest-weighted results in this corpus's dig, and they are the right reflex: open the file, read the signature, then design the hook.

## The allocation-time hook: panfrost_ioctl_create_bo

panfrost_ioctl_create_bo(struct drm_device *dev, void *data, struct drm_file *file) is the DRM_IOCTL_PANFROST_CREATE_BO handler in panfrost_drv.c ("source doc"). It reads struct drm_panfrost_create_bo (which carries .size), calls panfrost_gem_create(), and installs the resulting GEM handle in the caller's file. An independent kernel-description document lists panfrost_ioctl_create_bo as the buffer-object creation entry point of the driver (https://freebsdfoundation.org/wp-content/uploads/2021/08/The-Panfrost-Driver.pdf, weight 0.26 weak).

This is the allocation-time hook ("source doc"). Charge quota here, before the shmem object is created, and fail with -ENOMEM or -EDQUOT before calling into panfrost_gem_create() if the caller is over limit. Failing early is the whole point: a charge installed after object creation has to be unwound, which is more code and more failure modes.

## The submit-time guard: panfrost_lookup_bos

panfrost_lookup_bos(struct drm_device *dev, struct drm_file *file_priv, struct drm_panfrost_submit *args, struct panfrost_job *job) resolves submit-time handles to GEM objects and bumps refcounts ("source doc"). The mainline merge article for the driver describes it the same way: it sets up job->bo[] with the GEM objects referenced by the job (https://lwn.net/Articles/782655/, weight 0.22 weak).

This is the second guard point ("source doc"): reject submission from an already-over-quota context even if the BOs were allocated earlier. Without it there is a hole: a context allocates while under limit, then blows past the limit by reusing and re-submitting BOs. The submit check closes that gap.

## The free path: panfrost_gem_free_object

Free-path accounting belongs in the GEM object's .free callback, panfrost_gem_free_object in panfrost_gem.c ("source doc"). Uncharge there, keyed off the same identity used at charge time. A charge with no matching uncharge leaks quota permanently, so the identity keying is not an implementation detail, it is the correctness condition.

## Context and re-verification

Panfrost is the kernel driver for Arm Mali Midgard and Bifrost GPUs; the Mesa stack on top is conformant on Mali-G52, Mali-G57 and Mali-G610 (https://docs.mesa3d.org/drivers/panfrost.html, weight 0.37 weak). The kernel driver reached a mainline-acceptable form in early 2019 (https://www.collabora.com/news-and-blog/blog/2019/03/04/panfrost-update-new-kernel-driver/, weight 0.27 weak) and was merged the same year (https://lwn.net/Articles/782655/, weight 0.22 weak).

The source doc's closing instruction for this section is to confirm hook signatures against the kernel version yubiOS actually ships, via https://elixir.bootlin.com/linux/latest/source/drivers/gpu/drm/panfrost/panfrost_drv.c. Signatures drift across releases; the design above is stable, the exact parameter lists are not guaranteed to be.

## Why these two functions and not others

The pair create-plus-lookup is not an arbitrary choice of instrumentation points; it maps onto the two moments where GPU memory becomes a resource an untrusted context controls. At create time, memory is being claimed: the size is attacker-chosen input from the ioctl, and if quota is checked after the shmem object exists, the claim has already been paid before the check. At submit time, memory is being used in a batch: handles already issued can be composed into a job that collectively exceeds the limit even when no single allocation did ("source doc"). A design that only hooks one of the two moments leaves the other as the bypass.

It is also why the checks live in the driver, not in generic GEM core: Panfrost has no TTM region to hang a generic accounting layer on, which is the same fact that makes the upstream dev controller a poor fit for this hardware today (doc 02). The driver-local hook is where the data needed to charge is already in hand: the drm_file, which is the per-open-client identity, and the size field from the ioctl.

## Failure semantics worth pinning down

The source doc names the two error codes to fail with, -ENOMEM and -EDQUOT, before panfrost_gem_create() is called ("source doc"). The distinction matters for callers: -EDQUOT says the refusal is policy, not resource exhaustion, which is what lets userspace distinguish "the cgroup is over limit" from "the system is out of memory" and react differently. A quota design that collapses both into -ENOMEM destroys that signal and makes the limit indistinguishable from an OOM for every client.

The submit-side rejection should be symmetrical: refuse the submission, do not half-charge it. Because panfrost_lookup_bos only resolves handles and bumps refcounts, a rejected submit leaves no allocation residue to unwind, which is another reason the second check is cheap to enforce compared with reclaiming memory mid-flight.

## The verification discipline this section models

The source doc's own history explains the emphasis: this skill exists because source material for the area mixed real APIs with plausible fabrications, and the correction was done by verifying against the actual driver files ("source doc"). The two hook points carry the corpus's highest dig weights (0.62 each, the panfrost_drv.c and panfrost_gem.c sources on GitHub) precisely because they can be checked directly. The reusable rule: for every kernel symbol a design depends on, name the file, name the function, and name the kernel version, then confirm all three before the design hardens into code. Anything that cannot pass that check is a proposal (doc 05), not a hook point.
