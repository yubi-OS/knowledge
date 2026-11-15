# 068 - tpm2-policyduplicationselect (`tpm2_policyduplicationselect`)

**Scope:** tpm2_policyduplicationselect(1): Restricts duplication to a specific new parent.
**Upstream Manpage:** `man/tpm2_policyduplicationselect.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policyduplicationselect - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyduplicationselect.1/), weight 0.9916).
**Multiplexed Invocation:** `tpm2_policyduplicationselect [OPTIONS]` or `tpm2 policyduplicationselect [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policyduplicationselect.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyduplicationselect.1.md), weight 0.9892).

## 1. Command Overview & yubiOS Role

`tpm2_policyduplicationselect` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policyduplicationselect - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyduplicationselect.1/), weight 0.9916). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policyduplicationselect.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyduplicationselect.1.md), weight 0.9892)

## 2. Name

**tpm2_policyduplicationselect**(1) - Restricts duplication to a specific new
parent. ([tpm2_policyduplicationselect - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyduplicationselect.1/), weight 0.9916)

## 3. Synopsis

**tpm2_policyduplicationselect** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_policyduplicationselect.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyduplicationselect.1.md), weight 0.9892)

## 4. Description

**tpm2_policyduplicationselect**(1) - Restricts duplication to a specific new
parent. ([tpm2_policyduplicationselect - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyduplicationselect.1/), weight 0.9916)

## 5. Options

* **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession**(1).

  * **-n**, **\--object-name**=_FILE_:

    Input name file of the object to be duplicated.

  * **-N**, **\--parent-name**=_FILE_:

    Input name file of the new parent.

  * **-L**, **\--policy**=_FILE_:

    File to save the policy digest.

  * **\--include-object**:

    If exists, the object name will be included in the value in policy digest.


### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policyduplicationselect.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyduplicationselect.1.md), weight 0.9892)

## 6. Examples

### Setup a duplication role policy to restricted new parent

### Create source parent and destination(or new) parent
```bash
tpm2_createprimary -C n -g sha256 -G rsa -c dst_n.ctx -Q
tpm2_createprimary -C o -g sha256 -G rsa -c src_o.ctx -Q
```

### Create the restricted parent policy
```bash
tpm2_readpublic -c dst_n.ctx -n dst_n.name -Q
tpm2_startauthsession -S session.ctx
tpm2_policyduplicationselect -S session.ctx  -N dst_n.name \
-L policydupselect.dat -Q
tpm2_flushcontext session.ctx
rm session.ctx
```

### Create the object to be duplicated using the policy
```bash
tpm2_create -C src_o.ctx -g sha256 -G rsa -r dupkey.priv -u dupkey.pub \
-L policydupselect.dat  -a "sensitivedataorigin|sign|decrypt" -c dupkey.ctx -Q
tpm2_readpublic -c dupkey.ctx -n dupkey.name -Q
```

### Satisfy the policy and duplicate the object
```bash
tpm2_startauthsession -S session.ctx --policy-session
tpm2_policyduplicationselect -S session.ctx  -N dst_n.name -n dupkey.name -Q
tpm2_duplicate -C dst_n.ctx -c dupkey.ctx -G null -p session:session.ctx \
-r new_dupkey.priv -s dupseed.dat
tpm2_flushcontext  session.ctx
rm session.ctx
``` ([tpm2_policyduplicationselect - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyduplicationselect.1/), weight 0.9916)

## 7. Notes

* This command usually cooperates with **tpm2_duplicate**(1), so referring to
the man page of **tpm2_duplicate**(1)
is recommended.

* This command will set the policy session's command code to
**TPM_CC_Duplicate** which enables duplication role of the policy.

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_policyduplicationselect.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyduplicationselect.1.md), weight 0.9892)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policyduplicationselect - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyduplicationselect.1/) | `tpm2_policyduplicationselect tpm2-tools man page options examples` | **0.9916** | authoritative (kept) |
| 2 | [tpm2_policyduplicationselect: Restricts duplication to a specific new ...](https://www.mankier.com/1/tpm2_policyduplicationselect) | `tpm2_policyduplicationselect tpm2-tools man page options examples` | **0.4196** | low-weight (weak backing) |
| 3 | [Ubuntu Manpage: tpm2_policyduplicationselect (1) - Restricts ...](https://manpages.ubuntu.com/manpages/stonking/man1/tpm2_policyduplicationselect.1.html) | `tpm2_policyduplicationselect tpm2-tools man page options examples` | **0.9456** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policyduplicationselect.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyduplicationselect.1.md) | `tpm2_policyduplicationselect tpm2-tools man page options examples` | **0.9892** | authoritative (kept) |
