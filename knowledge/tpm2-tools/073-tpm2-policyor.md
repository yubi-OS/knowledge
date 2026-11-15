# 073 - tpm2-policyor (`tpm2_policyor`)

**Scope:** tpm2_policyor(1): logically OR's two policies together.
**Upstream Manpage:** `man/tpm2_policyor.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policyor - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyor.1/), weight 0.9893).
**Multiplexed Invocation:** `tpm2_policyor [OPTIONS]` or `tpm2 policyor [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policyor.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyor.1.md), weight 0.9881).

## 1. Command Overview & yubiOS Role

`tpm2_policyor` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policyor - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyor.1/), weight 0.9893). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policyor.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyor.1.md), weight 0.9881)

## 2. Name

**tpm2_policyor**(1) - logically OR's two policies together. ([tpm2_policyor - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyor.1/), weight 0.9893)

## 3. Synopsis

**tpm2_policyor** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_policyor.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyor.1.md), weight 0.9881)

## 4. Description

**tpm2_policyor**(1) - Generates a policy_or event with the TPM. It expects a
session to be already established via **tpm2_startauthsession**(1). If
the input session is a trial session this tool generates a policy digest that
compounds two or more input policy digests such that the resulting policy digest
requires at least one of the policy events being true. If the input session is
real policy session **tpm2_policyor**(1) authenticates the object successfully
if at least one of the policy events are true. ([tpm2_policyor - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyor.1/), weight 0.9893)

## 5. Options

* **-L**, **\--policy**=_FILE_:

    File to save the compounded policy digest.

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession**(1).

  * **ARGUMENT** the command line argument specifies the list of files for the
    policy digests that has to be compounded resulting in individual policies
    being added to final policy digest that can authenticate the object. The
    list begins with the policy digest hash alg. Example sha256:policy1,policy2

  * **-l**, **\--policy-list**=_POLICY\_FILE_\_LIST:

    This option is DEPRECATED yet is retained for backwards compatibility. Use the
    argument method instead. **NOTE**: When **-l** and an argument is specified
    it's the same as specifying it all at once. For instance:
    `tpm2_policyor -l sha256:file1 sha256:file2` is the same as
    `tpm2_policyor sha256:file1,file2`.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policyor.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyor.1.md), weight 0.9881)

## 6. Examples

Create an authorization policy for a sealing object that compounds a pcr policy
and a policypassword in an OR fashion and show satisfying either policies could
unseal the secret.

### Create policypcr as first truth value for compounding the policies
```bash
tpm2_startauthsession -S session.ctx
tpm2_policypcr -S session.ctx -L policy.pcr -l sha256:0,1,2,3
tpm2_flushcontext session.ctx
```

### Create policypassword as second truth value for compounding the policies
```bash
tpm2_startauthsession -S session.ctx
tpm2_policypassword -S session.ctx -L policy.pass
tpm2_flushcontext session.ctx
```

### Compound the two policies in an OR fashion with tpm2_policyor command
```bash
tpm2_startauthsession -S session.ctx
tpm2_policyor -S session.ctx -L policy.or sha256:policy.pass,policy.pcr
tpm2_flushcontext session.ctx
```

### Create a sealing object and attach the auth policy from tpm2_policyor command
```bash
tpm2_createprimary -c prim.ctx -Q
echo "secret" | tpm2_create -C prim.ctx -c key.ctx -u key.pub -r key.priv \
-L policy.or -i-
```

### Satisfy auth policy using password and unseal the secret
```bash
tpm2_startauthsession -S session.ctx --policy-session
tpm2_policypassword -S session.ctx
tpm2_policyor -S session.ctx sha256:policy.pass,policy.pcr
tpm2_unseal -c key.ctx -p session:session.ctx
tpm2_flushcontext session.ctx
```

### Satisfy auth policy using pcr and unseal the secret
```bash
tpm2_startauthsession -S session.ctx --policy-session
tpm2_policypcr -S session.ctx -l sha256:0,1,2,3
tpm2_policyor -S session.ctx sha256:policy.pass,policy.pcr
tpm2_unseal -c key.ctx -p session:session.ctx
tpm2_flushcontext session.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_policyor - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyor.1/), weight 0.9893)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policyor - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyor.1/) | `tpm2_policyor tpm2-tools man page options examples` | **0.9893** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_policyor tpm2-tools man page options examples` | **0.8150** | authoritative (kept) |
| 3 | [tpm2 (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2.1.en.html) | `tpm2_policyor tpm2-tools man page options examples` | **0.8171** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policyor.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyor.1.md) | `tpm2_policyor tpm2-tools man page options examples` | **0.9881** | authoritative (kept) |
