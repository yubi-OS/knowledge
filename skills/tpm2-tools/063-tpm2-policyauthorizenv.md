# 063 - tpm2-policyauthorizenv (`tpm2_policyauthorizenv`)

**Scope:** tpm2_policyauthorizenv(1): Allows for mutable policies by referencing to a policy from an NV index.
**Upstream Manpage:** `man/tpm2_policyauthorizenv.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policyauthorizenv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorizenv.1/), weight 0.9912).
**Multiplexed Invocation:** `tpm2_policyauthorizenv [OPTIONS]` or `tpm2 policyauthorizenv [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policyauthorizenv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthorizenv.1.md), weight 0.9899).

## 1. Command Overview & yubiOS Role

`tpm2_policyauthorizenv` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policyauthorizenv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorizenv.1/), weight 0.9912). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policyauthorizenv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthorizenv.1.md), weight 0.9899)

## 2. Name

**tpm2_policyauthorizenv**(1) - Allows for mutable policies by referencing to a
policy from an NV index. ([tpm2_policyauthorizenv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorizenv.1/), weight 0.9912)

## 3. Synopsis

**tpm2_policyauthorizenv** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_policyauthorizenv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthorizenv.1.md), weight 0.9899)

## 4. Description

**tpm2_policyauthorizenv**(1) - This command allows for policies to change by
referencing the authorization policy written to an NV index. The NV index
containing the authorization policy should remain readable even for trial
session. The index can be specified as raw handle or an offset value to the nv
handle range "TPM2_HR_NV_INDEX". ([tpm2_policyauthorizenv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorizenv.1/), weight 0.9912)

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

  * **-L**, **\--policy**=_FILE_:

    File to save the policy digest.

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
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policyauthorizenv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthorizenv.1.md), weight 0.9899)

## 6. Examples

Create a policypassword and write the policy digest to an NV Index. Build a
policyauthorizenv policy referencing the NV index in a *trial* session. The
resultant policy digest is then used in creation of objects.

In a policy authorization session, first satisfy the policy written to the
NV index. Then run the policyauthorizenv which satisfies the authorization for
the object.

### Define the test NV Index to store the auth policy
```bash
nv_test_index=0x01500001
tpm2_nvdefine -C o -p nvpass $nv_test_index -a "authread|authwrite" -s 34
```

### Define the auth policy
```bash
tpm2_startauthsession -S session.ctx
tpm2_policypassword -S session.ctx -L policy.pass
tpm2_flushcontext session.ctx
```

### Write the auth policy to the NV Index
```bash
echo "000b" | xxd -p -r | cat - policy.pass | \
tpm2_nvwrite -C $nv_test_index -P nvpass $nv_test_index -i-
```

### Define the policyauthorizenv
```bash
tpm2_startauthsession -S session.ctx
tpm2_policyauthorizenv -S session.ctx -C $nv_test_index -P nvpass \
-L policyauthorizenv.1500001 $nv_test_index
tpm2_flushcontext session.ctx
```

### Create and load a sealing object with auth policy = policyauthorizenv
```bash
tpm2_createprimary -C o -c prim.ctx

echo "secretdata" | \
tpm2_create -C prim.ctx -u key.pub -r key.priv \
-a "fixedtpm|fixedparent|adminwithpolicy" -L policyauthorizenv.1500001 -i-

tpm2_load -C prim.ctx -u key.pub -r key.priv -c key.ctx
```

### Satisfy the auth policy stored in the NV Index and thus policyauthorizenv
```bash
tpm2_startauthsession -S session.ctx --policy-session
tpm2_policypassword -S session.ctx
tpm2_policyauthorizenv -S session.ctx -C $nv_test_index -P nvpass $nv_test_index
tpm2_unseal -c key.ctx -p session:session.ctx
tpm2_flushcontext session.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_policyauthorizenv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorizenv.1/), weight 0.9912)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policyauthorizenv: Allows for mutable policies by ... - ManKier](https://www.mankier.com/1/tpm2_policyauthorizenv) | `tpm2_policyauthorizenv tpm2-tools man page options examples` | **0.9222** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_policyauthorizenv tpm2-tools man page options examples` | **0.9024** | authoritative (kept) |
| 3 | [tpm2_policyauthorizenv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorizenv.1/) | `tpm2_policyauthorizenv tpm2-tools man page options examples` | **0.9912** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policyauthorizenv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthorizenv.1.md) | `tpm2_policyauthorizenv tpm2-tools man page options examples` | **0.9899** | authoritative (kept) |
