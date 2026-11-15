# 096 - tpm2-startauthsession (`tpm2_startauthsession`)

**Scope:** tpm2_startauthsession(1): Start a session with the TPM.
**Upstream Manpage:** `man/tpm2_startauthsession.1.md` in `tpm2-software/tpm2-tools` ([tpm2_startauthsession - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_startauthsession.1/), weight 0.9905).
**Multiplexed Invocation:** `tpm2_startauthsession [OPTIONS]` or `tpm2 startauthsession [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_startauthsession.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_startauthsession.1.md), weight 0.9795).

## 1. Command Overview & yubiOS Role

`tpm2_startauthsession` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_startauthsession - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_startauthsession.1/), weight 0.9905). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_startauthsession.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_startauthsession.1.md), weight 0.9795)

## 2. Name

**tpm2_startauthsession**(1) - Start a session with the TPM. ([tpm2_startauthsession - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_startauthsession.1/), weight 0.9905)

## 3. Synopsis

**tpm2_startauthsession** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_startauthsession.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_startauthsession.1.md), weight 0.9795)

## 4. Description

**tpm2_startauthsession**(1) - Starts a session with the TPM. The default is to
start a *trial* session unless the **-a** option is specified. Saves the policy
session data to a file. This file can then be used in subsequent tools that can
use a policy file for authorization or policy events.

This will not work with resource managers (RMs) outside of
[tpm2-abrmd](https://github.com/tpm2-software/tpm2-abrmd), as most RMs will flush
session handles when a client disconnects from the IPC channel. However, when using
a RM without the session gapping feature, one can use the command TCTI to keep the
connection open.

The first step is to create a socket listener that uses tpm2\_send:
```bash
mknod "$HOME/backpipe" p
while [ 1 ]; do tpm2_send 0<"$HOME/backpipe" | nc -lU "$HOME/sock" 1>"$HOME/backpipe"; done;
```

The next step is to use the command TCTI and netcat (nc) to send data to the socket.
```bash
tpm2_startauthsession --tcti="cmd:nc -q 0 -U $HOME/sock" <options>
```

When finishing ensure to kill the listener. For commands executed with the command tcti against
the listener, one will need to manage transient handles. The simplest way is to add a flush
after each command: `tpm2_flushcontext --tcti="cmd:nc -q 0 -U $HOME/sock" -t`

Note: This example uses UNIX sockets, since the socket is controlled with Linux
access controls. Using a port is not recommended as it's either open to any user
on the system (localhost) or bound to a network card and exposed to the network.

This will work with direct TPM access, but note that internally this calls a
*ContextSave* and a *ContextLoad* on the session handle, thus the session
**cannot** be saved/loaded again. ([tpm2_startauthsession - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_startauthsession.1/), weight 0.9905)

## 5. Options

* **\--policy-session**:

    Start a policy session of type **TPM_SE_POLICY**. Default without this
    option is **TPM_SE_TRIAL**.

    **NOTE**: A *trial* session is used when building a policy and a *policy*
    session is used when authenticating with a policy.

  * **\--audit-session**:

    Start an HMAC session to be used as an audit session. Default without
    this option is **TPM2_SE_TRIAL**.

  * **\--hmac-session**:

    Start an HMAC session of type **TPM_SE_HMAC**. Default without this option
    is **TPM2_SE_TRIAL**.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm used in computation of the policy digest.

  * **-G**, **\--key-algorithm**=_ALGORITHM_:

    The symmetric algorithm used in parameter encryption/decryption.

  * **-c**, **\--key-context**=_OBJECT_:

    Set the tpmkey and bind objects to be the same.
    Session parameter encryption is turned on.
    Session parameter decryption is turned on.
    Parameter encryption/decryption symmetric-key set to AES-CFB.

  * **-S**, **\--session**=_FILE_:

    The name of the policy session file, required.

  * **\--bind-context**=_FILE_:

    Set the bind object.
    Session parameter encryption is off. Use **tpm2_sessionconfig** to turn on.
    Session parameter decryption is off. Use **tpm2_sessionconfig** to turn on.
    Parameter encryption/decryption symmetric-key set to AES-CFB.

  * **\--bind-auth**=_AUTH_:

    Set the authorization value for the bind object.

  * **\--tpmkey-context**=_FILE_:

    Set the tpmkey object.
    Session parameter encryption is off. Use **tpm2_sessionconfig** to turn on.
    Session parameter decryption is off. Use **tpm2_sessionconfig** to turn on.
    Parameter encryption/decryption symmetric-key set to AES-CFB.

  * **-n**, **\--name**=_FILE_

    A name file as output from a tool like tpm2\_readpublic(1) `-n` option.
    The name file can be used to **verify** a persistent handle input for
    the `--tpmkey-context`, `-c`, and `--key-context` options. Verification
    that the object referenced by a peristent handle, e.g 0x81000000, is
    the key expected prevents attackers from performing a man-in-the-middle
    attack on session traffic.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_startauthsession.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_startauthsession.1.md), weight 0.9795)

## 6. Examples

### Parameter encryption.

Command parameters and responses are not encrypted if no hmac session is used for
commands. A session where the parameter, in this case the password, is
encrypted can be created as follows:

```bash
tpm2_createprimary -c prim.ctx
tpm2_startauthsession -S enc_session.ctx --hmac-session --key-context prim.ctx
tpm2_create -C prim.ctx -c key.ctx -S enc_session.ctx -p password
```
Even without using a key for the session, a session can be used for parameter
encryption:

```bash
tpm2_startauthsession -S enc_session.ctx --hmac-session
tpm2_sessionconfig enc_session.ctx --enable-decrypt
tpm2_create -C prim.ctx -c key.ctx -S enc_session.ctx -p password
```
If the response has to be encrypted, the --enable-encrypt parameter can be used:

```bash
tpm2_startauthsession -S enc_session.ctx --hmac-session
tpm2_sessionconfig enc_session.ctx --enable-encrypt
tpm2_getrandom -S enc_session.ctx -o rand
```

### Start a *trial* session and save the session data to a file
```bash
tpm2_startauthsession -S mysession.ctx
```

### Start a *policy* session and save the session data to a file
```bash
tpm2_startauthsession --policy-session -S mysession.ctx
```

### Start an encrypted and bound *policy* session and save the session data to a file
```bash
tpm2_createprimary -c primary.ctx
tpm2_startauthsession --policy-session -c primary.ctx -S mysession.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_startauthsession - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_startauthsession.1/), weight 0.9905)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_startauthsession - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_startauthsession.1/) | `tpm2_startauthsession tpm2-tools man page options examples` | **0.9905** | authoritative (kept) |
| 2 | [tpm2_startauthsession: Start a session with the TPM. / Man Page ...](https://www.mankier.com/1/tpm2_startauthsession) | `tpm2_startauthsession tpm2-tools man page options examples` | **0.2714** | low-weight (weak backing) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_startauthsession tpm2-tools man page options examples` | **0.7766** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_startauthsession.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_startauthsession.1.md) | `tpm2_startauthsession tpm2-tools man page options examples` | **0.9795** | authoritative (kept) |
