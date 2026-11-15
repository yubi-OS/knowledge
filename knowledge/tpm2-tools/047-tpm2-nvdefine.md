# 047 - tpm2-nvdefine (`tpm2_nvdefine`)

**Scope:** tpm2_nvdefine(1): Define a TPM Non-Volatile (NV) index.
**Upstream Manpage:** `man/tpm2_nvdefine.1.md` in `tpm2-software/tpm2-tools` ([tpm2_nvdefine - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvdefine.1/), weight 0.9896).
**Multiplexed Invocation:** `tpm2_nvdefine [OPTIONS]` or `tpm2 nvdefine [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_nvdefine.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvdefine.1.md), weight 0.9892).

## 1. Command Overview & yubiOS Role

`tpm2_nvdefine` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_nvdefine - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvdefine.1/), weight 0.9896). In yubiOS, TPM 2.0 Non-Volatile (NV) indices back monotonic rollback counters, sealed policy digests (`tpm2_policyauthorizenv`), and RPMB-backed OP-TEE fTPM persistent storage on ARM64 boards (ROCK 5B, PineTab2). ([tpm2-software/tpm2-tools: man/tpm2_nvdefine.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvdefine.1.md), weight 0.9892)

## 2. Name

**tpm2_nvdefine**(1) - Define a TPM Non-Volatile (NV) index. ([tpm2_nvdefine - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvdefine.1/), weight 0.9896)

## 3. Synopsis

**tpm2_nvdefine** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_nvdefine.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvdefine.1.md), weight 0.9892)

## 4. Description

**tpm2_nvdefine**(1) - Define an NV index with given auth value. The index is
specified as an argument. It can be specified as raw handle or an offset value
to the nv handle range "TPM2_HR_NV_INDEX". If an index isn't specified, the tool
uses the first free index. The tool outputs the nv index defined on success. ([tpm2_nvdefine - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvdefine.1/), weight 0.9896)

## 5. Options

* **-C**, **\--hierarchy**=_OBJECT_:

    Specifies the handle used to authorize. Defaults to **o**, **TPM_RH_OWNER**,
    when no value has been specified.
    Supported options are:
      * **o** for **TPM_RH_OWNER**
      * **p** for **TPM_RH_PLATFORM**
      * **`<num>`** where a hierarchy handle or nv-index may be used.

  * **-s**, **\--size**=_NATURAL_NUMBER_:

    Specifies the size of data area in bytes. Defaults to **MAX_NV_INDEX_SIZE**
    which is typically 2048.

  * **-g**, **\--hash-algorithm**=_ALGORITHM_:

    The hash algorithm used to compute the name of the Index and used for the
    authorization policy. If the index is an extend index, the hash algorithm is
    used for the extend.

  * **-a**, **\--attributes**=_ATTRIBUTES_

    Specifies the attribute values for the nv region used when creating the
    entity. Either the raw bitfield mask or "nice-names" may be used. See
    section "NV Attributes" for more details. If not specified, the attributes
    default to various selections based on the hierarchy the index is defined in.

    For the owner hiearchy the defaults are:
      - TPMA_NV_OWNERWRITE
      - TPMA_NV_OWNERREAD

    For the platform hiearchy, the defaults are:
      - TPMA_NV_PPWRITE
      - TPMA_NV_PPREAD

    If a policy file is specified, the hiearchy chosen default attributes are bitwise or'd with:
      - TPMA_NV_POLICYWRITE
      - TPMA_NV_POLICYREAD

    If a policy file is **NOT** specified, the hiearchy chosen default attributes are bitwise or'd with:
      - TPMA_NV_AUTHWRITE
      - TPMA_NV_AUTHREAD

  * **-P**, **\--hierarchy-auth**=_AUTH_:

    Specifies the authorization value for the hierarchy. Authorization values
    should follow the "authorization formatting standards", see section
    "Authorization Formatting".

  * **-p**, **\--index-auth**=_AUTH_:

    Specifies the password of NV Index when created.
    HMAC and Password authorization values should follow the "authorization
    formatting standards", see section "Authorization Formatting".

  * **-L**, **\--policy**=_FILE_:

    Specifies the policy digest file for policy based authorizations.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash, unless rphash is also required.

  * **\--rphash**=_FILE_

    File path to record the hash of the response parameters. This is commonly
    termed as rpHash.

  * **-S**, **\--session**=_FILE_:

    The session created using **tpm2_startauthsession**. Multiple of these can
    be specified. For example, you can have one session for auditing and another
    for encryption/decryption of the parameters.

  * **ARGUMENT** the command line argument specifies the NV index or offset
    number.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**object attribute specifiers** (`man/common/nv-attrs.md`): NV Attributes are used to control various properties of the NV defined space. When specified as an option, either the raw bitfield mask or "nice-names" may be used. The values can be found in Table 204 Part 2 of the TPM2.0 specification, which can be found here: <https://trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-2-Structures-01.38.pdf> Nice names are calculated by taking the name field of table 204 and removing the prefix **TP details the options for
specifying the nv attributes _ATTRIBUTES_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_nvdefine.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvdefine.1.md), weight 0.9892)

## 6. Examples

```bash
tpm2_nvdefine   0x1500016 -C o -s 32 -a 0x2000A

tpm2_nvdefine   0x1500016 -C o -s 32 -a ownerread|ownerwrite|policywrite -p 1a1b
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_nvdefine - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvdefine.1/), weight 0.9896)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_nvdefine (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_nvdefine.1.en.html) | `tpm2_nvdefine tpm2-tools man page options examples` | **0.9805** | authoritative (kept) |
| 2 | [tpm2_nvdefine - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_nvdefine.1/) | `tpm2_nvdefine tpm2-tools man page options examples` | **0.9896** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_nvdefine tpm2-tools man page options examples` | **0.8387** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_nvdefine.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_nvdefine.1.md) | `tpm2_nvdefine tpm2-tools man page options examples` | **0.9892** | authoritative (kept) |
