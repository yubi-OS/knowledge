# 059 - tpm2-pcrextend (`tpm2_pcrextend`)

**Scope:** tpm2_pcrextend(1): Extends a PCR.
**Upstream Manpage:** `man/tpm2_pcrextend.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_pcrextend.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrextend.1.md), weight 0.9877).
**Multiplexed Invocation:** `tpm2_pcrextend [OPTIONS]` or `tpm2 pcrextend [OPTIONS]` ([tpm2_pcrextend - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrextend.1/), weight 0.9800).

## 1. Command Overview & yubiOS Role

`tpm2_pcrextend` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_pcrextend.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrextend.1.md), weight 0.9877). In yubiOS measured boot (Unified Kernel Images signed via YubiKey PIV slot 9a, `systemd-stub`, and OP-TEE fTPM on ARM64 / `swtpm` in `bcvk` CI), PCR and eventlog commands inspect and extend banks `sha256` (PCRs 0-15, including PCR 4 boot loader, PCR 7 Secure Boot policy, PCR 11 UKI image, and PCR 14/15 system measurements). ([tpm2_pcrextend - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrextend.1/), weight 0.9800)

## 2. Name

**tpm2_pcrextend**(1) - Extends a PCR. ([tpm2-software/tpm2-tools: man/tpm2_pcrextend.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrextend.1.md), weight 0.9877)

## 3. Synopsis

**tpm2_pcrextend** [*OPTIONS*] _PCR\_DIGEST\_SPEC_ ([tpm2_pcrextend - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrextend.1/), weight 0.9800)

## 4. Description

**tpm2_pcrextend**(1) - Extends the pcrs with values indicated by _PCR\_DIGEST\_SPEC_.

A _PCR\_DIGEST\_SPEC_ is defined as follows:

  * A numerical PCR identifier.
  * A colon followed by the algorithm hash specification.

The algorithm hash specification is as follows:
  * The algorithm friendly name or raw numerical.
  * An equals sign.
  * The hex hash value.

### Example Digest Specification

```
4:sha1=f1d2d2f924e986ac86fdf7b36c94bcdf32beec15
```

**Note**: Multiple specifications of PCR and hash are allowed. Multiple
hashes cause the PCR to be extended with both hashes. Multiple same PCR values
cause the PCR to be extended multiple times. Extension is done in order from
left to right as specified. At most 5 hash extensions per PCR entry are
supported. This is to keep the parser simple. ([tpm2-software/tpm2-tools: man/tpm2_pcrextend.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrextend.1.md), weight 0.9877)

## 5. Options

* **-P**, **\--auth**=_AUTH_:

The authorization value of the used PCR register.

* **-S**, **\--session**=_FILE_:

Specifies the auxiliary sessions for the command.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the 

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h

**PCR bank specifiers** (`man/common/pcr.md`): PCR Bank Selection lists follow the below specification: ``` <BANK>:<PCR>[,<PCR>] or <BANK>:all ``` multiple banks may be separated by '+'. For example: ``` sha1:3,4+sha256:all ``` will select PCRs 3 and 4 from the SHA1 bank and PCRs 0 to 23 from the SHA256 bank. Certain commands support specifying forward sealing values as well: ``` sha1:0,1=da39a3ee5e6b4b0d3255bfef95601890afd80709,2 ``` This will select the current values for PCRs 0 and 2, but ([tpm2_pcrextend - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrextend.1/), weight 0.9800)

## 6. Examples

### Extend PCR 4's SHA1 bank with a hash
```bash
tpm2_pcrextend 4:sha1=f1d2d2f924e986ac86fdf7b36c94bcdf32beec15
```

### Extend PCR 4's SHA1 and SHA256 banks with hashes
```bash
tpm2_pcrextend 4:sha1=f1d2d2f924e986ac86fdf7b36c94bcdf32beec15,sha256=b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c
```

### Extend PCR 4's SHA1 and PCR 7's SHA256 bank with hashes
```bash
tpm2_pcrextend 4:sha1=f1d2d2f924e986ac86fdf7b36c94bcdf32beec15 7:sha256=b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_pcrextend.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrextend.1.md), weight 0.9877)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_pcrextend: Extends a PCR. / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2_pcrextend) | `tpm2_pcrextend tpm2-tools man page options examples` | **0.6580** | authoritative (kept) |
| 2 | [tpm2_pcrextend - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrextend.1/) | `tpm2_pcrextend tpm2-tools man page options examples` | **0.9800** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_pcrextend tpm2-tools man page options examples` | **0.8412** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_pcrextend.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrextend.1.md) | `tpm2_pcrextend tpm2-tools man page options examples` | **0.9877** | authoritative (kept) |
