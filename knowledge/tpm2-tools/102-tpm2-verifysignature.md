# 102 - tpm2-verifysignature (`tpm2_verifysignature`)

**Scope:** tpm2_verifysignature(1): Validates a signature using the TPM.
**Upstream Manpage:** `man/tpm2_verifysignature.1.md` in `tpm2-software/tpm2-tools` ([tpm2_verifysignature - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_verifysignature.1/), weight 0.9899).
**Multiplexed Invocation:** `tpm2_verifysignature [OPTIONS]` or `tpm2 verifysignature [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_verifysignature.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_verifysignature.1.md), weight 0.9766).

## 1. Command Overview & yubiOS Role

`tpm2_verifysignature` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_verifysignature - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_verifysignature.1/), weight 0.9899). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_verifysignature.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_verifysignature.1.md), weight 0.9766)

## 2. Name

**tpm2_verifysignature**(1) - Validates a signature using the TPM. ([tpm2_verifysignature - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_verifysignature.1/), weight 0.9899)

## 3. Synopsis

**tpm2_verifysignature** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_verifysignature.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_verifysignature.1.md), weight 0.9766)

## 4. Description

**tpm2_verifysignature**(1) - Uses loaded keys to validate a signature on a
message with the message digest passed to the TPM. If the signature check
succeeds, then the TPM will produce a **TPMT_TK_VERIFIED**. Otherwise, the TPM
shall return **TPM_RC_SIGNATURE**. If object references an asymmetric key, only
the public portion of the key needs to be loaded. If object references a
symmetric key, both the public and private portions need to be loaded. ([tpm2_verifysignature - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_verifysignature.1/), weight 0.9899)

## 5. Options

* **-c**, **\--key-context**=_OBJECT_:

    Context object for the key context used for the operation. Either a file
    or a handle number. See section "Context Object Format".

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm used to digest the message.
    Algorithms should follow the "formatting standards", see section
    "Algorithm Specifiers".
    Also, see section "Supported Hash Algorithms" for a list of supported hash
    algorithms.

  * **-m**, **\--message**=_FILE_:

    The message file, containing the content to be  digested.

  * **-d**, **\--digest**=_FILE_:

    The input hash file, containing the hash of the message. If this option is
    selected, then the message (**-m**) and algorithm (**-g**) options do not
    need to be specified.

  * **-s**, **\--signature**=_FILE_:

    The input signature file of the signature to be validated.

  * **-f**, **\--scheme**=_SCHEME_:

    The signing scheme that was used to sign the message. This option should only
    be specified if the signature comes in from a non *tss* standard, like openssl.
    See "Signature format specifiers" for more details. The *tss* format contains
    the signature metadata required to understand it's signature scheme.

    Signing schemes should follow the "formatting standards", see section
    "Algorithm Specifiers".

  * **\--format**=_SCHEME_:

    Deprecated. Same as **\--scheme**.

  * **-t**, **\--ticket**=_FILE_:

    The ticket file to record the validation structure.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules.

**signature format specifiers** (`man/common/signature.md`): Format selection for the signature output file. **tss** (the default) will output a binary blob according to the TPM 2.0 specification and any potential compiler padding. The option **plain** will output the plain signature data as defined by the used cryptographic algorithm. ([tpm2-software/tpm2-tools: man/tpm2_verifysignature.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_verifysignature.1.md), weight 0.9766)

## 6. Examples

### Sign and verify with the TPM using the *endorsement* hierarchy
```bash
tpm2_createprimary -C e -c primary.ctx

tpm2_create -G rsa -u rsa.pub -r rsa.priv -C primary.ctx

tpm2_load -C primary.ctx -u rsa.pub -r rsa.priv -c rsa.ctx

echo "my message" > message.dat

tpm2_sign -c rsa.ctx -g sha256 -s sig.rssa message.dat

tpm2_verifysignature -c rsa.ctx -g sha256 -m message.dat -s sig.rssa
```

### Sign with openssl and verify with the TPM
```bash ([tpm2_verifysignature - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_verifysignature.1/), weight 0.9899)

## 7. Generate An Ecc Key

openssl ecparam -name prime256v1 -genkey -noout -out private.ecc.pem

openssl ec -in private.ecc.pem -out public.ecc.pem -pubout ([tpm2-software/tpm2-tools: man/tpm2_verifysignature.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_verifysignature.1.md), weight 0.9766)

## 8. Generate A Hash To Sign (Ossl Needs The Hash Of The Message)

echo "data to sign" > data.in.raw

sha256sum data.in.raw | awk '{ print "000000 " $1 }' | \
xxd -r -c 32 > data.in.digest ([tpm2_verifysignature - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_verifysignature.1/), weight 0.9899)

## 9. Load The Private Key For Signing

tpm2_loadexternal -Q -G ecc -r private.ecc.pem -c key.ctx ([tpm2-software/tpm2-tools: man/tpm2_verifysignature.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_verifysignature.1.md), weight 0.9766)

## 10. Sign In The Tpm And Verify With Ossl

tpm2_sign -Q -c key.ctx -g sha256 -d data.in.digest -f plain -s data.out.signed

openssl dgst -verify public.ecc.pem -keyform pem -sha256 \
-signature data.out.signed data.in.raw ([tpm2_verifysignature - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_verifysignature.1/), weight 0.9899)

## 11. Sign With Openssl And Verify With Tpm

openssl dgst -sha256 -sign private.ecc.pem -out data.out.signed data.in.raw

tpm2_verifysignature -Q -c key.ctx -g sha256 -m data.in.raw -f ecdsa \
-s data.out.signed
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_verifysignature.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_verifysignature.1.md), weight 0.9766)

## 12. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_verifysignature - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_verifysignature.1/) | `tpm2_verifysignature tpm2-tools man page options examples` | **0.9899** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_verifysignature tpm2-tools man page options examples` | **0.6064** | authoritative (kept) |
| 3 | [tpm2_verifysignature (1)  -  Arch manual pages](https://man.archlinux.org/man/extra/tpm2-tools/tpm2_verifysignature.1.en) | `tpm2_verifysignature tpm2-tools man page options examples` | **0.9659** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_verifysignature.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_verifysignature.1.md) | `tpm2_verifysignature tpm2-tools man page options examples` | **0.9766** | authoritative (kept) |
