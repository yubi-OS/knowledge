# 054 - tpm2-nvundefine (`tpm2_nvundefine`)

**Scope:** tpm2_nvundefine(1): Delete a Non-Volatile (NV) index.
**Upstream Manpage:** `man/tpm2_nvundefine.1.md` in `tpm2-software/tpm2-tools` ([tpm2_nvundefine - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvundefine.1/), weight 0.9912).
**Multiplexed Invocation:** `tpm2_nvundefine [OPTIONS]` or `tpm2 nvundefine [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_nvundefine.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvundefine.1.md), weight 0.9888).

## 1. Command Overview & yubiOS Role

`tpm2_nvundefine` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_nvundefine - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvundefine.1/), weight 0.9912). In yubiOS, TPM 2.0 Non-Volatile (NV) indices back monotonic rollback counters, sealed policy digests (`tpm2_policyauthorizenv`), and RPMB-backed OP-TEE fTPM persistent storage on ARM64 boards (ROCK 5B, PineTab2). ([tpm2-software/tpm2-tools: man/tpm2_nvundefine.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvundefine.1.md), weight 0.9888)

## 2. Name

**tpm2_nvundefine**(1) - Delete a Non-Volatile (NV) index. ([tpm2_nvundefine - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvundefine.1/), weight 0.9912)

## 3. Synopsis

**tpm2_nvundefine** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_nvundefine.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvundefine.1.md), weight 0.9888)

## 4. Description

**tpm2_nvundefine**(1) - Deletes a Non-Volatile (NV) index that was previously
defined with **tpm2_nvdefine**(1). The index is specified as an argument. It can
be specified as raw handle or an offset value to the nv handle range
"TPM2_HR_NV_INDEX".

The tool is also capable of deleting NV indices with attribute `TPMA_NV_POLICY_DELETE`, and
the tool uses this attribute for the default hierarchy to select when `-C` is missing. The
default value for `-C` is the "owner" hierarchy when `TPMA_NV_POLICY_DELETE` is clear and
"platform" when `TPMA_NV_POLICY_DELETE` is set. ([tpm2_nvundefine - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvundefine.1/), weight 0.9912)

## 5. Options

* **-C**, **\--hierarchy**=_OBJECT_:

    Specifies the hierarchy used to authorize.
    Supported options are:
      * **o** for **TPM_RH_OWNER**
      * **p** for **TPM_RH_PLATFORM**
      * **`<num>`** where a hierarchy handle may be specified.

  * **-P**, **\--auth**=_AUTH_:

    Specifies the authorization value for the hierarchy.

  * **-S**, **\--session**=_POLICY_SESSION_:

    Specify a policy session to use when the NV index has attribute
    `TPMA_NV_POLICY_DELETE` set. This can also be used to specify an auxiliary
    session for auditing and or encryption/decryption of the parameters.
    Note:
    1. If TPM2_CC_NV_UndefineSpaceSpecial is invoked then only one additional
       aux session can be specified. The order of how sessions are specified
       also matters. First specification of `-S` is interpreted as the session
       for satisfying the ADMIN role required for
       TPM2_CC_NV_UndefineSpaceSpecial. If a password is used for the NV object
       the password has to be added to the the session path: "path+passwdord".

    2. If TPM2_CC_NV_Undefine is invoked then only two additional aux sessions
       can be specified.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash, it simply returns
    a cpHash unless rphash is also required.

  * **\--rphash**=_FILE_

    File path to record the hash of the response parameters. This is commonly
    termed as rpHash.

  * **\--with-policydelete**=_NONE_

    This must be specified when calculating cpHash with **\--tcti=none**. This
    is a requirement because there is no way to know if the attribute
    TPMA_NV_POLICYDELETE has been set from the NV index name alone.

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
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_nvundefine.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvundefine.1.md), weight 0.9888)

## 6. Examples

### Define an ordinary NV index and delete it
```bash
tpm2_nvdefine 1

tpm2_nvundefine 1
```

### Define an ordinary NV index with attribute `TPMA_NV_POLICY_DELETE` and delete it
```bash
tpm2_startauthsession -S s.ctx

tpm2_policyauthvalue -S s.ctx

tpm2_policycommandcode -S s.ctx -L policy.dat TPM2_CC_NV_UndefineSpaceSpecial

tpm2_nvdefine -C p -s 32 \
  -a "ppread|ppwrite|authread|authwrite|platformcreate|policydelete|write_stclear|read_stclear" \
  -L policy.dat 1

tpm2_flushcontext s.ctx

tpm2_startauthsession --policy-session -S s.ctx

tpm2_policyauthvalue -S s.ctx

tpm2_policycommandcode -S s.ctx TPM2_CC_NV_UndefineSpaceSpecial

tpm2_nvundefine -S s.ctx 1
```
If a password is used for the nv object. The nv undefine command has to be executed
as follows:
```
tpm2_nvundefine -S s.ctx+mypassword  1
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_nvundefine - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvundefine.1/), weight 0.9912)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_nvundefine - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvundefine.1/) | `tpm2_nvundefine tpm2-tools man page options examples` | **0.9912** | authoritative (kept) |
| 2 | [tpm2_nvundefine: Delete a Non-Volatile (NV) index. / Man Page ... - ManKier](https://www.mankier.com/1/tpm2_nvundefine) | `tpm2_nvundefine tpm2-tools man page options examples` | **0.9255** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_nvundefine tpm2-tools man page options examples` | **0.9012** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_nvundefine.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvundefine.1.md) | `tpm2_nvundefine tpm2-tools man page options examples` | **0.9888** | authoritative (kept) |
