# 080 - tpm2-policyticket (`tpm2_policyticket`)

**Scope:** tpm2_policyticket(1): Enables policy authorization by verifying a ticket that represents a validated authorization that had an expiration time associated with it.
**Upstream Manpage:** `man/tpm2_policyticket.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policyticket - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyticket.1/), weight 0.9902).
**Multiplexed Invocation:** `tpm2_policyticket [OPTIONS]` or `tpm2 policyticket [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policyticket.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyticket.1.md), weight 0.9875).

## 1. Command Overview & yubiOS Role

`tpm2_policyticket` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policyticket - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyticket.1/), weight 0.9902). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policyticket.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyticket.1.md), weight 0.9875)

## 2. Name

**tpm2_ticket**(1) - Enables policy authorization by verifying a ticket that
represents a validated authorization that had an expiration time associated
with it. ([tpm2_policyticket - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyticket.1/), weight 0.9902)

## 3. Synopsis

**tpm2_ticket** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_policyticket.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyticket.1.md), weight 0.9875)

## 4. Description

**tpm2_ticket**(1) - Enables policy authorization by verifying a ticket that
represents a validated authorization that had an expiration time associated with
it. ([tpm2_policyticket - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyticket.1/), weight 0.9902)

## 5. Options

* **-L**, **\--policy**=_FILE_:

    File to save the compounded policy digest.

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession**(1).

  * **-n**, **\--name**=_FILE_:

    Name of the object that validated the authorization.

  * **\--ticket**=_FILE_:

    The ticket file to record the authorization ticket structure.

  * **\--timeout**=_FILE_:

    The file path to record the timeout structure returned.

  * **-q**, **\--qualification**=_FILE\_OR\_HEX\_STR_:

    Optional, the policy qualifier data that the signer can choose to include in the
    signature. Can be either a hex string or path.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policyticket.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyticket.1.md), weight 0.9875)

## 6. Examples

Authorize a TPM operation on an object whose authorization is bound to specific
signing authority.

### Create the signing authority and load the verification key
```bash
openssl genrsa -out private.pem 2048

openssl rsa -in private.pem -outform PEM -pubout -out public.pem

tpm2_loadexternal -C o -G rsa -u public.pem -c signing_key.ctx \
-n signing_key.name
```

### Generate signature with the expiry time
```bash
EXPIRYTIME="FFFFFE0C"

echo $EXPIRYTIME | xxd -r -p | \
openssl dgst -sha256 -sign private.pem -out signature.dat
```

### Create the policy
```bash
tpm2_startauthsession -S session.ctx

tpm2_policysigned -S session.ctx -g sha256 -s signature.dat -f rsassa \
-c signing_key.ctx -L policy.signed

tpm2_flushcontext session.ctx
```

### Create a sealing object
```bash
tpm2_createprimary -C o -c prim.ctx -Q

echo "plaintext" > secret.dat

tpm2_create -u sealing_key.pub -r sealing_key.priv -c sealing_key.ctx \
-C prim.ctx -i secret.dat -L policy.signed -Q
```

### Create ticket-able policy
```bash
tpm2_startauthsession -S session.ctx --nonce-tpm=nonce.test --policy-session

{ cat nonce.test & echo $EXPIRYTIME | xxd -r -p; } | \
openssl dgst -sha256 -sign private.pem -out signature.dat

tpm2_policysigned -S session.ctx -g sha256 -s signature.dat -f rsassa \
-c signing_key.ctx -x nonce.test --ticket tic.ket --timeout time.out \
-t 0xFFFFFE0C

tpm2_flushcontext session.ctx
```

##Test with policyticket instead of policysigned
```bash
tpm2_startauthsession -S session.ctx --policy-session

tpm2_policyticket -S session.ctx -n signing_key.name --ticket tic.ket \
--timeout time.out

tpm2_unseal -p session:session.ctx -c sealing_key.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_policyticket - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyticket.1/), weight 0.9902)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policyticket / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2_policyticket) | `tpm2_policyticket tpm2-tools man page options examples` | **0.4222** | low-weight (weak backing) |
| 2 | [tpm2_policyticket (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2_policyticket.1.en.html) | `tpm2_policyticket tpm2-tools man page options examples` | **0.9406** | authoritative (kept) |
| 3 | [tpm2_policyticket - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policyticket.1/) | `tpm2_policyticket tpm2-tools man page options examples` | **0.9902** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policyticket.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policyticket.1.md) | `tpm2_policyticket tpm2-tools man page options examples` | **0.9875** | authoritative (kept) |
