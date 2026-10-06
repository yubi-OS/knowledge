# 06. OP-TEE secure time on Rockchip: CNTPCT, verified

Scope: the one fully verified external mechanism in this skill: `CFG_SECURE_TIME_SOURCE_CNTPCT`, forced on for the OP-TEE Rockchip platform port, and what it does for RK3399 and RK3588.

Primary source: yubi-OS/yubiOS skills/drm-gpu-quota-secure-time/SKILL.md (the "source doc").

## The config bit and its source of record

`CFG_SECURE_TIME_SOURCE_CNTPCT` is real and confirmed forced-on for the Rockchip platform port. The source doc quotes the exact line from OP-TEE's `core/arch/arm/plat-rockchip/conf.mk`: `$(call force,CFG_SECURE_TIME_SOURCE_CNTPCT,y)`. Because it is forced at the shared platform level, it applies to every Rockchip `PLATFORM_FLAVOR` built against `plat-rockchip`, which covers both RK3399 and RK3588; there is no board-specific override needed (source doc, section 5).

The upstream artifacts to re-check against are public: the `conf.mk` file itself in the optee_os tree (jev 0.75, https://github.com/OP-TEE/optee_os/blob/master/core/arch/arm/plat-rockchip/conf.mk) and the optee_os build documentation, which describes the build system organization and configuration handling (jev 0.78, https://optee.readthedocs.io/en/latest/building/gits/optee_os.html). OP-TEE's porting guidelines confirm where this belongs: the platform `conf.mk` file should define the main configuration directives, including the generic time source (jev 0.81, https://optee.readthedocs.io/en/latest/architecture/porting_guidelines.html).

## What CNTPCT does

When built with `CFG_SECURE_TIME_SOURCE_CNTPCT=y`, `TEE_GetSystemTime()` (and its internal path `tee_time_get_sys_time()`) resolves time from the ARM generic timer's physical counter, `CNTPCT_EL0`, read from secure world, instead of trusting the normal-world REE wall clock (source doc, section 5).

This is not just the source doc's claim. The OP-TEE maintainers state it directly in the issue tracker: `TEE_GetSystemTime()` returns a value based on the physical timer count register (CNTPCT) when the platform supports it, that is, when OP-TEE is built with `CFG_SECURE_TIME_SOURCE_CNTPCT=y` (jev 0.61, https://github.com/OP-TEE/optee_os/issues/1489). A developer-side confirmation in the same repo notes that on a platform setting `CFG_SECURE_TIME_SOURCE_CNTPCT=y`, `TEE_GetSystemTime()` uses the OP-TEE secure timer instead of the REE timer (jev 0.61, https://github.com/OP-TEE/optee_os/issues/4029).

The contrast case is documented too: with `CFG_SECURE_TIME_SOURCE_REE=y`, the not-so-secure time is retrieved from non-secure world through RPC (jev 0.72, https://github.com/OP-TEE/optee_os/issues/1371). The two config options select between a counter the secure world reads itself and a clock service the normal world provides.

## The protection level

Reading CNTPCT from secure world raises `gpd.tee.systemTime.protectionLevel` to 1000, the TEE-controlled secure clock level, rather than the REE-trusting default (source doc, section 5). The property is part of the GlobalPlatform TEE Internal Core API: version 1.4 of the specification (GPD_SPE_010) clarified how clock skew between real world time and System Time is specified, differentiating behavior between different values of `gpd.tee.systemTime.protectionLevel` (jev 0.89, https://globalplatform.org/specs-library/tee-internal-core-api-specification/). The baseline guarantee the API makes even at lower protection levels is that the value cannot decrease while a trusted application is running, though the REE may be able to control the speed at which it advances (jev 0.08, weak backing, https://stackoverflow.com/questions/68544061/how-to-get-a-utc-timestamp-in-op-tee-trusted-application-ta-in-datetime-format).

## What it is not

There is no separate RK3399/RK3588 TrustZone-only clock peripheral (source doc, section 5). It is the same architectural generic timer counter, read with secure privilege (the `PL0PCTEN` and secure timer access controls apply) rather than being handed the REE's idea of time. Nothing extra to enable in the device tree; nothing to buy in silicon.

## Honest limits

Secure time is not a full RTC replacement: a maintainer discussion of `TEE_GetSystemTime` compliance notes that depending on secure storage to persist time would mean writing on every time query, so a platform that needs monotonic wall time across reboots needs a secure RTC or another way to restore the time at boot (jev 0.63, https://github.com/OP-TEE/optee_os/issues/5973). CNTPCT solves rollback within a running system, not continuity across power cycles. For yubiOS the value is the rollback-resistance direction, which doc 07 develops.
