# 029 - tpm2-getcap (`tpm2_getcap`)

**Scope:** tpm2_getcap(1): Display TPM capabilities in a human readable form.
**Upstream Manpage:** `man/tpm2_getcap.1.md` in `tpm2-software/tpm2-tools` ([tpm2_getcap - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcap.1/), weight 0.9909).
**Multiplexed Invocation:** `tpm2_getcap [OPTIONS]` or `tpm2 getcap [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_getcap.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getcap.1.md), weight 0.9900).

## 1. Command Overview & yubiOS Role

`tpm2_getcap` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_getcap - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcap.1/), weight 0.9909). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_getcap.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getcap.1.md), weight 0.9900)

## 2. Name

**tpm2_getcap**(1) - Display TPM capabilities in a human readable form. ([tpm2_getcap - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcap.1/), weight 0.9909)

## 3. Synopsis

**tpm2_getcap** [*OPTIONS*] [*CAPABILITY*] ([tpm2-software/tpm2-tools: man/tpm2_getcap.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getcap.1.md), weight 0.9900)

## 4. Description

**tpm2_getcap**(1) - Query the TPM for it's capabilities / properties and print
them to the console. It takes a string form of the capability to query as an
argument to the tool. Currently supported capability groups are:

- **algorithms**:
  Display data about supported algorithms.

- **commands**:
  Display data about supported commands.

- **pcrs**:
  Display currently allocated PCRs.

- **properties-fixed**:
  Display fixed TPM properties.

- **properties-variable**:
  Display variable TPM properties.

- **ecc-curves**:
  Display data about elliptic curves.

- **handles-transient**:
  Display handles about transient objects.

- **handles-persistent**:
  Display handles about persistent objects.

- **handles-permanent**:
  Display handles about permanent objects.

- **handles-pcr**:
  Display handles about PCRs.

- **handles-nv-index**:
  Display handles about NV Indices.

- **handles-loaded-session**:
  Display handles about both loaded HMAC and policy sessions.

- **handles-saved-session**:
  Display handles about saved sessions.

- **vendor[:num]**:
  Displays the vendor properties as a hex buffer output. The string "vendor"
  can be suffixed with a colon followed by a number as understood by strtoul(3)
  with a 0 base. That value is used as the property value within the\
  TPM2\_GetCapability command, and defaults to 1. An example to call it with a
  property value of 2 is:
    tpm2\_getcap vendor:2

  NOTE: if vendor requests hang, try the "-i" option to ignore the moreData field and
  only read once. ([tpm2_getcap - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcap.1/), weight 0.9909)

## 5. Options

* **-l**, **\--list**:

    List known supported capability names. These names can be
    supplied as the argument to **tpm2_getcap**(1). Output is in a
    YAML compliant list to stdout.

    For example:
    ```
      - algorithms
      - commands
      - properties-fixed
      ...
    ```

  * **\--ignore-moredata**

  Ignores the moreData field when dealing with buggy TPM responses.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the 

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h ([tpm2-software/tpm2-tools: man/tpm2_getcap.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getcap.1.md), weight 0.9900)

## 6. Examples

### To list the fixed properties of the TPM
```bash
tpm2_getcap properties-fixed
```

### To list the supported capability groups
```bash
tpm2_getcap -l
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_getcap - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcap.1/), weight 0.9909)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_getcap (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_getcap.1.en.html) | `tpm2_getcap tpm2-tools man page options examples` | **0.9695** | authoritative (kept) |
| 2 | [tpm2_getcap: Display TPM capabilities in a human readable form. / Man ...](https://www.mankier.com/1/tpm2_getcap) | `tpm2_getcap tpm2-tools man page options examples` | **0.2740** | low-weight (weak backing) |
| 3 | [tpm2_getcap - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getcap.1/) | `tpm2_getcap tpm2-tools man page options examples` | **0.9909** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_getcap.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getcap.1.md) | `tpm2_getcap tpm2-tools man page options examples` | **0.9900** | authoritative (kept) |
