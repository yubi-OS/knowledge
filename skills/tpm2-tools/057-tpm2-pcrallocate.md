# 057 - tpm2-pcrallocate (`tpm2_pcrallocate`)

**Scope:** tpm2_pcrallocate(1): Configure PCRs and bank algorithms.
**Upstream Manpage:** `man/tpm2_pcrallocate.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_pcrallocate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrallocate.1.md), weight 0.9903).
**Multiplexed Invocation:** `tpm2_pcrallocate [OPTIONS]` or `tpm2 pcrallocate [OPTIONS]` ([tpm2_pcrallocate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_pcrallocate.1/), weight 0.9900).

## 1. Command Overview & yubiOS Role

`tpm2_pcrallocate` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_pcrallocate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrallocate.1.md), weight 0.9903). In yubiOS measured boot (Unified Kernel Images signed via YubiKey PIV slot 9a, `systemd-stub`, and OP-TEE fTPM on ARM64 / `swtpm` in `bcvk` CI), PCR and eventlog commands inspect and extend banks `sha256` (PCRs 0-15, including PCR 4 boot loader, PCR 7 Secure Boot policy, PCR 11 UKI image, and PCR 14/15 system measurements). ([tpm2_pcrallocate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_pcrallocate.1/), weight 0.9900)

## 2. Name

**tpm2_pcrallocate**(1) - Configure PCRs and bank algorithms. ([tpm2-software/tpm2-tools: man/tpm2_pcrallocate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrallocate.1.md), weight 0.9903)

## 3. Synopsis

**tpm2_pcrallocate** [*OPTIONS*] [*ARGUMENT] ([tpm2_pcrallocate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_pcrallocate.1/), weight 0.9900)

## 4. Description

**tpm2_pcrallocate**(1) - Allow the user to specify a PCR allocation for the TPM.
An allocation is the enabling or disabling of PCRs and it's banks. A PCR can have
multiple banks, where each bank is associated with a specific hashing algorithm.
Allocation is specified in the argument.

If no allocation is given, then SHA1 and SHA256 banks with PCRs 0 - 23 are
allocated.

Allocation is a list of banks and selected pcrs. The values should follow the
pcr bank specifiers standards, see section "PCR Bank Specifiers".

The new allocations become effective after the next reboot.

**Note**: This command requires platform authorization. ([tpm2-software/tpm2-tools: man/tpm2_pcrallocate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrallocate.1.md), weight 0.9903)

## 5. Options

* **-P**, **\--auth**=_AUTH_:

    Optional authorization value. Authorization values should follow the
    "authorization formatting standards", see section "Authorization Formatting".

  * **ARGUMENT** the command line argument specifies the PCR allocation.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**object attribute specifiers** (`man/common/obj-attrs.md`): Object Attributes are used to control various properties of created objects. When specified as an option, either the raw bitfield mask or "nice-names" may be used. The values can be found in Table 31 Part 2 of the TPM2.0 specification, which can be found here: <https://trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-2-Structures-01.38.pdf> Nice names are calculated by taking the name field of table 31 and removing the prefix **TPMA_ details the options for
specifying the object attributes _ATTRIBUTES_.

**pcr bank specifiers** (`man/common/pcr.md`): PCR Bank Selection lists follow the below specification: ``` <BANK>:<PCR>[,<PCR>] or <BANK>:all ``` multiple banks may be separated by '+'. For example: ``` sha1:3,4+sha256:all ``` will select PCRs 3 and 4 from the SHA1 bank and PCRs 0 to 23 from the SHA256 bank. Certain commands support specifying forward sealing values as well: ``` sha1:0,1=da39a3ee5e6b4b0d3255bfef95601890afd80709,2 ``` This will select the current values for PCRs 0 and 2, but  details the syntax for specifying pcr list.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_pcrallocate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_pcrallocate.1/), weight 0.9900)

## 6. Examples

### To allocate the two default banks (SHA1 and SHA256)
```bash
tpm2_pcrallocate
```

### To make a custom allocation with a platform authorization
```bash
tpm2_pcrallocate -P abc sha1:7,8,9,10,16,17,18,19+sha256:all
```

### To completly switch from SHA1 bank to SHA256 with a platform authorization
```bash
tpm2_pcrallocate -P abc sha1:none+sha256:all
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_pcrallocate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrallocate.1.md), weight 0.9903)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_pcrallocate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_pcrallocate.1/) | `tpm2_pcrallocate tpm2-tools man page options examples` | **0.9900** | authoritative (kept) |
| 2 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_pcrallocate tpm2-tools man page options examples` | **0.8555** | authoritative (kept) |
| 3 | [tpm2 / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2) | `tpm2_pcrallocate tpm2-tools man page options examples` | **0.2718** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_pcrallocate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrallocate.1.md) | `tpm2_pcrallocate tpm2-tools man page options examples` | **0.9903** | authoritative (kept) |
