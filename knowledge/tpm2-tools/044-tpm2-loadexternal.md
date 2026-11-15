# 044 - tpm2-loadexternal (`tpm2_loadexternal`)

**Scope:** tpm2_loadexternal(1): Load an external object into the TPM.
**Upstream Manpage:** `man/tpm2_loadexternal.1.md` in `tpm2-software/tpm2-tools` ([tpm2_loadexternal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_loadexternal.1/), weight 0.9915).
**Multiplexed Invocation:** `tpm2_loadexternal [OPTIONS]` or `tpm2 loadexternal [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_loadexternal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_loadexternal.1.md), weight 0.9828).

## 1. Command Overview & yubiOS Role

`tpm2_loadexternal` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_loadexternal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_loadexternal.1/), weight 0.9915). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2-software/tpm2-tools: man/tpm2_loadexternal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_loadexternal.1.md), weight 0.9828)

## 2. Name

**tpm2_loadexternal**(1) - Load an external object into the TPM. ([tpm2_loadexternal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_loadexternal.1/), weight 0.9915)

## 3. Synopsis

**tpm2_loadexternal** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_loadexternal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_loadexternal.1.md), weight 0.9828)

## 4. Description

**tpm2_loadexternal**(1) - This command loads an external object into the TPM,
forgoing TPM protections. Ie, the key material is not protected by the parent
object's seed. It can also be used to load TSS2 Private Keys in pem format.
The command allows loading of just the public portion of an object or both the
public and private portions of an object. For TSS2 Private Keys, only the public
portion of the key is loaded.

The tool outputs the name of the loaded object in a YAML dictionary format
with the key *name* where the value for that key is the name of the object
in hex format, for example:
```yaml
name: 000bac25cb8743111c8e1f52f2ee7279d05d3902a18dd1af694db5d1afa7adf1c8b3
```

It also saves a context file for future interactions with the object. ([tpm2_loadexternal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_loadexternal.1/), weight 0.9915)

## 5. Options

* **-C**, **\--hierarchy**=_OBJECT_:

    Hierarchy to use for the ticket, optional. Defaults to **n**, **null**.
    Supported options are:
      * **o** for the **owner** hierarchy.
      * **p** for the **platform** hierarchy.
      * **e** for the **endorsement** hierarchy.
      * **n** for the **null** hierarchy.

  * **-G**, **\--key-algorithm**=_ALGORITHM_:

    The algorithm used by the key to be imported. Supports:
    * **aes** - AES 128,192 or 256 key.
    * **rsa** - RSA 1024 or 2048 key.
    * **ecc** - ECC NIST P192, P224, P256, P384 or P521 public and private key.

  * **-u**, **\--public**=_FILE_:

    The public portion of the object, this can be one of the following file
    formats:
      * TSS - The TSS/TPM format. For example from option `-u` of command
        **tpm2_create**(1).
      * RSA - OSSL PEM formats. For example `public.pem` from the command
        `openssl rsa -in private.pem -out public.pem -pubout`
      * ECC - OSSL PEM formats. For example `public.pem` from the command
        `openssl ec -in private.ecc.pem -out public.ecc.pem -pubout`

  * **-r**, **\--private**=_FILE_:

    The sensitive portion of the object, optional. If one wishes to use the
    private portion of a key, this must be specified. Like option **-u**, this
    command takes files in the following format:
      * RSA - OSSL PEM formats. For example `private.pem` from the command
        `openssl genrsa -out private.pem 2048`
        Since an RSA public key can be derived from the private PEM file, their
        is no need to specify -u for the public portion.
      * TSS2 PrivateKey PEM formats.

    *Note*: The private portion does not respect TSS formats as it's impossible
    to get a **TPM2B_SENSITIVE** output from a previous command. They are always
    protected by the TPM as **TPM2B_PRIVATE** blobs.

  * **-p**, **\--auth**=_AUTH_:

    The authorization value for the key, optional.

  * **-L**, **\--policy**=_FILE_ or _HEX\_STRING_:

    The input policy file or hex string, optional. A file or hex string
    containing the hash of a policy derived from `tpm2_createpolicy` or
    another policy digest generating source.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm for generating the objects name. This is optional
    and defaults to sha256 when not specified. However, load external supports
    having a *null* name algorithm. In this case, no cryptographic binding
    checks between the public and private portions are performed.

  * **-a**, **\--attributes**=_ATTRIBUTES_:

    The object attributes, optional. The default for created objects is:
    `TPMA_OBJECT_SIGN_ENCRYPT|TPMA_OBJECT_DECRYPT`. Optionally, if -p is
    specified or no `-p` or `-L` is specified then `TPMA_OBJECT_USERWITHAUTH`
    is added to the default attribute set.

    *Note*: If specifying attributes, the TPM will reject certain attributes
    like **TPMA_OBJECT_FIXEDTPM**, as those guarantees cannot be made.

  * **-c**, **\--key-context**=_FILE_

    The file name to save the object context, required.

  * **-n**, **\--name**=_FILE_:

    An optional file to save the object name, which is in a binary hash format.
    The size of the hash is based on name algorithm or the **-g** option.

  * **\--passin**=_OSSL\_PEM\_FILE\_PASSWORD_

    An optional password for an Open SSL (OSSL) provided input file.
    It mirrors the -passin option of OSSL and is known to support the pass,
    file, env, fd and plain password formats of openssl.
    (see *man(1) openssl*) for more.
    
 * **-e**, **\--rsa_exponent_zero**:
    Set the exponent of a public RSA key to zero, to enable compatibility
    in the computation of the key name if the TPM key is generated with
    exponent zero.

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
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_loadexternal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_loadexternal.1.md), weight 0.9828)

## 6. Notes

* If the hierarchy is *null* or the name hashing algorithm is *null*, tickets
  produced using the object will be NULL.

* If the private portion of an object is specified, the hierarchy must be *null*
  or the TPM will reject loading it. ([tpm2_loadexternal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_loadexternal.1/), weight 0.9915)

## 7. Examples

### Load a TPM generated public key into the *owner* hierarchy

```bash
tpm2_createprimary -c primary.ctx

tpm2_create -C primary.ctx -u pub.dat -r priv.dat

tpm2_loadexternal -C o -u pub.dat -c pub.ctx
name: 000b9be4d7c6193a57e1bfc86a42a6b03856a91d2f9e77c6cbdb796a783d52d4b3b9
```

### Load an RSA public key into the *owner* hierarchy

```bash
openssl genrsa -out private.pem 2048

openssl rsa -in private.pem -out public.pem -outform PEM -pubout

tpm2_loadexternal -C o -Grsa -u public.pem -c key.ctx
name: 000b7b91d304d16995d42792b57d0fb25df7abe5fdd8afe9950730e00dc5b934ddbc
```

### Load an RSA key-pair into the *null* hierarchy

```bash
openssl genrsa -out private.pem 2048

tpm2_loadexternal -C n -Grsa -r private.pem -c key.ctx
name: 000b635ea220b6c62ec1d02343859dd203c8ac5dad82ebc5b124e407d2502f88691f
```

### Load an AES key into the *null* hierarchy

```bash
dd if=/dev/urandom of=sym.key bs=1 count=16

tpm2_loadexternal -C n -Gaes -r sym.key -c key.ctx
name: 000bfc4d8dd7e4f921bcc9dca4b04f49564243cd9def129a3740002bfd4b9e966d34
```

### Load TSS2 Private Key into the *null* hierarchy

```bash
tpm2_loadexternal -r tss_privkey.pem -c tss_privkey.ctx
name: 000bc5a216702aca9ba226af1214c50dc4dc33ce6269677aa581ea6d9eec7f27000d
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_loadexternal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_loadexternal.1.md), weight 0.9828)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [Ubuntu Manpage: tpm2_loadexternal - load an object that is not a Protected](https://manpages.ubuntu.com/manpages/bionic/man8/tpm2_loadexternal.8.html) | `tpm2_loadexternal tpm2-tools man page options examples` | **0.9111** | authoritative (kept) |
| 2 | [tpm2_loadexternal - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_loadexternal.1/) | `tpm2_loadexternal tpm2-tools man page options examples` | **0.9915** | authoritative (kept) |
| 3 | [Ubuntu Manpage: tpm2_loadexternal (1) - Load an external ...](https://manpages.ubuntu.com/manpages/jammy/man1/tpm2_loadexternal.1.html) | `tpm2_loadexternal tpm2-tools man page options examples` | **0.9563** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_loadexternal.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_loadexternal.1.md) | `tpm2_loadexternal tpm2-tools man page options examples` | **0.9828** | authoritative (kept) |
