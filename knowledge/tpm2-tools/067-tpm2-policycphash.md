# 067 - tpm2-policycphash (`tpm2_policycphash`)

**Scope:** tpm2_policycphash(1): Couples a policy with command parameters of the command.
**Upstream Manpage:** `man/tpm2_policycphash.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policycphash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycphash.1/), weight 0.9908).
**Multiplexed Invocation:** `tpm2_policycphash [OPTIONS]` or `tpm2 policycphash [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policycphash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policycphash.1.md), weight 0.9816).

## 1. Command Overview & yubiOS Role

`tpm2_policycphash` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policycphash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycphash.1/), weight 0.9908). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policycphash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policycphash.1.md), weight 0.9816)

## 2. Name

**tpm2_policycphash**(1) - Couples a policy with command parameters of the
command. ([tpm2_policycphash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycphash.1/), weight 0.9908)

## 3. Synopsis

**tpm2_policycphash** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_policycphash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policycphash.1.md), weight 0.9816)

## 4. Description

**tpm2_policycphash**(1) - Couples a policy with command parameters of the
command. This is a deferred assertion where the hash of the command parameters
in a TPM command is checked against the one specified in the policy. ([tpm2_policycphash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycphash.1/), weight 0.9908)

## 5. Options

* **-L**, **\--policy**=_FILE_:

    File to save the compounded policy digest.

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession**(1).

  * **\--cphash-input**=_FILE_:

    The file containing the command parameter hash of the command.

  * **\--cphash**=_FILE_:

    **DEPRECATED**, use **--cphash-input** instead.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policycphash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policycphash.1.md), weight 0.9816)

## 6. Examples

Restrict the value that can be set through tpm2_nvsetbits.

### Define NV index object with authorized policy
```bash
openssl genrsa -out signing_key_private.pem 2048
openssl rsa -in signing_key_private.pem -out signing_key_public.pem -pubout
tpm2_loadexternal -G rsa -C o -u signing_key_public.pem -c signing_key.ctx \
-n signing_key.name
tpm2_startauthsession -S session.ctx -g sha256
tpm2_policyauthorize -S session.ctx -L authorized.policy -n signing_key.name
tpm2_flushcontext session.ctx
tpm2_nvdefine 1 -a "policywrite|authwrite|ownerread|nt=bits" -L authorized.policy
```

### Create policycphash
```bash
tpm2_nvsetbits 1 -i 1 --cphash cp.hash
tpm2_startauthsession -S session.ctx -g sha256
tpm2_policycphash -S session.ctx -L policy.cphash --cphash cp.hash
tpm2_flushcontext session.ctx
```

### Sign and verify policycphash
```bash
openssl dgst -sha256 -sign signing_key_private.pem \
-out policycphash.signature policy.cphash
tpm2_verifysignature -c signing_key.ctx -g sha256 -m policy.cphash \
-s policycphash.signature -t verification.tkt -f rsassa
```

### Satisfy policycphash and execute nvsetbits
```bash
tpm2_startauthsession -S session.ctx --policy-session -g sha256
tpm2_policycphash -S session.ctx --cphash cp.hash
tpm2_policyauthorize -S session.ctx -i policy.cphash -n signing_key.name \
-t verification.tkt
tpm2_nvsetbits 1 -i 1 -P "session:session.ctx"
tpm2_flushcontext session.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_policycphash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycphash.1/), weight 0.9908)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policycphash - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycphash.1/) | `tpm2_policycphash tpm2-tools man page options examples` | **0.9908** | authoritative (kept) |
| 2 | [tpm2_policycphash: Couples a policy with command parameters ... - ManKier](https://www.mankier.com/1/tpm2_policycphash) | `tpm2_policycphash tpm2-tools man page options examples` | **0.3614** | low-weight (weak backing) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_policycphash tpm2-tools man page options examples` | **0.9309** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policycphash.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policycphash.1.md) | `tpm2_policycphash tpm2-tools man page options examples` | **0.9816** | authoritative (kept) |
