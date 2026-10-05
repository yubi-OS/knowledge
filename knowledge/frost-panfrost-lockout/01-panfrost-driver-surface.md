# Panfrost driver surface

Scope: Panfrost driver architecture and per-DRM-file state (panfrost_file_priv, MMU context, job-manager contexts, supported Mali hardware) as the patch surface for GPU lockout policy work.

## What hardware Panfrost covers

The Panfrost driver stack in Mesa is the open source graphics stack for Arm Mali GPUs built on the Midgard and Bifrost microarchitectures, with OpenGL ES conformant on Mali-G52, Mali-G57 and Mali-G610, and PanVK (the Vulkan implementation in the same stack) conformant on Mali-G610 (source: https://docs.mesa3d.org/drivers/panfrost.html, jev weight 0.95). A third-party architecture tracker describes the same scope at the kernel driver level: Panfrost supports Midgard, Bifrost and Valhall architectures, while the newer Panthor driver handles CSF-class GPUs (source: https://deepwiki.com/allbilly/linux_drm/9.1-panfrost-and-panthor-(arm-mali-drivers), jev weight 0.22, weak backing).

Two coverage limits matter for lockout work. Other Midgard and Bifrost chips such as the G71 are listed in Mesa model tables but documented as not yet supported, and older Utgard chips (Mali-400, Mali-450) belong to the Lima driver instead (source: https://idr.pages.freedesktop.org/mesa/drivers/panfrost.html, jev weight 0.41, weak backing). A community-maintained architecture notes file confirms the G52/G57/G610 conformance list and flags the G71 gap against the Mesa docs (source: https://github.com/zenithblue-oss/panvk-kbase-android/blob/main/docs/MALI-GPU-ARCHITECTURES.md, jev weight 0.59). Lockout policy must therefore be designed against the specific Mali generation on the board, because conformance and feature support are generation-dependent.

## Kernel-side structure

The kernel driver lives in drivers/gpu/drm/panfrost/. The main entry file panfrost_drv.c pulls in panfrost_mmu.h, panfrost_job.h, panfrost_gpu.h and panfrost_perfcnt.h, and carries module state such as the unstable_ioctls flag and job requirement masks (source: https://github.com/torvalds/linux/blob/master/drivers/gpu/drm/panfrost/panfrost_drv.c, jev weight 0.95).

Per DRM file, the driver allocates panfrost_file_priv, an MMU context, job-manager contexts and engine-usage accounting. The JM context work makes this explicit: a 2025 patch series (v3, posted by Adrian Larumbe of Collabora in September 2025) introduces JM contexts for managing job resources, where context creation initializes scheduling entities of the same priority for all of the device's job slots, and until contexts are exposed to userspace all issued jobs bind to the default Panfrost file context (source: https://lists.freedesktop.org/archives/dri-devel/2025-September/525188.html, jev weight 0.74). A duplicate archive copy of the same series scored low on the quality metric (source: https://lists.freedesktop.org/archives/dri-devel/2025-September/525843.html, jev weight 0.15, weak backing) and the review-thread mirror scored high (source: https://lkml.rescloud.iu.edu/2509.2/02540.html, jev weight 0.80). The practical point for lockout design: there is already a per-file context object layer in flight upstream, which is exactly the handle a per-cgroup submit gate needs.

## Scheduling model

Panfrost uses the drm_sched framework for job scheduling. drm_sched is built around hardware queues (drm_gpu_scheduler instances) that process jobs in order against a fixed number of job slots (source: https://www.collabora.com/news-and-blog/news-and-events/pancsf-a-new-drm-driver-for-mali-csf-based-gpus.html, jev weight 0.77). A conference talk on DRM GPU job scheduling describes the entity model in the same terms: jobs run in per-entity submission order and the scheduler arbitrates between entities, which are the job containers (source: https://indico.freedesktop.org/event/10/contributions/433/attachments/247/334/GPU%20Job%20Scheduling%20in%20DRM_%20Past%2C%20Present%20and%20Future-2.pdf, jev weight 0.91). One client's submission stream is represented by a drm_sched_entity bound to one or more GPU engines (source: https://github.com/jreuben11/linux-graphics-stack-book/blob/main/chapters/part-01-kernel-layer/ch102-drm-gpu-scheduler.md, jev weight 0.56).

## Observability already built in

The driver implements the DRM client usage stats specification, so per-file engine and memory statistics are exported through fdinfo (source: https://docs.kernel.org/gpu/panfrost.html, jev weight 0.91). This is the attribution surface the lockout design relies on before any enforcement is added.

## Patch surface summary

For a lockout prototype the natural hook points are: probe/init (panfrost_device and compatible data) for discovering board and GPU identity; BO create and free paths (panfrost_ioctl_create_bo, panfrost_gem_create) for any future accounting; the PRIME import path for preventing imported buffers from bypassing policy; the submit guard (panfrost_ioctl_submit, panfrost_job_push) for denying new jobs from a locked context; and fdinfo/debugfs for attribution evidence. The driver's origin as a reverse-engineered FOSS implementation built by tracing Arm's userspace drivers (source: https://xdc2018.x.org/slides/Panfrost-XDC_2018.pdf, jev weight 0.89) is a reminder that behavior not covered by upstream tests can shift quickly, so every patch surface claim should be re-verified against the current tree before implementation.
