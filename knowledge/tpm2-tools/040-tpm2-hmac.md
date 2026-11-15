# 040 - tpm2-hmac (`tpm2_hmac`)

**Scope:** tpm2_hmac(1): Performs an HMAC operation with the TPM.
**Upstream Manpage:** `man/tpm2_hmac.1.md` in `tpm2-software/tpm2-tools` ([tpm2_hmac - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hmac.1/), weight 0.9895).
**Multiplexed Invocation:** `tpm2_hmac [OPTIONS]` or `tpm2 hmac [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_hmac.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hmac.1.md), weight 0.9841).

## 1. Command Overview & yubiOS Role

`tpm2_hmac` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_hmac - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hmac.1/), weight 0.9895). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_hmac.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hmac.1.md), weight 0.9841)

## 2. Name

**tpm2_hmac**(1) - Performs an HMAC operation with the TPM. ([tpm2_hmac - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hmac.1/), weight 0.9895)

## 3. Synopsis

**tpm2_hmac** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_hmac.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hmac.1.md), weight 0.9841)

## 4. Description

**tpm2_hmac**(1) - Performs an HMAC operation and returns the results.
If argument file is not specified, then data is read from stdin.

The hashing algorithm defaults to the keys scheme or sha256 if the key has a
NULL scheme.

Output defaults to _STDOUT_ and binary format unless otherwise specified via
**-o** and **--hex** options respectively. ([tpm2_hmac - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hmac.1/), weight 0.9895)

## 5. Options

* **-c**, **\--key-context**=_OBJECT_:

    The context object of the symmetric signing key providing the HMAC key.
    Either a file or a handle number. See section "Context Object Format".

  * **-p**, **\--auth**=_AUTH_:

    Optional authorization value to use the key specified by **-c**.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm to use.
    Algorithms should follow the "formatting standards", see section
    "Algorithm Specifiers".
    Also, see section "Supported Hash Algorithms" for a list of supported hash
    algorithms.

  * **\--hex**

	Convert the output hmac to hex format without a leading "0x".

  * **-o**, **\--output**=_FILE_:

    Optional file record of the HMAC result. Defaults to _STDOUT_.

  * **-t**, **\--ticket**=_FILE_:

    Optional file record of the ticket result.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

  * **ARGUMENT** the command line argument specifies the file path for the data
    to HMAC. Defaults to _STDIN_ if not specified.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**authorization formatting** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the methods for specifying
_ALGORITHM_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_hmac.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hmac.1.md), weight 0.9841)

## 6. Examples

### Setup
```bash ([tpm2_hmac - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hmac.1/), weight 0.9895)

## 7. Create A Primary Object

tpm2_createprimary -c primary.ctx ([tpm2-software/tpm2-tools: man/tpm2_hmac.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hmac.1.md), weight 0.9841)

## 8. Create An Hmac Key

tpm2_create -C primary.ctx -G hmac -c hmac.key
```

### Perform an HMAC with Default Hash Algorithm
Perform an hmac using the key's default scheme (hash algorithm) and
output to stdout in hexidecimal format.

```bash
tpm2_hmac -c hmac.key --hex data.in
e6eda48a53a9ddbb92f788f6d98e0372d63a408afb11aca43f522a2475a32805
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_hmac - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hmac.1/), weight 0.9895)

## 9. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_hmac - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_hmac.1/) | `tpm2_hmac tpm2-tools man page options examples` | **0.9895** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_hmac tpm2-tools man page options examples` | **0.8750** | authoritative (kept) |
| 3 | [tpm2_hmac: Performs an HMAC operation with the TPM. / Man Page ...](https://www.mankier.com/1/tpm2_hmac) | `tpm2_hmac tpm2-tools man page options examples` | **0.2042** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_hmac.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_hmac.1.md) | `tpm2_hmac tpm2-tools man page options examples` | **0.9841** | authoritative (kept) |
