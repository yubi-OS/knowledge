# 015 - tpm2-createak (`tpm2_createak`)

**Scope:** tpm2_createak(1): Generate attestation key with given algorithm under the endorsement hierarchy.
**Upstream Manpage:** `man/tpm2_createak.1.md` in `tpm2-software/tpm2-tools` ([tpm2_createak - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createak.1/), weight 0.9883).
**Multiplexed Invocation:** `tpm2_createak [OPTIONS]` or `tpm2 createak [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_createak.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createak.1.md), weight 0.9862).

## 1. Command Overview & yubiOS Role

`tpm2_createak` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_createak - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createak.1/), weight 0.9883). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2-software/tpm2-tools: man/tpm2_createak.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createak.1.md), weight 0.9862)

## 2. Name

**tpm2_createak**(1) - Generate attestation key with given algorithm under the
endorsement hierarchy. ([tpm2_createak - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createak.1/), weight 0.9883)

## 3. Synopsis

**tpm2_createak** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_createak.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createak.1.md), weight 0.9862)

## 4. Description

**tpm2_createak**(1) - Generate an attestation key (AK) with the given algorithm
under the endorsement hierarchy. The context of the attestation key is specified
via **-c**.

The tool outputs to stdout a YAML representation of the loaded key's name, for
example:
```
loaded-key:
  name: 000bac149518baa05540a0678bd9b624f8a98d042e46c60f4d098ba394d36fc49268
``` ([tpm2_createak - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createak.1/), weight 0.9883)

## 5. Options

* **-P**, **\--eh-auth**=_AUTH_:

    The authorization value for the endorsement hierarchy.

  * **-p**, **\--ak-auth**=_AUTH_

    The authorization value for the attestation key object created.

  * **-C**, **\--ek-context**=_OBJECT_:

    The endorsement key object.

  * **-c**, **\--ak-context**=_FILE_:

    The file path to save the object context of the attestation key.

  * **-G**, **\--key-algorithm**=_ALGORITHM_:

    Specifies the attestation key algorithm. Supports:
    * **ecc** - A NIST_P256 key by default. Alternative curves can be selected
      using algorithm specifiers (e.g. **ecc384** or **ecc_nist_p384**) .
    * **rsa** - An RSA2048 key.
    * **keyedhash** - hmac key.

  * **-a**, **\--attributes**=_ATTRIBUTES_:

    The object attributes, optional. The default for created objects is:
    "restricted|userwithauth|sign|fixedtpm|fixedparent|sensitivedataorigin"
    This default setting differs from the settings in the specification
    TPM 2.0 Keys for Device Identity and Attestation. "adminwithpolicy" is 
    not set and can be added to the default:
    "restricted|userwithauth|...|adminwithpolicy"

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    Specifies the digest algorithm used for signing.

  * **-s**, **\--signing-algorithm**=_ALGORITHM_:

    The signing algorithm.

  * **-u**, **\--public**=_FILE_:

    The file to save the public portion of the attestation key.

  * **-n**, **\--ak-name**=_FILE_:

    The file to save the attestation key name, optional.

  * **-r**, **\--private**=_FILE_:

    The output file which contains the sensitive portion of the object, optional.
    **protection details** (`man/common/protection-details.md`): Objects that can move outside of TPM need to be protected (confidentiality and integrity). For instance, transient objects require that TPM protected data (key or seal material) be stored outside of the TPM. This is seen in tools like tpm2\_create(1), where the **-r** option outputs this protected data. This blob contains the sensitive portions of the object. The sensitive portions of the object are protected by the parent object, using the paren

**pubkey options** (`man/common/pubkey.md`): * **-f**, **\--format**: Format selection for the public key output file. 'tss' (the default) will output a binary blob according to the TPM 2.0 Specification. 'pem' will output an OpenSSL compatible PEM encoded public key. 'der' will output an OpenSSL compatible DER encoded public key. 'tpmt' will output a binary blob of the TPMT_PUBLIC struct referenced by TPM 2.0 specs.

    Format selection for the signature output file.

  * **-q**, **\--ak-qualified-name**=_FILE_:

    The qualified name of the attestation key object. The qualified name is the qualified name
    of the parent object (the EK in this instance) and the name of the object itself. Thus, the
    qualified name of an object serves to bind it to its parents.

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
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_createak.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createak.1.md), weight 0.9862)

## 6. Examples

### Create an Attestation Key and make it persistent

```bash
tpm2_createek -c ek.handle -G rsa -u ek.pub
tpm2_createak -C ek.handle -c ak.ctx -u ak.pub -n ak.name
tpm2_evictcontrol -C o -c ak.ctx 0x81010002
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_createak - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createak.1/), weight 0.9883)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_createak: Generate attestation key with given algorithm ... - ManKier](https://www.mankier.com/1/tpm2_createak) | `tpm2_createak tpm2-tools man page options examples` | **0.2184** | low-weight (weak backing) |
| 2 | [tpm2_createek - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_createek.1/) | `tpm2_createak tpm2-tools man page options examples` | **0.7808** | authoritative (kept) |
| 3 | [tpm2_createak - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createak.1/) | `tpm2_createak tpm2-tools man page options examples` | **0.9883** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_createak.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createak.1.md) | `tpm2_createak tpm2-tools man page options examples` | **0.9862** | authoritative (kept) |
