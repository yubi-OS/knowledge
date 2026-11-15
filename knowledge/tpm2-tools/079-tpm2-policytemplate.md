# 079 - tpm2-policytemplate (`tpm2_policytemplate`)

**Scope:** tpm2_policytemplate(1): Couples a policy with public template data digest of an object.
**Upstream Manpage:** `man/tpm2_policytemplate.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_policytemplate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policytemplate.1.md), weight 0.9891).
**Multiplexed Invocation:** `tpm2_policytemplate [OPTIONS]` or `tpm2 policytemplate [OPTIONS]` ([tpm2_policytemplate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policytemplate.1/), weight 0.9839).

## 1. Command Overview & yubiOS Role

`tpm2_policytemplate` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_policytemplate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policytemplate.1.md), weight 0.9891). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2_policytemplate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policytemplate.1/), weight 0.9839)

## 2. Name

**tpm2_policytemplate**(1) - Couples a policy with public template data digest
of an object. ([tpm2-software/tpm2-tools: man/tpm2_policytemplate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policytemplate.1.md), weight 0.9891)

## 3. Synopsis

**tpm2_policytemplate** [*OPTIONS*] ([tpm2_policytemplate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policytemplate.1/), weight 0.9839)

## 4. Description

**tpm2_policytemplate**(1) - Couples a policy with public template data digest
of an object. This is a deferred assertion where the hash of the public template
data of an object is checked against the one specified in the policy. ([tpm2-software/tpm2-tools: man/tpm2_policytemplate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policytemplate.1.md), weight 0.9891)

## 5. Options

* **-L**, **\--policy**=_FILE_:

    File to save the compounded policy digest.

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession**(1).

  * **--template-hash**=_FILE_:

    The file containing the hash of the public template of the object.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_policytemplate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policytemplate.1/), weight 0.9839)

## 6. Restrict The Primary Object Type Created Under A Hierarchy

```bash
tpm2_createprimary -C o -c prim.ctx --template-data template.data

cat template.data | openssl dgst -sha256 -binary -out template.hash

tpm2_startauthsession -S session.ctx -g sha256
tpm2_policytemplate -S session.ctx -L policy.template \
--template-hash template.hash
tpm2_flushcontext session.ctx

tpm2_setprimarypolicy -C o -g sha256 -L policy.template

tpm2_startauthsession -S session.ctx -g sha256 --policy-session
tpm2_policytemplate -S session.ctx --template-hash template.hash
tpm2_createprimary -C o -c prim2.ctx -P session:session.ctx
tpm2_flushcontext session.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_policytemplate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policytemplate.1.md), weight 0.9891)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_policytemplate tpm2-tools man page options examples` | **0.7184** | authoritative (kept) |
| 2 | [tpm2_policytemplate: Couples a policy with public template data digest ...](https://www.mankier.com/1/tpm2_policytemplate) | `tpm2_policytemplate tpm2-tools man page options examples` | **0.4577** | low-weight (weak backing) |
| 3 | [tpm2_policytemplate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policytemplate.1/) | `tpm2_policytemplate tpm2-tools man page options examples` | **0.9839** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policytemplate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policytemplate.1.md) | `tpm2_policytemplate tpm2-tools man page options examples` | **0.9891** | authoritative (kept) |
