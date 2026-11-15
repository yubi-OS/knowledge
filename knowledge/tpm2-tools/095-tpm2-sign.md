# 095 - tpm2-sign (`tpm2_sign`)

**Scope:** tpm2_sign(1): Sign a hash or message using the TPM.
**Upstream Manpage:** `man/tpm2_sign.1.md` in `tpm2-software/tpm2-tools` ([tpm2_sign - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sign.1/), weight 0.9928).
**Multiplexed Invocation:** `tpm2_sign [OPTIONS]` or `tpm2 sign [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_sign.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sign.1.md), weight 0.9916).

## 1. Command Overview & yubiOS Role

`tpm2_sign` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_sign - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sign.1/), weight 0.9928). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_sign.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sign.1.md), weight 0.9916)

## 2. Name

**tpm2_sign**(1) - Sign a hash or message using the TPM. ([tpm2_sign - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sign.1/), weight 0.9928)

## 3. Synopsis

**tpm2_sign** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_sign.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sign.1.md), weight 0.9916)

## 4. Description

**tpm2_sign**(1) - Generates signature of specified message or message-digest
using the specified symmetric or asymmetric signing key.

When signing a message, **tpm2_sign** utility first calculates the digest of the
message similar to the **tpm2_hash** command. It also generates a validation
ticket under TPM2_RH_NULL or TPM2_RH_OWNER hierarchies respectively for
unrestricted or the restricted signing keys.

While signing messages is a provision in this tool it is recommended to use the
**tpm2_hash** tool first and pass the digest and validation ticket.

NOTE: If the signing key is a restricted signing key, then validation and digest
must be provided via the **-t** input. The ticket indicates that the TPM performed the hash of the message. ([tpm2_sign - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sign.1/), weight 0.9928)

## 5. Options

* **-c**, **\--key-context**=_OBJECT_:

    Context object pointing to the the key used for signing. Either a file or a
    handle number. See section "Context Object Format".

  * **-p**, **\--auth**_AUTH_:

    Optional authorization value to use the key specified by **-c**.
    Authorization values should follow the "authorization formatting standards",
    see section "Authorization Formatting".

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm used to digest the message.
    Algorithms should follow the "formatting standards", see section
    "Algorithm Specifiers".
    Also, see section "Supported Hash Algorithms" for a list of supported hash
    algorithms.

  * **-s**, **\--scheme**=_ALGORITHM_:

    The signing scheme used to sign the message. Optional.

    Signing schemes should follow the "formatting standards", see section
    "Algorithm Specifiers".

    If specified, the signature scheme must match the key type.
    If left unspecified, a default signature scheme for the key type will
    be used.

  * **-d**, **\--digest**:

    Indicate that _FILE_ is a file containing the digest of the message.
    When this option and **-t** is specified, a warning is
    generated and the **validation ticket (-t) is ignored**.
    You cannot use this option to sign a digest against a restricted
    signing key.

  * **-t**, **\--ticket**=_FILE_:

    The ticket file, containing the validation structure, optional.

  * **-o**, **\--signature**=_FILE_:

    The signature file, records the signature structure.

  * **-f**, **\--format**=_FORMAT_:

    Format selection for the signature output file. See section
    "Signature Format Specifiers".

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

  * **\--commit-index**=_NATURALNUMBER_

    The commit counter value to determine the key index to use in an ECDAA
    signing scheme. The default counter value is 0.

  * **ARGUMENT** the command line argument specifies the file data for sign.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules.

**signature format specifiers** (`man/common/signature.md`): Format selection for the signature output file. **tss** (the default) will output a binary blob according to the TPM 2.0 specification and any potential compiler padding. The option **plain** will output the plain signature data as defined by the used cryptographic algorithm. ([tpm2-software/tpm2-tools: man/tpm2_sign.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sign.1.md), weight 0.9916)

## 6. Examples

### Sign and verify with the TPM using the *endorsement* hierarchy
```bash
tpm2_createprimary -C e -c primary.ctx

tpm2_create -G rsa -u rsa.pub -r rsa.priv -C primary.ctx

tpm2_load -C primary.ctx -u rsa.pub -r rsa.priv -c rsa.ctx

echo "my message" > message.dat

tpm2_sign -c rsa.ctx -g sha256 -o sig.rssa message.dat

tpm2_verifysignature -c rsa.ctx -g sha256 -s sig.rssa -m message.dat
```

### Sign with the TPM and verify with OSSL
```bash
openssl ecparam -name prime256v1 -genkey -noout -out private.ecc.pem

openssl ec -in private.ecc.pem -out public.ecc.pem -pubout ([tpm2_sign - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sign.1/), weight 0.9928)

## 7. Generate A Hash To Sign

echo "data to sign" > data.in.raw

sha256sum data.in.raw | awk '{ print "000000 " $1 }' | \
xxd -r -c 32 > data.in.digest ([tpm2-software/tpm2-tools: man/tpm2_sign.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sign.1.md), weight 0.9916)

## 8. Load The Private Key For Signing

tpm2_loadexternal -Q -G ecc -r private.ecc.pem -c key.ctx ([tpm2_sign - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sign.1/), weight 0.9928)

## 9. Sign In The Tpm And Verify With Ossl

tpm2_sign -Q -c key.ctx -g sha256 -d -f plain -o data.out.signed data.in.digest

openssl dgst -verify public.ecc.pem -keyform pem -sha256 \
-signature data.out.signed data.in.raw
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_sign.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sign.1.md), weight 0.9916)

## 10. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_sign tpm2-tools man page options examples` | **0.8867** | authoritative (kept) |
| 2 | [tpm2_sign - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sign.1/) | `tpm2_sign tpm2-tools man page options examples` | **0.9928** | authoritative (kept) |
| 3 | [tpm2 (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2.1.en.html) | `tpm2_sign tpm2-tools man page options examples` | **0.8212** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_sign.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sign.1.md) | `tpm2_sign tpm2-tools man page options examples` | **0.9916** | authoritative (kept) |
