# 038 - tpm2-hash (`tpm2_hash`)

**Scope:** tpm2_hash(1): Performs a hash operation with the TPM.
**Upstream Manpage:** `man/tpm2_hash.1.md` in `tpm2-software/tpm2-tools` ([tpm2_hash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hash.1/), weight 0.9883).
**Multiplexed Invocation:** `tpm2_hash [OPTIONS]` or `tpm2 hash [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_hash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hash.1.md), weight 0.9858).

## 1. Command Overview & yubiOS Role

`tpm2_hash` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_hash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hash.1/), weight 0.9883). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_hash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hash.1.md), weight 0.9858)

## 2. Name

**tpm2_hash**(1) - Performs a hash operation with the TPM. ([tpm2_hash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hash.1/), weight 0.9883)

## 3. Synopsis

**tpm2_hash** [*OPTIONS*] [*ARGUMENT* OR *STDIN*] ([tpm2-software/tpm2-tools: man/tpm2_hash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hash.1.md), weight 0.9858)

## 4. Description

**tpm2_hash**(1) - Performs a hash operation on file and returns the results.
If argument is not specified, then data is read from stdin. If the results of the
hash will be used in a signing operation that uses a restricted signing key,
then the ticket returned by this command can indicate that the hash is safe to
sign.

Output defaults to *stdout* and binary format unless otherwise specified via
**-o** and **--hex** options respectively. ([tpm2_hash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hash.1/), weight 0.9883)

## 5. Options

* **-C**, **\--hierarchy**=_OBJECT_:

    Hierarchy to use for the ticket. Defaults to **o**, **TPM_RH_OWNER**, when
    no value has been specified.
    Supported options are:
      * **o** for **TPM_RH_OWNER**
      * **p** for **TPM_RH_PLATFORM**
      * **e** for **TPM_RH_ENDORSEMENT**
      * **n** for **TPM_RH_NULL**

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hashing algorithm for the digest operation.

  * **\--hex**

	Convert the output hmac to hex format without a leading "0x".

  * **-o**, **\--output**=_FILE_ or _STDOUT_:

    Optional file to save the hash result. Defaults to stdout in hex form.

  * **-t**, **\--ticket**=_TICKET\_FILE_

    Optional file record of the ticket result. Defaults to stdout in hex form.

  * **ARGUMENT** or **STDIN** the command line argument specifies the _FILE_ to
    hash.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the methods for specifying the
_ALGORITHM_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_hash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hash.1.md), weight 0.9858)

## 6. Examples

### Hash a file with sha1 hash algorithm and save the hash and ticket to a file
```bash
tpm2_hash -C e -g sha1 -o hash.bin -t ticket.bin data.txt
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_hash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hash.1/), weight 0.9883)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_hash (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_hash.1.en.html) | `tpm2_hash tpm2-tools man page options examples` | **0.9728** | authoritative (kept) |
| 2 | [tpm2_hash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hash.1/) | `tpm2_hash tpm2-tools man page options examples` | **0.9883** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_hash tpm2-tools man page options examples` | **0.7752** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_hash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hash.1.md) | `tpm2_hash tpm2-tools man page options examples` | **0.9858** | authoritative (kept) |
