# 014 - tpm2-create (`tpm2_create`)

**Scope:** tpm2_create(1): Create a child object.
**Upstream Manpage:** `man/tpm2_create.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_create.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_create.1.md), weight 0.9910).
**Multiplexed Invocation:** `tpm2_create [OPTIONS]` or `tpm2 create [OPTIONS]` ([tpm2_create - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_create.1/), weight 0.9898).

## 1. Command Overview & yubiOS Role

`tpm2_create` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_create.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_create.1.md), weight 0.9910). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2_create - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_create.1/), weight 0.9898)

## 2. Name

**tpm2_create**(1) - Create a child object. ([tpm2-software/tpm2-tools: man/tpm2_create.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_create.1.md), weight 0.9910)

## 3. Synopsis

**tpm2_create** [*OPTIONS*] ([tpm2_create - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_create.1/), weight 0.9898)

## 4. Description

**tpm2_create**(1) - Create a child object. The object can either be a key or
a sealing object. A sealing object allows to seal user data to the TPM, with a
maximum size of 128 bytes. Additionally it will load the created object if the
**-c** is specified. ([tpm2-software/tpm2-tools: man/tpm2_create.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_create.1.md), weight 0.9910)

## 5. Options

These options for creating the TPM entity:

  * **-C**, **\--parent-context**=_OBJECT_:

    The parent of the object to be created.

  * **-P**, **\--parent-auth**=_AUTH_:

    The authorization value of the parent object specified with **-C**.

  * **-p**, **\--key-auth**=_AUTH_:

    The authorization value for the created object.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm for generating the objects name. This is optional
    and defaults to sha256 when not specified.

  * **-G**, **\--key-algorithm**=_ALGORITHM_:

    The key algorithm associated with this object. It defaults to "rsa" if not
    specified.

  * **-a**, **\--attributes**=_ATTRIBUTES_:

    The object attributes, optional. The default for created objects is:

    `TPMA_OBJECT_SIGN_ENCRYPT|TPMA_OBJECT_DECRYPT|TPMA_OBJECT_FIXEDTPM|
     TPMA_OBJECT_FIXEDPARENT|TPMA_OBJECT_SENSITIVEDATAORIGIN|
     TPMA_OBJECT_USERWITHAUTH`

    When **-i** is specified for sealing, `TPMA_OBJECT_SIGN_ENCRYPT` and
    `TPMA_OBJECT_DECRYPT` are removed from the default attribute set.
    The algorithm is set in a way where the the object is only good for sealing
    and unsealing. I.e. one cannot use an object for sealing and cryptography
    operations.

    When **-L** is specified for adding policy based authorization information
    AND no string password is specified, the  attribute `TPMA_OBJECT_USERWITHAUTH`
    is cleared unless an explicit choice is made by setting of the attribute
    with **-a** option. This prevents creation of objects with inadvertent auth
    model where in user intended to enforce a policy but inadvertently created
    an object with empty auth which can be used instead of policy authorization.

  * **-i**, **\--sealing-input**=_FILE_ or _STDIN_:

    The data file to be sealed, optional. If file is -, read from stdin.
    When sealing data only the _TPM\_ALG\_KEYEDHASH_ algorithm with a NULL
    scheme is allowed. Thus, **-G** cannot be specified.

  * **-L**, **\--policy**=_FILE_ or _HEX\_STRING_:

    The input policy file or a hex string, optional.

  * **-u**, **\--public**=_FILE_:

    The output file which contains the public portion of the created object,
    optional.

  * **-r**, **\--private**=_FILE_:

    The output file which contains the sensitive portion of the object,
    optional.
    **protection details** (`man/common/protection-details.md`): Objects that can move outside of TPM need to be protected (confidentiality and integrity). For instance, transient objects require that TPM protected data (key or seal material) be stored outside of the TPM. This is seen in tools like tpm2\_create(1), where the **-r** option outputs this protected data. This blob contains the sensitive portions of the object. The sensitive portions of the object are protected by the parent object, using the paren


  * **-c**, **\--key-context**=_FILE_:

    The output file which contains the key context, optional. The key context is
    analogous to the context file produced by **tpm2_load**(1), however is
    generated via a **tpm2_createloaded**(1) command. This option can be used to
    avoid the normal **tpm2_create**(1) and **tpm2_load**(1) command sequences
    and do it all in one command, atomically.

  * **\--creation-data**=_FILE_:

    An optional file output that saves the creation data for certification.

    * **\--template-data**=_FILE_:

    An optional file output that saves the key template data (TPM2B_PUBLIC) to
    be used in **tpm2_policytemplate**.

  * **-t**, **\--creation-ticket**=_FILE_:

    An optional file output that saves the creation ticket for certification.

  * **-d**, **\--creation-hash**=_FILE_:

    An optional file output that saves the creation hash for certification.

  * **-q**, **\--outside-info**=_HEX\_STR\_OR\_FILE_:

    An optional hex string or path to add unique data to the creation data.
    Note that it does not contribute in creating statistically unique object.

  * **-l**, **\--pcr-list**=_PCR_:

    The list of PCR banks and selected PCRs' ids for each bank to be included in
    the creation data for certification.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

* **\--rphash**=_FILE_

     File path to record the hash of the response parameters. This is commonly
     termed as rpHash.

  * **-S**, **\--session**=_FILE_:

    The session created using **tpm2_startauthsession**. Multiple of these can
    be specified. For example, you can have one session for auditing and another
    for encryption/decryption of the parameters.

**pubkey options** (`man/common/pubkey.md`): * **-f**, **\--format**: Format selection for the public key output file. 'tss' (the default) will output a binary blob according to the TPM 2.0 Specification. 'pem' will output an OpenSSL compatible PEM encoded public key. 'der' will output an OpenSSL compatible DER encoded public key. 'tpmt' will output a binary blob of the TPMT_PUBLIC struct referenced by TPM 2.0 specs.

    Public key format.

  * **-o**, **\--output**=_FILE_:

    The output file path, recording the public portion of the object.

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
the various known TCTI modules. ([tpm2_create - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_create.1/), weight 0.9898)

## 6. Examples

### Setup

In order to create an object, we must first create a primary key as it's parent.
```bash
tpm2_createprimary -c primary.ctx
```

### Create an Object

This will create an object using all the default values and store the TPM sealed
private and public portions to the paths specified via -u and -r respectively.
The tool defaults to an RSA key.

```bash
tpm2_create -C primary.ctx -u obj.pub -r obj.priv
```

### Seal Data to the TPM

Outside of key objects, the TPM allows for small amounts of user specified data
to be sealed to the TPM.

```bash
echo "my sealed data" > seal.dat
tpm2_create -C primary.ctx -i seal.dat -u obj.pub -r obj.priv
```

### Create an EC Key Object and Load it to the TPM

Normally, when creating an object, only the public and private portions of the
object are returned and the caller needs to use tpm2\_load(1) to load those
public and private portions to the TPM before being able to use the object.
However, this can be accomplished within this command as well, when supported
by the TPM. You can verify your TPM supports this feature by checking
that tpm2\_getcap(1) commands returns TPM2\_CC\_CreateLoaded in the command set.
If your TPM does not support TPM2\_CC\_CreateLoaded an unsuported command code
error will be returned. If it's not supported one must use tpm2\_load(1). See
that manpage for details on its usage.

```bash
tpm2_create -C primary.ctx -G ecc -u obj.pub -r obj.priv -c ecc.ctx
```

### Create an Object and get the public key as a PEM file

This will create an object using all the default values but also output the
public key as a PEM file compatible with tools like OpenSSL and whatever supports
PEM files.

```bash
tpm2_create -C primary.ctx -u obj.pub -r obj.priv -f pem -o obj.pem
```
### Create a restricted RSA signing key

For a restricted signing key the scheme and null for the symmetric algorithm must be
specified.

```bash
tpm2_create -C primary.ctx -Grsa2048:rsapss:null  \
    -a "fixedtpm|fixedparen|sensitivedataorigin|userwithauth|restricted|sign" \
    -r obj.priv -u obj.pub
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_create.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_create.1.md), weight 0.9910)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_create - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_create.1/) | `tpm2_create tpm2-tools man page options examples` | **0.9898** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_create tpm2-tools man page options examples` | **0.8561** | authoritative (kept) |
| 3 | [Ubuntu Manpage: tpm2_create - create an object that can be loaded into a](https://manpages.ubuntu.com/manpages/bionic/man8/tpm2_create.8.html) | `tpm2_create tpm2-tools man page options examples` | **0.9184** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_create.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_create.1.md) | `tpm2_create tpm2-tools man page options examples` | **0.9910** | authoritative (kept) |
