# 077 - tpm2-policysecret (`tpm2_policysecret`)

**Scope:** tpm2_policysecret(1): Couples the authorization of an object to that of an existing object.
**Upstream Manpage:** `man/tpm2_policysecret.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policysecret - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policysecret.1/), weight 0.9890).
**Multiplexed Invocation:** `tpm2_policysecret [OPTIONS]` or `tpm2 policysecret [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policysecret.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policysecret.1.md), weight 0.9862).

## 1. Command Overview & yubiOS Role

`tpm2_policysecret` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policysecret - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policysecret.1/), weight 0.9890). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policysecret.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policysecret.1.md), weight 0.9862)

## 2. Name

**tpm2_policysecret**(1) - Couples the authorization of an object to that of an
existing object. ([tpm2_policysecret - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policysecret.1/), weight 0.9890)

## 3. Synopsis

**tpm2_policysecret** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_policysecret.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policysecret.1.md), weight 0.9862)

## 4. Description

**tpm2_policysecret**(1) - Couples the authorization of an object to that of an
existing object without requiring exposing the existing secret until time of
object use. ([tpm2_policysecret - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policysecret.1/), weight 0.9890)

## 5. Options

* **-c**, **\--object-context**=_OBJECT_:

    A context object specifier of a transient/permanent/persistent object. Either
    a file path of a object context blob or a loaded/persistent/permanent handle
    id. See section "Context Object Format". As an argument, it takes the auth
    value of the associated TPM object, a single dash - can be used to read the
    auth value from stdin. The argument follows the "authorization formatting
    standards", see section "Authorization Formatting".

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession**(1).

  * **-L**, **\--policy**=_FILE_:

    File to save the policy digest.

  * **-t**, **\--expiration**=_NATURAL_NUMBER_:

    Set the expiration time of the policy in seconds. In absence of nonceTPM
    the expiration time is the policy timeout value. If expiration value
    is 0 then the policy does not have a time limit on the authorization.

  * **\--ticket**=_FILE_:

    The ticket file to record the authorization ticket structure.

  * **\--timeout**=_FILE_:

    The file path to record the timeout structure returned.

  * **-x**, **\--nonce-tpm**:

    Enable the comparison of the current session's nonceTPM to ensure the
    validity of the policy authorization is limited to the current session.

  * **-q**, **\--qualification**=_FILE\_OR\_HEX\_STR_:

    Optional, the policy qualifier data that the signer can choose to include in the
    signature. Can be either a hex string or path.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash to be used in
    an audit or a policycphash.

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
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policysecret.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policysecret.1.md), weight 0.9862)

## 6. Examples

Associate auth value of a sealing object to the owner hierarchy password.
* Start a trial auth session and run **tpm2_policysecret**(1) to create policy
that can only be satisfied if owner hierarchy auth value is supplied.
* Start a real policy session and provide the owner hierarchy auth value.
* Provide the session input where in the policysecret for owner hierarchy auth
was satisfied to the unseal tool.
* If the policy was satisfied unsealing should succeed.

### Generate a policy that binds to the secret of the owner hiearchy
```bash
tpm2_startauthsession -S session.ctx

tpm2_policysecret -S session.ctx -c o -L secret.policy

tpm2_flushcontext session.ctx
```

### Create a TPM object using the policy
```bash
tpm2_createprimary -Q -C o -g sha256 -G rsa -c prim.ctx

tpm2_create -Q -g sha256 -u sealing_key.pub -r sealing_key.priv -i- \
  -C prim.ctx -L secret.policy <<< "SEALED-SECRET"

tpm2_load -C prim.ctx -u sealing_key.pub -r sealing_key.priv \
  -c sealing_key.ctx
```

### Satisfy the policy and unseal the secret
```bash
tpm2_startauthsession --policy-session -S session.ctx

tpm2_policysecret -S session.ctx -c o -L secret.policy

tpm2_unseal -p "session:session.ctx" -c sealing_key.ctx
SEALED-SECRET

tpm2_flushcontext session.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_policysecret - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policysecret.1/), weight 0.9890)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policysecret - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policysecret.1/) | `tpm2_policysecret tpm2-tools man page options examples` | **0.9890** | authoritative (kept) |
| 2 | [tpm2_policysecret (1)  -  tpm2-tools  -  Debian testing  -  Debian ...](https://manpages.debian.org/testing/tpm2-tools/tpm2_policysecret.1.en.html) | `tpm2_policysecret tpm2-tools man page options examples` | **0.9264** | authoritative (kept) |
| 3 | [tpm2_policysecret: Couples the authorization of an object to that of an ...](https://www.mankier.com/1/tpm2_policysecret) | `tpm2_policysecret tpm2-tools man page options examples` | **0.2324** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policysecret.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policysecret.1.md) | `tpm2_policysecret tpm2-tools man page options examples` | **0.9862** | authoritative (kept) |
