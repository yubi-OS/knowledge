# 022 - tpm2-ecdhzgen (`tpm2_ecdhzgen`)

**Scope:** tpm2_ecdhzgen(1): Recovers the shared secret value (Z) from a public point and a specified private key.
**Upstream Manpage:** `man/tpm2_ecdhzgen.1.md` in `tpm2-software/tpm2-tools` ([tpm2_ecdhzgen - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_ecdhzgen.1/), weight 0.9888).
**Multiplexed Invocation:** `tpm2_ecdhzgen [OPTIONS]` or `tpm2 ecdhzgen [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_ecdhzgen.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_ecdhzgen.1.md), weight 0.9847).

## 1. Command Overview & yubiOS Role

`tpm2_ecdhzgen` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_ecdhzgen - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_ecdhzgen.1/), weight 0.9888). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_ecdhzgen.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_ecdhzgen.1.md), weight 0.9847)

## 2. Name

**tpm2_ecdhzgen**(1) - Recovers the shared secret value (Z) from a public point
and a specified private key. ([tpm2_ecdhzgen - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_ecdhzgen.1/), weight 0.9888)

## 3. Synopsis

**tpm2_ecdhzgen** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_ecdhzgen.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_ecdhzgen.1.md), weight 0.9847)

## 4. Description

**tpm2_ecdhzgen**(1) - Recovers the shared secret value (Z) from a public point
and a specified private key. It will perform the multiplication of the provided
inPoint (QB) with the private key (ds) and return the coordinates of the
resultant point (Z = (xZ , yZ) ≔ [hds]QB; where h is the cofactor of the curve). ([tpm2_ecdhzgen - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_ecdhzgen.1/), weight 0.9888)

## 5. Options

* **-c**, **\--key-context**=_FILE_:

    Context object pointing to ECC key.
    Either a file or a handle number. See section "Context Object Format".

  * **-p**, **\--key-auth**=_AUTH_:

    The authorization value for the ECC key object.

  * **-u**, **\--public**=_FILE_:

    Input ECC point Q.

  * **-k**, **\--public-key**=_FILE_:

    Input ECC public key with point Q.

  * **-o**, **\--output**=_FILE_

    Specify file path to save the calculated ecdh secret or Z point.

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
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_ecdhzgen.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_ecdhzgen.1.md), weight 0.9847)

## 6. Examples

```bash
tpm2_createprimary -C o -c prim.ctx -Q

tpm2_create -C prim.ctx -c key.ctx -u key.pub -r key.priv -G ecc256:ecdh

tpm2_ecdhkeygen -u ecdh.pub -o ecdh.priv -c key.ctx

tpm2_ecdhzgen -u ecdh.pub -o ecdh.dat -c key.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_ecdhzgen - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_ecdhzgen.1/), weight 0.9888)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_ecdhzgen tpm2-tools man page options examples` | **0.7874** | authoritative (kept) |
| 2 | [tpm2_ecdhzgen: Recovers the shared secret value (Z) from a public point ...](https://www.mankier.com/1/tpm2_ecdhzgen) | `tpm2_ecdhzgen tpm2-tools man page options examples` | **0.1750** | low-weight (weak backing) |
| 3 | [tpm2_ecdhzgen - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_ecdhzgen.1/) | `tpm2_ecdhzgen tpm2-tools man page options examples` | **0.9888** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_ecdhzgen.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_ecdhzgen.1.md) | `tpm2_ecdhzgen tpm2-tools man page options examples` | **0.9847** | authoritative (kept) |
