# 061 - tpm2-pcrreset (`tpm2_pcrreset`)

**Scope:** tpm2_pcrreset(1): Reset one or more PCR banks
**Upstream Manpage:** `man/tpm2_pcrreset.1.md` in `tpm2-software/tpm2-tools` ([tpm2_pcrreset - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrreset.1/), weight 0.9898).
**Multiplexed Invocation:** `tpm2_pcrreset [OPTIONS]` or `tpm2 pcrreset [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_pcrreset.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrreset.1.md), weight 0.9873).

## 1. Command Overview & yubiOS Role

`tpm2_pcrreset` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_pcrreset - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrreset.1/), weight 0.9898). In yubiOS measured boot (Unified Kernel Images signed via YubiKey PIV slot 9a, `systemd-stub`, and OP-TEE fTPM on ARM64 / `swtpm` in `bcvk` CI), PCR and eventlog commands inspect and extend banks `sha256` (PCRs 0-15, including PCR 4 boot loader, PCR 7 Secure Boot policy, PCR 11 UKI image, and PCR 14/15 system measurements). ([tpm2-software/tpm2-tools: man/tpm2_pcrreset.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrreset.1.md), weight 0.9873)

## 2. Name

**tpm2_pcrreset**(1) - Reset one or more PCR banks ([tpm2_pcrreset - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrreset.1/), weight 0.9898)

## 3. Synopsis

**tpm2_pcrreset** [*OPTIONS*] _PCR\_INDEX_ ... ([tpm2-software/tpm2-tools: man/tpm2_pcrreset.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrreset.1.md), weight 0.9873)

## 4. Description

**tpm2_pcrreset**(1) - Reset PCR value in all banks for specified index.
More than one PCR index can be specified.

The reset value is manufacturer-dependent and is either sequence of 00 or FF
on the length of the hash algorithm for each supported bank.

_PCR\_INDEX_ is a space separated list of PCR indexes to be reset when issuing
the command. ([tpm2_pcrreset - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrreset.1/), weight 0.9898)

## 5. Options

This tool accepts no tool specific options.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the 

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h ([tpm2-software/tpm2-tools: man/tpm2_pcrreset.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrreset.1.md), weight 0.9873)

## 6. Examples

### Reset a single PCR
```bash
tpm2_pcrreset 23
```

### Reset multiple PCRs
```bash
tpm2_pcrreset 16 23
``` ([tpm2_pcrreset - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrreset.1/), weight 0.9898)

## 7. Notes

On operating system's locality (generally locality 0), only PCR 23 can be reset.
PCR-16 can also be reset on this locality, depending on TPM manufacturers
which could define this PCR as resettable.

PCR 0 to 15 are not resettable (being part of SRTM). PCR 16 to 22 are mostly
reserved for DRTM or dedicated to specific localities and might not
be resettable depending on current TPM locality.

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_pcrreset.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrreset.1.md), weight 0.9873)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_pcrreset: Reset one or more PCR banks / Man Page / ManKier](https://www.mankier.com/1/tpm2_pcrreset) | `tpm2_pcrreset tpm2-tools man page options examples` | **0.5822** | authoritative (kept) |
| 2 | [tpm2_pcrreset - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrreset.1/) | `tpm2_pcrreset tpm2-tools man page options examples` | **0.9898** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_pcrreset tpm2-tools man page options examples` | **0.7918** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_pcrreset.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrreset.1.md) | `tpm2_pcrreset tpm2-tools man page options examples` | **0.9873** | authoritative (kept) |
