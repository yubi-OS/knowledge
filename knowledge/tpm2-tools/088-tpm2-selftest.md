# 088 - tpm2-selftest (`tpm2_selftest`)

**Scope:** tpm2_selftest(1): Run TPM's self-test internal routines
**Upstream Manpage:** `man/tpm2_selftest.1.md` in `tpm2-software/tpm2-tools` ([tpm2_selftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_selftest.1/), weight 0.9927).
**Multiplexed Invocation:** `tpm2_selftest [OPTIONS]` or `tpm2 selftest [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_selftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_selftest.1.md), weight 0.9912).

## 1. Command Overview & yubiOS Role

`tpm2_selftest` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_selftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_selftest.1/), weight 0.9927). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_selftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_selftest.1.md), weight 0.9912)

## 2. Name

**tpm2_selftest**(1) - Run TPM's self-test internal routines ([tpm2_selftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_selftest.1/), weight 0.9927)

## 3. Synopsis

**tpm2_selftest** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_selftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_selftest.1.md), weight 0.9912)

## 4. Description

**tpm2_selftest**(1) - Cause the TPM to execute self-test of its capabilities.

Self-test can be executed in two modes :

* Simple test - TPM will test functions that require testing
* Full test - TPM will test all functions regardless of what has already been
tested

Once the TPM receives this request, the TPM will return TPM\_RC\_TESTING for any
command that requires a test. If a test fails, the TPM will return
TPM\_RC\_FAILURE for any command other than TPM2\_GetTestResult() and
TPM2\_GetCapability() during this time. The TPM will remain in failure mode
until the next TPM initialization. ([tpm2_selftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_selftest.1/), weight 0.9927)

## 5. Options

* **-f**, **\--fulltest** : Run self-test in full mode

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_selftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_selftest.1.md), weight 0.9912)

## 6. Examples

### Perform a simple TPM self-test
```bash
tpm2_selftest
```

### Perform a complete TPM self-test
```bash
tpm2_selftest -f
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_selftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_selftest.1/), weight 0.9927)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_selftest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_selftest.1/) | `tpm2_selftest tpm2-tools man page options examples` | **0.9927** | authoritative (kept) |
| 2 | [tpm2_selftest: Run TPM's self-test internal routines / Man Page ...](https://www.mankier.com/1/tpm2_selftest) | `tpm2_selftest tpm2-tools man page options examples` | **0.2477** | low-weight (weak backing) |
| 3 | [tpm2_selftest (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_selftest.1.en.html) | `tpm2_selftest tpm2-tools man page options examples` | **0.9676** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_selftest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_selftest.1.md) | `tpm2_selftest tpm2-tools man page options examples` | **0.9912** | authoritative (kept) |
