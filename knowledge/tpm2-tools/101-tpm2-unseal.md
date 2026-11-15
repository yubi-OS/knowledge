# 101 - tpm2-unseal (`tpm2_unseal`)

**Scope:** tpm2_unseal(1): Returns a data blob in a loaded TPM object. The data blob is returned in clear.
**Upstream Manpage:** `man/tpm2_unseal.1.md` in `tpm2-software/tpm2-tools` ([tpm2_unseal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_unseal.1/), weight 0.9913).
**Multiplexed Invocation:** `tpm2_unseal [OPTIONS]` or `tpm2 unseal [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_unseal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_unseal.1.md), weight 0.9899).

## 1. Command Overview & yubiOS Role

`tpm2_unseal` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_unseal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_unseal.1/), weight 0.9913). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2-software/tpm2-tools: man/tpm2_unseal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_unseal.1.md), weight 0.9899)

## 2. Name

**tpm2_unseal**(1) - Returns a data blob in a loaded TPM object. The data blob
is returned in clear. ([tpm2_unseal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_unseal.1/), weight 0.9913)

## 3. Synopsis

**tpm2_unseal** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_unseal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_unseal.1.md), weight 0.9899)

## 4. Description

**tpm2_unseal**(1) - Returns a data blob in a loaded TPM object. The data blob
is returned in clear. The data is sealed at the time of the object creation
using the **tpm2_create** tool. Such an object intended for sealing data has to
be of the type _TPM\_ALG\_KEYEDHASH_. ([tpm2_unseal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_unseal.1/), weight 0.9913)

## 5. Options

* **-c**, **\--object-context**=_OBJECT_:

    Object context for the loaded object.

  * **-p**, **\--auth**=_AUTH_:

    Optional auth value to use for the key specified by **-c**.

  * **-o**, **\--output**=_FILE_:

    Output file name containing the unsealed data. Defaults to _STDOUT_ if not
    specified.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash, unless rphash
    is also required.

  * **\--rphash**=_FILE_

    File path to record the hash of the response parameters. This is commonly
    termed as rpHash.

  * **-S**, **\--session**=_FILE_:

    The session created using **tpm2_startauthsession**. Multiple of these can
    be specified. For example, you can have one session for auditing and another
    for encryption/decryption of the parameters.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_unseal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_unseal.1.md), weight 0.9899)

## 6. Examples

```bash
tpm2_createprimary -c primary.ctx -Q

tpm2_pcrread -Q -o pcr.bin sha256:0,1,2,3

tpm2_createpolicy -Q --policy-pcr -l sha256:0,1,2,3 -f pcr.bin -L pcr.policy

echo 'secret' | tpm2_create -C primary.ctx -L pcr.policy -i-\
-u seal.pub -r seal.priv -c seal.ctx -Q

tpm2_unseal -c seal.ctx -p pcr:sha256:0,1,2,3
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_unseal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_unseal.1/), weight 0.9913)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_unseal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_unseal.1/) | `tpm2_unseal tpm2-tools man page options examples` | **0.9913** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_unseal tpm2-tools man page options examples` | **0.7840** | authoritative (kept) |
| 3 | [tpm2_unseal (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_unseal.1.en.html) | `tpm2_unseal tpm2-tools man page options examples` | **0.9618** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_unseal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_unseal.1.md) | `tpm2_unseal tpm2-tools man page options examples` | **0.9899** | authoritative (kept) |
