# 083 - tpm2-rc-decode (`tpm2_rc_decode`)

**Scope:** tpm2_rc_decode(1): Decode TPM2 error codes to a human readable format.
**Upstream Manpage:** `man/tpm2_rc_decode.1.md` in `tpm2-software/tpm2-tools` ([tpm2_rc_decode - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rc_decode.1/), weight 0.9916).
**Multiplexed Invocation:** `tpm2_rc_decode [OPTIONS]` or `tpm2 rc_decode [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_rc_decode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_rc_decode.1.md), weight 0.9898).

## 1. Command Overview & yubiOS Role

`tpm2_rc_decode` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_rc_decode - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rc_decode.1/), weight 0.9916). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_rc_decode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_rc_decode.1.md), weight 0.9898)

## 2. Name

**tpm2_rc_decode**(1) - Decode TPM2 error codes to a human readable format. ([tpm2_rc_decode - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rc_decode.1/), weight 0.9916)

## 3. Synopsis

**tpm2_rc_decode** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_rc_decode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_rc_decode.1.md), weight 0.9898)

## 4. Description

**tpm2_rc_decode**(1) - Converts an _RC\_CODE_ from the TPM or TSS2 software
stack into human readable errors. Analogous to **strerror**(3), but for the TPM2
stack. ([tpm2_rc_decode - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rc_decode.1/), weight 0.9916)

## 5. Options

This tool takes no tool specific options.

  * **ARGUMENT** the command line argument specifies the error code to be parsed.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect. ([tpm2-software/tpm2-tools: man/tpm2_rc_decode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_rc_decode.1.md), weight 0.9898)

## 6. Examples

```bash
tpm2_rc_decode 0x1d5
tpm:parameter(1):structure is the wrong size
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_rc_decode - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rc_decode.1/), weight 0.9916)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_rc_decode - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rc_decode.1/) | `tpm2_rc_decode tpm2-tools man page options examples` | **0.9916** | authoritative (kept) |
| 2 | [tpm2_rc_decode (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_rc_decode.1.en.html) | `tpm2_rc_decode tpm2-tools man page options examples` | **0.9634** | authoritative (kept) |
| 3 | [tpm2_rc_decode: Decode TPM2 error codes to a human readable ... - ManKier](https://www.mankier.com/1/tpm2_rc_decode) | `tpm2_rc_decode tpm2-tools man page options examples` | **0.2078** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_rc_decode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_rc_decode.1.md) | `tpm2_rc_decode tpm2-tools man page options examples` | **0.9898** | authoritative (kept) |
