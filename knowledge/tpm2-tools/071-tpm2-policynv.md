# 071 - tpm2-policynv (`tpm2_policynv`)

**Scope:** tpm2_policynv(1): Evaluates policy authorization by comparing a specified value against the contents in the specified NV Index.
**Upstream Manpage:** `man/tpm2_policynv.1.md` in `tpm2-software/tpm2-tools` ([tpm2-software/tpm2-tools: man/tpm2_policynv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynv.1.md), weight 0.9871).
**Multiplexed Invocation:** `tpm2_policynv [OPTIONS]` or `tpm2 policynv [OPTIONS]` ([tpm2_policynv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policynv.1/), weight 0.9832).

## 1. Command Overview & yubiOS Role

`tpm2_policynv` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2-software/tpm2-tools: man/tpm2_policynv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynv.1.md), weight 0.9871). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2_policynv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policynv.1/), weight 0.9832)

## 2. Name

**tpm2_policynv**(1) - Evaluates policy authorization by comparing a specified
value against the contents in the specified NV Index. ([tpm2-software/tpm2-tools: man/tpm2_policynv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynv.1.md), weight 0.9871)

## 3. Synopsis

**tpm2_policynv** [*OPTIONS*] [*ARGUMENT*] [*ARGUMENT*] ([tpm2_policynv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policynv.1/), weight 0.9832)

## 4. Description

**tpm2_policynv**(1) - This command evaluates policy authorization by comparing
the contents written to an NV index against the one specified in the tool
options. The tool takes two arguments - (1) The NV index specified as raw handle
or an offset value to the nv handle range "TPM2_HR_NV_INDEX" and (2) Comparison
operator for magnitude comparison and or bit test operations. In the
specification the NV index holding the data is called operandA and the data that
the user specifies to compare is called operandB. The comparison operator can be
specified as follows:
* "eq"  if operandA           =   operandB
* "neq" if operandA           !=  operandB
* "sgt" if signed operandA    >   signed operandB
* "ugt" if unsigned operandA  >   unsigned operandB
* "slt" if signed operandA    <   signed operandB
* "ult" if unsigned operandA  <   unsigned operandB
* "sge" if signed operandA    >=  signed operandB
* "uge" if unsigned operandA  >=  unsigned operandB
* "sle" if signed operandA    <=  unsigned operandB
* "ule" if unsigned operandA  <=  unsigned operandB
* "bs"  if all bits set in operandA are set in operandB
* "bc"  if all bits set in operandA are clear in operandB ([tpm2-software/tpm2-tools: man/tpm2_policynv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynv.1.md), weight 0.9871)

## 5. Options

* **-C**, **\--hierarchy**=_OBJECT_:

    Specifies the hierarchy used to authorize.
    Supported options are:
      * **o** for **TPM_RH_OWNER**
      * **p** for **TPM_RH_PLATFORM**
      * **`<num>`** where a hierarchy handle or nv-index may be used.

    When **-C** isn't explicitly passed the index handle will be used to
    authorize against the index. The index auth value is set via the
    **-p** option to **tpm2_nvdefine**(1).

  * **-P**, **\--auth**=_AUTH_:

    Specifies the authorization value for the hierarchy.

  * **-L**, **\--policy**=_FILE_:

    File to save the policy digest.

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession** or saved off of a previous tool run.

  * **\--offset**=_NATURAL_NUMBER_:

    The offset within the NV index to start comparing at. The size of the data
    starting at offset and ending at size of NV index shall not exceed the size
    of the operand specified in the options.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

  * **-i**, **\--input**=_FILE_:

    Specifies the input file with data to compare to NV Index contents. In the
    standard specification, this is termed as operand or operandB more
    specifically . It can be specified as a file input or stdin if option
    value is a "-".

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2_policynv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policynv.1/), weight 0.9832)

## 6. Examples

Test if NV index content value is equal to an input number. To do this we first
create an NV index of size 1 byte and write a value. Eg. 0xAA. Next we attempt
to create a policy that becomes valid if the equality comparison operation of
the NV index content against the one specified in the tool options.

### Define the test NV Index and write the value 0xAA to it
```bash
nv_test_index=0x01500001
tpm2_nvdefine -C o -p nvpass $nv_test_index -a "authread|authwrite" -s 1
echo "aa" | xxd -r -p | tpm2_nvwrite -P nvpass -i- $nv_test_index
```

### Attempt defining policynv with wrong comparison value specified in options.
```bash
tpm2_startauthsession -S session.ctx --policy-session
### This should fail
echo "bb" | xxd -r -p | tpm2_policynv -S session.ctx -L policy.nv -i- 0x1500001 eq -P nvpass
tpm2_flushcontext session.ctx
```

### Attempt defining policynv with right comparison value specified in options.
```bash
tpm2_startauthsession -S session.ctx --policy-session
### This should pass
echo "aa" | xxd -r -p | tpm2_policynv -S session.ctx -L policy.nv -i- 0x1500001 eq -P nvpass
tpm2_flushcontext session.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_policynv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynv.1.md), weight 0.9871)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policynv / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2_policynv) | `tpm2_policynv tpm2-tools man page options examples` | **0.5233** | authoritative (kept) |
| 2 | [tpm2_policynv - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policynv.1/) | `tpm2_policynv tpm2-tools man page options examples` | **0.9832** | authoritative (kept) |
| 3 | [tpm2_policynv (1)  -  Arch manual pages](https://man.archlinux.org/man/extra/tpm2-tools/tpm2_policynv.1.en) | `tpm2_policynv tpm2-tools man page options examples` | **0.9291** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policynv.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policynv.1.md) | `tpm2_policynv tpm2-tools man page options examples` | **0.9871** | authoritative (kept) |
