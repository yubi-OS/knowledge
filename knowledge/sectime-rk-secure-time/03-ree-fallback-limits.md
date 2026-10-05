# The REE-backed time fallback and why it cannot support secure-time claims

Scope: the REE-backed fallback time source, its rollback clamping within a boot, its protection level 100, and why it is insufficient for yubiOS secure-time claims.

## What the fallback is

The yubiOS refs source doc (sectime-rk-secure-time-2026-07-17) records that OP-TEE's `core/kernel/tee_time_ree.c` uses REE time, clamps rollback within a boot, and reports protection level 100, so it is not enough for yubiOS secure-time claims. Source: https://github.com/OP-TEE/optee_os/blob/afaebfcc6a21c87a6c924c40df2940f2b4c21d1d/core/kernel/tee_time_ree.c. This specific behavior set comes from the source doc's code-level reading of the upstream file; the present dig did not surface an independent weighted web result covering `tee_time_ree.c` itself, so the behavior claim carries the source doc's provenance rather than a jev weight.

The protection level 100 assigned to REE-controlled time is, however, independently grounded: GlobalPlatform's model maps REE-reliance to protection level 100 and TEE-controlled hardware assets to protection level 1000, citing GP TEE Internal Core API sections 2.5 and 5.2 (weight 0.70, authoritative backing: https://optee.readthedocs.io/en/latest/architecture/secure_storage.html).

## The threat model the fallback accepts

The GlobalPlatform Internal Core API specification is explicit that implementations may have to rely on untrusted real-time clocks and timers managed by the REE, which is precisely the trust position of the fallback path (weight 0.92, authoritative backing: https://globalplatform.org/wp-content/uploads/2018/06/GPD_TEE_Internal_Core_API_Specification_v1.1.2.50_PublicReview.pdf).

A Stack Overflow answer grounded in the Core API text states the minimum guarantee under REE-controlled time: the value cannot decrease while a trusted application is running, the REE may control at what speed it proceeds, and there is no guarantee across reboots (weak backing, weight 0.07: https://stackoverflow.com/questions/68544061/how-to-get-a-utc-timestamp-in-op-tee-trusted-application-ta-in-datetime-format). Within-boot rollback clamping is exactly the mechanism that delivers that "cannot decrease while running" minimum on the REE path.

## Why a clamped REE clock is still attacker-controlled

The rollback clamp bounds one specific attack: the REE pushing secure-world time backwards within a single boot. It does not bound the rest of the REE's control surface. The REE can still stretch or slow the clock, since the REE controls at what speed the value proceeds (weak backing, weight 0.07: https://stackoverflow.com/questions/68544061/how-to-get-a-utc-timestamp-in-op-tee-trusted-application-ta-in-datetime-format). For any yubiOS decision that depends on the rate of elapsed time passing, not merely its ordering, a clamped REE clock is attacker-influenced.

The structural reason the REE path is untrustworthy for security decisions is the world boundary itself: OP-TEE's core documentation describes the normal world and secure world switching through SMC exceptions and the Monitor, with the secure world reaching the kernel only through that boundary (weight 0.91, authoritative backing: https://optee.readthedocs.io/en/latest/architecture/core.html; duplicate of the same content at weight 0.94: https://optee.readthedocs.io/en/3.12.0/architecture/core.html). A clock whose value originates on the normal-world side of that boundary inherits the attacker's control.

Relevant REE/TEE communication protocols that carry such state (SCMI, PSCI, SMC) are surveyed in a Bootlin conference deck on OP-TEE and Linux interaction (weight 0.79, authoritative backing: https://bootlin.com/pub/conferences/2021/elc/leger-optee-linux-interaction/leger-optee-linux-interaction.pdf).

## Implication for yubiOS

A protection level of 100 is the specification's own signal that the time source is REE-controlled. If a RK3399/RK3588 OP-TEE build turns out to ship with `CFG_SECURE_TIME_SOURCE_REE=y` or no CNTPCT source at all, the only honest yubiOS claim is that secure-world time is REE-influenced and usable for nothing stronger than the within-boot minimum guarantee. Detecting which source is active is a build-inspection step, not a runtime guess.
