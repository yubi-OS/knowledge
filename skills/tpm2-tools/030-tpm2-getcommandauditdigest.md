# 030 - tpm2-getcommandauditdigest (`tpm2_getcommandauditdigest`)

**Scope:** tpm2_getcommandauditdigest(1): Retrieve the command audit attestation data from the TPM.
**Upstream Manpage:** `man/tpm2_getcommandauditdigest.1.md` in `tpm2-software/tpm2-tools` ([tpm2_getcommandauditdigest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcommandauditdigest.1/), weight 0.9912).
**Multiplexed Invocation:** `tpm2_getcommandauditdigest [OPTIONS]` or `tpm2 getcommandauditdigest [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_getcommandauditdigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getcommandauditdigest.1.md), weight 0.9816).

## 1. Command Overview & yubiOS Role

`tpm2_getcommandauditdigest` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_getcommandauditdigest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcommandauditdigest.1/), weight 0.9912). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_getcommandauditdigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getcommandauditdigest.1.md), weight 0.9816)

## 2. Name

**tpm2_getcommandauditdigest**(1) - Retrieve the command audit attestation data
from the TPM. ([tpm2_getcommandauditdigest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcommandauditdigest.1/), weight 0.9912)

## 3. Synopsis

**tpm2_getcommandauditdigest** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_getcommandauditdigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getcommandauditdigest.1.md), weight 0.9816)

## 4. Description

**tpm2_getcommandauditdigest**(1) - Retrieve the command audit attestation data
from the TPM. The attestation data includes the audit digest of the commands in
the setlist setup using the command **tpm2_setcommandauditstatus**. Also the
attestation data includes the digest of the list of commands setup for audit.
The audit digest algorith is setup in the **tpm2_setcommandauditstatus**. ([tpm2_getcommandauditdigest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcommandauditdigest.1/), weight 0.9912)

## 5. Options

* **-P**, **\--hierarchy-auth**=_AUTH_:

    Specifies the authorization value for the endorsement hierarchy.

  * **-c**, **\--key-context**=_OBJECT_:

    Context object for the signing key that signs the attestation data.

  * **-p**, **\--auth**=_AUTH_:

    Specifies the authorization value for key specified by option **-c**.

  * **-q**, **\--qualification**=_HEX\_STRING\_OR\_PATH_:

    Data given as a Hex string or binary file to qualify the quote, optional.
    This is typically used to add a nonce against replay attacks.

  * **-s**, **\--signature**=_FILE_:

    Signature output file, records the signature in the format specified via the
    **-f** option.

  * **-m**, **\--message**=_FILE_:

    Message output file, records the quote message that makes up the data that
    is signed by the TPM. This is the command audit digest attestation data.

  * **-f**, **\--format**=_FORMAT_:

    Format selection for the signature output file.

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

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**signature format specifiers** (`man/common/signature.md`): Format selection for the signature output file. **tss** (the default) will output a binary blob according to the TPM 2.0 specification and any potential compiler padding. The option **plain** will output the plain signature data as defined by the used cryptographic algorithm. option used to configure
signature _FORMAT_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_getcommandauditdigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getcommandauditdigest.1.md), weight 0.9816)

## 6. Examples

```bash
tpm2_getcommandauditdigest -P ekpass -c key.ctx -p keypass -m att.data -s att.sig
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_getcommandauditdigest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcommandauditdigest.1/), weight 0.9912)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_getcommandauditdigest tpm2-tools man page options examples` | **0.9312** | authoritative (kept) |
| 2 | [tpm2_getcommandauditdigest - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcommandauditdigest.1/) | `tpm2_getcommandauditdigest tpm2-tools man page options examples` | **0.9912** | authoritative (kept) |
| 3 | [tpm2_getcommandauditdigest: Retrieve the command audit attestation data ...](https://www.mankier.com/1/tpm2_getcommandauditdigest) | `tpm2_getcommandauditdigest tpm2-tools man page options examples` | **0.2213** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_getcommandauditdigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getcommandauditdigest.1.md) | `tpm2_getcommandauditdigest tpm2-tools man page options examples` | **0.9816** | authoritative (kept) |
