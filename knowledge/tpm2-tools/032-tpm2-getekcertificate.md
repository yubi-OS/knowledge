# 032 - tpm2-getekcertificate (`tpm2_getekcertificate`)

**Scope:** tpm2_getekcertificate(1): Retrieve the Endorsement key Certificate.
**Upstream Manpage:** `man/tpm2_getekcertificate.1.md` in `tpm2-software/tpm2-tools` ([tpm2-tools/man/tpm2_getekcertificate.1.md at master - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getekcertificate.1.md), weight 0.9924).
**Multiplexed Invocation:** `tpm2_getekcertificate [OPTIONS]` or `tpm2 getekcertificate [OPTIONS]` ([tpm2_getekcertificate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getekcertificate.1/), weight 0.9916).

## 1. Command Overview & yubiOS Role

`tpm2_getekcertificate` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-tools/man/tpm2_getekcertificate.1.md at master - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getekcertificate.1.md), weight 0.9924). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2_getekcertificate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getekcertificate.1/), weight 0.9916)

## 2. Name

**tpm2_getekcertificate**(1) - Retrieve the Endorsement key Certificate. ([tpm2-tools/man/tpm2_getekcertificate.1.md at master - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getekcertificate.1.md), weight 0.9924)

## 3. Synopsis

**tpm2_getekcertificate** [*OPTIONS*] [*ARGUMENT*] ([tpm2_getekcertificate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getekcertificate.1/), weight 0.9916)

## 4. Description

**tpm2_getekcertificate**(1) - Retrieve the endorsement key certificate. The
certificate is present either on the TCG specified TPM NV indices OR on the TPM
manufacturer's endorsement certificate hosting server. Following are the
conditions dictating the certificate location lookup.

1. NV-Index:

    Default search location when **ARGUMENT** is not specified.

2. Intel-EK-certificate-server:

    Search location when EK certificate could not be found in the NV index AND
    tpmEPSgenerated bit is CLEAR AND manufacturer is INTC.

3. Intel-EK-Re-certification-server:

    Search location when EK certificate could not be found in the NV index AND
    tpmEPSgenerated bit is SET AND manufacturer is INTC.

    Note:

    In this operation information is provided regarding additional software to
    be run as part of the re-provisioning/ re-certification service.

    After re-provisioning/ recertification process is complete, EK certificates
    can be read from the NV indexes by running another instance of
    **tpm2_getekcertificate**.

4. Generic or other EK-certificate-server:

    Search location when **ARGUMENT** specifies the EK certificate web hosting
    address. ([tpm2-tools/man/tpm2_getekcertificate.1.md at master - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getekcertificate.1.md), weight 0.9924)

## 5. Options

* **-o**, **\--ek-certificate**=_FILE_ or _STDOUT_:

    The file to save the Endorsement key certificate. When EK certificates are
    found in the TPM NV indices, this option can be specified additional times
    to save the RSA and ECC EK certificates in order. The tool will warn if
    additional EK certificates are found on the TPM NV indices and only a single
    output file is specified. If the option isn't specified all the EK
    certificates retrieved either from the manufacturer web hosting or from the
    TPM NV indices, are output to stdout.

  * **-X**, **\--allow-unverified**:

    Specifies to attempt connecting with the TPM manufacturer provisioning
    server without verifying server certificate. This option is irrelevant when
    EK certificates are found on the TPM NV indices.

    **WARNING**: This option should be used only on platforms with older CA
    certificates.

  * **-u**, **\--ek-public**=_FILE_:

    Specifies the file path for the endorsement key public portion in tss
    format.

  * **-x**, **\--offline**:

    This flags the tool to operate in an offline mode. In that the certificates
    can be retrieved for supplied EK public that do not belong to the platform
    the tool is run on. Useful in factory provisioning of multiple platforms
    that are not individually connected to the Internet. In such a scenario a
    single Internet facing provisioning server can utilize this tool in this
    mode. This forces the tool to not look for the EK certificates on the NV
    indices.

  * **--raw**:

    This flags the tool to output the EK certificate as is received from the
    source: NV/ Web-Hosting.

  * **-E**, **\--encoding**=_ENCODING_:

    Specifies the encoding format to use explicitly. Normally, the default
    method is the one used by Intel unless an AMD fTPM is detected, in which
    case the AMD-specific encoding is used. Use 'a' for AMD and 'i' for Intel.      

  * **-t**, **\--x509-trunc**:

    This flags the tool to parse certificates read from TPM NV indices, with a
    X509 parser, and truncate the trailing data before output. Useful when
    dealing with TPMs that output certificates with trailing data padded to a
    fixed length.

  * **ARGUMENT** the command line argument specifies the URL address for the EK
    certificate portal. This forces the tool to not look for the EK certificates
    on the NV indices.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_getekcertificate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getekcertificate.1/), weight 0.9916)

## 6. Notes

When the verbose option is specified, additional curl debugging information is
provided by setting the curl mode verbose, see
<https://curl.haxx.se/libcurl/c/CURLOPT_VERBOSE.html> for more information. ([tpm2-tools/man/tpm2_getekcertificate.1.md at master - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getekcertificate.1.md), weight 0.9924)

## 7. Examples

### Retrieve EK certificate from TPM manufacturer backend by supplying EK public.
```bash
tpm2_createek -G rsa -u ek.pub -c key.ctx

tpm2_getekcertificate -X -o ECcert.bin -u ek.pub \
https://tpm.manufacturer.com/ekcertserver/
```

### Retrieve EK certificate from Intel backend if certificate not found on NV.
```bash
tpm2_createek -G rsa -u ek.pub -c key.ctx

tpm2_getekcertificate -X -o ECcert.bin -u ek.pub
```

### Retrieve EK certificate from Intel backend for an offline platform.
```bash
tpm2_getekcertificate -X -x -o ECcert.bin -u ek.pub
```

### Retrieve EK certificate from TPM NV indices only, fail otherwise.
```bash
tpm2_getekcertificate -o ECcert.bin
```
### Retrieve EK certificate from TPM NV indices for an EK public key, fail otherwise.
```bash
 tpm2_createek -G ecc384 -u ek_ecc384.pub -c ek_ecc384.ctx
 tpm2_getekcertificate -o ek_ecc384.cert -u ek_ecc384.pub
```

### Retrieve multiple EK certificates from TPM NV indices only, fail otherwise.
```bash
tpm2_getekcertificate -o RSA_EK_cert.bin -o ECC_EK_cert.bin
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_getekcertificate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getekcertificate.1/), weight 0.9916)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_getekcertificate(1) - Retrieve the Endorsement key Certificate ...](https://manpages.ubuntu.com/manpages/focal/man1/tpm2_getekcertificate.1.html) | `tpm2_getekcertificate tpm2-tools man page options examples` | **0.9737** | authoritative (kept) |
| 2 | [tpm2_getekcertificate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_getekcertificate.1/) | `tpm2_getekcertificate tpm2-tools man page options examples` | **0.9916** | authoritative (kept) |
| 3 | [tpm2-tools/man/tpm2_getekcertificate.1.md at master - GitHub](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_getekcertificate.1.md) | `tpm2_getekcertificate tpm2-tools man page options examples` | **0.9924** | authoritative (kept) |
