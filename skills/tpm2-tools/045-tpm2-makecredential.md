# 045 - tpm2-makecredential (`tpm2_makecredential`)

**Scope:** tpm2_makecredential(1): Generate the encrypted-user-chosen-data and the wrapped-secret-data-encryption-key for the privacy-sensitive credentialing process of a TPM object.
**Upstream Manpage:** `man/tpm2_makecredential.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_makecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_makecredential.1.md), weight 0.9912).
**Multiplexed Invocation:** `tpm2_makecredential [OPTIONS]` or `tpm2 makecredential [OPTIONS]` ([tpm2_makecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_makecredential.1/), weight 0.9910).

## 1. Command Overview & yubiOS Role

`tpm2_makecredential` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_makecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_makecredential.1.md), weight 0.9912). In yubiOS runtime attestation (`runtime-attestation-keylime` and `audit-evidence-packaging`), Endorsement Keys (EK), Attestation Keys (AK), and TPM2 quotes provide hardware-rooted platform integrity proofs over `/dev/tpmrm0` alongside YubiKey FIDO2/PIV user identity. ([tpm2_makecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_makecredential.1/), weight 0.9910)

## 2. Name

**tpm2_makecredential**(1) - Generate the encrypted-user-chosen-data and the
wrapped-secret-data-encryption-key for the privacy-sensitive credentialing
process of a TPM object. ([tpm2-software/tpm2-tools: man/tpm2_makecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_makecredential.1.md), weight 0.9912)

## 3. Synopsis

**tpm2_makecredential** [*OPTIONS*] ([tpm2_makecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_makecredential.1/), weight 0.9910)

## 4. Description

**tpm2_makecredential**(1) - The TPM supports a privacy preserving protocol for
distributing credentials for keys on a TPM. The process guarantees that the
credentialed-TPM-object(AIK) is loaded on the same TPM as a well-known
public-key-object(EK) without knowledge of the specific public properties of the
credentialed-TPM-object(AIK). The privacy is guaranteed due to the fact that
only the name of the credentialed-TPM-object(AIK) is shared and not the
credentialed-TPM-object's public key itself.

Make-credential is the first step in this process where in after receiving the
public-key-object(EK) public key of the TPM and the name of the
credentialed-TPM-object(AIK), an encrypted-user-chosen-data is generated and the
secret-data-encryption-key is generated and wrapped using cryptographic
processes specific to credential activation that guarantees that the
credentialed-TPM-object(AIK) is loaded on the TPM with the well-known
public-key-object(EK).

**tpm2_makecredential** can be used to generate the encrypted-user-chosen-data
and the wrapped secret-data-encryption-key without a TPM by using the **none**
TCTI option. ([tpm2-software/tpm2-tools: man/tpm2_makecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_makecredential.1.md), weight 0.9912)

## 5. Options

* **-e**, **\--encryption-key**=_FILE_:

    **DEPRECATED**, use **-u** or **--public** instead.

  * **-u**, **\--public**=_FILE_:

    A TPM public key which was used to wrap the seed.
    NOTE: This option is same as **-e** and is added to make it similar with
    other tools specifying the public key. The old option is retained for
    backwards compatibility.

  * **-G**, **\--key-algorithm**=_ALGORITHM_:

    The key algorithm associated with TPM public key. Specify either RSA/ ECC.
    When this option is used, input public key is expected to be in PEM format
    and the default TCG EK template is used for the key properties.

  * **-s**, **\--secret**=_FILE_ or _STDIN_:

    The secret which will be protected by the key derived from the random seed. It can be specified as a file or passed from stdin.

  * **-n**, **\--name**=_FILE\_OR\_HEX_:

    The name of the key for which certificate is to be created. Can either be
    a path or hex string.

  * **-o**, **\--credential-blob**=_FILE_:

    The output file path, recording the encrypted-user-chosen-data and the
    wrapped secret-data-encryption-key.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the 

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h ([tpm2_makecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_makecredential.1/), weight 0.9910)

## 6. Examples

```bash
tpm2 createek -Q -c 0x81010009 -G rsa -u ek.pub

tpm2 createak -C 0x81010009 -c ak.ctx -G rsa -g sha256 -s rsassa -u ak.pub \
-n ak.name -p akpass> ak.out

file_size=`ls -l ak.name | awk {'print $5'}`
loaded_key_name=`cat ak.name | xxd -p -c $file_size`

tpm2 readpublic -c 0x81010009 -o ek.pem -f pem -Q

echo "12345678" | tpm2 makecredential -Q -u ek.pem -s - -n $loaded_key_name \
-o mkcred.out -G rsa
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_makecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_makecredential.1.md), weight 0.9912)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_makecredential tpm2-tools man page options examples` | **0.8351** | authoritative (kept) |
| 2 | [tpm2_makecredential - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_makecredential.1/) | `tpm2_makecredential tpm2-tools man page options examples` | **0.9910** | authoritative (kept) |
| 3 | [tpm2_makecredential / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2_makecredential) | `tpm2_makecredential tpm2-tools man page options examples` | **0.3581** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_makecredential.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_makecredential.1.md) | `tpm2_makecredential tpm2-tools man page options examples` | **0.9912** | authoritative (kept) |
