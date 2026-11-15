# 002 - tpm2-activatecredential (`tpm2_activatecredential`)

**Scope:** tpm2_activatecredential(1): Enables access to the credential qualifier to recover the credential secret.
**Upstream Manpage:** `man/tpm2_activatecredential.1.md` in `tpm2-software/tpm2-tools` ([tpm2_activatecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_activatecredential.1/), weight 0.9903).
**Multiplexed Invocation:** `tpm2_activatecredential [OPTIONS]` or `tpm2 activatecredential [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_activatecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_activatecredential.1.md), weight 0.9896).

## 1. Command Overview & yubiOS Role

`tpm2_activatecredential` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_activatecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_activatecredential.1/), weight 0.9903). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2-software/tpm2-tools: man/tpm2_activatecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_activatecredential.1.md), weight 0.9896)

## 2. Name

**tpm2_activatecredential**(1) - Enables access to the credential qualifier to
recover the credential secret. ([tpm2_activatecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_activatecredential.1/), weight 0.9903)

## 3. Synopsis

**tpm2_activatecredential** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_activatecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_activatecredential.1.md), weight 0.9896)

## 4. Description

**tpm2_activatecredential**(1) - Enables the association of a credential with an
object in a way that ensures that the TPM has validated the parameters of the
credentialed object. In an attestation scheme , this guarantees the registrar
that the attestation key belongs to the TPM with a qualified parent key in the
TPM. ([tpm2_activatecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_activatecredential.1/), weight 0.9903)

## 5. Options

* **-c**, **\--credentialedkey-context**=_OBJECT_:

    Object associated with the created certificate by CA.

  * **-C**, **\--credentialkey-context**=_OBJECT_:

    The loaded object used to decrypt the random seed.

  * **-p**, **\--credentialedkey-auth**=_AUTH_:

    The auth value of the credentialed object specified with **-c**.

  * **-P**, **\--credentialkey-auth**=_AUTH_:

    The auth value of the credential object specified with **-C**.

  * **-i**, **\--credential-blob**=_FILE_:

    The input file path containing the credential blob and secret created with
    the **tpm2_makecredential**(1) tool.

  * **-o**, **\--certinfo-data**=_FILE_:

    The output file path to save the decrypted credential secret information.

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

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_activatecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_activatecredential.1.md), weight 0.9896)

## 6. Examples

```bash
echo "12345678" > secret.data

tpm2_createek -Q -c 0x81010001 -G rsa -u ek.pub

tpm2_createak -C 0x81010001 -c ak.ctx -G rsa -g sha256 -s rsassa -u ak.pub \
-n ak.name -p akpass> ak.out

file_size=`stat --printf="%s" ak.name`
loaded_key_name=`cat ak.name | xxd -p -c $file_size`

tpm2_makecredential -Q -e ek.pub  -s secret.data -n $loaded_key_name \
-o mkcred.out

tpm2_startauthsession --policy-session -S session.ctx

tpm2_policysecret -S session.ctx -c e

tpm2_activatecredential -Q -c ak.ctx -C 0x81010001 -i mkcred.out \
-o actcred.out -p akpass -P"session:session.ctx"

tpm2_flushcontext session.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_activatecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_activatecredential.1/), weight 0.9903)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_activatecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_activatecredential.1/) | `tpm2_activatecredential tpm2-tools man page options examples` | **0.9903** | authoritative (kept) |
| 2 | [tpm2_activatecredential: Enables access to the credential ... - ManKier](https://www.mankier.com/1/tpm2_activatecredential) | `tpm2_activatecredential tpm2-tools man page options examples` | **0.1833** | low-weight (weak backing) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_activatecredential tpm2-tools man page options examples` | **0.9412** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_activatecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_activatecredential.1.md) | `tpm2_activatecredential tpm2-tools man page options examples` | **0.9896** | authoritative (kept) |
