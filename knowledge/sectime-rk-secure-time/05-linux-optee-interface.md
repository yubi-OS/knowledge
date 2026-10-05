# The Linux OP-TEE driver and the SMCCC protocol

Scope: how the Linux OP-TEE driver communicates with OP-TEE over the ARM SMCCC/SMC protocol and message protocol, and how normal-world clients reach Trusted Applications, the transport a yubiOS smoke-test client would use.

## Where the driver lives and what it builds on

The OP-TEE Linux driver is implemented in `drivers/tee/optee` since Linux kernel 4.12, and is designed so that the Linux thread invoking OP-TEE gets assigned a trusted thread on the TEE side (weight 0.73, authoritative backing: https://app.readthedocs.org/projects/optee/downloads/pdf/latest/). The kernel documentation states that the OP-TEE driver handles OP-TEE-based TEEs, currently only the ARM TrustZone-based OP-TEE solution, and that the lowest level of communication builds on the ARM SMC Calling Convention (SMCCC), which is the foundation for OP-TEE's SMC interface used internally by the driver (weight 0.69, authoritative backing: https://github.com/torvalds/linux/blob/master/Documentation/tee/op-tee.rst; duplicate content at weight 0.83: https://github.com/torvalds/linux/blob/master/Documentation/tee/op-tee.rst and weight 0.89: https://www.kernel.org/doc/Documentation/tee/op-tee.rst).

## The SMC and message protocol layer

The kernel documentation names the protocol surface: `OPTEE_SMC_CALL_WITH_ARG` drives the OP-TEE message protocol, and `OPTEE_SMC_GET_SHM_CONFIG` lets the driver and OP-TEE agree on which memory range to use for shared memory between Linux and OP-TEE. The GlobalPlatform TEE Client API is implemented on top of the generic TEE API (weight 0.93, authoritative backing: https://docs.kernel.org/tee/op-tee.html; duplicate of the same documentation at weight 0.94: https://docs.kernel.org/next/tee/op-tee.html and weight 0.90: https://docs.kernel.org/next/tee/op-tee.html).

The TEE subsystem page lists the family of TEE drivers the subsystem hosts beyond OP-TEE, including AMD-TEE, TS-TEE for the Trusted Services project, and QTEE for Qualcomm (weight 0.88, authoritative backing: https://docs.kernel.org/next/tee/index.html; subsystem index also at weight 0.85: https://docs.kernel.org/tee/index.html and weight 0.88: https://www.kernel.org/doc/html/v5.19/staging/tee.html).

## The userland side

On Linux userland, `optee_client` contains the source code for the TEE client library, providing the TEE Client API as defined by the GlobalPlatform TEE standard, distributed under the BSD 2-clause license, with `libteec.so` as the main library for communicating with the TEE (weight 0.89, authoritative backing: https://optee.readthedocs.io/en/latest/building/gits/optee_client.html).

## Implication for yubiOS

The transport for the smoke test defined in the yubiOS refs source doc is fully standardized: a Linux client process uses libteec and the GlobalPlatform TEE Client API, the kernel OP-TEE driver carries the request over SMCCC-based SMC calls and the OP-TEE message protocol, and OP-TEE in secure world executes the TA that reads `TEE_GetSystemTime()` and the protection level. None of this transport layer needs new engineering. What the transport cannot do is vouch for the time properties themselves; it delivers whatever value the active time source produces, which is why the smoke test must assert on the protection level and monotonicity behavior rather than trusting the read.
