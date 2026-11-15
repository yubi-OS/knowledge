# 046 - tpm2-nvcertify (`tpm2_nvcertify`)

**Scope:** tpm2_nvcertify(1): Provides attestation of the contents of an NV index.
**Upstream Manpage:** `man/tpm2_nvcertify.1.md` in `tpm2-software/tpm2-tools` ([tpm2_nvcertify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvcertify.1/), weight 0.9886).
**Multiplexed Invocation:** `tpm2_nvcertify [OPTIONS]` or `tpm2 nvcertify [OPTIONS]` ([tpm2-tools/man/tpm2_nvcertify.1.md at master · tpm2-software ... - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvcertify.1.md), weight 0.9853).

## 1. Command Overview & yubiOS Role

`tpm2_nvcertify` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_nvcertify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvcertify.1/), weight 0.9886). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2-tools/man/tpm2_nvcertify.1.md at master · tpm2-software ... - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvcertify.1.md), weight 0.9853)

## 2. Name

**tpm2_nvcertify**(1) - Provides attestation of the contents of an NV index. ([tpm2_nvcertify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvcertify.1/), weight 0.9886)

## 3. Synopsis

**tpm2_nvcertify** [*OPTIONS*] [*ARGUMENTS*] ([tpm2-tools/man/tpm2_nvcertify.1.md at master · tpm2-software ... - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvcertify.1.md), weight 0.9853)

## 4. Description

**tpm2_nvcertify**(1) - Provides attestation of the contents of an NV index.
NOTE: As part of the attestation output, the NV index contents are revealed. ([tpm2_nvcertify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvcertify.1/), weight 0.9886)

## 5. Options

These options control the certification:

  * **-C**, **\--signingkey-context**=_OBJECT_:

    The key object that signs the attestation structure.

  * **-P**, **\--signingkey-auth**=_AUTH_:

    The authorization value provided for the object specified with -C.

  * **-c**, **\--nvauthobj-context**=_OBJECT_:

    The object that is the authorization handle for the NV object. It is either
    the NV index handle itself or the platform/ owner hierarchy handle. If not
    specified it defaults to the NV index handle.

  * **-p**, **\--nvauthobj-auth**=_AUTH_:

    The authorization value provided for the object specified with -c.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm to use in signature generation.

  * **-s**, **\--scheme**=_ALGORITHM_:

    The signing scheme used to sign the attestation data.

  * **-f**, **\--format**=_FORMAT_:

    Format selection for the signature output file.

  * **-o**, **\--signature**=_FILE_:

    Output file name for the signature data.

  * **-q**, **\--qualification**=_FILE\_OR\_HEX\_STR_:

    Optional, the policy qualifier data that the signer can choose to include in the
    signature. Can be either a hex string or path.

  * **\--size**=_NATURAL_NUMBER_:

    Specifies the size of data to be read in bytes, starting from 0 if
    offset is not specified. If not specified, the size of the data
    as reported by the public portion of the index will be used.

  * **\--offset**=_NATURAL_NUMBER_:

    The offset within the NV index to start reading from.

  * **--attestation**=_FILE_:

    The attestation data of the type TPMS_ATTEST signed with signing key.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash unless rphash is
    also required.

  * **\--rphash**=_FILE_

    File path to record the hash of the response parameters. This is commonly
    termed as rpHash.

  * **-S**, **\--session**=_FILE_:

    The session created using **tpm2_startauthsession**. This can be used to
    specify an auxiliary session for auditing and or encryption/decryption of
    the parameters.

  * **-n**, **\--name**=_FILE_:

    The name of the NV index that must be provided when only calculating the
    cpHash without actually dispatching the command to the TPM.

  * **\-signer-name**=_FILE_:

    The name of the signing key that must be provided when only calculating the
    cpHash without actually dispatching the command to the TPM.

  * **ARGUMENT** the command line argument specifies the NV index or offset
    number.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**signature format specifiers** (`man/common/signature.md`): Format selection for the signature output file. **tss** (the default) will output a binary blob according to the TPM 2.0 specification and any potential compiler padding. The option **plain** will output the plain signature data as defined by the used cryptographic algorithm. option used to configure
signature _FORMAT_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-tools/man/tpm2_nvcertify.1.md at master · tpm2-software ... - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvcertify.1.md), weight 0.9853)

## 6. Examples

```bash
tpm2_nvdefine -s 32 -a "authread|authwrite" 1

dd if=/dev/urandom bs=1 count=32 status=none| \
tpm2_nvwrite 1 -i-

tpm2_createprimary -C o -c primary.ctx -Q

tpm2_create -G rsa -u rsa.pub -r rsa.priv -C primary.ctx -c signing_key.ctx -Q

tpm2_readpublic -c signing_key.ctx -f pem -o sslpub.pem -Q

tpm2_nvcertify -C signing_key.ctx -g sha256 -f plain -s rsassa \
-o signature.bin --attestation attestation.bin --size 32 1
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_nvcertify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvcertify.1/), weight 0.9886)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_nvcertify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvcertify.1/) | `tpm2_nvcertify tpm2-tools man page options examples` | **0.9886** | authoritative (kept) |
| 2 | [tpm2_nvcertify: Provides attestation of the contents of an... / ManKier](https://www.mankier.com/1/tpm2_nvcertify) | `tpm2_nvcertify tpm2-tools man page options examples` | **0.1654** | low-weight (weak backing) |
| 3 | [tpm2-tools/man/tpm2_nvcertify.1.md at master · tpm2-software ... - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvcertify.1.md) | `tpm2_nvcertify tpm2-tools man page options examples` | **0.9853** | authoritative (kept) |
