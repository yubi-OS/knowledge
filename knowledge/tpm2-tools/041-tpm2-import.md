# 041 - tpm2-import (`tpm2_import`)

**Scope:** tpm2_import(1): Imports an external key into the tpm as a TPM managed key object.
**Upstream Manpage:** `man/tpm2_import.1.md` in `tpm2-software/tpm2-tools` ([tpm2_import - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_import.1/), weight 0.9916).
**Multiplexed Invocation:** `tpm2_import [OPTIONS]` or `tpm2 import [OPTIONS]` ([tpm2-tools/man/tpm2_import.1.md at master · tpm2-software/tpm2-tools](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_import.1.md), weight 0.9892).

## 1. Command Overview & yubiOS Role

`tpm2_import` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_import - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_import.1/), weight 0.9916). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2-tools/man/tpm2_import.1.md at master · tpm2-software/tpm2-tools](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_import.1.md), weight 0.9892)

## 2. Name

**tpm2_import**(1) - Imports an external key into the tpm as a TPM managed key
object. ([tpm2_import - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_import.1/), weight 0.9916)

## 3. Synopsis

**tpm2_import** [*OPTIONS*] ([tpm2-tools/man/tpm2_import.1.md at master · tpm2-software/tpm2-tools](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_import.1.md), weight 0.9892)

## 4. Description

**tpm2_import**(1) - Imports an external generated key as TPM managed key object.
It requires that the parent key object be a RSA key. Can also import a TPM
managed key object created by the tpm2_duplicate tool. ([tpm2_import - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_import.1/), weight 0.9916)

## 5. Options

These options control the key importation process:

  * **-G**, **\--key-algorithm**=_ALGORITHM_:

    The algorithm used by the key to be imported. Supports:
    * **aes** - AES 128, 192 or 256 key.
    * **rsa** - RSA 1024, 2048, 3072, or 4096 key.
    * **ecc** - ECC NIST P192, P224, P256, P384 or P521 public and private key.
	* **hmac** - HMAC key.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm for generating the objects name. This is optional
    and defaults to **sha256** when not specified. Algorithms should follow the
    "formatting standards", see section "Algorithm Specifiers".
    Also, see section "Supported Hash Algorithms" for a list of supported
    hash algorithms.

  * **-i**, **\--input**=_FILE_:

    Specifies the filename of the key to be imported. For AES keys,
    this file is the raw key bytes. For assymetric keys in PEM or DER
    format. A typical file is generated with `openssl genrsa`.

  * **-C**, **\--parent-context**=_OBJECT_:

    The parent key object.

  * **-U**, **\--parent-public**=_FILE_:

    Optional. Specifies the parent key public data file input. This can be read
    with **tpm2_readpublic**(1) tool. If not specified, the tool invokes a
    tpm2_readpublic on the parent object.

  * **-k**, **\--encryption-key**=_FILE_:

    Optional. Specifies the file containing the symmetric algorithm key that was
    used for the inner wrapper. If the file is specified the tool assumes the
    algorithm is AES 128 in CFB mode otherwise none.

  * **-r**, **\--private**=_FILE_:

    Specifies the file path required to save the encrypted private portion of
    the object imported as key.

    When importing a duplicated object this option specifies the file containing
    the private portion of the object to be imported.
    **protection details** (`man/common/protection-details.md`): Objects that can move outside of TPM need to be protected (confidentiality and integrity). For instance, transient objects require that TPM protected data (key or seal material) be stored outside of the TPM. This is seen in tools like tpm2\_create(1), where the **-r** option outputs this protected data. This blob contains the sensitive portions of the object. The sensitive portions of the object are protected by the parent object, using the paren

  * **-u**, **\--public**=_FILE_:

    Specifies the file path required to save the public portion of the object
    imported as key

    When importing a duplicated object this option specifies the file containing
    the public portion of the object to be imported.

  * **-a**, **\--attributes**=_ATTRIBUTES_:

    The object attributes, optional.

  * **-P**, **\--parent-auth**=_AUTH_:

    The authorization value for using the parent key specified with **-C**.

  * **-p**, **\--key-auth**=_AUTH_:

    The authorization value for the imported key, optional.

  * **-L**, **\--policy**=_POLICY_ or _HEX\_STRING_:

    The policy file or policy hex string used for authorization to the object.

  * **-s**, **\--seed**=_FILE_:

    Specifies the file containing the encrypted seed of the duplicated object.

    In order to perform an "unencrypted import" a seed file with the content
    0x0000 needs to be provided (e.g. printf "0000" | xxd -r -p >seed.file).

  * **\--passin**=_OSSL\_PEM\_FILE\_PASSWORD_

    An optional password for an Open SSL (OSSL) provided input file. It mirrors
    the -passin option of OSSL and is known to support the pass, file, env, fd
    and plain password formats of openssl. (see *man(1) openssl*) for more.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**object attribute specifiers** (`man/common/obj-attrs.md`): Object Attributes are used to control various properties of created objects. When specified as an option, either the raw bitfield mask or "nice-names" may be used. The values can be found in Table 31 Part 2 of the TPM2.0 specification, which can be found here: <https://trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-2-Structures-01.38.pdf> Nice names are calculated by taking the name field of table 31 and removing the prefix **TPMA_ details the options for
specifying the object attributes _ATTRIBUTES_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-tools/man/tpm2_import.1.md at master · tpm2-software/tpm2-tools](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_import.1.md), weight 0.9892)

## 6. Examples

### To import a key, one needs to have a parent key
```bash
tpm2_createprimary -Grsa2048:aes128cfb -C o -c parent.ctx
```

Create your key and and import it. If you already have a key, just use that
and skip creating it.

### Import an AES 128 key
```bash
dd if=/dev/urandom of=sym.key bs=1 count=16

tpm2_import -C parent.ctx -G aes -i sym.key -u key.pub -r key.priv
```

### Import an RSA key
```bash
openssl genrsa -out private.pem 2048

tpm2_import -C parent.ctx -G rsa -i private.pem -u key.pub -r key.priv
```

### Import an ECC key
```bash
openssl ecparam -name prime256v1 -genkey -noout -out private.ecc.pem

tpm2_import -C parent.ctx -G ecc -i private.ecc.pem -u key.pub -r key.priv
```

### Import a duplicated key
```bash
tpm2_import -C parent.ctx -i key.dup -u key.pub -r key.priv -L policy.dat
``` ([tpm2_import - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_import.1/), weight 0.9916)

## 7. Limitations

* The TPM requires that the name algorithm of the child be smaller than the
    parent.

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-tools/man/tpm2_import.1.md at master · tpm2-software/tpm2-tools](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_import.1.md), weight 0.9892)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_import tpm2-tools man page options examples` | **0.8802** | authoritative (kept) |
| 2 | [tpm2_import - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_import.1/) | `tpm2_import tpm2-tools man page options examples` | **0.9916** | authoritative (kept) |
| 3 | [tpm2-tools/man/tpm2_import.1.md at master · tpm2-software/tpm2-tools](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_import.1.md) | `tpm2_import tpm2-tools man page options examples` | **0.9892** | authoritative (kept) |
