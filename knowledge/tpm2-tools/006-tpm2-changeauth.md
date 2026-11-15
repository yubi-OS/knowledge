# 006 - tpm2-changeauth (`tpm2_changeauth`)

**Scope:** tpm2_changeauth(1): Changes authorization values for TPM objects.
**Upstream Manpage:** `man/tpm2_changeauth.1.md` in `tpm2-software/tpm2-tools` ([tpm2_changeauth - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changeauth.1/), weight 0.9926).
**Multiplexed Invocation:** `tpm2_changeauth [OPTIONS]` or `tpm2 changeauth [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_changeauth.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_changeauth.1.md), weight 0.9918).

## 1. Command Overview & yubiOS Role

`tpm2_changeauth` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_changeauth - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changeauth.1/), weight 0.9926). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2-software/tpm2-tools: man/tpm2_changeauth.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_changeauth.1.md), weight 0.9918)

## 2. Name

**tpm2_changeauth** - Changes authorization values for TPM objects. ([tpm2_changeauth - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changeauth.1/), weight 0.9926)

## 3. Synopsis

**tpm2_changeauth** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_changeauth.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_changeauth.1.md), weight 0.9918)

## 4. Description

**tpm2_changeauth** - Configures authorization values for the various
hierarchies, NV indices, transient and persistent objects.

Note: For non-permanent objects (Transient objects and Persistent objects),
copies of the private information (files or persistent handles) created prior
to changing auth are not invalidated. ([tpm2_changeauth - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changeauth.1/), weight 0.9926)

## 5. Options

Passwords should follow the "password authorization formatting standards",
see section "Authorization Formatting".

  * **-c**, **\--object-context**=_OBJECT_:

    The key context object to be used for the operation.

  * **-p**, **\--object-auth**=_AUTH_:

    The old authorization value for the TPM object specified with **-c**.

  * **-C**, **\--parent-context**=_OBJECT_:

    The parent object. This is required if the object for the operation is a
    transient or persistent object.

  * **-r**, **\--private**=_FILE_:
    The output file which contains the new sensitive portion of the object whose
    auth was being changed.
    **protection details** (`man/common/protection-details.md`): Objects that can move outside of TPM need to be protected (confidentiality and integrity). For instance, transient objects require that TPM protected data (key or seal material) be stored outside of the TPM. This is seen in tools like tpm2\_create(1), where the **-r** option outputs this protected data. This blob contains the sensitive portions of the object. The sensitive portions of the object are protected by the parent object, using the paren

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash, unless rphash is
    also required.

  * **\--rphash**=_FILE_

    File path to record the hash of the response parameters. This is commonly
    termed as rpHash.

  * **-S**, **\--session**=_FILE_:

    The session created using **tpm2_startauthsession**. This can be used to
    specify an auxiliary session for auditing and or encryption/decryption of
    the parameters.

  * **ARGUMENT** the command line argument specifies the _AUTH_ to be set for
    the object specified with **-c**.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_changeauth.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_changeauth.1.md), weight 0.9918)

## 6. Examples

### Set owner, endorsement and lockout authorizations to newpass
```bash
tpm2_changeauth -c owner newpass
tpm2_changeauth -c endorsement newpass
tpm2_changeauth -c lockout newpass
```

### Change owner, endorsement and lockout authorizations
```bash
tpm2_changeauth -c o -p newpass newerpass
tpm2_changeauth -c e -p newpass newerpass
tpm2_changeauth -c l -p newpass newerpass
```

### Set owner authorization to empty password
```bash
tpm2_changeauth -c o -p oldpass
```

### Modify authorization for a loadable transient object
```bash
tpm2_createprimary -Q -C o -c prim.ctx

tpm2_create -Q -g sha256 -G aes -u key.pub -r key.priv -C prim.ctx

tpm2_load -C prim.ctx -u key.pub -r key.priv -n key.name -c key.ctx

tpm2_changeauth -c key.ctx -C prim.ctx -r key.priv newkeyauth
```

### Modify authorization for a NV Index

Requires Extended Session Support.

```bash
tpm2_startauthsession -S session.ctx

tpm2_policycommandcode -S session.ctx -L policy.nvchange TPM2_CC_NV_ChangeAuth
tpm2_flushcontext session.ctx

NVIndex=0x1500015
tpm2_nvdefine   $NVIndex -C o -s 32 -a "authread|authwrite" -L policy.nvchange
tpm2_startauthsession \--policy-session -S session.ctx

tpm2_policycommandcode -S session.ctx -L policy.nvchange TPM2_CC_NV_ChangeAuth

tpm2_changeauth -p session:session.ctx -c $NVIndex newindexauth
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_changeauth - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changeauth.1/), weight 0.9926)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [Ubuntu Manpage: tpm2_changeauth - Changes authorization values for TPM ...](https://manpages.ubuntu.com/manpages/jammy/man1/tpm2_changeauth.1.html) | `tpm2_changeauth tpm2-tools man page options examples` | **0.9770** | authoritative (kept) |
| 2 | [tpm2_changeauth - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changeauth.1/) | `tpm2_changeauth tpm2-tools man page options examples` | **0.9926** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_changeauth tpm2-tools man page options examples` | **0.9184** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_changeauth.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_changeauth.1.md) | `tpm2_changeauth tpm2-tools man page options examples` | **0.9918** | authoritative (kept) |
