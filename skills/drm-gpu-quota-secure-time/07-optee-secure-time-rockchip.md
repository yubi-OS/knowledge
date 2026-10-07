Scope: OP-TEE's CNTPCT-based secure time source on Rockchip, what it is and is not, and the yubiOS-facing configuration fact.

## The configuration fact

CFG_SECURE_TIME_SOURCE_CNTPCT is real and confirmed forced-on for the Rockchip platform port in OP-TEE's optee_os ("source doc"). The conf.mk line is:

$(call force,CFG_SECURE_TIME_SOURCE_CNTPCT,y)

The dig surfaced the actual file, core/arch/arm/plat-rockchip/conf.mk in the optee_os tree (https://github.com/OP-TEE/optee_os/blob/master/core/arch/arm/plat-rockchip/conf.mk, weight 0.57), which is this corpus's strongest direct corroboration of a source-doc claim. The setting applies to every Rockchip PLATFORM_FLAVOR built against plat-rockchip, covering both RK3399 and RK3588; there is no board-specific override needed, it is inherited from the shared Rockchip platform config ("source doc"). The source doc still directs a re-check of that conf.mk for the OP-TEE version pinned in the firmware stack before relying on it (see its sources list).

## What it does

With this config, TEE_GetSystemTime() and tee_time_get_sys_time() resolve time from the ARM generic timer's physical counter, CNTPCT_EL0, read from secure world, instead of trusting the normal-world (REE) wall clock ("source doc"). OP-TEE's core architecture documentation describes its time-source model (https://optee.readthedocs.io/en/3.12.0/architecture/core.html, weight 0.56; https://optee.readthedocs.io/en/latest/architecture/core.html, weight 0.53).

The effect is a protection-level upgrade: gpd.tee.systemTime.protectionLevel rises to 1000, TEE-controlled secure clock, rather than the REE-trusting default ("source doc").

## What it is not

There is no separate RK3399 or RK3588 TrustZone-only clock peripheral ("source doc"). It is the same architectural generic timer counter, just read with secure privilege, with the PL0PCTEN and secure timer access controls applying, instead of the TEE being handed REE's idea of time. Designing against an imagined secure RTC chip would be the same class of error as building against invented kernel symbols, and the source doc closes that door explicitly.

One honest nuance from the dig: OP-TEE issue 5973 records that TEE_GetSystemTime's behavior relative to the GlobalPlatform TEE core specification has been debated, including the relationship between time and secure storage and the case for a secure RTC (https://github.com/OP-TEE/optee_os/issues/5973, weight 0.44 weak). The takeaway is not that CNTPCT sourcing is wrong; it is that the GP-spec conformance story around secure time is still being argued upstream, so treat exact GP semantics as an open item, not a settled guarantee.

## Build-system context

The setting lives in optee_os's platform configuration layer: a main Makefile plus per-directory sub.mk files and supporting conf.mk files drive the build (https://optee.readthedocs.io/en/latest/building/gits/optee_os.html, weight 0.51; https://optee.readthedocs.io/en/latest/building/gits/optee_os.html, weight 0.48 weak). The force directive is a build-system mechanism, which is why it is inherited platform-wide and why a different platform port would not get it for free.

## Why yubiOS cares

This is directly useful for anything needing tamper-resistant timestamps ahead of a real RTC or attestation service: bounding replay windows for fTPM NV counters, or timestamping the ADR-018/019 ARM64 fTPM measured-boot event log with a time value normal-world userspace cannot roll back ("source doc"). It is a config bit inside the same OP-TEE build, so it pairs with the ftpm-optee-tpm and arm-trusted-firmware-optee skills; check those before assuming this is a standalone feature ("source doc"). Doc 08 carries the integration placement.

## The mechanism under the config bit

The generic timer's physical counter is a single architectural counter shared across exception levels; what the config changes is who the TEE believes about time. Reading CNTPCT_EL0 from secure world means the TEE's clock is the counter itself rather than a value the REE hands across the boundary ("source doc"). The access-control surface, PL0PCTEN and the secure timer controls, governs which exception levels may read which timer views ("source doc"). The source doc's point that there is no separate TrustZone-only clock peripheral ("source doc") is worth restating as a design rule: any yubiOS component that wants a timestamp a compromised REE cannot roll back should ask the TEE, not look for a second clock chip on the board.

## Why protection level 1000 matters downstream

The gpd.tee.systemTime.protectionLevel value of 1000 is the GlobalPlatform-visible statement that the clock is TEE-controlled ("source doc"). For the consumers the source doc names, fTPM NV counter replay-window bounding and measured-boot event-log timestamping ("source doc"), the level is what makes the timestamp admissible in a security argument: an auditor can trace the timestamp's provenance to a counter the REE cannot set, rather than to a wall clock the REE controls. Without that provenance, a rollback attack on the log becomes "set the clock backwards before the event", and the log's ordering guarantees evaporate. This is the same shape as the rest of the skill: name the real primitive, know exactly what it guarantees, and do not let a plausible-sounding mechanism stand in for it.

## What re-verification looks like for this section

The source doc's sources list asks for one re-check here: confirm the force-on still holds for the OP-TEE version pinned in the firmware stack (source doc sources list). The conf.mk file is small and versioned in optee_os, so the check is a one-file diff across the pin, and the GitHub location surfaced in the dig (https://github.com/OP-TEE/optee_os/blob/master/core/arch/arm/plat-rockchip/conf.mk, weight 0.57) is the master-branch reference point. A drift here would be quiet: nothing fails at build time if a future optee_os changes the default, the TEE simply starts trusting REE time again, and the protectionLevel drops back. That failure mode, a security property silently lost to a config default change, is exactly why the source doc pins the check to the pinned version rather than to "OP-TEE" in general.

## Relation to the GPU half of the skill

The two halves of this skill share one property worth naming: both are about which world you trust for a foundational resource. The GPU quota design trusts the kernel for enforcement up to the threat model that breaks it (doc 06); the secure-time design declines to trust the REE for time at all. In both cases the correction the skill encodes is the same: establish what the real primitive guarantees, then design against that, not against the API name that sounded right in a transcript.
