# 033 - tpm2-getpolicydigest (`tpm2_getpolicydigest`)

**Scope:** tpm2_getpolicydigest(1): Retrieves the policy digest from session.
**Upstream Manpage:** `man/tpm2_getpolicydigest.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_getpolicydigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getpolicydigest.1.md), weight 0.9853).
**Multiplexed Invocation:** `tpm2_getpolicydigest [OPTIONS]` or `tpm2 getpolicydigest [OPTIONS]` ([Ubuntu Manpage: tpm2_getpolicydigest (1) - Retrieves the ...](https://manpages.ubuntu.com/manpages/jammy/man1/tpm2_getpolicydigest.1.html), weight 0.9770).

## 1. Command Overview & yubiOS Role

`tpm2_getpolicydigest` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_getpolicydigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getpolicydigest.1.md), weight 0.9853). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([Ubuntu Manpage: tpm2_getpolicydigest (1) - Retrieves the ...](https://manpages.ubuntu.com/manpages/jammy/man1/tpm2_getpolicydigest.1.html), weight 0.9770)

## 2. Name

**tpm2_getpolicydigest**(1) - Retrieves the policy digest from session. ([tpm2-software/tpm2-tools: man/tpm2_getpolicydigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getpolicydigest.1.md), weight 0.9853)

## 3. Synopsis

**tpm2_getpolicydigest** [*OPTIONS*] [*ARGUMENT*] ([Ubuntu Manpage: tpm2_getpolicydigest (1) - Retrieves the ...](https://manpages.ubuntu.com/manpages/jammy/man1/tpm2_getpolicydigest.1.html), weight 0.9770)

## 4. Description

**tpm2_getpolicydigest**(1) - Returns the policydigest of a session.

Output defaults to *stdout* and binary format unless otherwise specified with
**-o** and **--hex** options respectively. ([tpm2-software/tpm2-tools: man/tpm2_getpolicydigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getpolicydigest.1.md), weight 0.9853)

## 5. Options

* **-o**, **\--output**=_FILE_

    Specifies the filename to output the raw bytes to. Defaults to stdout as a
    hex string.

  * **\--hex**

	Convert the output data to hex format without a leading "0x".

  * **-S**, **\--session**=_FILE_:

    The session created using **tpm2_startauthsession**.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([Ubuntu Manpage: tpm2_getpolicydigest (1) - Retrieves the ...](https://manpages.ubuntu.com/manpages/jammy/man1/tpm2_getpolicydigest.1.html), weight 0.9770)

## 6. Examples

### Create a session and retrieve policydigest
```bash
tpm2 startauthsession -S session.ctx
tpm2 policypassword -S session.ctx -L test.policy
tpm2 getpolicydigest -S session.ctx -o policy.out
tpm2 flushcontext session.ctx
```


**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_getpolicydigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getpolicydigest.1.md), weight 0.9853)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_getpolicydigest (1)  -  Arch manual pages](https://man.archlinux.org/man/extra/tpm2-tools/tpm2_getpolicydigest.1.en) | `tpm2_getpolicydigest tpm2-tools man page options examples` | **0.9700** | authoritative (kept) |
| 2 | [Ubuntu Manpage: tpm2_getpolicydigest (1) - Retrieves the ...](https://manpages.ubuntu.com/manpages/jammy/man1/tpm2_getpolicydigest.1.html) | `tpm2_getpolicydigest tpm2-tools man page options examples` | **0.9770** | authoritative (kept) |
| 3 | [tpm2_getpolicydigest: Retrieves the policy digest from session. / Man ...](https://www.mankier.com/1/tpm2_getpolicydigest) | `tpm2_getpolicydigest tpm2-tools man page options examples` | **0.2679** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_getpolicydigest.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getpolicydigest.1.md) | `tpm2_getpolicydigest tpm2-tools man page options examples` | **0.9853** | authoritative (kept) |
