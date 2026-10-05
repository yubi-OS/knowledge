# TF-A to OP-TEE handoff: BL32 loading through SPD=opteed

Scope: how Trusted Firmware-A loads OP-TEE as the BL32 secure payload through SPD=opteed, the security difference between boot-time loading and post-boot SMC loading, and what that means for trusting secure-world state at the time a clock source is read.

## Two loading modes, one recommended

TF-A's OP-TEE dispatcher documentation describes OP-TEE OS as a Trusted OS running at Secure EL1 and defines 2 modes for loading it. The default mode loads OP-TEE as the BL32 payload during boot and is the recommended technique for platforms to use (weight 0.92, authoritative backing: https://tf-a.docs.trustedfirmware.org/en/latest/components/spd/optee-dispatcher.html). The same text appears in the TF-A 2.15.0 docs (weight 0.72, authoritative backing: https://tf-a.docs.trustedfirmware.org/en/latest/components/spd/optee-dispatcher.html).

The alternative technique loads OP-TEE OS after boot via an SMC call by enabling the `OPTEE_ALLOW_SMC_LOAD` option, which was added specifically for ChromeOS (weight 0.83, authoritative backing: https://github.com/ARM-software/arm-trusted-firmware/blob/master/docs/components/spd/optee). TF-A is explicit that loading OP-TEE via an SMC call may be insecure depending on the platform configuration, and that anyone using that option must understand the risks of allowing the Trusted OS to be loaded this way (weight 0.69, authoritative backing: https://trustedfirmware-a.readthedocs.io/en/v2.12/components/spd/optee-dispatcher.html).

## What the dispatcher does

The `opteed` SPD implementation lives at `services/spd/opteed/opteed_main.c` and states its role: it executes at EL3, the Secure Monitor delegates all SMCs targeting the Trusted OS and Applications range to the dispatcher, the SPD either handles a request locally or delegates it to the Secure Payload, and it is responsible for initializing and maintaining communication with the secure payload (weight 0.80, authoritative backing: https://github.com/ARM-software/arm-trusted-firmware/blob/master/services/spd/opteed/opteed_main.c). A third-party overview describes the SPD framework as the component managing BL32 initialization, context switching between security worlds, and Secure EL1 interrupt handling (weak backing, weight 0.20: https://deepwiki.com/mtk-openwrt/arm-trusted-firmware/4.4-secure-payload-dispatchers-(spd):-tspd-op-tee-trusty-tlk).

TF-A's firmware design documentation places this in the boot structure: the cold boot path runs through the boot stages, and after boot TF-A exposes runtime services including PSCI, which normal-world software reaches via the Arm SMC instruction (weight 0.91, authoritative backing: https://trustedfirmware-a.readthedocs.io/en/latest/design/firmware-design.html).

## Verified loading versus merely correct loading

The reason loading mode matters for a time claim is chain of custody. OP-TEE's own secure-boot documentation describes verifying OP-TEE using the authentication framework in TF-A, that is, authenticating the OP-TEE image during the TF-A boot chain (weight 0.82, authoritative backing: https://optee.readthedocs.io/en/latest/architecture/secure_boot.html). A platform reference implementation shows what a fully verified path looks like: STM32MPU profiles run OP-TEE in secure SYSRAM with the OP-TEE pager enabled, on top of the STM32 MPU ROM code secure boot and TF-A BL2 Trusted Board Boot (weight 0.82, authoritative backing: https://wiki.st.com/stm32mpu/wiki/STM32MPU_OP-TEE_profiles).

If OP-TEE is instead loaded later by normal-world software over SMC, the normal world chose which binary the secure world runs. Any guarantee that depends on secure-world code being unmodified, including the code that reads CNTPCT and reports protection level 1000, inherits that doubt.

## Implication for yubiOS

The yubiOS refs source doc requires that OP-TEE boots as BL32 through TF-A `SPD=opteed` before any secure-time claim is made. The dig supports the mechanism: BL32 boot-time loading is the recommended mode, SMC loading exists but carries an explicit TF-A warning. The remaining evidence is board-specific: the RK3399/RK3588 firmware build must be shown to select `SPD=opteed` and the BL32 path, and to the extent the platform uses TF-A Trusted Board Boot, the OP-TEE image should be inside the verified chain rather than loaded post boot.
