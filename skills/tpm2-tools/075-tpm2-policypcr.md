# 075 - tpm2-policypcr (`tpm2_policypcr`)

**Scope:** tpm2_policypcr(1): Create a policy that includes specific PCR values.
**Upstream Manpage:** `man/tpm2_policypcr.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_policypcr.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policypcr.1.md), weight 0.9858).
**Multiplexed Invocation:** `tpm2_policypcr [OPTIONS]` or `tpm2 policypcr [OPTIONS]` ([tpm2_policypcr - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policypcr.1/), weight 0.9845).

## 1. Command Overview & yubiOS Role

`tpm2_policypcr` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_policypcr.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policypcr.1.md), weight 0.9858). In yubiOS measured boot (Unified Kernel Images signed via YubiKey PIV slot 9a, `systemd-stub`, and OP-TEE fTPM on ARM64 / `swtpm` in `bcvk` CI), PCR and eventlog commands inspect and extend banks `sha256` (PCRs 0-15, including PCR 4 boot loader, PCR 7 Secure Boot policy, PCR 11 UKI image, and PCR 14/15 system measurements). ([tpm2_policypcr - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policypcr.1/), weight 0.9845)

## 2. Name

**tpm2_policypcr**(1) - Create a policy that includes specific PCR values. ([tpm2-software/tpm2-tools: man/tpm2_policypcr.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policypcr.1.md), weight 0.9858)

## 3. Synopsis

**tpm2_policypcr** [*OPTIONS*] ([tpm2_policypcr - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policypcr.1/), weight 0.9845)

## 4. Description

**tpm2_policypcr**(1) - Generates a PCR policy event with the TPM. A PCR policy
event creates a policy bound to specific PCR values and is useful within larger
policies constructed using policyor and policyauthorize events. See
**tpm2_policyor(1)** and **tpm2_policyauthorize(1)** respectively for their
usages. The PCR data factored into the policy can be specified in one of 3 ways:
1. A file containing a concatenated list of PCR values as in the output from
   **tpm2_pcrread**.
2. Requiring the PCR values be read off the TPM by not specifying a PCR file
   input.
3. The digest of all the PCR values directly specified as an **argument**. ([tpm2-software/tpm2-tools: man/tpm2_policypcr.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policypcr.1.md), weight 0.9858)

## 5. Options

* **-L**, **\--policy**=_FILE_:

    File to save the policy digest.

  * **-f**, **\--pcr**=_FILE_:

    Optional Path or Name of the file containing expected PCR values for the
    specified index. Default is to read the current PCRs per the set list.

  * **-l**, **\--pcr-list**=_PCR_:

    The list of PCR banks and selected PCRs' ids for each bank.  Forward
    sealing values can be specified.

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession**(1).

  * **ARGUMENT**:
    The calculated digest of all PCR values specified as a hex byte stream.
    Eg: `openssl dgst -sha256 -binary pcr.bin | xxd -p -c 32`

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**pcr bank specifiers** (`man/common/pcr.md`): PCR Bank Selection lists follow the below specification: ``` <BANK>:<PCR>[,<PCR>] or <BANK>:all ``` multiple banks may be separated by '+'. For example: ``` sha1:3,4+sha256:all ``` will select PCRs 3 and 4 from the SHA1 bank and PCRs 0 to 23 from the SHA256 bank. Certain commands support specifying forward sealing values as well: ``` sha1:0,1=da39a3ee5e6b4b0d3255bfef95601890afd80709,2 ``` This will select the current values for PCRs 0 and 2, but  details the syntax for specifying pcr list
_PCR_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_policypcr - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policypcr.1/), weight 0.9845)

## 6. Examples

Starts a *trial* session, builds a PCR policy and uses that policy in the
creation of an object. Then, it uses a *policy* session to unseal some data
stored in the object.

### Step 1: create a policy
```bash
tpm2_createprimary -C e -g sha256 -G ecc -c primary.ctx

tpm2_pcrread -o pcr.dat "sha1:0,1,2,3"

tpm2_startauthsession -S session.dat

tpm2_policypcr -S session.dat -l "sha1:0,1,2,3" -f pcr.dat -L policy.dat

tpm2_flushcontext session.dat
``` ([tpm2-software/tpm2-tools: man/tpm2_policypcr.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policypcr.1.md), weight 0.9858)

## 7. Step 2: Create An Object Using That Policy

```bash
tpm2_create -Q -u key.pub -r key.priv -C primary.ctx -L policy.dat \
-i- <<< "12345678"

tpm2_load -C primary.ctx -u key.pub -r key.priv -n unseal.key.name \
-c unseal.key.ctx
```

### Step 3: Satisfy the policy
```bash
tpm2_startauthsession --policy-session -S session.dat

tpm2_policypcr -S session.dat -l "sha1:0,1,2,3" -f pcr.dat -L policy.dat
```

### Step 4: Use the policy
```bash
tpm2_unseal -psession:session.dat -c unseal.key.ctx
12345678

tpm2_flushcontext session.dat
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_policypcr - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policypcr.1/), weight 0.9845)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policypcr: Create a policy that includes specific PCR... / ManKier](https://www.mankier.com/1/tpm2_policypcr) | `tpm2_policypcr tpm2-tools man page options examples` | **0.2795** | low-weight (weak backing) |
| 2 | [tpm2_policypcr - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policypcr.1/) | `tpm2_policypcr tpm2-tools man page options examples` | **0.9845** | authoritative (kept) |
| 3 | [Ubuntu Manpage: tpm2_policypcr (1) - Create a policy that includes ...](https://manpages.ubuntu.com/manpages/focal/man1/tpm2_policypcr.1.html) | `tpm2_policypcr tpm2-tools man page options examples` | **0.9501** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policypcr.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policypcr.1.md) | `tpm2_policypcr tpm2-tools man page options examples` | **0.9858** | authoritative (kept) |
