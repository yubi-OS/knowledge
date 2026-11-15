# 052 - tpm2-nvreadpublic (`tpm2_nvreadpublic`)

**Scope:** tpm2_nvreadpublic(1): Display all defined Non-Volatile (NV)s indices.
**Upstream Manpage:** `man/tpm2_nvreadpublic.1.md` in `tpm2-software/tpm2-tools` ([tpm2_nvreadpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvreadpublic.1/), weight 0.9884).
**Multiplexed Invocation:** `tpm2_nvreadpublic [OPTIONS]` or `tpm2 nvreadpublic [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_nvreadpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvreadpublic.1.md), weight 0.9855).

## 1. Command Overview & yubiOS Role

`tpm2_nvreadpublic` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_nvreadpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvreadpublic.1/), weight 0.9884). In yubiOS, TPM 2.0 Non-Volatile (NV) indices back monotonic rollback counters, sealed policy digests (`tpm2_policyauthorizenv`), and RPMB-backed OP-TEE fTPM persistent storage on ARM64 boards (ROCK 5B, PineTab2). ([tpm2-software/tpm2-tools: man/tpm2_nvreadpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvreadpublic.1.md), weight 0.9855)

## 2. Name

**tpm2_nvreadpublic**(1) - Display all defined Non-Volatile (NV)s indices. ([tpm2_nvreadpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvreadpublic.1/), weight 0.9884)

## 3. Synopsis

**tpm2_nvreadpublic** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_nvreadpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvreadpublic.1.md), weight 0.9855)

## 4. Description

**tpm2_nvreadpublic**(1) - Display all defined Non-Volatile (NV)s indices to
stdout in a YAML format.

Display metadata for all defined NV indices. Metadata includes:

  * The size of the defined region.
  * The hash algorithm used to compute the name of the index.
  * The auth policy.
  * The NV attributes as defined in section "NV Attributes".

### Example Output
  ```
  0x1500015:
    hash algorithm:
      friendly: sha256
      value: 0xB
    attributes:
      friendly: ownerwrite|ownerread
      value: 0x2000200
    size: 32
    authorization policy:

  0x1500017:
    hash algorithm:
      friendly: sha256
      value: 0xB
    attributes:
      friendly: ownerwrite|ownerread
      value: 0x2000200
    size: 32
    authorization policy:
  ``` ([tpm2_nvreadpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvreadpublic.1/), weight 0.9884)

## 5. Options

* **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash unless rphash is
    also required.

  * **\--rphash**=_FILE_

    File path to record the hash of the response parameters. This is commonly
    termed as rpHash.

  * **-S**, **\--session**=_POLICY_SESSION_:

    Specify an auxiliary session for auditing and or encryption/decryption of
    the parameters.

  * **-n**, **\--name**=_FILE_:

    The name of the NV index that must be provided when only calculating the
    cpHash without actually dispatching the command to the TPM.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the 

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h

**nv attributes** (`man/common/nv-attrs.md`): NV Attributes are used to control various properties of the NV defined space. When specified as an option, either the raw bitfield mask or "nice-names" may be used. The values can be found in Table 204 Part 2 of the TPM2.0 specification, which can be found here: <https://trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-2-Structures-01.38.pdf> Nice names are calculated by taking the name field of table 204 and removing the prefix **TP ([tpm2-software/tpm2-tools: man/tpm2_nvreadpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvreadpublic.1.md), weight 0.9855)

## 6. Examples

### List the defined NV indices to stdout

```bash
tpm2_nvreadpublic
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_nvreadpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvreadpublic.1/), weight 0.9884)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_nvreadpublic (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_nvreadpublic.1.en.html) | `tpm2_nvreadpublic tpm2-tools man page options examples` | **0.9770** | authoritative (kept) |
| 2 | [tpm2_nvreadpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvreadpublic.1/) | `tpm2_nvreadpublic tpm2-tools man page options examples` | **0.9884** | authoritative (kept) |
| 3 | [tpm2_nvreadpublic: Display all defined Non-Volatile (NV)s indices ...](https://www.mankier.com/1/tpm2_nvreadpublic) | `tpm2_nvreadpublic tpm2-tools man page options examples` | **0.2226** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_nvreadpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvreadpublic.1.md) | `tpm2_nvreadpublic tpm2-tools man page options examples` | **0.9855** | authoritative (kept) |
