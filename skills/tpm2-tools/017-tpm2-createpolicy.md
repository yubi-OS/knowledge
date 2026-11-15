# 017 - tpm2-createpolicy (`tpm2_createpolicy`)

**Scope:** tpm2_createpolicy(1): Creates simple assertion authorization policies based on multiple PCR indices values across multiple enabled banks.
**Upstream Manpage:** `man/tpm2_createpolicy.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_createpolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createpolicy.1.md), weight 0.9894).
**Multiplexed Invocation:** `tpm2_createpolicy [OPTIONS]` or `tpm2 createpolicy [OPTIONS]` ([tpm2_createpolicy - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createpolicy.1/), weight 0.9739).

## 1. Command Overview & yubiOS Role

`tpm2_createpolicy` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_createpolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createpolicy.1.md), weight 0.9894). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2_createpolicy - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createpolicy.1/), weight 0.9739)

## 2. Name

**tpm2_createpolicy**(1) - Creates simple assertion authorization policies based
on multiple PCR indices values across multiple enabled banks. ([tpm2-software/tpm2-tools: man/tpm2_createpolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createpolicy.1.md), weight 0.9894)

## 3. Synopsis

**tpm2_createpolicy** [*OPTIONS*] ([tpm2_createpolicy - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createpolicy.1/), weight 0.9739)

## 4. Description

**tpm2_createpolicy**(1) - Creates simple assertion authorization policies based
on multiple PCR indices values across multiple enabled banks. It can then be
used with object creation and or tools using the object. ([tpm2-software/tpm2-tools: man/tpm2_createpolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createpolicy.1.md), weight 0.9894)

## 5. Options

These options control creating the policy authorization session:

  * **-L**, **\--policy**=_FILE_:

    The file to save the policy digest.

  * **\--policy-pcr**:

    Identifies the PCR policy type for policy creation.

  * **-g**, **\--policy-algorithm**=_ALGORITHM_:

    The hash algorithm used in computation of the policy digest.

  * **-l**, **\--pcr-list**=_PCR_:

    The list of PCR banks and selected PCRs' ids for each bank.

  * **-f**, **\--pcr**=_FILE_:

    Optional Path or Name of the file containing expected PCR values for the
    specified index. Default is to read the current PCRs per the set list.

  * **\--policy-session**:

    Start a policy session of type **TPM_SE_POLICY**.
    Defaults to **TPM_SE_TRIAL** if this option isn't specified.

### References

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**common options** (`man/common/pcr.md`): PCR Bank Selection lists follow the below specification: ``` <BANK>:<PCR>[,<PCR>] or <BANK>:all ``` multiple banks may be separated by '+'. For example: ``` sha1:3,4+sha256:all ``` will select PCRs 3 and 4 from the SHA1 bank and PCRs 0 to 23 from the SHA256 bank. Certain commands support specifying forward sealing values as well: ``` sha1:0,1=da39a3ee5e6b4b0d3255bfef95601890afd80709,2 ``` This will select the current values for PCRs 0 and 2, but  details options for specifying the pcr index and
bank/algorithm _PCR_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_createpolicy - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createpolicy.1/), weight 0.9739)

## 6. Examples

### Create a authorization policy tied to a specific PCR index
```bash
tpm2_createpolicy \--policy-pcr -l 0x4:0 -L policy.file -f pcr0.bin
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_createpolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createpolicy.1.md), weight 0.9894)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_createpolicy (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_createpolicy.1.en.html) | `tpm2_createpolicy tpm2-tools man page options examples` | **0.9709** | authoritative (kept) |
| 2 | [tpm2_createpolicy / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2_createpolicy) | `tpm2_createpolicy tpm2-tools man page options examples` | **0.3590** | low-weight (weak backing) |
| 3 | [tpm2_createpolicy - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_createpolicy.1/) | `tpm2_createpolicy tpm2-tools man page options examples` | **0.9739** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_createpolicy.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_createpolicy.1.md) | `tpm2_createpolicy tpm2-tools man page options examples` | **0.9894** | authoritative (kept) |
