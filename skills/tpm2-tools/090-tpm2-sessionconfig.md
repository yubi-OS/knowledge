# 090 - tpm2-sessionconfig (`tpm2_sessionconfig`)

**Scope:** tpm2_sessionconfig(1): Configure session attributes and print session info from a session file.
**Upstream Manpage:** `man/tpm2_sessionconfig.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_sessionconfig.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sessionconfig.1.md), weight 0.9930).
**Multiplexed Invocation:** `tpm2_sessionconfig [OPTIONS]` or `tpm2 sessionconfig [OPTIONS]` ([tpm2_sessionconfig - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sessionconfig.1/), weight 0.9917).

## 1. Command Overview & yubiOS Role

`tpm2_sessionconfig` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_sessionconfig.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sessionconfig.1.md), weight 0.9930). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2_sessionconfig - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sessionconfig.1/), weight 0.9917)

## 2. Name

**tpm2_sessionconfig**(1) - Configure session attributes and print session info
from a session file. ([tpm2-software/tpm2-tools: man/tpm2_sessionconfig.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sessionconfig.1.md), weight 0.9930)

## 3. Synopsis

**tpm2_sessionconfig** [*OPTIONS*] [*ARGUMENT*] ([tpm2_sessionconfig - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sessionconfig.1/), weight 0.9917)

## 4. Description

**tpm2_sessionconfig**(1) - Configure session attributes and print session info
from a session file.

The tool operates in one of two modes:
1. Configure/ modify the session attributes.
2. Print the session information. This is the default behavior. ([tpm2-software/tpm2-tools: man/tpm2_sessionconfig.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sessionconfig.1.md), weight 0.9930)

## 5. Options

* **\--enable-continuesession**:

    Enable continueSession in the session-attributes.

  * **\--disable-continuesession**

    Disable continuesession in the session-attributes.

  * **\--enable-auditexclusive**

    Enable auditexclusive in the session-attributes.

  * **\--disable-auditexclusive**

    Disable auditexclusive in the session-attributes.

  * **\--enable-auditreset**

    Enable  auditreset in the session-attributes.

  * **\--disable-auditreset**

    Disable auditreset in the session-attributes.

  * **\--enable-decrypt**

    Enable  decrypt in the session-attributes.

  * **\--disable-decrypt**

    Disable decrypt in the session-attributes.

  * **\--enable-encrypt**

    Enable  encrypt in the session-attributes.

  * **\--disable-encrypt**

    Disable encrypt in the session-attributes.

  * **\--enable-audit**

    Enable  audit in the session-attributes.

  * **\--disable-audit**

    Disable audit in the session-attributes.

* **ARGUMENT** the session context file.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_sessionconfig - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sessionconfig.1/), weight 0.9917)

## 6. Examples

### Start a bounded & salted session, disable continuesession and display session

```bash

tpm2 createprimary -c prim.ctx
tpm2 startauthsession -S session.ctx --policy-session -c prim.ctx

### Session info before changing attributes
tpm2 sessionconfig session.ctx

### Session info after changing attributes
tpm2 sessionconfig --disable-continuesession
tpm2 sessionconfig session.ctx

```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_sessionconfig.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sessionconfig.1.md), weight 0.9930)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_sessionconfig (1)  -  Arch manual pages](https://man.archlinux.org/man/tpm2_sessionconfig.1.en) | `tpm2_sessionconfig tpm2-tools man page options examples` | **0.9641** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_sessionconfig tpm2-tools man page options examples` | **0.8790** | authoritative (kept) |
| 3 | [tpm2_sessionconfig - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_sessionconfig.1/) | `tpm2_sessionconfig tpm2-tools man page options examples` | **0.9917** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_sessionconfig.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_sessionconfig.1.md) | `tpm2_sessionconfig tpm2-tools man page options examples` | **0.9930** | authoritative (kept) |
