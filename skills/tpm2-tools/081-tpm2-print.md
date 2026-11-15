# 081 - tpm2-print (`tpm2_print`)

**Scope:** tpm2_print(1): Prints TPM data structures
**Upstream Manpage:** `man/tpm2_print.1.md` in `tpm2-software/tpm2-tools` ([tpm2_print - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_print.1/), weight 0.9915).
**Multiplexed Invocation:** `tpm2_print [OPTIONS]` or `tpm2 print [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_print.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_print.1.md), weight 0.9909).

## 1. Command Overview & yubiOS Role

`tpm2_print` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_print - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_print.1/), weight 0.9915). In yubiOS CI (`ci_test-vm.yml`, `ci_test-vgpu-vm.yml`) and bare-metal provisioning, this command runs against `/dev/tpmrm0` (hardware TPM 2.0, ARM64 OP-TEE `tpm_ftpm_tee`, or QEMU `swtpm`) using the `device:/dev/tpmrm0` or `swtpm` TCTI. ([tpm2-software/tpm2-tools: man/tpm2_print.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_print.1.md), weight 0.9909)

## 2. Name

**tpm2_print**(1) - Prints TPM data structures ([tpm2_print - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_print.1/), weight 0.9915)

## 3. Synopsis

**tpm2_print** [*OPTIONS*] [*ARGUMENT* or *STDIN*] ([tpm2-software/tpm2-tools: man/tpm2_print.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_print.1.md), weight 0.9909)

## 4. Description

**tpm2_print**(1) - Decodes a TPM data structure and prints enclosed elements
to stdout as YAML. A file path containing a TPM object or a TSS2 Private Key
in the PEM format may be specified as the path argument. Reads from stdin if
unspecified. ([tpm2_print - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_print.1/), weight 0.9915)

## 5. Options

* **-t**, **\--type**:

    Required. Type of data structure. The option supports the following arguments:
      * **TPMS_ATTEST**
      * **TPMS_CONTEXT**
      * **TPM2B_PUBLIC**
      * **TPMT_PUBLIC**
      * **TSSPRIVKEY_OBJ**
      * **ESYS_TR**
  * **ARGUMENT** the command line argument specifies the path of the TPM data.

**pubkey options** (`man/common/pubkey.md`): * **-f**, **\--format**: Format selection for the public key output file. 'tss' (the default) will output a binary blob according to the TPM 2.0 Specification. 'pem' will output an OpenSSL compatible PEM encoded public key. 'der' will output an OpenSSL compatible DER encoded public key. 'tpmt' will output a binary blob of the TPMT_PUBLIC struct referenced by TPM 2.0 specs.

    Public key format. This only works if option `--type/-t` is set to
    TPM2B_PUBLIC or TPMT_PUBLIC.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_print.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_print.1.md), weight 0.9909)

## 6. Examples

### Print a TPM Quote

### Setup a key to generate a quote from
```bash
tpm2_createprimary -C e -c primary.ctx
tpm2_create -C primary.ctx -u key.pub -r key.priv
tpm2_load -C primary.ctx -u key.pub -r key.priv -c key.ctx
tpm2_quote -c key.ctx -l 0x0004:16,17,18+0x000b:16,17,18 -g sha256 -m msg.dat
```

### Print a Quote

```bash
tpm2_print -t TPMS_ATTEST msg.dat
```

### Print a public file

```bash
tpm2_print -t TPM2B_PUBLIC key.pub
```

### Print a tpmt public file
```bash
tpm2_readpublic -c key.ctx -f tpmt -o key.tpmt
tpm2_print -t TPMT_PUBLIC key.tpmt
```

### Print a TPM2B_PUBLIC file and convert to PEM format

```bash
tpm2 print -t TPM2B_PUBLIC -f pem key.pub
```

### Print public portion of TSSPRIVKEY PEM file and convert to PEM format

```bash
tpm2 print -t TSSPRIVKEY_OBJ tssprivkey.pem
tpm2 print -t TSSPRIVKEY_OBJ tssprivkey.pem -f pem > publickey.pem
```

### Print the name of a serialized ESYS\_TR handle.

Serialized ESYS\_TR handles are returned from tools like `tpm2_evictcontrol`'s
`-o` and `tpm2_readpublic`'s `-t` options.

```bash
tpm2_createprimary -c primary.ctx
tpm2_evictcontrol -c primary.ctx -o primary.tr
tpm2 print -t ESYS_TR primary.tr
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_print - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_print.1/), weight 0.9915)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_print - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_print.1/) | `tpm2_print tpm2-tools man page options examples` | **0.9899** | authoritative (kept) |
| 2 | [tpm2_print: Prints TPM data structures / Man Page / Commands - ManKier](https://www.mankier.com/1/tpm2_print) | `tpm2_print tpm2-tools man page options examples` | **0.2886** | low-weight (weak backing) |
| 3 | [tpm2_print - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_print.1/) | `tpm2_print tpm2-tools man page options examples` | **0.9915** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_print.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_print.1.md) | `tpm2_print tpm2-tools man page options examples` | **0.9909** | authoritative (kept) |
