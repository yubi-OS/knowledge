# 089 - tpm2-send (`tpm2_send`)

**Scope:** tpm2_send(1): Send a raw command buffer to the TPM.
**Upstream Manpage:** `man/tpm2_send.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_send.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_send.1.md), weight 0.9914).
**Multiplexed Invocation:** `tpm2_send [OPTIONS]` or `tpm2 send [OPTIONS]` ([tpm2_send - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_send.1/), weight 0.9902).

## 1. Command Overview & yubiOS Role

`tpm2_send` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_send.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_send.1.md), weight 0.9914). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2_send - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_send.1/), weight 0.9902)

## 2. Name

**tpm2_send**(1) - Send a raw command buffer to the TPM. ([tpm2-software/tpm2-tools: man/tpm2_send.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_send.1.md), weight 0.9914)

## 3. Synopsis

**tpm2_send** [*OPTIONS*] [*STDIN*] ([tpm2_send - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_send.1/), weight 0.9902)

## 4. Description

**tpm2_send**(1) - Sends a TPM command to the TPM. The command is read from a
file as a binary stream and transmitted to the TPM using the TCTI specified by
the caller. The response received from the TPM is written to the output file.

Likely the caller will want to redirect this to a file or into a
program to decode and display the response in a human readable form. ([tpm2-software/tpm2-tools: man/tpm2_send.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_send.1.md), weight 0.9914)

## 5. Options

* **-o**, **\--output**=_FILE_:

    Output file to send response buffer to. Defaults to _STDOUT_.

  * **_STDIN** the file containing the TPM2 command.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_send - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_send.1/), weight 0.9902)

## 6. Examples

### Send and receive raw commands to TPM

Send the contents of *tpm2-command.bin* to a device and collect the response as *tpm2-response.bin*.

```bash
tpm2_send < tpm2-command.bin > tpm2-response.bin

tpm2_send < tpm2-command.bin -o tpm2-response.bin
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_send.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_send.1.md), weight 0.9914)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_send - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_send.1/) | `tpm2_send tpm2-tools man page options examples` | **0.9902** | authoritative (kept) |
| 2 | [tpm2_send (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_send.1.en.html) | `tpm2_send tpm2-tools man page options examples` | **0.9832** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_send tpm2-tools man page options examples` | **0.8752** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_send.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_send.1.md) | `tpm2_send tpm2-tools man page options examples` | **0.9914** | authoritative (kept) |
