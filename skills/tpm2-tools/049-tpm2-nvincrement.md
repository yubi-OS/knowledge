# 049 - tpm2-nvincrement (`tpm2_nvincrement`)

**Scope:** tpm2_nvincrement(1): Increment counter in a Non-Volatile (NV) index.
**Upstream Manpage:** `man/tpm2_nvincrement.1.md` in `tpm2-software/tpm2-tools` ([tpm2_nvincrement - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvincrement.1/), weight 0.9906).
**Multiplexed Invocation:** `tpm2_nvincrement [OPTIONS]` or `tpm2 nvincrement [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_nvincrement.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvincrement.1.md), weight 0.9857).

## 1. Command Overview & yubiOS Role

`tpm2_nvincrement` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_nvincrement - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvincrement.1/), weight 0.9906). In yubiOS, TPM 2.0 Non-Volatile (NV) indices back monotonic rollback counters, sealed policy digests (`tpm2_policyauthorizenv`), and RPMB-backed OP-TEE fTPM persistent storage on ARM64 boards (ROCK 5B, PineTab2). ([tpm2-software/tpm2-tools: man/tpm2_nvincrement.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvincrement.1.md), weight 0.9857)

## 2. Name

**tpm2_nvincrement**(1) - Increment counter in a Non-Volatile (NV) index. ([tpm2_nvincrement - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvincrement.1/), weight 0.9906)

## 3. Synopsis

**tpm2_nvincrement** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_nvincrement.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvincrement.1.md), weight 0.9857)

## 4. Description

**tpm2_nvincrement**(1) - Increment value of a Non-Volatile (NV) index setup as
a counter. The index can be specified as raw handle or an offset value to the nv
handle range "TPM2_HR_NV_INDEX". ([tpm2_nvincrement - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvincrement.1/), weight 0.9906)

## 5. Options

* **-C**, **\--hierarchy**=_OBJECT_:

    Specifies the hierarchy used to authorize.
    Supported options are:
      * **o** for **TPM_RH_OWNER**
      * **p** for **TPM_RH_PLATFORM**
      * **`<num>`** where a hierarchy handle or nv-index may be used.

    When **-C** isn't explicitly passed the index handle will be used to
    authorize against the index. The index auth value is set via the
    **-p** option to **tpm2_nvdefine**(1).

  * **-P**, **\--auth**=_AUTH_:

    Specifies the authorization value for the hierarchy.

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

  * **ARGUMENT** the command line argument specifies the NV index or offset
    number.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_nvincrement.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvincrement.1.md), weight 0.9857)

## 6. Examples

### To increment the counter at index *0x150016*

```bash
tpm2_nvdefine -C o -s 8 -a "ownerread|authread|authwrite|nt=1" 0x1500016 -p index

tpm2_nvincrement -C 0x1500016  0x1500016 -P "index"

tpm2_nvread 0x1500016 -P index | xxd -p
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_nvincrement - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvincrement.1/), weight 0.9906)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_nvincrement tpm2-tools man page options examples` | **0.7857** | authoritative (kept) |
| 2 | [tpm2_nvincrement - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvincrement.1/) | `tpm2_nvincrement tpm2-tools man page options examples` | **0.9906** | authoritative (kept) |
| 3 | [tpm2_nvincrement: Increment counter in a Non-Volatile (NV) index. / Man ...](https://www.mankier.com/1/tpm2_nvincrement) | `tpm2_nvincrement tpm2-tools man page options examples` | **0.1710** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_nvincrement.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvincrement.1.md) | `tpm2_nvincrement tpm2-tools man page options examples` | **0.9857** | authoritative (kept) |
