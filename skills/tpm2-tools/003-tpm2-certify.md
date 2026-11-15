# 003 - tpm2-certify (`tpm2_certify`)

**Scope:** tpm2_certify(1): Prove that an object is loaded in the TPM.
**Upstream Manpage:** `man/tpm2_certify.1.md` in `tpm2-software/tpm2-tools` ([tpm2_certify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certify.1/), weight 0.9898).
**Multiplexed Invocation:** `tpm2_certify [OPTIONS]` or `tpm2 certify [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_certify.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certify.1.md), weight 0.9802).

## 1. Command Overview & yubiOS Role

`tpm2_certify` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_certify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certify.1/), weight 0.9898). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2-software/tpm2-tools: man/tpm2_certify.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certify.1.md), weight 0.9802)

## 2. Name

**tpm2_certify**(1) - Prove that an object is loaded in the TPM. ([tpm2_certify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certify.1/), weight 0.9898)

## 3. Synopsis

**tpm2_certify** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_certify.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certify.1.md), weight 0.9802)

## 4. Description

**tpm2_certify**(1) - Proves that an object with a specific _NAME_ is loaded in
the TPM. By certifying that the object is loaded, the TPM warrants that a public
area with a given _NAME_ is self-consistent and associated with a valid
sensitive area.

If a relying party has a public area that has the same _NAME_ as a _NAME_
certified with this command, then the values in that public area are correct.
An object that only has its public area loaded cannot be certified. ([tpm2_certify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certify.1/), weight 0.9898)

## 5. Options

These options control the certification:

  * **-c**, **\--certifiedkey-context**=_OBJECT_:

    The object to be certified.

  * **-C**, **\--signingkey-context**=_OBJECT_:

    The key used to sign the attestation structure.

  * **-P**, **\--certifiedkey-auth**=_AUTH_:

    The authorization value provided for the object specified with -c.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm to use in signature generation.

  * **\--scheme**=_ALGORITHM_:

    The signing scheme used to sign the message. Optional.
    Signing schemes should follow the "formatting standards", see section
     "Algorithm Specifiers".
    Also, see section "Supported Signing Schemes" for a list of supported
     signature schemes.
    If specified, the signature scheme must match the key type.
    If left unspecified, a default signature scheme for the key type will
     be used.

  * **-p**, **\--signingkey-auth**=_AUTH_:

    The authorization value for the signing key specified with -C.

  * **-o**, **\--attestation**=_FILE_:

    Output file name for the attestation data.

  * **-q**, **\--qualifying-data**=_HEX\_STRING\_OR\_PATH_:

    Data given as a Hex string or binary file to qualify the certification, optional.
    This is typically used to add a nonce against replay attacks.
    The default is:  0x00, 0xff, 0x55, 0xaa


  * **-s**, **\--signature**=_FILE_:

    Output file name for the signature data.

  * **-f**, **\--format**=_FORMAT_:

    Format selection for the signature output file.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash, unless rphash is
    also required.

  * **\--rphash**=_FILE_

    File path to record the hash of the response parameters. This is commonly
    termed as rpHash.

  * **-S**, **\--session**=_FILE_:

    The session created using **tpm2_startauthsession**. This can be used to
    specify an auxiliary session for auditing and or encryption/decryption of
    the parameters.

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
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_certify.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certify.1.md), weight 0.9802)

## 6. Examples

Create a primary key and certify it with a signing key.

```bash
tpm2_createprimary -Q -C e -g sha256 -G rsa -c primary.ctx

tpm2_create -Q -g sha256 -G rsa -u certify.pub -r certify.priv -C primary.ctx

tpm2_load -Q -C primary.ctx -u certify.pub -r certify.priv -n certify.name \
-c certify.ctx

tpm2_certify -Q -c primary.ctx -C certify.ctx -g sha256 -o attest.out -s sig.out
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_certify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certify.1/), weight 0.9898)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_certify tpm2-tools man page options examples` | **0.9026** | authoritative (kept) |
| 2 | [tpm2_certify - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certify.1/) | `tpm2_certify tpm2-tools man page options examples` | **0.9898** | authoritative (kept) |
| 3 | [tpm2_certify: Prove that an object is loaded in the TPM. / Man Page ...](https://www.mankier.com/1/tpm2_certify) | `tpm2_certify tpm2-tools man page options examples` | **0.1445** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_certify.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certify.1.md) | `tpm2_certify tpm2-tools man page options examples` | **0.9802** | authoritative (kept) |
