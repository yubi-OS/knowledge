# 027 - tpm2-evictcontrol (`tpm2_evictcontrol`)

**Scope:** tpm2_evictcontrol(1): Make a transient object persistent or evict a persistent object.
**Upstream Manpage:** `man/tpm2_evictcontrol.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_evictcontrol.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_evictcontrol.1.md), weight 0.9921).
**Multiplexed Invocation:** `tpm2_evictcontrol [OPTIONS]` or `tpm2 evictcontrol [OPTIONS]` ([tpm2_evictcontrol - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_evictcontrol.1/), weight 0.9910).

## 1. Command Overview & yubiOS Role

`tpm2_evictcontrol` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_evictcontrol.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_evictcontrol.1.md), weight 0.9921). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2_evictcontrol - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_evictcontrol.1/), weight 0.9910)

## 2. Name

**tpm2_evictcontrol**(1) - Make a transient object persistent or evict a
persistent object. ([tpm2-software/tpm2-tools: man/tpm2_evictcontrol.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_evictcontrol.1.md), weight 0.9921)

## 3. Synopsis

**tpm2_evictcontrol** [*OPTIONS*] [*ARGUMENT*] ([tpm2_evictcontrol - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_evictcontrol.1/), weight 0.9910)

## 4. Description

**tpm2_evictcontrol**(1) - Allows a transient object to be made persistent or a
persistent object to
be evicted. The _HANDLE_ argument controls the index the handle will be assigned
to. If the object specified via **-c** is transient, and a permanent _HANDLE_ is
specified, the object will be persisted at _HANDLE_. If _HANDLE_ is a -, then
the object will be persisted at the first available permanent handle location.
If the object specified via **-c** is a permanent handle, then the object will
be evicted from it's permenent handle location. ([tpm2-software/tpm2-tools: man/tpm2_evictcontrol.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_evictcontrol.1.md), weight 0.9921)

## 5. Options

* **-C**, **\--hierarchy**=_OBJECT_:

    The authorization hierarchy used to authorize the commands. Defaults to the
    "owner" hierarchy. Supported options are:
      * **o** for **TPM_RH_OWNER**
      * **p** for **TPM_RH_PLATFORM**
      * **`<num>`** where a raw number can be used.

  * **-c**, **\--object-context**=_OBJECT_:

    A context object specifier of a transient or persistent object.
    If _OBJECT_ is a transient object it will be persisted, either to the handle
    specified by the argument or to first available vacant persistent handle.
    If the _OBJECT_ is for a persistent object, then the object will be evicted
    from non-volatile memory.

  * **-P**, **\--auth**=_AUTH_:

    The authorization value for the hierarchy specified with **-C**.

  * **-o**, **\--output**=_FILE_:

    Optionally output a serialized object representing the persistent handle.
    If untampered, these files are safer to use then raw persistent handles. A
    raw persistent handle should be verified that the object it points to is
    as expected.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

  * **ARGUMENT** the command line argument specifies the persistent handle to
    save the transient object to. ([tpm2_evictcontrol - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_evictcontrol.1/), weight 0.9910)

## 6. Output

The tool outputs a YAML compliant dictionary with the fields:
persistent-handle: <handle>
action: evicted|persisted

Where *persistent-handle* is the handle the action occurred to.
Where *action* can either be one of *evicted* or *persisted*. If an object is
*evicted* then the object is no longer resident at the *persistent-handle*
address within the TPM. If an object is *persisted* then the object is resident
at the *persistent-handle* address within the TPM.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_evictcontrol.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_evictcontrol.1.md), weight 0.9921)

## 7. Examples

### To make a transient handle persistent at address 0x81010002
```bash
tpm2_changeauth -c o ownerauth
tpm2_createprimary -c primary.ctx -P ownerauth
tpm2_evictcontrol -C o -c primary.ctx 0x81010002 -P ownerauth
```

### To evict a persistent handle
```bash
tpm2_evictcontrol -C o -c 0x81010002 -P ownerauth
```

### To make a transient handle persistent and output a serialized persistent handle.
```bash
tpm2_evictcontrol -C o -c primary.ctx -o primary.handle -P ownerauth
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_evictcontrol - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_evictcontrol.1/), weight 0.9910)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_evictcontrol (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_evictcontrol.1.en.html) | `tpm2_evictcontrol tpm2-tools man page options examples` | **0.9868** | authoritative (kept) |
| 2 | [tpm2_evictcontrol - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_evictcontrol.1/) | `tpm2_evictcontrol tpm2-tools man page options examples` | **0.9910** | authoritative (kept) |
| 3 | [Ubuntu Manpage: tpm2_evictcontrol - allows a transient object to be made](https://manpages.ubuntu.com/manpages/bionic/man8/tpm2_evictcontrol.8.html) | `tpm2_evictcontrol tpm2-tools man page options examples` | **0.9617** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_evictcontrol.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_evictcontrol.1.md) | `tpm2_evictcontrol tpm2-tools man page options examples` | **0.9921** | authoritative (kept) |
