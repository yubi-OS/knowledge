# 025 - tpm2-encryptdecrypt (`tpm2_encryptdecrypt`)

**Scope:** tpm2_encryptdecrypt(1): Performs symmetric encryption or decryption.
**Upstream Manpage:** `man/tpm2_encryptdecrypt.1.md` in `tpm2-software/tpm2-tools` ([tpm2_encryptdecrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_encryptdecrypt.1/), weight 0.9856).
**Multiplexed Invocation:** `tpm2_encryptdecrypt [OPTIONS]` or `tpm2 encryptdecrypt [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_encryptdecrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encryptdecrypt.1.md), weight 0.9814).

## 1. Command Overview & yubiOS Role

`tpm2_encryptdecrypt` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_encryptdecrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_encryptdecrypt.1/), weight 0.9856). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_encryptdecrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encryptdecrypt.1.md), weight 0.9814)

## 2. Name

**tpm2_encryptdecrypt**(1) - Performs symmetric encryption or decryption. ([tpm2_encryptdecrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_encryptdecrypt.1/), weight 0.9856)

## 3. Synopsis

**tpm2_encryptdecrypt** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_encryptdecrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encryptdecrypt.1.md), weight 0.9814)

## 4. Description

**tpm2_encryptdecrypt**(1) - Performs symmetric encryption or decryption with a
specified symmetric key on the contents of _FILE_.
If _FILE_ is not specified, defaults to *stdin*. ([tpm2_encryptdecrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_encryptdecrypt.1/), weight 0.9856)

## 5. Options

* **-c**, **\--key-context**=_OBJECT_:

    The encryption key object.

  * **-p**, **\--auth**=_AUTH_:

    The authorization value for the encryption key object.

  * **-d**, **\--decrypt**:

    Perform a decrypt operation. Defaults to encryption when this option is not
    specified.

  * **-e**, **\--pad**:

    Enable pkcs7 padding for applicable AES encryption modes cfb/cbc/ecb.
    Applicable only to encryption and for input data with last block shorter
    than encryption block length.

  * **-o**, **\--output**=_FILE_ or _STDOUT_:

    The output file path for either the encrypted or decrypted data. If not
    specified, defaults to **stdout**.

  * **-G**, **\--mode**=_ALGORITHM_:

    The key algorithm associated with this object. Defaults to object properties
    or CFB if not defined.

  * **-t**, **\--iv**=_FILE_:

    Optional initialization vector to use. Defaults to 0's. Syntax allows for an
    input file and output file source to be specified. The input file path is
    first, optionally followed by a colon ":" and the output iv path. This
    output iv can be saved for subsequent calls when chaining.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

  * **ARGUMENT** the command line argument specifies the input file path _FILE_
    of the data to encrypt or decrypt.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_encryptdecrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encryptdecrypt.1.md), weight 0.9814)

## 6. Create An Aes Key

```bash
tpm2_createprimary -c primary.ctx
tpm2_create -C primary.ctx -Gaes128 -u key.pub -r key.priv
tpm2_load -C primary.ctx -u key.pub -r key.priv -c key.ctx
``` ([tpm2_encryptdecrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_encryptdecrypt.1/), weight 0.9856)

## 7. Encrypt And Decrypt Some Data

```bash
echo "my secret" > secret.dat
tpm2_encryptdecrypt -c key.ctx -o secret.enc secret.dat
tpm2_encryptdecrypt -d -c key.ctx -o secret.dec secret.enc
cat secret.dec
my secret
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_encryptdecrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encryptdecrypt.1.md), weight 0.9814)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_encryptdecrypt(1)  -  tpm2-tools...  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_encryptdecrypt.1.en.html) | `tpm2_encryptdecrypt tpm2-tools man page options examples` | **0.9728** | authoritative (kept) |
| 2 | [tpm2_encryptdecrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_encryptdecrypt.1/) | `tpm2_encryptdecrypt tpm2-tools man page options examples` | **0.9856** | authoritative (kept) |
| 3 | [tpm2_encryptdecrypt: Performs symmetric encryption or decryption. / Man ...](https://www.mankier.com/1/tpm2_encryptdecrypt) | `tpm2_encryptdecrypt tpm2-tools man page options examples` | **0.2517** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_encryptdecrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encryptdecrypt.1.md) | `tpm2_encryptdecrypt tpm2-tools man page options examples` | **0.9814** | authoritative (kept) |
