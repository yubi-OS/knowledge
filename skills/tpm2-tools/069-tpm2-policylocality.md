# 069 - tpm2-policylocality (`tpm2_policylocality`)

**Scope:** tpm2_policylocality(1): Restrict TPM object authorization to specific localities.
**Upstream Manpage:** `man/tpm2_policylocality.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policylocality - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policylocality.1/), weight 0.9899).
**Multiplexed Invocation:** `tpm2_policylocality [OPTIONS]` or `tpm2 policylocality [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policylocality.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policylocality.1.md), weight 0.9833).

## 1. Command Overview & yubiOS Role

`tpm2_policylocality` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policylocality - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policylocality.1/), weight 0.9899). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policylocality.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policylocality.1.md), weight 0.9833)

## 2. Name

**tpm2_policylocality**(1) - Restrict TPM object authorization to specific
localities. ([tpm2_policylocality - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policylocality.1/), weight 0.9899)

## 3. Synopsis

**tpm2_policylocality** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_policylocality.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policylocality.1.md), weight 0.9833)

## 4. Description

**tpm2_policylocality**(1) - Restricts TPM object authorization to specific
TPM locality. Useful when you want to allow only specific locality
with the TPM object. A locality indicates the source of the command,
for example it could be from the application layer or the driver layer, each
would have it's own locality integer. Localities are hints to the TPM and are
enforced by the software communicating to the TPM. Thus they are
**not trusted** inputs on their own and are implemented in platform specific
ways.

As an argument it takes the _LOCALITY_ as an integer or friendly name.

Localities are fixed to a byte in size and have two representations, locality
and extended locality.

Localities 0 through 4 are the normal locality representation and are represented
as set bit indexes. Thus locality 0 is indicated by `1<<0` and locality 4 is
indicated by `1<<4`. Rather then using raw numbers, these localities can also
be specified by the friendly names of:
 - zero: locality 0 or `1<<0`
 - one: locality 1 or `1<<1`
 - two: locality 2 or `1<<2`
 - three: locality 3 or `1<<3`
 - four: locality 4 or `1<<4`

Anything from the range 32 - 255 are extended localities. ([tpm2_policylocality - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policylocality.1/), weight 0.9899)

## 5. Options

* **-S**, **\--session**=_FILE_:

    A session file from **tpm2_startauthsession**(1)'s **-S** option.

  * **-L**, **\--policy**=_FILE_:

    File to save the policy digest.

  * **ARGUMENT** the command line argument specifies the locality number.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policylocality.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policylocality.1.md), weight 0.9833)

## 6. Examples

Start a *policy* session and extend it with a specific locality number (like 3).
Attempts to perform other operations would fail.

### Create an policy restricted by locality 3
```bash
tpm2_startauthsession -S session.dat

tpm2_policylocality -S session.dat -L policy.dat three

tpm2_flushcontext session.dat
```

### Create the object with auth policy
```bash
tpm2_createprimary -C o -c prim.ctx

tpm2_create -C prim.ctx -u sealkey.pub -r sealkey.priv -L policy.dat \
-i- <<< "SEALED-SECRET"
```

### Try unseal operation
```bash
tpm2_load -C prim.ctx -u sealkey.pub -r sealkey.priv -n sealkey.name \
-c sealkey.ctx

tpm2_startauthsession \--policy-session -S session.dat

tpm2_policylocality -S session.dat -L policy.dat three ([tpm2_policylocality - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policylocality.1/), weight 0.9899)

## 7. Change To Locality 3, Note: This Operation Varies On Different Platforms

tpm2_unseal -p session:session.dat -c sealkey.ctx

tpm2_flushcontext session.dat
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_policylocality.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policylocality.1.md), weight 0.9833)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policylocality: Restrict TPM object authorization to specific ...](https://www.mankier.com/1/tpm2_policylocality) | `tpm2_policylocality tpm2-tools man page options examples` | **0.4968** | low-weight (weak backing) |
| 2 | [tpm2_policylocality - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policylocality.1/) | `tpm2_policylocality tpm2-tools man page options examples` | **0.9899** | authoritative (kept) |
| 3 | [tpm2_policylocality (1)  -  tpm2.0-tools](https://manpages.opensuse.org/Leap-15.6/tpm2.0-tools/tpm2_policylocality.1.en.html) | `tpm2_policylocality tpm2-tools man page options examples` | **0.9221** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policylocality.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policylocality.1.md) | `tpm2_policylocality tpm2-tools man page options examples` | **0.9833** | authoritative (kept) |
