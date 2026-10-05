# OP-TEE secure clock contract: REE time versus TEE-controlled time

Scope: OP-TEE's contract distinguishing REE time from system and TA persistent time, and the protection-level requirement (100 REE-controlled versus 1000 TEE-controlled) that governs what an OS may claim about secure time.

## The GlobalPlatform contract

The GlobalPlatform TEE Internal Core API specification states that the level of trust a Trusted Application can put in System Time and its TA Persistent Time is implementation-defined, because an implementation may not include fully trustable hardware sources of time and may have to rely on untrusted real-time clocks and timers managed by the Rich Execution Environment (weight 0.92, authoritative backing: https://globalplatform.org/wp-content/uploads/2018/06/GPD_TEE_Internal_Core_API_Specification_v1.1.2.50_PublicReview.pdf).

GlobalPlatform does not require a secure clock. OP-TEE's porting documentation states that from the GlobalPlatform point of view it is OK to use time from the REE, but the level of trust must be reflected by the `gpd.tee.systemTime.protectionLevel` property and the `gpd.tee.TAPersistentTime.protectionLevel` property, where 100 means an REE-controlled clock and 1000 means a TEE-controlled clock (weight 0.90, authoritative backing: https://github.com/OP-TEE/optee_docs/blob/master/architecture/porting_guidelines.rst).

The same 100 versus 1000 split appears in OP-TEE's secure-storage documentation, which cites GlobalPlatform TEE Internal Core API sections 2.5 and 5.2: an implementation may rely on the REE (protection level 100) or on hardware assets controlled by the TEE (protection level 1000) (weight 0.70, authoritative backing: https://optee.readthedocs.io/en/latest/architecture/secure_storage.html).

## What OP-TEE asks a porter to do

The OP-TEE porting guidelines instruct a porter whose hardware has a secure clock to change the time implementation to use it, and to update `tee_time_get_sys_time_protection_level()` and the variable `ta_time_prot_lvl` in `tee_svc.c` accordingly (weight 0.91, authoritative backing: https://optee.readthedocs.io/en/latest/architecture/porting_guidelines.html). A duplicate result confirms the same instructions (weight 0.50, authoritative backing: https://optee.readthedocs.io/en/latest/architecture/porting_guidelines.html).

OP-TEE ships with TEE Internal Core API v1.3.1 exposed to Trusted Applications and TEE Client API v1.0 for communication with the TEE, both defined in GlobalPlatform API specifications (weight 0.71, authoritative backing: https://app.readthedocs.org/projects/optee/downloads/pdf/latest/).

## The 1000 bar is higher than a counter read

Two maintainer threads qualify what protection level 1000 actually means, and both carry weak backing, so they are labeled as such here.

Since GlobalPlatform TEE Internal Core API v1.1, protection level 1000 requires a calibrated time origin, which needs a secure RTC or similar platform support. This means reading a free-running counter and reporting 1000 satisfies the counter-trust property but not necessarily the calibrated-origin property of the spec (weak backing, weight 0.31: https://github.com/OP-TEE/optee_os/issues/5973).

On TA persistent time specifically, OP-TEE maintainers note that current OP-TEE does not fully manage persistent time, and that reaching TAPersistentTime protection level 1000 requires the RTC to be secure (weak backing, weight 0.25: https://github.com/OP-TEE/optee_os/issues/7157).

A Stack Overflow answer aimed at TAs states the practical minimum guarantee: `TEE_GetSystemTime` returns milliseconds since 1970-01-01, the security level depends on the secure clocks available on the specific system, the absolute minimum guarantee is that the value cannot decrease while a trusted application is running, the REE may be able to control at what speed it proceeds, and there is no guarantee across reboots (weak backing, weight 0.18: https://stackoverflow.com/questions/68544061/how-to-get-a-utc-timestamp-in-op-tee-trusted-application-ta-in-datetime-format).

## Implication for yubiOS

The contract is explicit about what the property value advertises versus what the platform actually provides. A platform can legally report level 100 while running on REE time. It can also report 1000 on the strength of a counter read without a calibrated origin, which the maintainer thread above flags as non-compliant with Core API v1.1. Before yubiOS quotes any protection level in owner-facing security text, the active OP-TEE build must be shown to set the level that matches the implemented time source, and the claim must be scoped to what that level actually covers (calibrated origin, monotonicity within a boot, persistence across boots).
