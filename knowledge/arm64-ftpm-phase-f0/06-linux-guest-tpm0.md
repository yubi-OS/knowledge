# 06 - Linux guest integration: /dev/tpm0 and the tpm_ftpm_tee driver

Scope: how the guest kernel exposes the fTPM as standard TPM devices through the `tpm_ftpm_tee` driver, the config gates `CONFIG_TEE`, `CONFIG_OPTEE`, `CONFIG_TCG_TPM`, and `CONFIG_TCG_FTPM_TEE`, and what the done-condition checks of `/dev/tpm0`, `/dev/tpmrm0`, and `TPM2_Startup` actually verify.

## The driver design

The Linux firmware TPM driver is a shim for firmware implemented in ARM's TrustZone environment. The driver allows programs to interact with the TPM in the same way they would interact with a hardware TPM, and it acts as a thin layer that passes commands to and from a TPM implemented in the trusted execution environment (https://www.kernel.org/doc/html/latest/security/tpm/tpm_ftpm_tee.html, weight 0.925, with the same text documented at https://docs.kernel.org/6.1/security/tpm/tpm_ftpm_tee.html, weight 0.894 and in the v5.5 docs at https://www.kernel.org/doc/html/v5.5/security/tpm/tpm_ftpm_tee.html, weight 0.944). The driver source lives at `drivers/char/tpm/tpm_ftpm_tee.c` in the mainline tree (https://github.com/torvalds/linux/blob/master/drivers/char/tpm/tpm_ftpm_tee.c, weight 0.931).

This design is what makes the plan's done condition portable: a user-space `tpm2-tools` client that works against a discrete TPM also works against the fTPM, because the shim presents the standard TPM character device interface.

## The config chain

The plan's kernel config gates are `CONFIG_TEE=y`, `CONFIG_OPTEE=y`, `CONFIG_TCG_TPM=y`, and `CONFIG_TCG_FTPM_TEE=m`. The last one being a module matches how real deployments behave: NVIDIA's Jetson flow deliberately keeps the fTPM out of kernel init by blacklisting the module and loading it by hand from user space once `tee-supplicant` and its RPMB backing store are ready (https://github.com/10GiC10V38/jetson-ima-attestation, weight 0.320, weak backing). Building the driver as a module is what makes that deferral possible, and it is the config-level expression of the same boot-ordering hazard the plan documents.

The TEE and OPTEE gates provide the OP-TEE driver framework the fTPM shim rides on, and `CONFIG_TCG_TPM` provides the TPM core that owns the character devices.

## The device nodes

Two device nodes are the observable output of a working stack: `/dev/tpm0` and `/dev/tpmrm0`. Third-party documentation of the pair describes `/dev/tpmrm0` as the resource-managed access path, recommended for normal use, and `/dev/tpm0` as direct access with one client at a time, with the `tpm2-tss` package providing the user-space software stack and `tpm2-tools` the command-line utilities (https://linuxvox.com/blog/trusted-platform-module-linux/, weight 0.075, weak backing). A more detailed guide of the same devices explains how `tpm2_pcrread` and `tpm2_pcrextend` fit into measured boot, disk encryption, and signed PCR policies in Linux (https://en.hwlibre.com/complete-guide-to-dev-tpm0-dev-tpmrm0-and-the-tpm2_pcrread-and-tpm2_pcr_extend-commands-in-linux/, weight 0.276, weak backing). The weak weights are honest here: device-node semantics are widely documented, but the dig returned mostly community pages, so these claims carry labeled weak backing rather than primary-source authority.

The plan's verifier requires both nodes to be present, which matches the standard behavior: a healthy TPM subsystem creates both the direct and the resource-managed device.

## TPM2_Startup and its boot-time context

`TPM2_Startup` is the first command a TPM expects after power-on, and its success is the plan's proof that the fTPM TA is alive and the transport works end to end. The command is non-trivial to get right in an emulated chain because of when it runs: the fTPM needs RPMB secure storage, which in the standard flow is only reachable through the user-space `tee-supplicant` daemon, while some subsystems such as IMA check for a TPM during kernel init, before user space (https://www.linkedin.com/posts/m-rajesh-reddy-463658170_embeddedsecurity-linux-optee-activity-7470858694788927488-7qXJ, weight 0.038, weak backing). The weak weight reflects the source class, but the sequencing problem it describes is corroborated by the stronger sources in the RPMB hazard doc: `tee-supplicant` has been responsible for RPMB communication, so access to secure storage has not been available until the system is fully up (https://www.linaro.org/blog/linaro-enables-op-tee-rpmb-access-directly-from-the-linux-kernel/, weight 0.733).

A guest that must run `TPM2_Startup` before `tee-supplicant` is available should expect an NV-related failure mode, and the plan's initramfs or deferral strategies exist for exactly this window.

## Boot-time interactions worth knowing

Systemd units can get in the way of a clean verification run: a report describes boot slowdown because of a `/dev/tpmrm0` start job and resolves it by masking `tpm2.target` (https://bbs.archlinux.org/viewtopic.php?id=296699, weight 0.066, weak backing). For a Phase F0 guest image, deciding explicitly whether `tpm2.target` and the userspace TPM resource managers start at boot, or whether the verifier drives the device directly, avoids nondeterministic first-boot behavior.

At the standard level, a TPM is a secure cryptoprocessor used for applications such as secure boot, key storage, and random number generation (https://wiki.archlinux.org/title/Trusted_Platform_Module, weight 0.797). The fTPM in the guest provides the same interface surface, which is why the Phase F0 verification script can reuse ordinary `tpm2-tools` invocations.

## What the done condition proves, item by item

The plan's in-guest checks each isolate a layer: the OP-TEE bus being up proves the TEE framework and OP-TEE driver initialized; `/dev/tpm0` and `/dev/tpmrm0` present proves the `tpm_ftpm_tee` shim bound to the fTPM TA and registered with the TPM core; `TPM2_Startup` succeeding proves the full command path through OP-TEE into the secure-world TA works; and a PCR extend changing the PCR value proves the measurement machinery, not just the admin path. A verifier that checks all of them in order has covered every hop of the normal-world to secure-world stack without needing any instrumentation inside the TA.
