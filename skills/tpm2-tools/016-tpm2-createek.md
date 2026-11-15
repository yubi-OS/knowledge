# 016 - tpm2-createek (`tpm2_createek`)

**Scope:** tpm2_createek(1): Generate TCG profile compliant endorsement key.
**Upstream Manpage:** `man/tpm2_createek.1.md` in `tpm2-software/tpm2-tools` ([tpm2_createek - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_createek.1/), weight 0.9881).
**Multiplexed Invocation:** `tpm2_createek [OPTIONS]` or `tpm2 createek [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_createek.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createek.1.md), weight 0.9871).

## 1. Command Overview & yubiOS Role

`tpm2_createek` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_createek - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_createek.1/), weight 0.9881). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2-software/tpm2-tools: man/tpm2_createek.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createek.1.md), weight 0.9871)

## 2. Name

**tpm2_createek**(1) - Generate TCG profile compliant endorsement key. ([tpm2_createek - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_createek.1/), weight 0.9881)

## 3. Synopsis

**tpm2_createek** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_createek.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createek.1.md), weight 0.9871)

## 4. Description

**tpm2_createek**(1) - Generate TCG profile compliant endorsement key (EK),
which is the primary object of the endorsement hierarchy.

If a transient object is generated the tool outputs a context file specified
with **-c**.

Refer to:
<http://www.trustedcomputinggroup.org/files/static_page_files/7CAA5687-1A4B-B294-D04080D058E86C5F> ([tpm2_createek - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_createek.1/), weight 0.9881)

## 5. Options

* **-P**, **\--eh-auth**=_AUTH_:

    The authorization value for the endorsement hierarchy

  * **-w**, **\--owner-auth**=_AUTH_

    The authorization value for the owner hierarchy.

  * **-c**, **\--ek-context**=_OBJECT_ or _FILE_:

    Either a file path or a persistent handle value to save the endorsement key.

    If a value of **-** is passed the tool will find a vacant persistent handle
    to use and print out the automatically selected handle.

    If one saves the context file via this option and the public key via the
    **-u** option, the EK can be restored via a call to **tpm2_loadexternal**(1).

  * **-G**, **\--key-algorithm**=_ALGORITHM_:

    The endorsement key algorithm. Supports:
    * **ecc** - A NIST_P256 key by default. Alternative curves can be selected
      using algorithm specifiers (e.g. **ecc384** or **ecc_nist_p384**) .
    * **rsa** - An RSA2048 key.
    * **keyedhash** - hmac key.
    By default, For NIST_P256 and RSA2048 the LOW range template defined in
    the EK Credential Profile will be used. The HIGH range template can
    be selected by adding the suffix _high to the algorithm name.

  * **-u**, **\--public**=_FILE_:

    The optional input for a file to save the public portion of endorsement key.

  * **-t**, **\--template**:

    The optional manufacturer defined endorsement key template and nonce from
    fixed NV Indices to populate the **TPM2B_PUBLIC** public area.
    See the TCG EK Credential Profile specification for more information:
    https://trustedcomputinggroup.org/wp-content/uploads/
    TCG_IWG_Credential_Profile_EK_V2.1_R13.pdf

**pubkey options** (`man/common/pubkey.md`): * **-f**, **\--format**: Format selection for the public key output file. 'tss' (the default) will output a binary blob according to the TPM 2.0 Specification. 'pem' will output an OpenSSL compatible PEM encoded public key. 'der' will output an OpenSSL compatible DER encoded public key. 'tpmt' will output a binary blob of the TPMT_PUBLIC struct referenced by TPM 2.0 specs.

    Public key format.

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
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_createek.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createek.1.md), weight 0.9871)

## 6. Examples

### Create an RSA Endorsement Key and make it persistent
```bash
tpm2_createek -P abc123 -w abc123 -c 0x81010001 -G rsa -u ek.pub
```

### Create an ECC NIST_P384 Endorsement Key and make it persistent
```bash
tpm2_createek -G ecc384 -c 0x81010002
```

### Create a transient Endorsement Key, flush it, and reload it.
Typically, when using the TPM, the interactions occur through a resource
manager, like tpm2-abrmd(8).  However, when interacting with the TPM directly,
this scenario is possible. The below example assumes direct TPM access not
brokered by a resource manager. Specifically we will use /dev/tpm0.

```bash
tpm2_createek -c ek.ctx -G rsa -u ek.pub -Tdevice:/dev/tpm0 ([tpm2_createek - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_createek.1/), weight 0.9881)

## 7. Check That It Is Loaded In Transient Memory

tpm2_getcap handles-transient -Tdevice:/dev/tpm0 
- 0x80000000 ([tpm2-software/tpm2-tools: man/tpm2_createek.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createek.1.md), weight 0.9871)

## 8. Flush The Handle

tpm2_flushcontext 0x80000000 -Tdevice:/dev/tpm0 ([tpm2_createek - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_createek.1/), weight 0.9881)

## 9. Note That It Is Flushed

tpm2_getcap handles-transient -Tdevice:/dev/tpm0
<null output> ([tpm2-software/tpm2-tools: man/tpm2_createek.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createek.1.md), weight 0.9871)

## 10. Reload It Via Loadexternal

tpm2_loadexternal -C o -u ek.pub -c ek.ctx -Tdevice:/dev/tpm0 ([tpm2_createek - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_createek.1/), weight 0.9881)

## 11. Check That It Is Re-Loaded In Transient Memory

tpm2_getcap handles-transient -Tdevice:/dev/tpm0
- 0x80000000

```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_createek.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createek.1.md), weight 0.9871)

## 12. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_createek (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_createek.1.en.html) | `tpm2_createek tpm2-tools man page options examples` | **0.9797** | authoritative (kept) |
| 2 | [tpm2_createek - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_createek.1/) | `tpm2_createek tpm2-tools man page options examples` | **0.9881** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_createek tpm2-tools man page options examples` | **0.8481** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_createek.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createek.1.md) | `tpm2_createek tpm2-tools man page options examples` | **0.9871** | authoritative (kept) |
