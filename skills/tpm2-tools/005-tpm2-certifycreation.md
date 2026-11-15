# 005 - tpm2-certifycreation (`tpm2_certifycreation`)

**Scope:** tpm2_certifycreation(1): Attest the association between a loaded public area and the provided hash of the creation data.
**Upstream Manpage:** `man/tpm2_certifycreation.1.md` in `tpm2-software/tpm2-tools` ([tpm2_certifycreation - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifycreation.1/), weight 0.9913).
**Multiplexed Invocation:** `tpm2_certifycreation [OPTIONS]` or `tpm2 certifycreation [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_certifycreation.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certifycreation.1.md), weight 0.9867).

## 1. Command Overview & yubiOS Role

`tpm2_certifycreation` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_certifycreation - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifycreation.1/), weight 0.9913). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2-software/tpm2-tools: man/tpm2_certifycreation.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certifycreation.1.md), weight 0.9867)

## 2. Name

**tpm2_certifycreation**(1) - Attest the association between a loaded public
area and the provided hash of the creation data. ([tpm2_certifycreation - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifycreation.1/), weight 0.9913)

## 3. Synopsis

**tpm2_certifycreation** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_certifycreation.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certifycreation.1.md), weight 0.9867)

## 4. Description

**tpm2_certifycreation**(1) - Attest the association between a loaded public
area and the provided hash of the creation data. The creation data and the
creation ticket is produced when creating the object. The object itself is
created with either **TPM2_CreatePrimary** or **TPM2_Create** commands. ([tpm2_certifycreation - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifycreation.1/), weight 0.9913)

## 5. Options

* **-C**, **\--signingkey-context**=_OBJECT_:

    Context object pointing to the key used that signs the attestation.

  * **-P**, **\--signingkey-auth**_AUTH_:

    Optional authorization value to use for the key specified by **-C**.

  * **-c**, **\--certifiedkey-context**=_OBJECT_:

    Context object pointing to the key that has to be certified.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm used to digest the creation data.

  * **-s**, **\--scheme**=_ALGORITHM_:

    The signing scheme used to sign the attestation data.

  * **-d**, **\--creation-hash**=_FILE_

    File containing the digest of the creation data.

  * **-t**, **\--ticket**=_FILE_:

    The ticket file to validate that the creation data was produced by the TPM.

  * **-o**, **\--signature**=_FILE_:

    File containing the signature of the attestation data for the certified key.

  * **-f**, **\--format**=_FORMAT_:

    Output signature format selection.

  * **--attestation**=_FILE_:

    The attestation data of the type TPM2_CREATION_INFO signed with signing key.

  * **-q**, **\--qualification**=_FILE\_OR\_HEX_:

    Optional, the policy qualifier data that the signer can choose to include in the
    signature. Can either be a path or hex string.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash, unless rphash is also required.

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

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules.
**signature format specifiers** (`man/common/signature.md`): Format selection for the signature output file. **tss** (the default) will output a binary blob according to the TPM 2.0 specification and any potential compiler padding. The option **plain** will output the plain signature data as defined by the used cryptographic algorithm. ([tpm2-software/tpm2-tools: man/tpm2_certifycreation.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certifycreation.1.md), weight 0.9867)

## 6. Examples

### Certify creation data of a primary key.

```bash
tpm2_createprimary -C o -c prim.ctx --creation-data create.dat \
-d create.dig -t create.ticket

tpm2_create -G rsa -u rsa.pub -r rsa.priv -C prim.ctx -c signing_key.ctx

tpm2_certifycreation -C signing_key.ctx -c prim.ctx -d create.dig \
-t create.ticket -g sha256 -o sig.nature --attestation attestat.ion -f plain \
-s rsassa
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_certifycreation - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifycreation.1/), weight 0.9913)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_certifycreation tpm2-tools man page options examples` | **0.9311** | authoritative (kept) |
| 2 | [tpm2_certifycreation - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifycreation.1/) | `tpm2_certifycreation tpm2-tools man page options examples` | **0.9913** | authoritative (kept) |
| 3 | [tpm2_certifycreation: Attest the association between a loaded public ...](https://www.mankier.com/1/tpm2_certifycreation) | `tpm2_certifycreation tpm2-tools man page options examples` | **0.1161** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_certifycreation.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certifycreation.1.md) | `tpm2_certifycreation tpm2-tools man page options examples` | **0.9867** | authoritative (kept) |
