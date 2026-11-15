# 031 - tpm2-geteccparameters (`tpm2_geteccparameters`)

**Scope:** tpm2_geteccparameters(1): Retrieves the parameters of an ECC curve identified by its TCG-assigned curveID.
**Upstream Manpage:** `man/tpm2_geteccparameters.1.md` in `tpm2-software/tpm2-tools` ([tpm2_geteccparameters - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_geteccparameters.1/), weight 0.9909).
**Multiplexed Invocation:** `tpm2_geteccparameters [OPTIONS]` or `tpm2 geteccparameters [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_geteccparameters.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_geteccparameters.1.md), weight 0.9827).

## 1. Command Overview & yubiOS Role

`tpm2_geteccparameters` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_geteccparameters - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_geteccparameters.1/), weight 0.9909). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_geteccparameters.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_geteccparameters.1.md), weight 0.9827)

## 2. Name

**tpm2_geteccparameters**(1) - Retrieves the parameters of an ECC curve
identified by its TCG-assigned curveID. ([tpm2_geteccparameters - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_geteccparameters.1/), weight 0.9909)

## 3. Synopsis

**tpm2_geteccparameters** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_geteccparameters.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_geteccparameters.1.md), weight 0.9827)

## 4. Description

**tpm2_geteccparameters**(1) - Retrieves the parameters of an ECC curve
identified by its TCG-assigned curveID. ([tpm2_geteccparameters - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_geteccparameters.1/), weight 0.9909)

## 5. Options

* **ARGUMENT**=_ALGORITHM_:

    Specify the ECC curve. Example ecc521.

  * **-o**, **\--output**=_FILE_

    Specify the file path to save the ECC parameters.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_geteccparameters.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_geteccparameters.1.md), weight 0.9827)

## 6. Examples

```bash
tpm2_geteccparameters ecc256 -o ecc.params
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_geteccparameters - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_geteccparameters.1/), weight 0.9909)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_geteccparameters tpm2-tools man page options examples` | **0.9039** | authoritative (kept) |
| 2 | [tpm2_geteccparameters - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_geteccparameters.1/) | `tpm2_geteccparameters tpm2-tools man page options examples` | **0.9909** | authoritative (kept) |
| 3 | [tpm2_geteccparameters: Retrieves the parameters of an ECC curve ...](https://www.mankier.com/1/tpm2_geteccparameters) | `tpm2_geteccparameters tpm2-tools man page options examples` | **0.3498** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_geteccparameters.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_geteccparameters.1.md) | `tpm2_geteccparameters tpm2-tools man page options examples` | **0.9827** | authoritative (kept) |
