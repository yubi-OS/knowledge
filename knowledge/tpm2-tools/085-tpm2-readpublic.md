# 085 - tpm2-readpublic (`tpm2_readpublic`)

**Scope:** tpm2_readpublic(1): Read the public area of a loaded object.
**Upstream Manpage:** `man/tpm2_readpublic.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_readpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readpublic.1.md), weight 0.9926).
**Multiplexed Invocation:** `tpm2_readpublic [OPTIONS]` or `tpm2 readpublic [OPTIONS]` ([tpm2_readpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readpublic.1/), weight 0.9893).

## 1. Command Overview & yubiOS Role

`tpm2_readpublic` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_readpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readpublic.1.md), weight 0.9926). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2_readpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readpublic.1/), weight 0.9893)

## 2. Name

**tpm2_readpublic**(1) - Read the public area of a loaded object. ([tpm2-software/tpm2-tools: man/tpm2_readpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readpublic.1.md), weight 0.9926)

## 3. Synopsis

**tpm2_readpublic** [*OPTIONS*] ([tpm2_readpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readpublic.1/), weight 0.9893)

## 4. Description

**tpm2_readpublic**(1) - Reads the public area of a loaded object. ([tpm2-software/tpm2-tools: man/tpm2_readpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readpublic.1.md), weight 0.9926)

## 5. Options

* **-c**, **\--object-context**=_OBJECT_:

    Context object for the object to read.

  * **-n**, **\--name**=_FILE_:

    An optional file to save the name structure of the object.

**pubkey options** (`man/common/pubkey.md`): * **-f**, **\--format**: Format selection for the public key output file. 'tss' (the default) will output a binary blob according to the TPM 2.0 Specification. 'pem' will output an OpenSSL compatible PEM encoded public key. 'der' will output an OpenSSL compatible DER encoded public key. 'tpmt' will output a binary blob of the TPMT_PUBLIC struct referenced by TPM 2.0 specs.

    Public key format.

  * **-o**, **\--output**=_FILE_:

    The output file path, recording the public portion of the object.

  * **-t**, **\--serialized-handle**=_HANDLE_:

    If the object to be read is a persistent object specified by a raw handle,
    optionally save the serialized handle for use later. This routine does NOT verify the name of the object being read. Callers should ensure that the
    contents of name match the expected objects name.

  * **-q**, **\--qualified-name**=_FILE_:

    Saves the qualified name of the object to _FILE_. The qualified name of the object is the name algorithm hash of
    the parents qualified and the objects name. Thus the qualified name of the object serves as proof of the objects
    parents.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_readpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readpublic.1/), weight 0.9893)

## 6. Examples

### Create a primary object and read the public structure in an openssl compliant format
```bash
tpm2_createprimary -c primary.ctx
tpm2_readpublic -c primary.ctx -o output.dat -f pem
```

### Serialize an existing persistent object handle to disk for later use

This work-flow is primarily intended for existing persistent TPM objects. This
work-flow does not verify that the name of the serialized object matches the
expected, and thus the serialized handle could be pointing to an attacker
controlled object if no verification is done. If you are creating an object from
scratch, save the serialized handle when making the object persistent.

We assume that an object has already been persisted, for example via:

```bash ([tpm2-software/tpm2-tools: man/tpm2_readpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readpublic.1.md), weight 0.9926)

## 7. We Assume That An Object Has Already Been Persisted, For Example

tpm2_createprimary -c primary.ctx ([tpm2_readpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readpublic.1/), weight 0.9893)

## 8. Context Files Have All The Information For The Tpm To Verify The Object

tpm2_evictcontrol -c primary.ctx
persistent-handle: 0x81000001
action: persisted
```

Next use the persistent handle to get a serialized handle:

```bash ([tpm2-software/tpm2-tools: man/tpm2_readpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readpublic.1.md), weight 0.9926)

## 9. Serialized Handle Instead.

tpm2_readpublic -c 0x81000001 -o output.dat -f pem -t primary.handle ([tpm2_readpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readpublic.1/), weight 0.9893)

## 10. Use This Verified Handle In An Encrypted Session With The Tpm

tpm2_startauthsession --policy-session -S session.ctx -c primary.handle
```

For new objects, its best to use all serialized handles.

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_readpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readpublic.1.md), weight 0.9926)

## 11. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_readpublic - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_readpublic.1/) | `tpm2_readpublic tpm2-tools man page options examples` | **0.9893** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_readpublic tpm2-tools man page options examples` | **0.8829** | authoritative (kept) |
| 3 | [Zamfir Mariana OnlyFans](https://onlyfans.com/liuxbate) | `tpm2_readpublic tpm2-tools man page options examples` | **0.0327** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_readpublic.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_readpublic.1.md) | `tpm2_readpublic tpm2-tools man page options examples` | **0.9926** | authoritative (kept) |
