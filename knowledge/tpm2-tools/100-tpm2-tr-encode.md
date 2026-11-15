# 100 - tpm2-tr-encode (`tpm2_tr_encode`)

**Scope:** tpm2_tr_encode(1): Encodes a peristent handle and `TPM2B_NAME` as a serialized `ESYS_TR` as output.
**Upstream Manpage:** `man/tpm2_tr_encode.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_tr_encode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_tr_encode.1.md), weight 0.9902).
**Multiplexed Invocation:** `tpm2_tr_encode [OPTIONS]` or `tpm2 tr_encode [OPTIONS]` ([COMMON OPTIONS - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/common/options/), weight 0.9707).

## 1. Command Overview & yubiOS Role

`tpm2_tr_encode` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_tr_encode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_tr_encode.1.md), weight 0.9902). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([COMMON OPTIONS - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/common/options/), weight 0.9707)

## 2. Name

**tpm2_tr_encode**(1) - Encodes a peristent handle and `TPM2B_NAME` as a serialized `ESYS_TR` as
output. ([tpm2-software/tpm2-tools: man/tpm2_tr_encode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_tr_encode.1.md), weight 0.9902)

## 3. Synopsis

**tpm2_tr_encode** [*OPTIONS*] ([COMMON OPTIONS - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/common/options/), weight 0.9707)

## 4. Description

**tpm2_tr_encode**(1) - Encodes a peristent TPM2 handle along with a populated `TPM2B_PUBLIC` as
a serialized `ESYS_TR`. This is useful for moving a public and handle from one environment
where a TPM is not available to another environment with a TPM and make use of it through the
ESAPI API or tpm2-tools(1). ([tpm2-software/tpm2-tools: man/tpm2_tr_encode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_tr_encode.1.md), weight 0.9902)

## 5. Options

* **-c**, **\--object-context**=_OBJECT_:

    Persistent handle.

**pubkey options** (`man/common/pubkey.md`): * **-f**, **\--format**: Format selection for the public key output file. 'tss' (the default) will output a binary blob according to the TPM 2.0 Specification. 'pem' will output an OpenSSL compatible PEM encoded public key. 'der' will output an OpenSSL compatible DER encoded public key. 'tpmt' will output a binary blob of the TPMT_PUBLIC struct referenced by TPM 2.0 specs.

    Public key format.

  * **-o**, **\--output**=_FILE_:

    The output file path, recording the serialized `ESYS_TR`.


### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([COMMON OPTIONS - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/common/options/), weight 0.9707)

## 6. Examples

### Serialize a public and handle as an ESYS_TR

```bash
tpm2_createprimary -c primary.ctx
tpm2_evictcontrol -c primary.ctx -o primary.tr 0x81000002
tpm2_readpublic -c primary.tr -o primary.pub
tpm2_tr_encode -c 0x81000002 -u primary.pub -o primary2.tr
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_tr_encode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_tr_encode.1.md), weight 0.9902)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_tr_encode tpm2-tools man page options examples` | **0.8142** | authoritative (kept) |
| 2 | [COMMON OPTIONS - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/common/options/) | `tpm2_tr_encode tpm2-tools man page options examples` | **0.9707** | authoritative (kept) |
| 3 | [tpm2_tr_encode (1)  -  tpm2.0-tools](https://manpages.opensuse.org/Tumbleweed/tpm2.0-tools/tpm2_tr_encode.1.en.html) | `tpm2_tr_encode tpm2-tools man page options examples` | **0.8963** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_tr_encode.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_tr_encode.1.md) | `tpm2_tr_encode tpm2-tools man page options examples` | **0.9902** | authoritative (kept) |
