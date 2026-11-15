# 093 - tpm2-setprimarypolicy (`tpm2_setprimarypolicy`)

**Scope:** tpm2_setprimarypolicy(1): Sets the authorization policy for the lockout (lockoutPolicy), the platform hierarchy (platformPolicy), the storage hierarchy (ownerPolicy), and the endorsement hierarchy (endorsementPolicy).
**Upstream Manpage:** `man/tpm2_setprimarypolicy.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_setprimarypolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_setprimarypolicy.1.md), weight 0.9906).
**Multiplexed Invocation:** `tpm2_setprimarypolicy [OPTIONS]` or `tpm2 setprimarypolicy [OPTIONS]` ([tpm2_setprimarypolicy - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_setprimarypolicy.1/), weight 0.9888).

## 1. Command Overview & yubiOS Role

`tpm2_setprimarypolicy` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_setprimarypolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_setprimarypolicy.1.md), weight 0.9906). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2_setprimarypolicy - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_setprimarypolicy.1/), weight 0.9888)

## 2. Name

**tpm2_setprimarypolicy**(1) - Sets the authorization policy for the lockout
(lockoutPolicy), the platform hierarchy (platformPolicy), the storage hierarchy
(ownerPolicy), and the endorsement hierarchy (endorsementPolicy). ([tpm2-software/tpm2-tools: man/tpm2_setprimarypolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_setprimarypolicy.1.md), weight 0.9906)

## 3. Synopsis

**tpm2_setprimarypolicy** [*OPTIONS*] ([tpm2_setprimarypolicy - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_setprimarypolicy.1/), weight 0.9888)

## 4. Description

**tpm2_setprimarypolicy**(1) -  Sets the authorization policy for the lockout
(lockoutPolicy), the platform hierarchy (platformPolicy), the storage hierarchy
(ownerPolicy), and the endorsement hierarchy (endorsementPolicy). ([tpm2-software/tpm2-tools: man/tpm2_setprimarypolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_setprimarypolicy.1.md), weight 0.9906)

## 5. Options

These options control creating the policy authorization session:

  * **-C**, **\--hierarchy**=_OBJECT_:

    Specifies the hierarchy whose authorization policy is to be setup. It can be
    specified as o|p|e|l

 * **-P**, **\--auth**=_AUTH_:

    Specifies the authorization value for the hierarchy.

  * **-L**, **\--policy**=_FILE_:

    The file path of the authorization policy data.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm used in computation of the policy digest.

 * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

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
the various known TCTI modules. ([tpm2_setprimarypolicy - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_setprimarypolicy.1/), weight 0.9888)

## 6. Examples

### Set a blank authorization policy for endorsement hierarchy
```bash
tpm2_setprimarypolicy -C e
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_setprimarypolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_setprimarypolicy.1.md), weight 0.9906)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_setprimarypolicy / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2_setprimarypolicy) | `tpm2_setprimarypolicy tpm2-tools man page options examples` | **0.2309** | low-weight (weak backing) |
| 2 | [tpm2_setprimarypolicy - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_setprimarypolicy.1/) | `tpm2_setprimarypolicy tpm2-tools man page options examples` | **0.9888** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_setprimarypolicy tpm2-tools man page options examples` | **0.8016** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_setprimarypolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_setprimarypolicy.1.md) | `tpm2_setprimarypolicy tpm2-tools man page options examples` | **0.9906** | authoritative (kept) |
