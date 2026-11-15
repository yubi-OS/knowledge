# 084 - tpm2-readclock (`tpm2_readclock`)

**Scope:** tpm2_readclock(1): Retrieves the time information from the TPM.
**Upstream Manpage:** `man/tpm2_readclock.1.md` in `tpm2-software/tpm2-tools` ([tpm2_readclock - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readclock.1/), weight 0.9909).
**Multiplexed Invocation:** `tpm2_readclock [OPTIONS]` or `tpm2 readclock [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_readclock.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readclock.1.md), weight 0.9907).

## 1. Command Overview & yubiOS Role

`tpm2_readclock` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_readclock - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readclock.1/), weight 0.9909). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_readclock.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readclock.1.md), weight 0.9907)

## 2. Name

**tpm2_readclock**(1) - Retrieves the time information from the TPM. ([tpm2_readclock - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readclock.1/), weight 0.9909)

## 3. Synopsis

**tpm2_readclock** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_readclock.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readclock.1.md), weight 0.9907)

## 4. Description

**tpm2_readclock**(1) -Reads the current TPMS\_TIME\_INFO structure from the
TPM. The structure contains the current setting of Time, Clock, resetCount, and
restartCount. The structure is output as YAML to stdout. The YAML output is
defined as:

```yaml
time: 13673142     # 64 bit value of time TPM has been powered on in ms.
clock_info:
  clock: 13673142  # 64 bit value of time TPM has been powered on since last TPM2_Clear in ms.
  reset_count: 0   # 32 bit value of the number of TPM Resets since the last
                   # TPM2_Clear.
  restart_count: 0 # 32 bit value of the number of times that TPM2_Shutdown or
                   # _TPM_Hash_Start have occurred since the last TPM Reset or
                   # TPM2_Clear.
  safe: yes        # boolean yes|no value that no value of Clock greater than
                   # the current value of Clock has been previously reported by
                   # the TPM.
```

This tool takes no arguments and no tool specific options.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_readclock - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readclock.1/), weight 0.9909)

## 5. Examples

### Read the clock
```bash
tpm2_readclock
time: 13673142
clock_info:
  clock: 13673142
  reset_count: 0
  restart_count: 0
  safe: yes
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_readclock.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readclock.1.md), weight 0.9907)

## 6. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_readclock: Retrieves the time information from the TPM. / Man Page ...](https://www.mankier.com/1/tpm2_readclock) | `tpm2_readclock tpm2-tools man page options examples` | **0.2360** | low-weight (weak backing) |
| 2 | [tpm2_readclock - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readclock.1/) | `tpm2_readclock tpm2-tools man page options examples` | **0.9909** | authoritative (kept) |
| 3 | [tpm2_readclock (1)  -  Arch manual pages](https://man.archlinux.org/man/extra/tpm2-tools/tpm2_readclock.1.en) | `tpm2_readclock tpm2-tools man page options examples` | **0.9666** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_readclock.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readclock.1.md) | `tpm2_readclock tpm2-tools man page options examples` | **0.9907** | authoritative (kept) |
