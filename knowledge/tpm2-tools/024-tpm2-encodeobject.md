# 024 - tpm2-encodeobject (`tpm2_encodeobject`)

**Scope:** tpm2_encodeobject(1): Encode an object into a combined PEM format.
**Upstream Manpage:** `man/tpm2_encodeobject.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_encodeobject.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encodeobject.1.md), weight 0.9899).
**Multiplexed Invocation:** `tpm2_encodeobject [OPTIONS]` or `tpm2 encodeobject [OPTIONS]` ([Ubuntu Manpage: tpm2_encodeobject (1) - Encode an object into a ...](https://manpages.ubuntu.com/manpages/resolute/man1/tpm2_encodeobject.1.html), weight 0.9803).

## 1. Command Overview & yubiOS Role

`tpm2_encodeobject` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_encodeobject.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encodeobject.1.md), weight 0.9899). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([Ubuntu Manpage: tpm2_encodeobject (1) - Encode an object into a ...](https://manpages.ubuntu.com/manpages/resolute/man1/tpm2_encodeobject.1.html), weight 0.9803)

## 2. Name

**tpm2_encodeobject**(1) - Encode an object into a combined PEM format. ([tpm2-software/tpm2-tools: man/tpm2_encodeobject.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encodeobject.1.md), weight 0.9899)

## 3. Synopsis

**tpm2_encodeobject** [*OPTIONS*] ([Ubuntu Manpage: tpm2_encodeobject (1) - Encode an object into a ...](https://manpages.ubuntu.com/manpages/resolute/man1/tpm2_encodeobject.1.html), weight 0.9803)

## 4. Description

**tpm2_encodeobject**(1) - Encode both the private and public portions of an
object into a combined PEM format used by tpm2-tss-engine.

The tool reads private and public portions of an object and encodes it
into a combined PEM format used by tpm2-tss-engine and other
applications.

**NOTE**: Both private and public portions of the tpm key must be specified. ([tpm2-software/tpm2-tools: man/tpm2_encodeobject.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encodeobject.1.md), weight 0.9899)

## 5. Options

* **-C**, **\--parent-context**=_OBJECT_:

    The parent object.

  * **-P**, **\--auth**=_AUTH_:

    The authorization value of the parent object specified by **-C**.

  * **-u**, **\--public**=_FILE_:

    A file containing the public portion of the object.

  * **-r**, **\--private**=_FILE_:

    A file containing the sensitive portion of the object.

  * **-p**, **\--key-auth**:

    Indicates if an authorization value is needed for the object specified by
    **-r** and **-u**.

  * **-o**, **\--output**=_FILE_:

    The output file path, recording the public portion of the object.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([Ubuntu Manpage: tpm2_encodeobject (1) - Encode an object into a ...](https://manpages.ubuntu.com/manpages/resolute/man1/tpm2_encodeobject.1.html), weight 0.9803)

## 6. Examples

### Setup
To load an object you first must create an object under a primary object. So the
first step is to create the primary object.

```bash
tpm2_createprimary -c primary.ctx
```

Step 2 is to create an object under the primary object.

```bash
tpm2_create -C primary.ctx -u key.pub -r key.priv -f pem -o pub.pem
```

This creates the private and public portions of the TPM object. With these
object portions, it is now possible to load that object into the TPM for
subsequent use.

### Encoding an Object into a combined PEM format

The final step, is encoding the public and private portions of the object into a
PEM format.

```bash
tpm2_encodeobject -C primary.ctx -u key.pub -r key.priv -o priv.pem
```

The generated `priv.pem` can be used together with `pub.pem` created in the
step 2 of Setup section.

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_encodeobject.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encodeobject.1.md), weight 0.9899)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_encodeobject: Encode an object into a combined PEM format. / Man ...](https://www.mankier.com/1/tpm2_encodeobject) | `tpm2_encodeobject tpm2-tools man page options examples` | **0.1923** | low-weight (weak backing) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_encodeobject tpm2-tools man page options examples` | **0.7199** | authoritative (kept) |
| 3 | [Ubuntu Manpage: tpm2_encodeobject (1) - Encode an object into a ...](https://manpages.ubuntu.com/manpages/resolute/man1/tpm2_encodeobject.1.html) | `tpm2_encodeobject tpm2-tools man page options examples` | **0.9803** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_encodeobject.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_encodeobject.1.md) | `tpm2_encodeobject tpm2-tools man page options examples` | **0.9899** | authoritative (kept) |
