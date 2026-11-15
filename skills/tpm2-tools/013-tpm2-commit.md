# 013 - tpm2-commit (`tpm2_commit`)

**Scope:** tpm2_commit(1): Performs the first part of an ECC anonymous signing operation.
**Upstream Manpage:** `man/tpm2_commit.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_commit.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_commit.1.md), weight 0.9906).
**Multiplexed Invocation:** `tpm2_commit [OPTIONS]` or `tpm2 commit [OPTIONS]` ([tpm2_commit - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_commit.1/), weight 0.9797).

## 1. Command Overview & yubiOS Role

`tpm2_commit` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_commit.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_commit.1.md), weight 0.9906). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2_commit - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_commit.1/), weight 0.9797)

## 2. Name

**tpm2_commit**(1) - Performs the first part of an ECC anonymous signing
operation. ([tpm2-software/tpm2-tools: man/tpm2_commit.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_commit.1.md), weight 0.9906)

## 3. Synopsis

**tpm2_commit** [*OPTIONS*] ([tpm2_commit - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_commit.1/), weight 0.9797)

## 4. Description

**tpm2_commit**(1) - Performs the first part of an ECC anonymous signing
operation. The TPM will perform the point multiplications on the provided points
and return intermediate signing values. The signing key is an ECC key. The key
cannot be a sign+decrypt key and must have an anonymous signing scheme.
TPM_ALG_ECDAA is the only supported anonymous scheme. ([tpm2-software/tpm2-tools: man/tpm2_commit.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_commit.1.md), weight 0.9906)

## 5. Options

* **ARGUMENT**=_FILE_:

    Specify the input data used to derive the x coordinate of the basepoint.

  * **\--basepoint-y**=_FILE_:

    Specify the y coordinate of the basepoint.

  * **\--eccpoint-P**=_FILE_:

    Specify a point on the curve used by sign handle.

  * **\--eccpoint-K**=_FILE_:

    Output ECC point K ≔ \[ds\](x2, y2).

  * **\--eccpoint-L**=_FILE_:

    Output ECC point L ≔ \[r\](x2, y2).

  * **-u**, **\--public**=_FILE_:

    Output ECC point E ≔ [r]P1.

  * **-t**, **\--counter**=_FILE_

    Specify file path to save the least-significant 16 bits of commit count.

  * **-p**, **\--auth**=_AUTH_:

    The authorization value for the created object.

  * **-c**, **\--context**=_FILE_:

    Context object pointing to the the key used for signing. Either a file or a
    handle number. See section "Context Object Format".

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
the various known TCTI modules. ([tpm2_commit - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_commit.1/), weight 0.9797)

## 6. Examples

```bash
tpm2_createprimary -C o -c prim.ctx -Q

tpm2_create -C prim.ctx -c key.ctx -u key.pub -r key.priv -G ecc256:ecdaa

tpm2_commit -c key.ctx -t count.er \
--eccpoint-K K.bin --eccpoint-L L.bin -u E.bin
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_commit.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_commit.1.md), weight 0.9906)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_commit tpm2-tools man page options examples` | **0.8858** | authoritative (kept) |
| 2 | [tpm2_commit - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_commit.1/) | `tpm2_commit tpm2-tools man page options examples` | **0.9797** | authoritative (kept) |
| 3 | [tpm2 (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2.1.en.html) | `tpm2_commit tpm2-tools man page options examples` | **0.8514** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_commit.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_commit.1.md) | `tpm2_commit tpm2-tools man page options examples` | **0.9906** | authoritative (kept) |
