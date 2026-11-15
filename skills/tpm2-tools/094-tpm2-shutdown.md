# 094 - tpm2-shutdown (`tpm2_shutdown`)

**Scope:** tpm2_shutdown(1): Send a shutdown command to the TPM.
**Upstream Manpage:** `man/tpm2_shutdown.1.md` in `tpm2-software/tpm2-tools` ([tpm2_shutdown - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_shutdown.1/), weight 0.9912).
**Multiplexed Invocation:** `tpm2_shutdown [OPTIONS]` or `tpm2 shutdown [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_shutdown.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_shutdown.1.md), weight 0.9888).

## 1. Command Overview & yubiOS Role

`tpm2_shutdown` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_shutdown - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_shutdown.1/), weight 0.9912). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_shutdown.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_shutdown.1.md), weight 0.9888)

## 2. Name

**tpm2_shutdown**(1) - Send a shutdown command to the TPM. ([tpm2_shutdown - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_shutdown.1/), weight 0.9912)

## 3. Synopsis

**tpm2_shutdown** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_shutdown.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_shutdown.1.md), weight 0.9888)

## 4. Description

**tpm2_shutdown**(1) - Send a **TPM2_Shutdown** command with either
**TPM_SU_CLEAR** or **TPM_SU_STATE**. ([tpm2_shutdown - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_shutdown.1/), weight 0.9912)

## 5. Options

* **-c**, **\--clear**:

    Shutdown type sent will be **TPM_SU_CLEAR** instead of **TPM2_SU_STATE**.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_shutdown.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_shutdown.1.md), weight 0.9888)

## 6. Examples

### Send a TPM Shutdown Command with flags TPM2\_SU\_STATE
```bash
tpm2_shutdown
```

### Send a TPM Shutdown Command with flags TPM2\_SU\_CLEAR
```bash
tpm2_shutdown -c
``` ([tpm2_shutdown - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_shutdown.1/), weight 0.9912)

## 7. Notes

Typically a Resource Manager (like
[tpm2-abrmd](https://github.com/tpm2-software/tpm2-abrmd)) or low-level/boot
software will have already sent this command.

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_shutdown.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_shutdown.1.md), weight 0.9888)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_shutdown - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_shutdown.1/) | `tpm2_shutdown tpm2-tools man page options examples` | **0.9912** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_shutdown tpm2-tools man page options examples` | **0.8897** | authoritative (kept) |
| 3 | [tpm2_shutdown: Send a shutdown command to the TPM. / Man Page ...](https://www.mankier.com/1/tpm2_shutdown) | `tpm2_shutdown tpm2-tools man page options examples` | **0.1845** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_shutdown.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_shutdown.1.md) | `tpm2_shutdown tpm2-tools man page options examples` | **0.9888** | authoritative (kept) |
