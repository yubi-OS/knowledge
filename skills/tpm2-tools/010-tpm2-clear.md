# 010 - tpm2-clear (`tpm2_clear`)

**Scope:** tpm2_clear(1): Clears lockout, endorsement and owner hierarchy authorization values and other TPM data.
**Upstream Manpage:** `man/tpm2_clear.1.md` in `tpm2-software/tpm2-tools` ([tpm2_clear - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_clear.1/), weight 0.9897).
**Multiplexed Invocation:** `tpm2_clear [OPTIONS]` or `tpm2 clear [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_clear.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clear.1.md), weight 0.9876).

## 1. Command Overview & yubiOS Role

`tpm2_clear` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_clear - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_clear.1/), weight 0.9897). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_clear.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clear.1.md), weight 0.9876)

## 2. Name

**tpm2_clear**(1) - Clears lockout, endorsement and owner hierarchy
authorization values and other TPM data. ([tpm2_clear - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_clear.1/), weight 0.9897)

## 3. Synopsis

**tpm2_clear** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_clear.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clear.1.md), weight 0.9876)

## 4. Description

**tpm2_clear**(1) - Send a clear command to the TPM to clear the 3 hierarchy
authorization values. As an argument takes the auth value for either platform or
lockout hierarchy. Details of the changes performed to the TPM can be found
in Part 3, "Commands", section of the TPM Library spec located at the URL below.
  - https://trustedcomputinggroup.org/resource/tpm-library-specification

Please look for the version coresponding to your TPM support specification version
and the TPM2_Clear command. The TPM's supported spec version can be found by
issuing a `tpm2_getcap properties-fixed` in the `TPM_PT_REVISION` property.

**NOTE**: All objects created under the respective hierarchies are lost. ([tpm2_clear - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_clear.1/), weight 0.9897)

## 5. Options

* **-c**, **\--auth-hierarchy**=_OBJECT_:

    Specifies the hierarchy the tools should operate on. By default
    it operates on the lockout hierarchy.

    **NOTE : Operating on platform hierarchy require platform authentication.**

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

  * **ARGUMENT** the command line argument specifies the _AUTH_ to be set for
    the object specified with **-c**.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_clear.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clear.1.md), weight 0.9876)

## 6. Examples

### Set owner, endorsement and lockout authorizations to an empty value

```bash
tpm2_clear lockoutpasswd
```

### Clear the authorization values on the platform hierarchy
```bash
tpm2_clear -c p
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_clear - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_clear.1/), weight 0.9897)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_clear (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_clear.1.en.html) | `tpm2_clear tpm2-tools man page options examples` | **0.9802** | authoritative (kept) |
| 2 | [tpm2_clear - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_clear.1/) | `tpm2_clear tpm2-tools man page options examples` | **0.9897** | authoritative (kept) |
| 3 | [tpm2 / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2) | `tpm2_clear tpm2-tools man page options examples` | **0.2128** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_clear.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clear.1.md) | `tpm2_clear tpm2-tools man page options examples` | **0.9876** | authoritative (kept) |
