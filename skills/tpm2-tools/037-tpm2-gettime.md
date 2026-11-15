# 037 - tpm2-gettime (`tpm2_gettime`)

**Scope:** tpm2_gettime(1): Get the current time and clock from the TPM in a signed form.
**Upstream Manpage:** `man/tpm2_gettime.1.md` in `tpm2-software/tpm2-tools` ([tpm2_gettime - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettime.1/), weight 0.9906).
**Multiplexed Invocation:** `tpm2_gettime [OPTIONS]` or `tpm2 gettime [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_gettime.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettime.1.md), weight 0.9850).

## 1. Command Overview & yubiOS Role

`tpm2_gettime` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_gettime - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettime.1/), weight 0.9906). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2-software/tpm2-tools: man/tpm2_gettime.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettime.1.md), weight 0.9850)

## 2. Name

**tpm2_gettime**(1) - Get the current time and clock from the TPM in a signed form. ([tpm2_gettime - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettime.1/), weight 0.9906)

## 3. Synopsis

**tpm2_gettime** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_gettime.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettime.1.md), weight 0.9850)

## 4. Description

**tpm2_gettime**(1) - Provides a signed copy of the current time and clock from the TPM.
It returns both a signature, and the data in the standard TPM attestation form, a TPMS\_ATTEST
structure.

It outputs to stdout, in YAML format, the TPMS\_TIME\_INFO structure from the TPM. The structure contains the
current setting of Time, Clock, resetCount, and restartCount. The structure is output as
YAML defined as:

```yaml
time: 13673142     # 64 bit value of time since last _TPM_Init or TPM2_Startup
                   # in ms.
clock_info:
  clock: 13673142  # 64 bit value of time TPM has been powered on in ms.
  reset_count: 0   # 32 bit value of the number of TPM Resets since the last
                   # TPM2_Clear.
  restart_count: 0 # 32 bit value of the number of times that TPM2_Shutdown or
                   # _TPM_Hash_Start have occurred since the last TPM Reset or
                   # TPM2_Clear.
  safe: yes        # boolean yes|no value that no value of Clock greater than
                   # the current value of Clock has been previously reported by
                   # the TPM.
``` ([tpm2_gettime - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettime.1/), weight 0.9906)

## 5. Options

* **-c**, **\--key-context**=_OBJECT_:

    Context object pointing to the the key used for signing.
    Either a file or a handle number. See section "Context Object Format".

  * **-p**, **\--auth**_AUTH_:

    Optional authorization value to use the key specified by **-c**.
    Authorization values should follow the "authorization formatting standards",
    see section "Authorization Formatting".

  * **-P**, **\--endorse-auth**_AUTH_:

    Optional authorization value for the endorsement hierarchy.
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
    Also, see section "Supported Signing Schemes" for a list of supported
     signature schemes.
    If specified, the signature scheme must match the key type.
    If left unspecified, a default signature scheme for the key type will
     be used.

  * **-q**, **\--qualification**=_FILE\_OR\_HEX\_STR_:

    Optional, the policy qualifier data that the signer can choose to include in the
    signature. Can be either a hex string or path.

  * **-o**, **\--signature**=_FILE_:

    The signature file, records the signature structure.

  * **-f**, **\--format**=_FORMAT_:

    Format selection for the signature output file. See section
    "Signature Format Specifiers".

  * **--attestation**=_FILE_:

    The attestation data of the type TPMS_ATTEST signed with signing key.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

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
**signature format specifiers** (`man/common/signature.md`): Format selection for the signature output file. **tss** (the default) will output a binary blob according to the TPM 2.0 specification and any potential compiler padding. The option **plain** will output the plain signature data as defined by the used cryptographic algorithm. ([tpm2-software/tpm2-tools: man/tpm2_gettime.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettime.1.md), weight 0.9850)

## 6. Examples

### Create a key and get attested TPM time

```bash
tpm2_createprimary -C e -c primary.ctx

tpm2_create -G rsa -u rsa.pub -r rsa.priv -C primary.ctx

tpm2_load -C primary.ctx -u rsa.pub -r rsa.priv -c rsa.ctx

tpm2_gettime -c rsa.ctx -o attest.sig --attestation attest.data
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_gettime - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettime.1/), weight 0.9906)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_gettime tpm2-tools man page options examples` | **0.8337** | authoritative (kept) |
| 2 | [tpm2_gettime: Get the current time and clock from the TPM in ... - ManKier](https://www.mankier.com/1/tpm2_gettime) | `tpm2_gettime tpm2-tools man page options examples` | **0.2403** | low-weight (weak backing) |
| 3 | [tpm2_gettime - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_gettime.1/) | `tpm2_gettime tpm2-tools man page options examples` | **0.9906** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_gettime.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_gettime.1.md) | `tpm2_gettime tpm2-tools man page options examples` | **0.9850** | authoritative (kept) |
