# 042 - tpm2-incrementalselftest (`tpm2_incrementalselftest`)

**Scope:** tpm2_incrementalselftest(1): Request testing of specified algorithm list
**Upstream Manpage:** `man/tpm2_incrementalselftest.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_incrementalselftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_incrementalselftest.1.md), weight 0.9896).
**Multiplexed Invocation:** `tpm2_incrementalselftest [OPTIONS]` or `tpm2 incrementalselftest [OPTIONS]` ([tpm2_incrementalselftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_incrementalselftest.1/), weight 0.9873).

## 1. Command Overview & yubiOS Role

`tpm2_incrementalselftest` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_incrementalselftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_incrementalselftest.1.md), weight 0.9896). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2_incrementalselftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_incrementalselftest.1/), weight 0.9873)

## 2. Name

**tpm2_incrementalselftest**(1) - Request testing of specified algorithm list ([tpm2-software/tpm2-tools: man/tpm2_incrementalselftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_incrementalselftest.1.md), weight 0.9896)

## 3. Synopsis

**tpm2_incrementalselftest** [*OPTIONS*] _ALG\_SPEC\_LIST_ ([tpm2_incrementalselftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_incrementalselftest.1/), weight 0.9873)

## 4. Description

**tpm2_incrementalselftest**(1) Request the TPM to perform testing on specified
algorithm and print a list of algorithm scheduled to be tested *OR* remain to be
tested but not scheduled.

The main interest of this command is to reduce delays that might occur on
cryptographic operations as TPM must test the algorithm prior using it. ([tpm2-software/tpm2-tools: man/tpm2_incrementalselftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_incrementalselftest.1.md), weight 0.9896)

## 5. Alg\_Spec\_List

A space-separated list of algorithm suite to be tested. Algorithms should follow
the "formatting standards", see section "Algorithm Specifiers". Also, see
section "Supported Hash Algorithms" for a list of supported hash algorithms.

If _ALG\_SPEC\_LIST_ is left empty, **tpm2_incrementalselftest**(1) will return
the list of algorithms left to be tested. Please note that in this case these
algorithms are **NOT** scheduled to be tested.

If _ALG\_SPEC\_LIST_ is not empty, **tpm2_incrementalselftest**(1) will return
the list of algorithms that remains to be tested. This list contains algorithms
scheduled for testing AND algorithms that remains to be tested and not yet
scheduled. This can occur for instance if all AES mode have not been already
tested yet. ([tpm2_incrementalselftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_incrementalselftest.1/), weight 0.9873)

## 6. Output

List of algorithms to be tested (implying scheduled) or remain to be tested
(not scheduled) is also printed in YAML format.

If none of the specified algorithm is printed, that means both that they are
already tested AND that these algorithms won't be tested again. ([tpm2-software/tpm2-tools: man/tpm2_incrementalselftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_incrementalselftest.1.md), weight 0.9896)

## 7. Options

This tool accepts no tool specific options.

### References

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_incrementalselftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_incrementalselftest.1/), weight 0.9873)

## 8. Examples

### Request testing of RSA algorithm

```bash
tpm2_incrementalselftest rsa
```

### Request testing of multiple algorithms

```bash
tpm2_incrementalselftest rsa ecc xor aes cbc
``` ([tpm2-software/tpm2-tools: man/tpm2_incrementalselftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_incrementalselftest.1.md), weight 0.9896)

## 9. Notes

Algorithm suite specified can imply either testing the combination or the
complete suite, depending on TPM manufacturer implementation.

e.g : One TPM might only test AES with CTR mode if "aes ctr" is specified. An
other might also test complete AES mode list AND test ctr mode.

If an algorithm has already been tested, this command won't permit re-executing
the test. Only issuing **tpm2_selftest**(1) in full-test mode enabled will force
re-testing.

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_incrementalselftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_incrementalselftest.1/), weight 0.9873)

## 10. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_incrementalselftest (1)  -  tpm2-tools  -  Debian testing ...](https://manpages.debian.org/testing/tpm2-tools/tpm2_incrementalselftest.1.en.html) | `tpm2_incrementalselftest tpm2-tools man page options examples` | **0.9756** | authoritative (kept) |
| 2 | [tpm2_incrementalselftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_incrementalselftest.1/) | `tpm2_incrementalselftest tpm2-tools man page options examples` | **0.9873** | authoritative (kept) |
| 3 | [tpm2_incrementalselftest: Request testing of specified algorithm list ...](https://www.mankier.com/1/tpm2_incrementalselftest) | `tpm2_incrementalselftest tpm2-tools man page options examples` | **0.1701** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_incrementalselftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_incrementalselftest.1.md) | `tpm2_incrementalselftest tpm2-tools man page options examples` | **0.9896** | authoritative (kept) |
