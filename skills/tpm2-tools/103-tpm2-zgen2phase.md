# 103 - tpm2-zgen2phase (`tpm2_zgen2phase`)

**Scope:** tpm2_zgen2phase(1): Command to enable the TPM to combine data from the other party with the ephemeral key generated in the first phase of two-phase key exchange protocols.
**Upstream Manpage:** `man/tpm2_zgen2phase.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_zgen2phase.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_zgen2phase.1.md), weight 0.9917).
**Multiplexed Invocation:** `tpm2_zgen2phase [OPTIONS]` or `tpm2 zgen2phase [OPTIONS]` ([tpm2_zgen2phase - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_zgen2phase.1/), weight 0.9900).

## 1. Command Overview & yubiOS Role

`tpm2_zgen2phase` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_zgen2phase.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_zgen2phase.1.md), weight 0.9917). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2_zgen2phase - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_zgen2phase.1/), weight 0.9900)

## 2. Name

**tpm2_zgen2phase**(1) - Command to enable the TPM to combine data from the
other party with the ephemeral key generated in the first phase of two-phase
key exchange protocols. ([tpm2-software/tpm2-tools: man/tpm2_zgen2phase.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_zgen2phase.1.md), weight 0.9917)

## 3. Synopsis

**tpm2_zgen2phase** [*OPTIONS*] ([tpm2_zgen2phase - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_zgen2phase.1/), weight 0.9900)

## 4. Description

**tpm2_zgen2phase**(1) - Command to enable the TPM to combine data from the
other party with the ephemeral key generated in the first phase of two-phase
key exchange protocols. ([tpm2-software/tpm2-tools: man/tpm2_zgen2phase.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_zgen2phase.1.md), weight 0.9917)

## 5. Options

* **-c**, **\--key-context**=_FILE_:

    Context object pointing to ECC key.
    Either a file or a handle number. See section "Context Object Format".

  * **-p**, **\--key-auth**=_AUTH_:

    The authorization value for the ECC key object.

  * **-s**, **\--scheme**=_ALGORITHM_:

    The key exchange scheme. Optional. Valid options are ecdh or sm2.

  * **-t**, **\--counter**=_NATURALNUMBER_:

    The commit count to determine the key index to use.

  * **\--static-public**=_FILE_:

    The static public key input of the other party.

  * **\--ephemeral-public**=_FILE_:

    The ephemeral public key input of the other party.

  * **\--output-Z1**=_FILE_

    Specify file path to save the calculated ecdh secret Z1 point.

  * **\--output-Z2**=_FILE_

    Specify file path to save the calculated ecdh secret Z2 point.

### References

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_zgen2phase - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_zgen2phase.1/), weight 0.9900)

## 6. Examples

```bash
tpm2_createprimary -C o -c prim.ctx -Q

tpm2_create -C prim.ctx -c key.ctx -u key.pub -r key.priv -G ecc256:ecdh -Q

tpm2_ecephemeral -u ecc.q -t ecc.ctr ecc256

tpm2_ecdhkeygen -u ecdh.pub -o ecdh.priv -c key.ctx

tpm2_zgen2phase -c key.ctx --static-public ecdh.pub --ephemeral-public ecc.q \
-t 0 --output-Z1 z1.bin --output-Z2 z2.bin
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_zgen2phase.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_zgen2phase.1.md), weight 0.9917)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_zgen2phase (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_zgen2phase.1.en.html) | `tpm2_zgen2phase tpm2-tools man page options examples` | **0.9763** | authoritative (kept) |
| 2 | [tpm2_zgen2phase - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_zgen2phase.1/) | `tpm2_zgen2phase tpm2-tools man page options examples` | **0.9900** | authoritative (kept) |
| 3 | [tpm2_zgen2phase / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2_zgen2phase) | `tpm2_zgen2phase tpm2-tools man page options examples` | **0.2742** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_zgen2phase.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_zgen2phase.1.md) | `tpm2_zgen2phase tpm2-tools man page options examples` | **0.9917** | authoritative (kept) |
