# 066 - tpm2-policycountertimer (`tpm2_policycountertimer`)

**Scope:** tpm2_policycountertimer(1): Enables policy authorization by evaluating the comparison operation on the TPM parameters time, clock, reset count, restart count and TPM clock safe flag.
**Upstream Manpage:** `man/tpm2_policycountertimer.1.md` in `tpm2-software/tpm2-tools` ([tpm2_policycountertimer - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycountertimer.1/), weight 0.9889).
**Multiplexed Invocation:** `tpm2_policycountertimer [OPTIONS]` or `tpm2 policycountertimer [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_policycountertimer.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policycountertimer.1.md), weight 0.9783).

## 1. Command Overview & yubiOS Role

`tpm2_policycountertimer` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_policycountertimer - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycountertimer.1/), weight 0.9889). In yubiOS declarative policy and sealed-object flows, Enhanced Authorization (EA) policy sessions (`tpm2_startauthsession`, `tpm2_policypcr`, `tpm2_policyor`, `tpm2_policyauthorize`) bind TPM objects to signed PCR states so UKI upgrades rotate authorized PCR digests without re-sealing secrets. ([tpm2-software/tpm2-tools: man/tpm2_policycountertimer.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policycountertimer.1.md), weight 0.9783)

## 2. Name

**tpm2_policycountertimer**(1) - Enables policy authorization by evaluating the
comparison operation on the TPM parameters time, clock, reset count, restart
count and TPM clock safe flag. ([tpm2_policycountertimer - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycountertimer.1/), weight 0.9889)

## 3. Synopsis

**tpm2_policycountertimer** [*OPTIONS*] [*ARGUMENT*] ([tpm2-software/tpm2-tools: man/tpm2_policycountertimer.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policycountertimer.1.md), weight 0.9783)

## 4. Description

**tpm2_policycountertimer**(1) - Enables policy authorization by evaluating the
comparison operation on the TPM parameters time, clock, reset count, restart
count and TPM clock safe flag. If time/clock, it is input as milliseconds value.
The parameter and the value is given as a command line argument as below:
```
tpm2_policycountertimer -S session.ctx safe
tpm2_policycountertimer -S session.ctx clock=<N ms>
tpm2_policycountertimer -S session.ctx time=<N ms>
tpm2_policycountertimer -S session.ctx resets=<N>
tpm2_policycountertimer -S session.ctx restarts=<N>
```
By default comparison tests for equality and also by default it tests for time. ([tpm2_policycountertimer - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycountertimer.1/), weight 0.9889)

## 5. Options

* **-L**, **\--policy**=_FILE_:

    File to save the policy digest.

  * **-S**, **\--session**=_FILE_:

    The policy session file generated via the **-S** option to
    **tpm2_startauthsession** or saved off of a previous tool run.

  * **--eq**

    if value of current time in the TPM = value of specified input time.

  * **--neq**

   if value of current time in the TPM != value of specified input time.

  * **--sgt**

   if signed value of current time in the TPM > signed value of specified input
   time.

  * **--ugt**

   if unsigned value of current time in the TPM > unsigned value of specified
   input time.

  * **--slt**

   if signed value of current time in the TPM < signed value of specified
   input time.

  * **--ult**

   if unsigned value of current time in the TPM < unsigned value of specified
   input time.

  * **--sge**

   if signed value of current time in the TPM >= signed value of specified
   input time.

  * **--uge**

   if unsigned value of current time in the TPM >= unsigned value of specified
   input time.

  * **--sle**

   if signed value of current time in the TPM <= unsigned value of specified
   input time.

  * **--ule**

   if unsigned value of current time in the TPM <= unsigned value of specified
   input time.

  * **--bs**

    if all bits set in value of current time in the TPM are set in value of
    specified input time.

  * **--bc**

    if all bits set in value of current time in the TPM are clear in value of
    specified input time.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_policycountertimer.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policycountertimer.1.md), weight 0.9783)

## 6. Examples

Create a sealing object with an authorization policy that evaluates only for
first minute of TPM restart.

### Create the policy and the sealing object

```bash
tpm2_startauthsession -S session.ctx

tpm2_policycountertimer -S session.ctx -L policy.countertimer --ult 60000

tpm2_flushcontext session.ctx

tpm2_createprimary -C o -c prim.ctx -Q

echo "SUPERSECRET" | \
tpm2_create -Q -u key.pub -r key.priv -i- -C prim.ctx \
-L policy.countertimer -a "fixedtpm|fixedparent" -c key.ctx
```

### Unsealing should work in the first minute after TPM restart

```bash
tpm2_startauthsession -S session.ctx --policy-session

tpm2_policycountertimer -S session.ctx --ult 60000

tpm2_unseal -c key.ctx -p session:session.ctx

tpm2_flushcontext session.ctx
```

**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**limitations** (`man/common/policy-limitations.md`): It expects a session to be already established via **tpm2_startauthsession**(1) and requires one of the following: - direct device access - extended session support with **tpm2-abrmd**. Without it, most resource managers **will not** save session state between command invocations.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2_policycountertimer - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycountertimer.1/), weight 0.9889)

## 7. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_policycountertimer / Man Page / Commands / tpm2-tools / ManKier](https://www.mankier.com/1/tpm2_policycountertimer) | `tpm2_policycountertimer tpm2-tools man page options examples` | **0.4253** | low-weight (weak backing) |
| 2 | [tpm2_policycountertimer - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_policycountertimer.1/) | `tpm2_policycountertimer tpm2-tools man page options examples` | **0.9889** | authoritative (kept) |
| 3 | [tpm2 - tpm2-tools - Read the Docs](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2.1/) | `tpm2_policycountertimer tpm2-tools man page options examples` | **0.8554** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_policycountertimer.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_policycountertimer.1.md) | `tpm2_policycountertimer tpm2-tools man page options examples` | **0.9783** | authoritative (kept) |
