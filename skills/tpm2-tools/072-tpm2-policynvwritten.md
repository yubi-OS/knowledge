# 072 - tpm2-policynvwritten (`tpm2_policynvwritten`)

**Scope:** tpm2_policynvwritten(1): Restrict TPM object authorization to the written state of an NV index.
**Upstream Manpage:** `man/tpm2_policynvwritten.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_policynvwritten.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynvwritten.1.md), weight 0.9860).
**Multiplexed Invocation:** `tpm2_policynvwritten [OPTIONS]` or `tpm2 policynvwritten [OPTIONS]` ([tpm2_policynvwritten - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policynvwritten.1/), weight 0.9853).

## 1. Command Overview & yubiOS Role

`tpm2_policynvwritten` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_policynvwritten.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynvwritten.1.md), weight 0.9860). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2_policynvwritten - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policynvwritten.1/), weight 0.9853)

## 2. Name

**tpm2_policynvwritten**(1) - Restrict TPM object authorization to the written
state of an NV index. ([tpm2-software/tpm2-tools: man/tpm2_policynvwritten.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynvwritten.1.md), weight 0.9860)

## 3. Synopsis

**tpm2_policynvwritten** [*OPTIONS*] [*ARGUMENT*] ([tpm2_policynvwritten - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policynvwritten.1/), weight 0.9853)

## 4. Description

**tpm2_policynvwritten**(1) - Restricts TPM object authorization to the written
state of an NV index. Useful when creating write once NV indexes.

As an [*ARGUMENT*] it takes the expected written state of the NV index. It can
be specified as s|c|0|1. ([tpm2-software/tpm2-tools: man/tpm2_policynvwritten.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynvwritten.1.md), weight 0.9860)

## 5. Options

* **-S**, **\--session**=_FILE_:

    A session file from **tpm2_startauthsession**(1)'s **-S** option.

  * **-L**, **\--policy**=_FILE_:

    File to save the policy digest.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_policynvwritten - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policynvwritten.1/), weight 0.9853)

## 6. Examples

Create a write once NV index. To do this the NV index is defined with a write
policy that is valid only if the NV index attribute "TPMA_NV_WRITTEN" was never
set.

### Define the NV index write policy
```bash
tpm2_startauthsession -S session.dat
tpm2_policycommandcode -S session.dat TPM2_CC_NV_Write
tpm2_policynvwritten -S session.dat -L nvwrite.policy c
tpm2_flushcontext session.dat
```

### Define the NV index with the policy
```bash
 tpm2_nvdefine -s 1 -a "authread|policywrite" -p nvrdpass -L nvwrite.policy
```

### Write the NV index by satisfying the policy
```bash
tpm2_startauthsession -S session.dat --policy-session
tpm2_policycommandcode -S session.dat TPM2_CC_NV_Write
tpm2_policynvwritten -S session.dat c
echo 0xAA | xxd -r -p | tpm2_nvwrite 0x01000000 -i- -P session:session.dat
tpm2_flushcontext session.dat
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_policynvwritten.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynvwritten.1.md), weight 0.9860)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policynvwritten - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policynvwritten.1/) | `tpm2_policynvwritten tpm2-tools man page options examples` | **0.9853** | authoritative (kept) |
| 2 | [tpm2_policynvwritten: Restrict TPM object authorization to ... - ManKier](https://www.mankier.com/1/tpm2_policynvwritten) | `tpm2_policynvwritten tpm2-tools man page options examples` | **0.2916** | low-weight (weak backing) |
| 3 | [tpm2_policynvwritten (1)  -  tpm2.0-tools](https://manpages.opensuse.org/Leap-15.6/tpm2.0-tools/tpm2_policynvwritten.1.en.html) | `tpm2_policynvwritten tpm2-tools man page options examples` | **0.9503** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policynvwritten.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynvwritten.1.md) | `tpm2_policynvwritten tpm2-tools man page options examples` | **0.9860** | authoritative (kept) |
