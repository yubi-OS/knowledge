# 070 - tpm2-policynamehash (`tpm2_policynamehash`)

**Scope:** tpm2_policynamehash(1): Couples a policy with names of specific objects.
**Upstream Manpage:** `man/tpm2_policynamehash.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policynamehash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policynamehash.1/), weight 0.9900).
**Multiplexed Invocation:** `tpm2_policynamehash [OPTIONS]` or `tpm2 policynamehash [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policynamehash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynamehash.1.md), weight 0.9868).

## 1. Command Overview & yubiOS Role

`tpm2_policynamehash` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policynamehash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policynamehash.1/), weight 0.9900). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policynamehash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynamehash.1.md), weight 0.9868)

## 2. Name

**tpm2_policynamehash**(1) - Couples a policy with names of specific objects. ([tpm2_policynamehash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policynamehash.1/), weight 0.9900)

## 3. Synopsis

**tpm2_policynamehash** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_policynamehash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynamehash.1.md), weight 0.9868)

## 4. Description

**tpm2_policynamehash**(1) - Couples a policy with names of specific objects.
This is a deferred assertion where the hash of the names of all object handles
in a TPM command is checked against the one specified in the policy. ([tpm2_policynamehash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policynamehash.1/), weight 0.9900)

## 5. Options

* **-L**, **\--policy**=_FILE_:

    File to save the compounded policy digest.

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession**(1).

  * **-n**, **\--name**=_FILE_:

    The file containing the name hash of the referenced objects.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policynamehash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynamehash.1.md), weight 0.9868)

## 6. Examples

Restrict key duplication to specific new parent and specific duplicable key. ([tpm2_policynamehash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policynamehash.1/), weight 0.9900)

## 7. Generate A Duplicable Object

```bash

openssl genrsa -out signing_key_private.pem 2048

openssl rsa -in signing_key_private.pem -out signing_key_public.pem -pubout

tpm2_loadexternal -G rsa -C o -u signing_key_public.pem -c signing_key.ctx \
-n signing_key.name

tpm2_startauthsession -S session.ctx -g sha256

tpm2_policyauthorize -S session.ctx -L authorized.policy -n signing_key.name

tpm2_policycommandcode -S session.ctx -L policy.dat TPM2_CC_Duplicate

tpm2_flushcontext session.ctx

tpm2_createprimary -C o -g sha256 -G rsa -c primary.ctx -Q

### The duplicable key
tpm2_create -Q -C primary.ctx -g sha256 -G rsa -r key.prv -u key.pub \
-L policy.dat -a "sensitivedataorigin|sign|decrypt"

tpm2_load -Q -C primary.ctx -r key.prv -u key.pub -c key.ctx
``` ([tpm2-software/tpm2-tools: man/tpm2_policynamehash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynamehash.1.md), weight 0.9868)

## 8. Create The New Parent

```bash

tpm2_create -Q -C primary.ctx -g sha256 -G rsa -r new_parent.prv \
-u new_parent.pub \
-a "decrypt|fixedparent|fixedtpm|restricted|sensitivedataorigin"

tpm2_loadexternal -Q -C o -u new_parent.pub -c new_parent.ctx
``` ([tpm2_policynamehash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policynamehash.1/), weight 0.9900)

## 9. Modify The Duplicable Key Policy To Namehash Policy To Restrict Parent And Key

```bash
tpm2_readpublic -Q -c new_parent.ctx -n new_parent.name

tpm2_readpublic -Q -c key.ctx -n key.name

cat key.name new_parent.name | openssl dgst -sha256 -binary > name.hash

tpm2_startauthsession -S session.ctx -g sha256

tpm2_policynamehash -L policy.namehash -S session.ctx -n name.hash

tpm2_flushcontext session.ctx

openssl dgst -sha256 -sign signing_key_private.pem \
-out policynamehash.signature policy.namehash

tpm2_startauthsession -S session.ctx -g sha256

tpm2_policyauthorize -S session.ctx -L authorized.policy -i policy.namehash \
-n signing_key.name

tpm2_policycommandcode -S session.ctx -L policy.dat TPM2_CC_Duplicate

tpm2_flushcontext session.ctx
``` ([tpm2-software/tpm2-tools: man/tpm2_policynamehash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynamehash.1.md), weight 0.9868)

## 10. Satisfy The Policy And Attempt Key Duplication

```bash
tpm2_verifysignature -c signing_key.ctx -g sha256 -m policy.namehash \
-s policynamehash.signature -t verification.tkt -f rsassa

tpm2_startauthsession -S session.ctx --policy-session -g sha256

tpm2_policynamehash -S session.ctx -n name.hash

tpm2_policyauthorize -S session.ctx -i policy.namehash -n signing_key.name \
-t verification.tkt

tpm2_policycommandcode -S session.ctx TPM2_CC_Duplicate

tpm2_duplicate -C new_parent.ctx -c key.ctx -G null -p "session:session.ctx" \
-r dupprv.bin -s dupseed.dat

tpm2_flushcontext session.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_policynamehash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policynamehash.1/), weight 0.9900)

## 11. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policynamehash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_policynamehash.1/) | `tpm2_policynamehash tpm2-tools man page options examples` | **0.9900** | authoritative (kept) |
| 2 | [tpm2_policynamehash: Couples a policy with names of specific objects ...](https://www.mankier.com/1/tpm2_policynamehash) | `tpm2_policynamehash tpm2-tools man page options examples` | **0.4952** | low-weight (weak backing) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_policynamehash tpm2-tools man page options examples` | **0.8960** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policynamehash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynamehash.1.md) | `tpm2_policynamehash tpm2-tools man page options examples` | **0.9868** | authoritative (kept) |
