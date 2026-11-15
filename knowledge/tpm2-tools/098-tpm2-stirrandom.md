# 098 - tpm2-stirrandom (`tpm2_stirrandom`)

**Scope:** tpm2_stirrandom(1): Add "additional information" into TPM RNG state.
**Upstream Manpage:** `man/tpm2_stirrandom.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_stirrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_stirrandom.1.md), weight 0.9911).
**Multiplexed Invocation:** `tpm2_stirrandom [OPTIONS]` or `tpm2 stirrandom [OPTIONS]` ([tpm2_stirrandom - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_stirrandom.1/), weight 0.9896).

## 1. Command Overview & yubiOS Role

`tpm2_stirrandom` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_stirrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_stirrandom.1.md), weight 0.9911). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2_stirrandom - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_stirrandom.1/), weight 0.9896)

## 2. Name

**tpm2_stirrandom**(1) - Add "additional information" into TPM RNG state. ([tpm2-software/tpm2-tools: man/tpm2_stirrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_stirrandom.1.md), weight 0.9911)

## 3. Synopsis

**tpm2_stirrandom** [*OPTIONS*] [*ARGUMENT*] ([tpm2_stirrandom - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_stirrandom.1/), weight 0.9896)

## 4. Description

**tpm2_stirrandom**(1) - Inject "additional information" as bytes into TPM entropy Protected Capability pool.

"Additional information" can be extracted from file specified as argument or
being read from *STDIN* if argument is not specified.

Up to 128 bytes can be injected at once through standard input to **tpm2_stirrandom**(1).

If input file is larger than 128 bytes, **tpm2_stirrandom**(1) will fail.

Adding data through **tpm2_stirrandom**(1) will trigger a reseeding of TPM
DRBG Protected Capability. It is used when performing any sensitive action
on a shielded location such as loading a persistent key or acting on a
Protected Capability like updating TPM firmware. ([tpm2-software/tpm2-tools: man/tpm2_stirrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_stirrandom.1.md), weight 0.9911)

## 5. Options

This command has no option

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules.) ([tpm2_stirrandom - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_stirrandom.1/), weight 0.9896)

## 6. Examples

### Inject from stdin using echo
```bash
echo -n "myrandomdata" | tpm2_stirrandom
```

### Inject 64 bytes from stdin using a file
```bash
dd if=/dev/urandom bs=1 count=64 > myrandom.bin

tpm2_stirrandom < ./myrandom.bin
```

### Inject bytes from a file and reading up to 128 bytes
```bash
dd if=/dev/urandom of=./myrandom.bin bs=1 count=42

tpm2_stirrandom ./myrandom.bin
``` ([tpm2-software/tpm2-tools: man/tpm2_stirrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_stirrandom.1.md), weight 0.9911)

## 7. Notes

Please be aware that even if the "additional information" added
by **tpm2_stirrandom**(1) can be entropy gathered from other DRBG
sources, the TPM has no way of determining if the value has any entropy or not.
As a consequence, it will just be considered as "additional input".

The "additional input" is as defined in [NIST SP800-90A](
https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-90.pdf)

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_stirrandom - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_stirrandom.1/), weight 0.9896)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_stirrandom - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_stirrandom.1/) | `tpm2_stirrandom tpm2-tools man page options examples` | **0.9896** | authoritative (kept) |
| 2 | [tpm2_stirrandom: Add "additional information" into TPM RNG state. / Man ...](https://www.mankier.com/1/tpm2_stirrandom) | `tpm2_stirrandom tpm2-tools man page options examples` | **0.3217** | low-weight (weak backing) |
| 3 | [tpm2_stirrandom (1)  -  Arch manual pages](https://man.archlinux.org/man/extra/tpm2-tools/tpm2_stirrandom.1.en) | `tpm2_stirrandom tpm2-tools man page options examples` | **0.9674** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_stirrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_stirrandom.1.md) | `tpm2_stirrandom tpm2-tools man page options examples` | **0.9911** | authoritative (kept) |
