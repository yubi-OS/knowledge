# 028 - tpm2-flushcontext (`tpm2_flushcontext`)

**Scope:** tpm2_flushcontext(1): Remove a specified handle, or all contexts associated with a transient object, loaded session or saved session from the TPM.
**Upstream Manpage:** `man/tpm2_flushcontext.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_flushcontext.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_flushcontext.1.md), weight 0.9911).
**Multiplexed Invocation:** `tpm2_flushcontext [OPTIONS]` or `tpm2 flushcontext [OPTIONS]` ([tpm2_flushcontext (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_flushcontext.1.en.html), weight 0.9741).

## 1. Command Overview & yubiOS Role

`tpm2_flushcontext` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_flushcontext.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_flushcontext.1.md), weight 0.9911). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2_flushcontext (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_flushcontext.1.en.html), weight 0.9741)

## 2. Name

**tpm2_flushcontext**(1) - Remove a specified handle, or all contexts associated
with a transient object, loaded session or saved session from the TPM. ([tpm2-software/tpm2-tools: man/tpm2_flushcontext.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_flushcontext.1.md), weight 0.9911)

## 3. Synopsis

**tpm2_flushcontext** [*OPTIONS*] [*ARGUMENT*] ([tpm2_flushcontext (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_flushcontext.1.en.html), weight 0.9741)

## 4. Description

**tpm2_flushcontext**(1) - Remove a specified handle, or all contexts associated
with a transient object, loaded session or saved session from the TPM. The
object to be flushed is specified as the first argument to the tool and is in
one of the following forms:
  - The handle of the object to be flushed from the TPM. Must be a valid handle
  number.
  - Flush a session via a session file. A session file is generated from
    **tpm2_startauthsession**(1)'s **-S** option. ([tpm2-software/tpm2-tools: man/tpm2_flushcontext.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_flushcontext.1.md), weight 0.9911)

## 5. Options

* **-t**, **\--transient-object**:

    Remove all transient objects.

  * **-l**, **\--loaded-session**:

    Remove all loaded sessions.

  * **-s**, **\--saved-session**:

    Remove all saved sessions.

  * **ARGUMENT** the command line argument specifies the _OBJECT_ to be removed
    from the TPM resident memory.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the 

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h ([tpm2_flushcontext (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_flushcontext.1.en.html), weight 0.9741)

## 6. Examples

### Flushing a Transient Object

Typically, when using the TPM, the interactions occur through a resource
manager, like tpm2-abrmd(8). When the process exits, transient object handles
are flushed. Thus, flushing transient objects through the command line is not
required. However, when interacting with the TPM directly, this scenario is
possible. The below example assumes direct TPM access not brokered by a resource
manager. Specifically we will use the simulator.

```bash
tpm2_createprimary -Tmssim -c primary.ctx

tpm2_getcap -T mssim handles-transient
- 0x80000000

tpm2_flushcontext -T mssim 0x80000000
```

### Flush All the Transient Objects
```bash
tpm2_flushcontext \--transient-object
```

### Flush a Session
```bash
tpm2_startauthsession -S session.dat

tpm2_flushcontext session.dat
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_flushcontext.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_flushcontext.1.md), weight 0.9911)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_flushcontext / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2_flushcontext) | `tpm2_flushcontext tpm2-tools man page options examples` | **0.2999** | low-weight (weak backing) |
| 2 | [Ubuntu Manpage: tpm2_flushcontext(1) - Remove a specified handle...](https://manpages.ubuntu.com/manpages/jammy/man1/tpm2_flushcontext.1.html) | `tpm2_flushcontext tpm2-tools man page options examples` | **0.9723** | authoritative (kept) |
| 3 | [tpm2_flushcontext (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_flushcontext.1.en.html) | `tpm2_flushcontext tpm2-tools man page options examples` | **0.9741** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_flushcontext.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_flushcontext.1.md) | `tpm2_flushcontext tpm2-tools man page options examples` | **0.9911** | authoritative (kept) |
