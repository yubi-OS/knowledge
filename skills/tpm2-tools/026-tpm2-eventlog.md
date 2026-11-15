# 026 - tpm2-eventlog (`tpm2_eventlog`)

**Scope:** tpm2_eventlog(1): Display tpm2 event log.
**Upstream Manpage:** `man/tpm2_eventlog.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_eventlog.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_eventlog.1.md), weight 0.9905).
**Multiplexed Invocation:** `tpm2_eventlog [OPTIONS]` or `tpm2 eventlog [OPTIONS]` ([tpm2_eventlog - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_eventlog.1/), weight 0.9889).

## 1. Command Overview & yubiOS Role

`tpm2_eventlog` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_eventlog.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_eventlog.1.md), weight 0.9905). In yubiOS measured boot (Unified Kernel Images signed via YubiKey PIV slot 9a, `systemd-stub`, and OP-TEE fTPM on ARM64 / `swtpm` in `bcvk` CI), PCR and eventlog commands inspect and extend banks `sha256` (PCRs 0-15, including PCR 4 boot loader, PCR 7 Secure Boot policy, PCR 11 UKI image, and PCR 14/15 system measurements). ([tpm2_eventlog - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_eventlog.1/), weight 0.9889)

## 2. Name

**tpm2_eventlog**(1) - Display tpm2 event log. ([tpm2-software/tpm2-tools: man/tpm2_eventlog.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_eventlog.1.md), weight 0.9905)

## 3. Synopsis

**tpm2_eventlog**  [*ARGUMENT*] ([tpm2_eventlog - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_eventlog.1/), weight 0.9889)

## 4. Description

**tpm2_eventlog**(1) - Parse a binary TPM2 event log. The event log may be
passed to the tool as the final positional parameter. If this parameter is
omitted the tool will return an error. The format of this log documented in
the "TCG PC Client Platform Firmware Profile Specification". ([tpm2-software/tpm2-tools: man/tpm2_eventlog.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_eventlog.1.md), weight 0.9905)

## 5. Options

* **\--eventlog-version**=_NATURAL_NUMBER_:

    Specifies the yaml version of parsed event log.
    Currently version 1 and 2 are supported. The default is 1.

  * **ARGUMENT** The command line argument is the path to a binary TPM2
    eventlog.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect. ([tpm2_eventlog - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_eventlog.1/), weight 0.9889)

## 6. Examples

```bash ([tpm2-software/tpm2-tools: man/tpm2_eventlog.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_eventlog.1.md), weight 0.9905)

## 7. Display Eventlog From Provided File

tpm2_eventlog eventlog.bin
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_eventlog - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_eventlog.1/), weight 0.9889)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_eventlog(1) - Display tpm2 event log. - Ubuntu Manpages](https://manpages.ubuntu.com/manpages/jammy/man1/tpm2_eventlog.1.html) | `tpm2_eventlog tpm2-tools man page options examples` | **0.9719** | authoritative (kept) |
| 2 | [tpm2_eventlog - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_eventlog.1/) | `tpm2_eventlog tpm2-tools man page options examples` | **0.9889** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_eventlog tpm2-tools man page options examples` | **0.7557** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_eventlog.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_eventlog.1.md) | `tpm2_eventlog tpm2-tools man page options examples` | **0.9905** | authoritative (kept) |
