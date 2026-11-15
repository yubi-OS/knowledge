# 036 - tpm2-gettestresult (`tpm2_gettestresult`)

**Scope:** tpm2_gettestresult(1): Get the result of tests performed by the TPM
**Upstream Manpage:** `man/tpm2_gettestresult.1.md` in `tpm2-software/tpm2-tools` ([tpm2_gettestresult - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettestresult.1/), weight 0.9895).
**Multiplexed Invocation:** `tpm2_gettestresult [OPTIONS]` or `tpm2 gettestresult [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_gettestresult.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettestresult.1.md), weight 0.9890).

## 1. Command Overview & yubiOS Role

`tpm2_gettestresult` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_gettestresult - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettestresult.1/), weight 0.9895). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_gettestresult.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettestresult.1.md), weight 0.9890)

## 2. Name

**tpm2_gettestresult**(1) - Get the result of tests performed by the TPM ([tpm2_gettestresult - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettestresult.1/), weight 0.9895)

## 3. Synopsis

**tpm2_gettestresult** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_gettestresult.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettestresult.1.md), weight 0.9890)

## 4. Description

**tpm2_gettestresult**(1) will return the result of the tests conducted by the
TPM.

Error code will state if the test executed successfully or have failed.

If pending algorithms are scheduled to be tested, **tpm2_gettestresult** will
return "TESTING". Otherwise "FAILED" will be returned or "SUCCESS" depending
on the result to the test.

Manufacturer-dependent information will also be printed in raw hex format. ([tpm2_gettestresult - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettestresult.1/), weight 0.9895)

## 5. Options

This tool accepts no tool specific options.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the 

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h ([tpm2-software/tpm2-tools: man/tpm2_gettestresult.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettestresult.1.md), weight 0.9890)

## 6. Examples

### Get the result of the TPM testing

```bash
tpm2_gettestresult
``` ([tpm2_gettestresult - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettestresult.1/), weight 0.9895)

## 7. Notes

This command is the one of the few commands authorized to be submitted to TPM
when in failure mode.

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_gettestresult.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettestresult.1.md), weight 0.9890)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_gettestresult: Get the result of tests performed by the TPM / Man ...](https://www.mankier.com/1/tpm2_gettestresult) | `tpm2_gettestresult tpm2-tools man page options examples` | **0.4658** | low-weight (weak backing) |
| 2 | [tpm2_gettestresult - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettestresult.1/) | `tpm2_gettestresult tpm2-tools man page options examples` | **0.9895** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_gettestresult tpm2-tools man page options examples` | **0.8699** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_gettestresult.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettestresult.1.md) | `tpm2_gettestresult tpm2-tools man page options examples` | **0.9890** | authoritative (kept) |
