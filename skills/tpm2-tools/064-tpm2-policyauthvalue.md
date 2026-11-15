# 064 - tpm2-policyauthvalue (`tpm2_policyauthvalue`)

**Scope:** tpm2_policyauthvalue(1): Enables binding a policy to the authorization value of the authorized TPM object.
**Upstream Manpage:** `man/tpm2_policyauthvalue.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policyauthvalue - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthvalue.1/), weight 0.9909).
**Multiplexed Invocation:** `tpm2_policyauthvalue [OPTIONS]` or `tpm2 policyauthvalue [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policyauthvalue.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthvalue.1.md), weight 0.9867).

## 1. Command Overview & yubiOS Role

`tpm2_policyauthvalue` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policyauthvalue - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthvalue.1/), weight 0.9909). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policyauthvalue.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthvalue.1.md), weight 0.9867)

## 2. Name

**tpm2_policyauthvalue**(1) - Enables binding a policy to the authorization value
 of the authorized TPM object. ([tpm2_policyauthvalue - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthvalue.1/), weight 0.9909)

## 3. Synopsis

**tpm2_policyauthvalue** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_policyauthvalue.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthvalue.1.md), weight 0.9867)

## 4. Description

**tpm2_policyauthvalue**(1) - Enables a policy that requires the object's
authentication passphrase be provided. This is equivalent to authenticating
using the object passphrase in plaintext or HMAC. It enforces it as a policy.
It provides a mechanism to allow for password authentication when an object only
allows policy based authorization, ie object attribute "userwithauth" is 0. ([tpm2_policyauthvalue - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthvalue.1/), weight 0.9909)

## 5. Options

* **-L**, **\--policy**=_FILE_:

    File to save the compounded policy digest.

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession**(1).

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policyauthvalue.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthvalue.1.md), weight 0.9867)

## 6. Examples

We want to authenticate using the TPM objects plaintext authentication value.
While we could authenticate with an ephemeral password session, in this example
we will authenticate with the plaintext passphrase in  a policy session instead
using the **tpm2_policyauthvalue**(1) tool.

### Create the password policy
```bash
tpm2_startauthsession -S session.dat

tpm2_policyauthvalue -S session.dat -L policy.dat

tpm2_flushcontext session.dat
```

### Create the object with a passphrase and the password policy
```bash
tpm2_createprimary -C o -c prim.ctx

tpm2_create -g sha256 -G aes -u key.pub -r key.priv -C prim.ctx -L policy.dat \
  -p testpswd
```

### Authenticate with plaintext passphrase input
```bash
tpm2_load -C prim.ctx -u key.pub -r key.priv -n key.name -c key.ctx

echo "plaintext" > plain.txt
tpm2_encryptdecrypt -c key.ctx -o encrypt.out plain.txt -p testpswd
```

### Authenticate with password and the policy
```bash
tpm2_startauthsession --policy-session -S session.dat

tpm2_policyauthvalue -S session.dat

tpm2_encryptdecrypt -c key.ctx -o encrypt.out -p session:session.dat+testpswd \
plain.txt

tpm2_flushcontext session.dat
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_policyauthvalue - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthvalue.1/), weight 0.9909)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_policyauthvalue tpm2-tools man page options examples` | **0.9016** | authoritative (kept) |
| 2 | [tpm2_policyauthvalue: Enables binding a policy to the ... - ManKier](https://www.mankier.com/1/tpm2_policyauthvalue) | `tpm2_policyauthvalue tpm2-tools man page options examples` | **0.4561** | low-weight (weak backing) |
| 3 | [tpm2_policyauthvalue - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthvalue.1/) | `tpm2_policyauthvalue tpm2-tools man page options examples` | **0.9909** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policyauthvalue.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthvalue.1.md) | `tpm2_policyauthvalue tpm2-tools man page options examples` | **0.9867** | authoritative (kept) |
