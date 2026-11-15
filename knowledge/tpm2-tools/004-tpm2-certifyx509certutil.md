# 004 - tpm2-certifyx509certutil (`tpm2_certifyX509certutil`)

**Scope:** tpm2_certifyX509certutil(1): Generate partial X509 certificate.
**Upstream Manpage:** `man/tpm2_certifyX509certutil.1.md` in `tpm2-software/tpm2-tools` ([tpm2_certifyX509certutil - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifyX509certutil.1/), weight 0.9921).
**Multiplexed Invocation:** `tpm2_certifyX509certutil [OPTIONS]` or `tpm2 certifyX509certutil [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_certifyX509certutil.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certifyX509certutil.1.md), weight 0.9804).

## 1. Command Overview & yubiOS Role

`tpm2_certifyX509certutil` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_certifyX509certutil - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifyX509certutil.1/), weight 0.9921). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2-software/tpm2-tools: man/tpm2_certifyX509certutil.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certifyX509certutil.1.md), weight 0.9804)

## 2. Name

**tpm2_certifyX509certutil**(1) - Generate partial X509 certificate. ([tpm2_certifyX509certutil - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifyX509certutil.1/), weight 0.9921)

## 3. Synopsis

**tpm2_certifyX509certutil** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_certifyX509certutil.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certifyX509certutil.1.md), weight 0.9804)

## 4. Description

**tpm2_certifyX509certutil**(1) - Generates a partial certificate
that is suitable as the third input parameter for TPM2_certifyX509 command.
The certificate data is written into a file in DER format and can be examined
using openssl asn1parse tool as follows:

```bash
openssl asn1parse -in partial_cert.der -inform DER
``` ([tpm2_certifyX509certutil - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifyX509certutil.1/), weight 0.9921)

## 5. Options

These are the available options:

  * **-o**, **\--outcert**=_STRING_:
    The output file where the certificate will be written to.
	The default is partial_cert.der
    Optional parameter.

  * **-d**, **\--days**=_NUMBER_:
    The number of days the certificate will be valid starting from today.
	The default is 3560 (10 years)
	Optional parameter.

  * **-i**, **\--issuer**=_STRING_:
    The ISSUER entry for the cert in the following format:
	--issuer="C=US;O=org;OU=Org unit;CN=cname"
	Supported fields are:
	* C - "Country", max size = 2
	* O - "Org", max size = 8
	* OU - "Org Unit", max size = 8
	* CN - "Common Name", max size = 8
	The files need to be separated with semicolon.
	At list one supported field is required for the option to be valid.
	Optional parameter.

  * **-s**, **\--subject**=_STRING_:
    The  SUBJECT for the cert in the following format:
	--subject="C=US;O=org;OU=Org unit;CN=cname"
	Supported fields are:
	* C - "Country", max size = 2
	* O - "Org", max size = 8
	* OU - "Org Unit", max size = 8
	* CN - "Common Name", max size = 8
	The files need to be separated with semicolon.
	At list one supported field is required for the option to be valid.
	Optional parameter.

  * **ARGUMENT**
    No arguments required.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect. ([tpm2-software/tpm2-tools: man/tpm2_certifyX509certutil.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certifyX509certutil.1.md), weight 0.9804)

## 6. Examples

```bash
tpm2 certifyX509certutil -o partial_cert.der -d 356
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_certifyX509certutil - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifyX509certutil.1/), weight 0.9921)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_certifyX509certutil - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_certifyX509certutil.1/) | `tpm2_certifyX509certutil tpm2-tools man page options examples` | **0.9921** | authoritative (kept) |
| 2 | [tpm2_certifyX509certutil (1)  -  tpm2.0-tools](https://manpages.opensuse.org/Tumbleweed/tpm2.0-tools/tpm2_certifyX509certutil.1.en.html) | `tpm2_certifyX509certutil tpm2-tools man page options examples` | **0.9070** | authoritative (kept) |
| 3 | [tpm2_certifyX509certutil: Generate partial X509 certificate. / Man Page ...](https://www.mankier.com/1/tpm2_certifyX509certutil) | `tpm2_certifyX509certutil tpm2-tools man page options examples` | **0.0845** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_certifyX509certutil.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_certifyX509certutil.1.md) | `tpm2_certifyX509certutil tpm2-tools man page options examples` | **0.9804** | authoritative (kept) |
