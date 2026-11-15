# 008 - tpm2-changepps (`tpm2_changepps`)

**Scope:** tpm2_changepps(1): Replaces the active platform primary seed with a new one generated off the TPM2 RNG.
**Upstream Manpage:** `man/tpm2_changepps.1.md` in `tpm2-software/tpm2-tools` ([tpm2_changepps - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changepps.1/), weight 0.9908).
**Multiplexed Invocation:** `tpm2_changepps [OPTIONS]` or `tpm2 changepps [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_changepps.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_changepps.1.md), weight 0.9805).

## 1. Command Overview & yubiOS Role

`tpm2_changepps` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_changepps - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changepps.1/), weight 0.9908). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_changepps.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_changepps.1.md), weight 0.9805)

## 2. Name

**tpm2_changepps**(1) - Replaces the active platform primary seed with a new one
generated off the TPM2 RNG. ([tpm2_changepps - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changepps.1/), weight 0.9908)

## 3. Synopsis

**tpm2_changepps** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_changepps.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_changepps.1.md), weight 0.9805)

## 4. Description

**tpm2_changepps**(1) - Replaces the active platform primary seed with a new one
generated off the TPM2 RNG. The Transient and Persistent objects under the
platform hierarchy are lost whilst retaining the NV objects. ([tpm2_changepps - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changepps.1/), weight 0.9908)

## 5. Options

* **-p**, **\--auth** specifies the _AUTH_ for the platform.
  hierarchy.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash, unless rphash is also required.

  * **\--rphash**=_FILE_

    File path to record the hash of the response parameters. This is commonly
    termed as rpHash.

  * **-S**, **\--session**=_FILE_:

    The session created using **tpm2_startauthsession**. This can be used to
    specify an auxiliary session for auditing and or encryption/decryption of
    the parameters.

### References

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_changepps.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_changepps.1.md), weight 0.9805)

## 6. Examples

### Change the platform primary seed where the platform auth is NULL.
```bash
tpm2_changepps
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_changepps - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changepps.1/), weight 0.9908)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_changepps - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_changepps.1/) | `tpm2_changepps tpm2-tools man page options examples` | **0.9908** | authoritative (kept) |
| 2 | [tpm2_changepps: Replaces the active platform primary seed with a new ...](https://www.mankier.com/1/tpm2_changepps) | `tpm2_changepps tpm2-tools man page options examples` | **0.1398** | low-weight (weak backing) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_changepps tpm2-tools man page options examples` | **0.9293** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_changepps.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_changepps.1.md) | `tpm2_changepps tpm2-tools man page options examples` | **0.9805** | authoritative (kept) |
