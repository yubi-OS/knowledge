# 099 - tpm2-testparms (`tpm2_testparms`)

**Scope:** tpm2_testparms(1): Verify that specified algorithm suite is supported by TPM
**Upstream Manpage:** `man/tpm2_testparms.1.md` in `tpm2-software/tpm2-tools` ([tpm2_testparms - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_testparms.1/), weight 0.9882).
**Multiplexed Invocation:** `tpm2_testparms [OPTIONS]` or `tpm2 testparms [OPTIONS]` ([tpm2-tools/man/tpm2_testparms.1.md at master · tpm2-software ... - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_testparms.1.md), weight 0.9875).

## 1. Command Overview & yubiOS Role

`tpm2_testparms` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_testparms - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_testparms.1/), weight 0.9882). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-tools/man/tpm2_testparms.1.md at master · tpm2-software ... - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_testparms.1.md), weight 0.9875)

## 2. Name

**tpm2_testparms**(1) - Verify that specified algorithm suite is supported by TPM ([tpm2_testparms - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_testparms.1/), weight 0.9882)

## 3. Synopsis

**tpm2_testparms** [*OPTIONS*] [*ARGUMENT*] ([tpm2-tools/man/tpm2_testparms.1.md at master · tpm2-software ... - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_testparms.1.md), weight 0.9875)

## 4. Description

**tpm2_testparms**(1) - Checks that the suite specified by _ALG\_SPEC_ is
available for usage per _ALGORITHM_.

Algorithms should follow the "formatting standards", see section "Algorithm Specifiers".

Also, see section "Supported Signing Schemes" for a list of supported hash algorithms. ([tpm2_testparms - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_testparms.1/), weight 0.9882)

## 5. Options

This tool accepts no tool specific options.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules.

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**signature format specifiers** (`man/common/signature.md`): Format selection for the signature output file. **tss** (the default) will output a binary blob according to the TPM 2.0 specification and any potential compiler padding. The option **plain** will output the plain signature data as defined by the used cryptographic algorithm. ([tpm2-tools/man/tpm2_testparms.1.md at master · tpm2-software ... - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_testparms.1.md), weight 0.9875)

## 6. Examples

### Check whether if "rsa" is supported
```bash
tpm2_testparms rsa
```

### Check that ECDSA using P-256 with AES-128 CTR mode is available
```bash
tpm2_testparms ecc256:ecdsa:aes128ctr
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_testparms - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_testparms.1/), weight 0.9882)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_testparms - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_testparms.1/) | `tpm2_testparms tpm2-tools man page options examples` | **0.9882** | authoritative (kept) |
| 2 | [tpm2-tools/man/tpm2_testparms.1.md at master · tpm2-software ... - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_testparms.1.md) | `tpm2_testparms tpm2-tools man page options examples` | **0.9875** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_testparms tpm2-tools man page options examples` | **0.8615** | authoritative (kept) |
