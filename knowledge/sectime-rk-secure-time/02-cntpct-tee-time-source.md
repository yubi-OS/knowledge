# The TEE-controlled CNTPCT time source in OP-TEE

Scope: the TEE-controlled ARM counter path, `CFG_SECURE_TIME_SOURCE_CNTPCT`, and the `tee_time_arm_cntpct.c` implementation that reads the ARM generic timer counter from secure world.

## The implementation and its registered properties

OP-TEE's `core/arch/arm/kernel/tee_time_arm_cntpct.c` registers a time source named `arm_cntpct_time_source` via `REGISTER_TIME_SOURCE`, with `.protection_level = 1000` and `.get_sys_time = arm_cntpct_get_sys_time`. The same source tree uses the counter for jitter entropy, collecting it in 32- or 64-bit mode that is typically clocked at around 1 MHz, adding the low 16 bits of the counter as entropy on first call and accumulating 2 low bits per subsequent call (weight 0.77, authoritative backing: https://coral.googlesource.com/optee-os-mtk/+/80d47d0aba0f7810a1c56caa0cf86a280d8b9d0b/core/arch/arm/kernel/tee_time_arm_cntpct.c).

The upstream OP-TEE master copy of the same file confirms the jitter-collection comment about CNTPCT in 32- or 64-bit mode clocked at around 1 MHz (weight 0.85, authoritative backing: https://github.com/OP-TEE/optee_os/blob/master/core/arch/arm/kernel/tee_time_arm_cntpct.c). A second GitHub view of the same file is available (weight 0.81, authoritative backing: https://github.com/OP-TEE/optee_os/blob/master/core/arch/arm/kernel/tee_time_arm_cntpct.c), and vendor forks carry the identical implementation, including the Renesas RZ fork (weight 0.81, authoritative backing: https://github.com/Renesas-SST/rz_optee_os/blob/master/core/arch/arm/kernel/tee_time_arm_c). The released OP-TEE 4.3.0 tree exposes the same file through the Elixir cross-referencer (weight 0.73, authoritative backing: https://elixir.bootlin.com/op-tee/4.3.0/source/core/arch/arm/kernel/tee_time_arm_cntpct.c).

## The configuration flag

OP-TEE's Qualcomm platform documentation lists, as part of its reference platform profile, "Secure time sourced from the physical counter CNTPCT (CFG_SECURE_TIME_SOURCE_CNTPCT)" alongside a TF-A-based boot flow (`CFG_WITH_ARM_TRUSTED_FW`) with an AArch64 secure core (weight 0.91, authoritative backing: https://optee.readthedocs.io/en/latest/architecture/platforms/qualcomm/index.html). This establishes that `CFG_SECURE_TIME_SOURCE_CNTPCT=y` is a mainstream, documented platform configuration for TF-A-based ARM64 ports, not an exotic one.

A maintainer thread confirms the flag-to-property mapping in the other direction: a platform that sets `CFG_SECURE_TIME_SOURCE_CNTPCT=y` gets protection level 1000, and if the platform actually intends REE time it should set `CFG_SECURE_TIME_SOURCE_REE=y` instead; mismatching these is a real bug class that surfaces as panics in `TEE_GetSystemTime()` (weak backing, weight 0.40: https://github.com/OP-TEE/optee_os/issues/4029).

A third-party page asserts that on RK3399 and RK3588 the usual trusted time source in OP-TEE is the ARM generic timer counter, typically CNTPCT, exposed via `CFG_SECURE_TIME_SOURCE_CNTPCT` (weak backing, weight 0.17: https://շանթ.com/?p=1184). This matches the expectation in the yubiOS refs source doc but is not authoritative on its own; it is exactly the kind of claim that requires the hardware evidence yubiOS still needs to collect.

## What the counter is

The counter the implementation reads is the ARM architectural physical counter (CNTPCT), part of the Arm Generic Timer framework. Arm's documentation describes the Generic Timer as a common timer framework for A-profile processing elements with defined programming interfaces (weight 0.81, authoritative backing: https://support.arm.com/documentation/102379/0101/The-processor-timers). A virtualization example shows the architectural system counter being virtualized for guests on arm64, which confirms the counter is the architectural system-count source on that architecture (weak backing, weight 0.40: https://docs.kernel.org/6.1/virt/hyperv/clocks.html).

## Implication for yubiOS

The implementation exists, is stable across vendor forks and releases, and reports protection level 1000 by construction when the flag is set. What no search result proves is the RK3399/RK3588-specific fact that matters: that the active OP-TEE platform configuration on those boards is built with `CFG_SECURE_TIME_SOURCE_CNTPCT=y` and not with the REE fallback. The flag is a build-time constant; proving it requires inspecting the actual firmware build configuration on the target board, which is the hardware evidence the yubiOS refs source doc still requires.
