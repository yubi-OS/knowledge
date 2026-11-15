# 043 - tpm2-load (`tpm2_load`)

**Scope:** tpm2_load(1): Load an object into the TPM.
**Upstream Manpage:** `man/tpm2_load.1.md` in `tpm2-software/tpm2-tools` ([tpm2_load - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_load.1/), weight 0.9897).
**Multiplexed Invocation:** `tpm2_load [OPTIONS]` or `tpm2 load [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_load.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_load.1.md), weight 0.9873).

## 1. Command Overview & yubiOS Role

`tpm2_load` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_load - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_load.1/), weight 0.9897). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2-software/tpm2-tools: man/tpm2_load.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_load.1.md), weight 0.9873)

## 2. Name

**tpm2_load**(1) - Load an object into the TPM. ([tpm2_load - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_load.1/), weight 0.9897)

## 3. Synopsis

**tpm2_load** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_load.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_load.1.md), weight 0.9873)

## 4. Description

**tpm2_load**(1) - Load both the private and public portions of an object
into the TPM or load the object in the TSS2-Private-Key PEM format. This can
be done by specifying the private as well as the public section or via a pem
file using the *-r* option.

The tool outputs the name of the loaded object in a YAML dictionary format
with the key *name* where the value for that key is the name of the object
in hex format, for example:
```yaml
name: 000bac25cb8743111c8e1f52f2ee7279d05d3902a18dd1af694db5d1afa7adf1c8b3
```

It also saves a context file for future interactions with the object.

**NOTE**: Both private and public portions of the tpm key must be specified.
The exception to this is if a TSS2-Private-Key formatted PEM object is to be
loaded which does not need the public specified. ([tpm2_load - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_load.1/), weight 0.9897)

## 5. Options

* **-C**, **\--parent-context**=_OBJECT_:

    The parent object.

  * **-P**, **\--auth**=_AUTH_:

    The authorization value of the parent object specified by **-C**.

  * **-u**, **\--public**=_FILE_:

    A file containing the public portion of the object.

  * **-r**, **\--private**=_FILE_:

    A file containing the sensitive portion of the object.

  * **-n**, **\--name**=_FILE_:

    An optional file to save the name structure of the object.

  * **-c**, **\--key-context**=_FILE_:

    The file name of the saved object context, required.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_load.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_load.1.md), weight 0.9873)

## 6. Examples

### Setup
To load an object you first must create an object under a primary object. So the first
step is to create the primary object.

```bash
tpm2_createprimary -c primary.ctx
```

Step 2 is to create an object under the primary object.

```bash
tpm2_create -C primary.ctx -u key.pub -r key.priv
```

This creates the private and public portions of the TPM object. With these object
portions, it is now possible to load that object into the TPM for subsequent use.

### Loading an Object into the TPM

The final step, is loading the public and private portions of the object into the TPM.

```bash
tpm2_load  -C primary.ctx -u key.pub -r key.priv -c key.ctx
name: 000bac25cb8743111c8e1f52f2ee7279d05d3902a18dd1af694db5d1afa7adf1c8b3
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_load - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_load.1/), weight 0.9897)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_load tpm2-tools man page options examples` | **0.8811** | authoritative (kept) |
| 2 | [tpm2_load - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_load.1/) | `tpm2_load tpm2-tools man page options examples` | **0.9897** | authoritative (kept) |
| 3 | [tpm2_load: Load an object into the TPM. / Man Page / Commands / tpm2 ...](https://www.mankier.com/1/tpm2_load) | `tpm2_load tpm2-tools man page options examples` | **0.2773** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_load.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_load.1.md) | `tpm2_load tpm2-tools man page options examples` | **0.9873** | authoritative (kept) |
