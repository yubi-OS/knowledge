# 034 - tpm2-getrandom (`tpm2_getrandom`)

**Scope:** tpm2_getrandom(1): Retrieves random bytes from the TPM.
**Upstream Manpage:** `man/tpm2_getrandom.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_getrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getrandom.1.md), weight 0.9877).
**Multiplexed Invocation:** `tpm2_getrandom [OPTIONS]` or `tpm2 getrandom [OPTIONS]` ([tpm2_getrandom (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_getrandom.1.en.html), weight 0.9799).

## 1. Command Overview & yubiOS Role

`tpm2_getrandom` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_getrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getrandom.1.md), weight 0.9877). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2_getrandom (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_getrandom.1.en.html), weight 0.9799)

## 2. Name

**tpm2_getrandom**(1) - Retrieves random bytes from the TPM. ([tpm2-software/tpm2-tools: man/tpm2_getrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getrandom.1.md), weight 0.9877)

## 3. Synopsis

**tpm2_getrandom** [*OPTIONS*] [*ARGUMENT*] ([tpm2_getrandom (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_getrandom.1.en.html), weight 0.9799)

## 4. Description

**tpm2_getrandom**(1) - Returns the next _SIZE_ octets from the random number
generator. The _SIZE_ parameter is expected as the only argument to the tool.

Note that the TPM specification recommends that TPM's fix the number of
available entry to the maximum size of a hash algorithm output in bytes.

Most TPMs do this, and thus the tool verifies that input size is bounded by
property **TPM2_PT_MAX_DIGEST** and issues an error if it is too large.

Output defaults to *stdout* and binary format unless otherwise specified with
**-o** and **--hex** options respectively. ([tpm2-software/tpm2-tools: man/tpm2_getrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getrandom.1.md), weight 0.9877)

## 5. Options

* **-o**, **\--output**=_FILE_

    Specifies the filename to output the raw bytes to. Defaults to stdout as a
    hex string.

  * **\--hex**

	Convert the output data to hex format without a leading "0x".

  * **-f**, **\--force**

    Override checking that the:
    - Requested size is within the hash size limit of the TPM.
    - Number of retrieved random bytes matches requested amount.

  * **-S**, **\--session**=_FILE_:

    The session created using **tpm2_startauthsession**. Multiple of these can
    be specified. For example, you can have one session for auditing and another
    for encryption of the parameters.

  * **\--cphash**=_FILE_:

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, in absence of rphash
    option, The tool will not actually execute the command, it simply returns a
    cpHash.

  * **\--rphash**=_FILE_:

    File path to record the hash of the response parameters. This is commonly
    termed as rpHash.

* **ARGUMENT** the command line argument specifies the size of the output.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_getrandom (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_getrandom.1.en.html), weight 0.9799)

## 6. Examples

### Generate a random 20 bytes and output the binary data to a file
```bash
tpm2_getrandom -o random.out 20
```

### Generate a random 8 bytes and output the hex formatted data to stdout
```bash
tpm2_getrandom 8 --hex
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_getrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getrandom.1.md), weight 0.9877)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_getrandom (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_getrandom.1.en.html) | `tpm2_getrandom tpm2-tools man page options examples` | **0.9799** | authoritative (kept) |
| 2 | [tpm2_getrandom: Retrieves random bytes from the TPM. / Man Page ...](https://www.mankier.com/1/tpm2_getrandom) | `tpm2_getrandom tpm2-tools man page options examples` | **0.3805** | low-weight (weak backing) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_getrandom tpm2-tools man page options examples` | **0.9236** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_getrandom.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getrandom.1.md) | `tpm2_getrandom tpm2-tools man page options examples` | **0.9877** | authoritative (kept) |
