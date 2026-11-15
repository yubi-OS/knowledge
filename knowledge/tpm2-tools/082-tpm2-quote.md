# 082 - tpm2-quote (`tpm2_quote`)

**Scope:** tpm2_quote(1): Provide a quote and signature from the TPM.
**Upstream Manpage:** `man/tpm2_quote.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_quote.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_quote.1.md), weight 0.9920).
**Multiplexed Invocation:** `tpm2_quote [OPTIONS]` or `tpm2 quote [OPTIONS]` ([tpm2_quote - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_quote.1/), weight 0.9915).

## 1. Command Overview & yubiOS Role

`tpm2_quote` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_quote.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_quote.1.md), weight 0.9920). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2_quote - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_quote.1/), weight 0.9915)

## 2. Name

**tpm2_quote**(1) - Provide a quote and signature from the TPM. ([tpm2-software/tpm2-tools: man/tpm2_quote.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_quote.1.md), weight 0.9920)

## 3. Synopsis

**tpm2_quote** [*OPTIONS*] ([tpm2_quote - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_quote.1/), weight 0.9915)

## 4. Description

**tpm2_quote**(1) - Provide quote and signature for given list of PCRs in given
algorithm/banks. ([tpm2-software/tpm2-tools: man/tpm2_quote.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_quote.1.md), weight 0.9920)

## 5. Options

* **-c**, **\--key-context**=_OBJECT_:

    Context object for the quote signing key.

  * **-p**, **\--auth**=_AUTH_:

    Specifies the authorization value for AK specified by option **-C**.

  * **-l**, **\--pcr-list**=_PCR_:

    The list of PCR banks and selected PCRs' ids for each bank.
    Also see **NOTES** section below.

  * **-m**, **\--message**=_FILE_:

    Message output file, records the quote message that makes up the data that
    is signed by the TPM.

  * **-s**, **\--signature**=_FILE_:

    Signature output file, records the signature in the format specified via the
    **-f** option.

  * **-f**, **\--format**=_FORMAT_:

    Format selection for the signature output file.

  * **-o**, **\--pcr**=_FILE_.

    PCR output file, optional, records the list of PCR values as defined
    by **-l**.

**PCR output file format specifiers** (`man/common/pcrs_format.md`): * **-F**, **\--pcrs_format**=_FORMAT_: Format selection for the binary blob in the PCR output file. 'values' will output a binary blob of the PCR values. 'serialized' will write or read a binary blob of the PCR values in the form of serialized data structure in little endian format. 'marshaled' will will read or write a binary blob in the binary format used by the TSS2 marshaling and unmarshaling functions. If marshaled is used the data is serial
    Default is 'serialized'.

  * **-q**, **\--qualification**=_HEX\_STRING\_OR\_PATH_:

    Data given as a Hex string or binary file to qualify the quote, optional.
    This is typically used to add a nonce against replay attacks.

  * **-g**, **\--hash-algorithm**:

    Hash algorithm for signature. Defaults to sha256.

  * **\--scheme**=_ALGORITHM_:

    The signing scheme used to sign the message. Optional.
    Signing schemes should follow the "formatting standards", see section
     "Algorithm Specifiers".
    Also, see section "Supported Signing Schemes" for a list of supported
     signature schemes.
    If specified, the signature scheme must match the key type.
    If left unspecified, a default signature scheme for the key type will
     be used.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**signature format specifiers** (`man/common/signature.md`): Format selection for the signature output file. **tss** (the default) will output a binary blob according to the TPM 2.0 specification and any potential compiler padding. The option **plain** will output the plain signature data as defined by the used cryptographic algorithm. option used to configure
signature _FORMAT_.

**pcr bank specifiers** (`man/common/pcr.md`): PCR Bank Selection lists follow the below specification: ``` <BANK>:<PCR>[,<PCR>] or <BANK>:all ``` multiple banks may be separated by '+'. For example: ``` sha1:3,4+sha256:all ``` will select PCRs 3 and 4 from the SHA1 bank and PCRs 0 to 23 from the SHA256 bank. Certain commands support specifying forward sealing values as well: ``` sha1:0,1=da39a3ee5e6b4b0d3255bfef95601890afd80709,2 ``` This will select the current values for PCRs 0 and 2, but  details the syntax for specifying pcr list.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_quote - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_quote.1/), weight 0.9915)

## 6. Examples

```bash
tpm2_createprimary -C e -c primary.ctx

tpm2_create -C primary.ctx -u key.pub -r key.priv

tpm2_load -C primary.ctx -u key.pub -r key.priv -c key.ctx

tpm2_quote -Q -c key.ctx -l 0x0004:16,17,18+0x000b:16,17,18
``` ([tpm2-software/tpm2-tools: man/tpm2_quote.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_quote.1.md), weight 0.9920)

## 7. Notes

The maximum number of PCR that can be quoted at once is associated
with the maximum length of a bank.

On most TPMs, it means that this tool can quote up to 24 PCRs
at once.

That this performs a detached signature.

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_quote - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_quote.1/), weight 0.9915)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_quote - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_quote.1/) | `tpm2_quote tpm2-tools man page options examples` | **0.9915** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_quote tpm2-tools man page options examples` | **0.9252** | authoritative (kept) |
| 3 | [tpm2_quote (8)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_quote.8.en.html) | `tpm2_quote tpm2-tools man page options examples` | **0.9685** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_quote.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_quote.1.md) | `tpm2_quote tpm2-tools man page options examples` | **0.9920** | authoritative (kept) |
