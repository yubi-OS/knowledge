# 018 - tpm2-createprimary (`tpm2_createprimary`)

**Scope:** tpm2_createprimary(1): Create a primary key.
**Upstream Manpage:** `man/tpm2_createprimary.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_createprimary.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createprimary.1.md), weight 0.9907).
**Multiplexed Invocation:** `tpm2_createprimary [OPTIONS]` or `tpm2 createprimary [OPTIONS]` ([tpm2_createprimary - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createprimary.1/), weight 0.9886).

## 1. Command Overview & yubiOS Role

`tpm2_createprimary` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_createprimary.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createprimary.1.md), weight 0.9907). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2_createprimary - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createprimary.1/), weight 0.9886)

## 2. Name

**tpm2_createprimary**(1) - Create a primary key. ([tpm2-software/tpm2-tools: man/tpm2_createprimary.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createprimary.1.md), weight 0.9907)

## 3. Synopsis

**tpm2_createprimary** [*OPTIONS*] ([tpm2_createprimary - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createprimary.1/), weight 0.9886)

## 4. Description

**tpm2_createprimary**(1) - This command is used to create a primary object
under one of the hierarchies: Owner, Platform, Endorsement, NULL. The command
will create and load a Primary Object. The sensitive and public portions are not
returned. A context file for the created object's handle is saved as a file for
future interactions with the created primary. ([tpm2-software/tpm2-tools: man/tpm2_createprimary.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createprimary.1.md), weight 0.9907)

## 5. Options

* **-C**, **\--hierarchy**=_OBJECT_:

    The hierarchy under which the object is created. This will also dictate
    which authorization secret (if any) must be supplied. Defaults to
    **TPM_RH_OWNER**, when no value specified.
    Supported options are:
      * **o** for **TPM_RH_OWNER**
      * **p** for **TPM_RH_PLATFORM**
      * **e** for **TPM_RH_ENDORSEMENT**
      * **n** for **TPM_RH_NULL**
      * **`<num>`** where a raw number can be used.

  * **-P**, **\--hierarchy-auth**=_AUTH_:

    The authorization value for the hierarchy specified with **-C**.

  * **-p**, **\--key-auth**=_AUTH_:

    The authorization value for the primary object created.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm to use for generating the objects name.
    Defaults to sha256 if not specified.

  * **-G**, **\--key-algorithm**=_ALGORITHM_:

    The algorithm type for the generated primary key. Defaults to
    rsa2048:null:aes128cfb.

  * **-c**, **\--key-context**=_FILE_:

    The file path to save the object context of the generated primary object.

  * **-L**, **\--policy**=_FILE_ or _HEX\_STRING_:

    An optional file input or hex string that contains the policy digest for policy based
    authorization of the object.

  * **-a**, **\--attributes**=_ATTRIBUTES_:

    The object attributes, optional. Defaults to:
    `TPMA_OBJECT_RESTRICTED|TPMA_OBJECT_DECRYPT|TPMA_OBJECT_FIXEDTPM|
     TPMA_OBJECT_FIXEDPARENT|TPMA_OBJECT_SENSITIVEDATAORIGIN|
     TPMA_OBJECT_USERWITHAUTH`

  * **-u**, **\--unique-data**=_FILE_ OR _STDIN_:

    An optional file input that contains the unique field of **TPMT_PUBLIC** in
    little-endian format. Primary key creator may place information that causes
    the primary key generation scheme internal to the TPM to generate
    statistically unique values. The TPM v2.0 specification calls this field
    unique and overloads it so that it contains one value when the application
    provides this structure as input and another value when the applications
    receives this structure as output (like public portion of the rsa key).

    If the data is specified as a file, the user is responsible for ensuring
    that this buffer is formatted per TPMU_PUBLIC_ID union.

    The unique data can also be retrieved from stdin buffer by specifying
    **"-"** as the **--unique-data** option value and the tool will parse the
    key type and associate the input data with the unique data buffer associated
    with the key type.

    NOTE:
    1. The maximum allowed bytes is dependent on key type and the TPM
    implementation. Eg. While TSS allows a value upto 512 for MAX_RSA_KEY_BYTES,
    however the ibmSwTPM implementation supports a value upto 256 bytes.
    2. The unique input data specified on stdin for ECC is split for specifying
    the X coordinate and Y coordinate buffers.

  * **\--creation-data**=_FILE_:

    An optional file output that saves the creation data for certification.

  * **\--template-data**=_FILE_:

    An optional file output that saves the key template data (TPM2B_PUBLIC) to
    be used in **tpm2_policytemplate**.

  * **-t**, **\--creation-ticket**=_FILE_:

    An optional file output that saves the creation ticket for certification.

  * **-d**, **\--creation-hash**=_FILE_:

    An optional file output that saves the creation hash for certification.

  * **-q**, **\--outside-info**=_FILE\_OR\_HEX_:

    An optional file or hex string to add unique data to the creation data.
    Note that it does not contribute in creating statistically unique object.

  * **-l**, **\--pcr-list**=_PCR_:

    The list of PCR banks and selected PCRs' ids for each bank to be included in
    the creation data for certification.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

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
the various known TCTI modules. ([tpm2_createprimary - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createprimary.1/), weight 0.9886)

## 6. Examples

### Create an ECC primary object
```bash
tpm2_createprimary -C o -g sha256 -G ecc -c context.out
```

### Create a primary object that follows the guidance of TCG Provisioning guide

See : https://trustedcomputinggroup.org/wp-content/uploads/TCG-TPM-v2.0-Provisioning-Guidance-Published-v1r1.pdf

Where unique.dat contains the binary-formatted data: 0x00 0x01 (0x00 * 256)

```bash
tpm2_createprimary -C o -G rsa2048:aes128cfb -g sha256 -c prim.ctx \
-a 'restricted|decrypt|fixedtpm|fixedparent|sensitivedataorigin|userwithauth|\
noda' -u unique.dat

### Create a primary object and output the public key in pem format
tpm2_createprimary -c primary.ctx --format=pem --output=public.pem
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_createprimary.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createprimary.1.md), weight 0.9907)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_createprimary: Create a primary key. / Man Page / Commands / tpm2 ...](https://www.mankier.com/1/tpm2_createprimary) | `tpm2_createprimary tpm2-tools man page options examples` | **0.3889** | low-weight (weak backing) |
| 2 | [tpm2_createprimary - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createprimary.1/) | `tpm2_createprimary tpm2-tools man page options examples` | **0.9886** | authoritative (kept) |
| 3 | [tpm2_createprimary(1)  -  tpm2-tools...  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_createprimary.1.en.html) | `tpm2_createprimary tpm2-tools man page options examples` | **0.9851** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_createprimary.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createprimary.1.md) | `tpm2_createprimary tpm2-tools man page options examples` | **0.9907** | authoritative (kept) |
