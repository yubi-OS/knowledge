# 062 - tpm2-policyauthorize (`tpm2_policyauthorize`)

**Scope:** tpm2_policyauthorize(1): Allows for mutable policies by tethering to a signing authority.
**Upstream Manpage:** `man/tpm2_policyauthorize.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policyauthorize - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorize.1/), weight 0.9885).
**Multiplexed Invocation:** `tpm2_policyauthorize [OPTIONS]` or `tpm2 policyauthorize [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policyauthorize.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthorize.1.md), weight 0.9840).

## 1. Command Overview & yubiOS Role

`tpm2_policyauthorize` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policyauthorize - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorize.1/), weight 0.9885). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policyauthorize.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthorize.1.md), weight 0.9840)

## 2. Name

**tpm2_policyauthorize**(1) - Allows for mutable policies by tethering to a
signing authority. ([tpm2_policyauthorize - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorize.1/), weight 0.9885)

## 3. Synopsis

**tpm2_policyauthorize** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_policyauthorize.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthorize.1.md), weight 0.9840)

## 4. Description

**tpm2_policyauthorize**(1) - This command allows for policies to change by associating
the policy to a signing authority and allowing the policy contents to change.

1. If the input session is a trial session this tool generates a policy digest
that associates a signing authority's public key name with the policy being
authorized.

2. If the input session is real policy session **tpm2_policyauthorize**(1) looks
for a verification ticket from the TPM to attest that the TPM has verified
the signature on the policy digest before authorizing the policy
in the policy digest. ([tpm2_policyauthorize - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorize.1/), weight 0.9885)

## 5. Options

* **-L**, **\--policy**=_FILE_:

    File to save the policy digest.

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession**(1).

  * **-i**, **\--input**=_FILE_:

    The policy digest that has to be authorized.

  * **-q**, **\--qualification**=_FILE\_OR\_HEX_:

    The policy qualifier data signed in conjunction with the input policy digest.
    This is unique data that the signer can choose to include in the signature
    and can either be a path or hex string.

  * **-n**, **\--name**=_FILE_:

    File containing the name of the verifying public key. This ties the final
    policy digest with a signer. This can be retrieved with
    **tpm2_readpublic**(1)

  * **-t**, **\--ticket**=_FILE_:

    The ticket file to record the validation structure. This is generated with
    **tpm2_verifysignature**(1).

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policyauthorize.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthorize.1.md), weight 0.9840)

## 6. Examples

Starts a *trial* session, builds a PCR policy. This PCR policy digest is then
an input to the **tpm2_policyauthorize**(1) along with policy qualifier data and
a signer public. The resultant policy digest is then used in creation of objects.

Subsequently when the PCR change and so does the PCR policy digest, the actual
policy digest from the **tpm2_policyauthorize**(1) used in creation of the object
will not change. At runtime the new PCR policy needs to be satisfied along with
verification of the signature on the PCR policy digest using **tpm2_policyauthorize**(1)

### Create a signing authority
```bash
openssl genrsa -out signing_key_private.pem 2048

openssl rsa -in signing_key_private.pem -out signing_key_public.pem -pubout

tpm2_loadexternal -G rsa -C o -u signing_key_public.pem -c signing_key.ctx -n signing_key.name
```

### Create the authorize policy digest
```bash
tpm2_startauthsession -S session.ctx

tpm2_policyauthorize -S session.ctx -L authorized.policy -n signing_key.name

tpm2_flushcontext session.ctx
```

### Create a policy to be authorized like a PCR policy
```bash
tpm2_pcrread -opcr0.sha256 sha256:0

tpm2_startauthsession -S session.ctx

tpm2_policypcr -S session.ctx -l sha256:0 -f pcr0.sha256 -L pcr.policy_desired

tpm2_flushcontext session.ctx
```

### Sign the policy
```bash
openssl dgst -sha256 -sign signing_key_private.pem -out pcr.signature pcr.policy_desired
```

### Create a TPM object like a sealing object with the authorized policy based authentication
```bash
tpm2_createprimary -C o -g sha256 -G rsa -c prim.ctx

tpm2_create -g sha256 -u sealing_pubkey.pub -r sealing_prikey.pub -i- -C prim.ctx -L authorized.policy <<< "secret to seal"
```

### Verify the desired policy digest comes from the signing authority, read the actual value of PCR and check that read policy and desired policy are equal. 
```bash
tpm2_verifysignature -c signing_key.ctx -g sha256 -m  pcr.policy_desired -s pcr.signature -t verification.tkt -f rsassa

tpm2_startauthsession \--policy-session -S session.ctx

tpm2_policypcr -S session.ctx -l sha256:0 -L pcr.policy_read

tpm2_policyauthorize -S session.ctx -L authorized.policy -i pcr.policy_desired -n signing_key.name -t verification.tkt

tpm2_load -C prim.ctx -u sealing_pubkey.pub -r sealing_prikey.pub -c sealing_key.ctx

unsealed=$(tpm2_unseal -p"session:session.ctx" -c sealing_key.ctx)

echo $unsealed

tpm2_flushcontext session.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_policyauthorize - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorize.1/), weight 0.9885)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_policyauthorize tpm2-tools man page options examples` | **0.8011** | authoritative (kept) |
| 2 | [tpm2_policyauthorize - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyauthorize.1/) | `tpm2_policyauthorize tpm2-tools man page options examples` | **0.9885** | authoritative (kept) |
| 3 | [tpm2_policyauthorize: Allows for mutable policies by tethering to a ...](https://www.mankier.com/1/tpm2_policyauthorize) | `tpm2_policyauthorize tpm2-tools man page options examples` | **0.4931** | low-weight (weak backing) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policyauthorize.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyauthorize.1.md) | `tpm2_policyauthorize tpm2-tools man page options examples` | **0.9840** | authoritative (kept) |
