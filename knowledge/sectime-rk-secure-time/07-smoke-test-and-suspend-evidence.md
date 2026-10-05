# Smoke-test design and suspend-resume evidence for secure time

Scope: the smoke-test design (a TA reading TEE_GetSystemTime and the protection level, a REE clock-move check, and per-board suspend/resume repetition on ROCK 5B/RK3588 and ROCKPro64/RK3399) and the CNTPCT continuity question across suspend states.

## What the counter does across sleep states

The physical counter CNTPCT that backs a TEE-controlled time source is part of the Arm Generic Timer. Arm's architecture documentation specifies the count and frequency registers: `CNTFRQ_EL0` reports the frequency of the system count, is not populated by hardware, and is writable at the highest implemented exception level and readable at all exception levels. Armv8.6-A and Armv9.1-A added a self-synchronizing version of `CNTPCT_EL0` called `CNTPCTSS_EL0` (weight 0.85, authoritative backing: https://support.arm.com/documentation/102379/0104/The-processor-timers/Count-and-frequency?lang=en). Two renderings of the Generic Timer programmer's guide repeat the framework description (weight 0.85, authoritative backing: https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/Learn%20the%20Architecture/Generic%20Timer.pdf?revision=c710e7a7-9f52-4901-8c9d-91b19f44f9c7; weight 0.51, authoritative backing: https://willendless.github.io/assets/os_arm_doc/aarch64-generic-timer.pdf).

Nothing in the architecture documentation surfaced by this dig states what happens to the system counter across deep sleep states on a specific SoC family. That is precisely why the yubiOS refs source doc requires suspend/resume to be measured per board: if CNTPCT continuity differs across suspend states, the ADR language must name the supported suspend state or avoid relying on secure-time continuity across suspend. The continuity claim on RK3399/RK3588 is open hardware evidence.

## What the test can assert through OP-TEE's own surfaces

OP-TEE maintains a test suite: `optee_test.git` contains the TEE sanity test suite (xtest) running in Linux using ARM TrustZone (weight 0.58, authoritative backing: https://optee.readthedocs.io/en/latest/building/gits/optee_test.html). OP-TEE itself implements the GlobalPlatform TEE Internal Core API (v1.1.x per the project page) exposed to Trusted Applications (weight 0.72, authoritative backing: https://www.trustedfirmware.org/projects/op-tee/).

Two maintainer threads constrain what a test can and cannot see, both weakly backed.

A platform that sets `CFG_SECURE_TIME_SOURCE_CNTPCT=y` reports `gpd.tee.systemTime.protectionLevel` 1000; if REE time is the intended source the flag should be `CFG_SECURE_TIME_SOURCE_REE=y` instead, and a wrong setting shows up as a panic with `TEE_GetSystemTime()` returning `TEE_ERROR_TARGET_DEAD` (weak backing, weight 0.22: https://github.com/OP-TEE/optee_os/issues/4029).

Since GlobalPlatform TEE Internal Core API v1.1, protection level 1000 requires a calibrated time origin, needing a secure RTC or similar platform support (weak backing, weight 0.30: https://github.com/OP-TEE/optee_os/issues/5973).

A Stack Overflow answer describes the minimum guarantee a TA test can rely on: `TEE_GetSystemTime` returns milliseconds since 1970-01-01, the value cannot decrease while the TA runs, the REE may control the speed, and there is no guarantee across reboots (weak backing, weight 0.07: https://stackoverflow.com/questions/68544061/how-to-get-a-utc-timestamp-in-op-tee-trusted-application-ta-in-datetime-format).

## The test design, from the yubiOS refs source doc

The source doc (sectime-rk-secure-time-2026-07-17) specifies a tiny OP-TEE TA plus Linux client that:

1. Reads `TEE_GetSystemTime()` and the system-time protection level from secure world.
2. Sleeps in normal world and verifies the second secure-world read is not earlier than the first.
3. Attempts to move REE wall-clock time backward and verifies secure-world time does not follow it.
4. Repeats after a suspend/resume cycle on ROCK 5B/RK3588 and ROCKPro64/RK3399.
5. Records TF-A/OP-TEE build refs, `CFG_SECURE_TIME_SOURCE_CNTPCT`, `SPD=opteed`, board, kernel version, and pass/fail logs in `refs/`.

Expected pass for the TEE-controlled path: protection level 1000, monotonic reads during the tested boot, and no dependence on REE wall-clock changes. Expected non-claim areas: reboot and power-loss rollback, and remote freshness.

The transport for steps 1 and 2 is the standard Linux OP-TEE stack (libteec, TEE Client API, kernel OP-TEE driver over SMCCC), documented in doc 05 of this corpus. The xtest suite provides the harness conventions for packaging the new TA alongside existing tests (weight 0.58, authoritative backing: https://optee.readthedocs.io/en/latest/building/gits/optee_test.html).

## Evidence discipline

The evidence set in step 5 is deliberately falsifiable: build refs and config flags pin which OP-TEE and TF-A were running, the board and kernel pin the hardware and REE side, and the pass/fail logs pin the observed behavior. An ADR citing secure time should be able to point at that evidence record rather than at a source-code expectation.
