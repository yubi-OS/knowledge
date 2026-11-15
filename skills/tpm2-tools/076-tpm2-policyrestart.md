# 076 - tpm2-policyrestart (`tpm2_policyrestart`)

**Scope:** tpm2_policyrestart(1): Restart an existing session with the TPM.
**Upstream Manpage:** `man/tpm2_policyrestart.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_policyrestart.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyrestart.1.md), weight 0.9886).
**Multiplexed Invocation:** `tpm2_policyrestart [OPTIONS]` or `tpm2 policyrestart [OPTIONS]` ([tpm2_policyrestart - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policyrestart.1/), weight 0.9880).

## 1. Command Overview & yubiOS Role

`tpm2_policyrestart` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_policyrestart.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyrestart.1.md), weight 0.9886). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2_policyrestart - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policyrestart.1/), weight 0.9880)

## 2. Name

**tpm2_policyrestart**(1) - Restart an existing session with the TPM. ([tpm2-software/tpm2-tools: man/tpm2_policyrestart.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyrestart.1.md), weight 0.9886)

## 3. Synopsis

**tpm2_policyrestart** [*OPTIONS*] ([tpm2_policyrestart - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policyrestart.1/), weight 0.9880)

## 4. Description

**tpm2_policyrestart**(1) - Restarts a session with the TPM back to it's
initial state. This is useful when the TPM gives one a **TPM_RC_PCR_CHANGED**
(`0x00000128`) error code when using a PCR policy session.

This will be returned if a PCR state affecting policy is altered during the
session. One could restart the session and try again, however, the PCR state
would still need to satisfy the policy. ([tpm2-software/tpm2-tools: man/tpm2_policyrestart.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyrestart.1.md), weight 0.9886)

## 5. Options

* **-S**, **\--session**=_FILE_:

    Optional, A session file from **tpm2_startauthsession**(1)'s **-S** option.
    This session is used in lieu of starting a session and using the PCR policy
    options.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_policyrestart - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policyrestart.1/), weight 0.9880)

## 6. Examples

### Start a *policy* session and restart it, unsealing some data.

```bash ([tpm2-software/tpm2-tools: man/tpm2_policyrestart.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyrestart.1.md), weight 0.9886)

## 7. Create A Policy And Bind It To An Object

tpm2_startauthsession -S session.dat

tpm2_policypcr -S session.dat -l "sha1:0,1,2,3" -L policy.dat

tpm2_createprimary -c primary.ctx

tpm2_create -Cprimary.ctx -u key.pub -r key.priv -L policy.dat -i- <<< "secret"

tpm2_load -C primary.ctx -c key.ctx -u key.pub -r key.priv

tpm2_flushcontext session.dat ([tpm2_policyrestart - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policyrestart.1/), weight 0.9880)

## 8. Satisfy The Policy And Use The Object

tpm2_startauthsession --policy -S session.dat

tpm2_policypcr -S session.dat -l "sha1:0,1,2,3" ([tpm2-software/tpm2-tools: man/tpm2_policyrestart.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyrestart.1.md), weight 0.9886)

## 9. Pcr Event Occurs Here Causing Unseal To Fail

tpm2_pcrevent 0 <<< "event data"

tpm2_unseal -psession:session.dat -c key.ct
ERROR: Esys_Unseal(0x128) - tpm:error(2.0): PCR have changed since checked ([tpm2_policyrestart - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policyrestart.1/), weight 0.9880)

## 10. Policy So Policyor Would Be Useful Here.

tpm2_policyrestart -S session.dat
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_policyrestart.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyrestart.1.md), weight 0.9886)

## 11. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policyrestart: Restart an existing session with the TPM. / Man ...](https://www.mankier.com/1/tpm2_policyrestart) | `tpm2_policyrestart tpm2-tools man page options examples` | **0.2623** | low-weight (weak backing) |
| 2 | [tpm2_policyrestart - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policyrestart.1/) | `tpm2_policyrestart tpm2-tools man page options examples` | **0.9880** | authoritative (kept) |
| 3 | [tpm2 / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2) | `tpm2_policyrestart tpm2-tools man page options examples` | **0.2499** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policyrestart.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyrestart.1.md) | `tpm2_policyrestart tpm2-tools man page options examples` | **0.9886** | authoritative (kept) |
