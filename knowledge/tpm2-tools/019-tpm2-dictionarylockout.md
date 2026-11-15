# 019 - tpm2-dictionarylockout (`tpm2_dictionarylockout`)

**Scope:** tpm2_dictionarylockout(1): Setup or clear dictionary-attack-lockout parameters.
**Upstream Manpage:** `man/tpm2_dictionarylockout.1.md` in `tpm2-software/tpm2-tools` ([tpm2_dictionarylockout - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_dictionarylockout.1/), weight 0.9898).
**Multiplexed Invocation:** `tpm2_dictionarylockout [OPTIONS]` or `tpm2 dictionarylockout [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_dictionarylockout.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_dictionarylockout.1.md), weight 0.9887).

## 1. Command Overview & yubiOS Role

`tpm2_dictionarylockout` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_dictionarylockout - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_dictionarylockout.1/), weight 0.9898). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_dictionarylockout.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_dictionarylockout.1.md), weight 0.9887)

## 2. Name

**tpm2_dictionarylockout**(1) - Setup or clear dictionary-attack-lockout
parameters. ([tpm2_dictionarylockout - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_dictionarylockout.1/), weight 0.9898)

## 3. Synopsis

**tpm2_dictionarylockout** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_dictionarylockout.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_dictionarylockout.1.md), weight 0.9887)

## 4. Description

**tpm2_dictionarylockout**(1) - Setup dictionary-attack-lockout parameters or
clear dictionary-attack-lockout state. ([tpm2_dictionarylockout - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_dictionarylockout.1/), weight 0.9898)

## 5. Options

* **-s**, **\--setup-parameters**:

    Specifies the tool should operate to setup dictionary-attack-lockout
    parameters.

  * **-c**, **\--clear-lockout**:

    Specifies the tool should operate to clear dictionary-attack-lockout state.

  * **-l**, **\--lockout-recovery-time**=_NATURAL_NUMBER_:

    Specifies the wait time in seconds before another **TPM_RH_LOCKOUT**
    authentication attempt can be made after a failed authentication.

  * **-t**, **\--recovery-time**=_NATURAL_NUMBER_:

    Specifies the wait time in seconds before another DA-protected-object
    authentication attempt can be made after max-tries number of failed
    authentications.

  * **-n**, **\--max-tries**=_NATURAL_NUMBER_:

    Specifies the maximum number of allowed authentication attempts on
    DA-protected-object; after which DA is activated.

  * **-p**, **\--auth**=_AUTH_:

    The authorization value for the lockout handle.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_dictionarylockout.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_dictionarylockout.1.md), weight 0.9887)

## 6. Examples

```bash
tpm2_dictionarylockout -c -p passwd

tpm2_dictionarylockout -s -n 5 -t 6 -l 7 -p passwd
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_dictionarylockout - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_dictionarylockout.1/), weight 0.9898)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_dictionarylockout (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_dictionarylockout.1.en.html) | `tpm2_dictionarylockout tpm2-tools man page options examples` | **0.9567** | authoritative (kept) |
| 2 | [tpm2_dictionarylockout - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_dictionarylockout.1/) | `tpm2_dictionarylockout tpm2-tools man page options examples` | **0.9898** | authoritative (kept) |
| 3 | [Manpage of tpm2_dictionarylockout - Linux Manual Database](https://man.linuxreviews.org/man1/tpm2_dictionarylockout.1.html) | `tpm2_dictionarylockout tpm2-tools man page options examples` | **0.2612** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_dictionarylockout.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_dictionarylockout.1.md) | `tpm2_dictionarylockout tpm2-tools man page options examples` | **0.9887** | authoritative (kept) |
