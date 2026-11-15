# 012 - tpm2-clockrateadjust (`tpm2_clockrateadjust`)

**Scope:** tpm2_clockrateadjust(1): Sets the clock rate period on the TPM.
**Upstream Manpage:** `man/tpm2_clockrateadjust.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_clockrateadjust.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clockrateadjust.1.md), weight 0.9875).
**Multiplexed Invocation:** `tpm2_clockrateadjust [OPTIONS]` or `tpm2 clockrateadjust [OPTIONS]` ([tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/), weight 0.7725).

## 1. Command Overview & yubiOS Role

`tpm2_clockrateadjust` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_clockrateadjust.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clockrateadjust.1.md), weight 0.9875). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/), weight 0.7725)

## 2. Name

**tpm2_clockrateadjust**(1) - Sets the clock rate period on the TPM. ([tpm2-software/tpm2-tools: man/tpm2_clockrateadjust.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clockrateadjust.1.md), weight 0.9875)

## 3. Synopsis

**tpm2_clockrateadjust** [*OPTIONS*] __ADJUSTER__ ([tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/), weight 0.7725)

## 4. Description

**tpm2_clockrateadjust**(1) - Adjusts the rate at which clock and time are updated on
the TPM so one can better match real time. With no argument, the command is invoked
but the clock rate is not altered. With an argument, the tool will adjust the clock
and time period. The command can either increase or decrease the clock period via 3
distinct granularities: course, medium and fine. To specify this, the argument can
be a string of 1 to 3 characters of *all* 's' or 'f'.

### Valid Adjuster Arguments

  * s - slows down the clock period one fine increment.
  * ss - slows down the clock period one medium increment.
  * sss - slows down the clock period one course increment.
  * f - speeds up the clock period one fine increment.
  * ff - speeds up the clock period one medium increment.
  * fff - speeds up the clock period one course increment. ([tpm2-software/tpm2-tools: man/tpm2_clockrateadjust.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clockrateadjust.1.md), weight 0.9875)

## 5. Options

* **-c**, **\--hierarchy**=_OBJECT_:

    The hierarchy to use for authorization, either platform or owner.
    Defaults to the owner hierarchy if not specified.

  * **-p**, **\--auth**=_AUTH_:

    Specifies the authorization value for the hierarchy specified by option
    **-c**.

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
the various known TCTI modules. ([tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/), weight 0.7725)

## 6. Examples

### Set the clock

Slow the clock one medium increment using the owner password.

```bash
tpm2_clockrateadjust -p ownerpw ss
```

Speed up the clock one course increment using the platform password.

```bash
tpm2_clockrateadjust -c p -p platformpw fff
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_clockrateadjust.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clockrateadjust.1.md), weight 0.9875)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_clockrateadjust tpm2-tools man page options examples` | **0.7725** | authoritative (kept) |
| 2 | [tpm2_clockrateadjust: Sets the clock rate period on the TPM. / Man Page ...](https://www.mankier.com/1/tpm2_clockrateadjust) | `tpm2_clockrateadjust tpm2-tools man page options examples` | **0.3182** | low-weight (weak backing) |
| 3 | [tpm2 / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2) | `tpm2_clockrateadjust tpm2-tools man page options examples` | **0.1736** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_clockrateadjust.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_clockrateadjust.1.md) | `tpm2_clockrateadjust tpm2-tools man page options examples` | **0.9875** | authoritative (kept) |
