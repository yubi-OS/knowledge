# 058 - tpm2-pcrevent (`tpm2_pcrevent`)

**Scope:** tpm2_pcrevent(1): Hashes a file and optionally extends a pcr.
**Upstream Manpage:** `man/tpm2_pcrevent.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_pcrevent.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrevent.1.md), weight 0.9865).
**Multiplexed Invocation:** `tpm2_pcrevent [OPTIONS]` or `tpm2 pcrevent [OPTIONS]` ([tpm2_pcrevent - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrevent.1/), weight 0.9801).

## 1. Command Overview & yubiOS Role

`tpm2_pcrevent` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_pcrevent.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrevent.1.md), weight 0.9865). In yubiOS measured boot (Unified Kernel Images signed via YubiKey PIV slot 9a, `systemd-stub`, and OP-TEE fTPM on ARM64 / `swtpm` in `bcvk` CI), PCR and eventlog commands inspect and extend banks `sha256` (PCRs 0-15, including PCR 4 boot loader, PCR 7 Secure Boot policy, PCR 11 UKI image, and PCR 14/15 system measurements). ([tpm2_pcrevent - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrevent.1/), weight 0.9801)

## 2. Name

**tpm2_pcrevent**(1) - Hashes a file and optionally extends a pcr. ([tpm2-software/tpm2-tools: man/tpm2_pcrevent.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrevent.1.md), weight 0.9865)

## 3. Synopsis

**tpm2_pcrevent** [*OPTIONS*] _FILE_ _PCR\_INDEX_ ([tpm2_pcrevent - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrevent.1/), weight 0.9801)

## 4. Description

**tpm2_pcrevent**(1) - Hashes _FILE_ if specified or stdin. It uses all of the
hashing algorithms that the TPM supports.

Optionally, if a PCR index is specified, it extends that PCR for all
supported algorithms with the hash digest. _FILE_ and _PCR\_INDEX\_ arguments
don't need to come in any particular order.

In either case, it
outputs to stdout the hash algorithm used and the digest value,
one per line:

_alg_:_digest_

Where _alg_ is the algorithm used (like sha1) and _digest_ is the digest
resulting from the hash computation of _alg_ on the data.

See sections 23.1 and sections 17 of the [TPM2.0 Specification](https://trustedcomputinggroup.org/wp-content/uploads/TPM-Rev-2.0-Part-3-Commands-01.38.pdf) ([tpm2-software/tpm2-tools: man/tpm2_pcrevent.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrevent.1.md), weight 0.9865)

## 5. Options

These options control extending the pcr:

  * **-P**, **\--auth**=_AUTH_:

    Specifies the authorization value for PCR.

  * **-S**, **\--session**=_FILE_:

    Specifies the auxiliary sessions for the command.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse ([tpm2_pcrevent - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrevent.1/), weight 0.9801)

## 6. Examples

### Hash a file
```bash
echo "foo" > data
tpm2_pcrevent data
```

### Hash a file and extend PCR 8
```bash
echo "foo" > data
tpm2_pcrevent 8 data
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_pcrevent.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrevent.1.md), weight 0.9865)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_pcrevent: Hashes a file and optionally extends a pcr. / Man Page ...](https://www.mankier.com/1/tpm2_pcrevent) | `tpm2_pcrevent tpm2-tools man page options examples` | **0.6152** | authoritative (kept) |
| 2 | [tpm2 / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2) | `tpm2_pcrevent tpm2-tools man page options examples` | **0.2304** | low-weight (weak backing) |
| 3 | [tpm2_pcrevent - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_pcrevent.1/) | `tpm2_pcrevent tpm2-tools man page options examples` | **0.9801** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_pcrevent.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_pcrevent.1.md) | `tpm2_pcrevent tpm2-tools man page options examples` | **0.9865** | authoritative (kept) |
