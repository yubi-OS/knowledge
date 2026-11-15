# 087 - tpm2-rsaencrypt (`tpm2_rsaencrypt`)

**Scope:** tpm2_rsaencrypt(1): Performs an RSA encryption operation using the TPM.
**Upstream Manpage:** `man/tpm2_rsaencrypt.1.md` in `tpm2-software/tpm2-tools` ([tpm2_rsaencrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rsaencrypt.1/), weight 0.9926).
**Multiplexed Invocation:** `tpm2_rsaencrypt [OPTIONS]` or `tpm2 rsaencrypt [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_rsaencrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_rsaencrypt.1.md), weight 0.9919).

## 1. Command Overview & yubiOS Role

`tpm2_rsaencrypt` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_rsaencrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rsaencrypt.1/), weight 0.9926). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_rsaencrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_rsaencrypt.1.md), weight 0.9919)

## 2. Name

**tpm2_rsaencrypt**(1) - Performs an RSA encryption operation using the TPM. ([tpm2_rsaencrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rsaencrypt.1/), weight 0.9926)

## 3. Synopsis

**tpm2_rsaencrypt** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_rsaencrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_rsaencrypt.1.md), weight 0.9919)

## 4. Description

**tpm2_rsaencrypt**(1) - Performs RSA encryption on the contents of file data
using the indicated padding scheme according to IETF RFC 3447 (PKCS#1).
Input defaults to *STDIN* if not specified.

The key referenced by key-context is **required** to be:

1. An RSA key
2. Have the attribute *encrypt* **SET** in it's attributes. ([tpm2_rsaencrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rsaencrypt.1/), weight 0.9926)

## 5. Options

* **-c**, **\--key-context**=_OBJECT_:

    Context object pointing to the the public portion of RSA key to use for
    encryption.

  * **-o**, **\--output**=_FILE_:

    Optional output file path to record the encrypted data to. The default is to print
    the binary encrypted data to stdout.

  * **-s**, **\--scheme**=_FORMAT_:

    Optional, set the padding scheme (defaults to rsaes).

    * null  - TPM_ALG_NULL uses the key's scheme if set.
    * rsaes - TPM_ALG_RSAES which is RSAES_PKCSV1.5.
    * oaep  - TPM_ALG_OAEP which is RSAES_OAEP.

  * **-l**, **\--label**=_FILE_ or _STRING_:

    Optional, set the label data. Can either be a string or file path. The TPM
    requires the last byte of the label to be zero, this is handled internally
    to the tool. No other embedded 0 bytes can exist or the TPM will truncate
    your label.

  * **ARGUMENT** the command line argument specifies the path of the file with
    data to be encrypted.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_rsaencrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_rsaencrypt.1.md), weight 0.9919)

## 6. Examples

### Create an RSA key and load it
```bash
tpm2_createprimary -c primary.ctx
tpm2_create -C primary.ctx -Grsa2048 -u key.pub -r key.priv
tpm2_load -C primary.ctx -u key.pub -r key.priv -c key.ctx
```

### Encrypt using RSA
```bash
echo "my message" > msg.dat
tpm2_rsaencrypt -c key.ctx -o msg.enc msg.dat
```

### Decrypt using RSA
```bash
tpm2_rsadecrypt -c key.ctx -o msg.ptext msg.enc
cat msg.ptext
my message
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_rsaencrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rsaencrypt.1/), weight 0.9926)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_rsaencrypt - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_rsaencrypt.1/) | `tpm2_rsaencrypt tpm2-tools man page options examples` | **0.9926** | authoritative (kept) |
| 2 | [tpm2_rsaencrypt: Performs an RSA encryption operation using ... - ManKier](https://www.mankier.com/1/tpm2_rsaencrypt) | `tpm2_rsaencrypt tpm2-tools man page options examples` | **0.3487** | low-weight (weak backing) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_rsaencrypt tpm2-tools man page options examples` | **0.7963** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_rsaencrypt.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_rsaencrypt.1.md) | `tpm2_rsaencrypt tpm2-tools man page options examples` | **0.9919** | authoritative (kept) |
