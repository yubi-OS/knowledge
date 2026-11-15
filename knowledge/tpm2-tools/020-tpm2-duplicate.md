# 020 - tpm2-duplicate (`tpm2_duplicate`)

**Scope:** tpm2_duplicate(1): Duplicates a loaded object so that it may be used in a different hierarchy.
**Upstream Manpage:** `man/tpm2_duplicate.1.md` in `tpm2-software/tpm2-tools` ([tpm2_duplicate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_duplicate.1/), weight 0.9899).
**Multiplexed Invocation:** `tpm2_duplicate [OPTIONS]` or `tpm2 duplicate [OPTIONS]` ([tpm2-software/tpm2-tools: man/tpm2_duplicate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_duplicate.1.md), weight 0.9854).

## 1. Command Overview & yubiOS Role

`tpm2_duplicate` is an official command in the `tpm2-tools` TSS2 CLI suite ([tpm2_duplicate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_duplicate.1/), weight 0.9899). In yubiOS, transient and persistent object management commands operate via the kernel resource manager (`/dev/tpmrm0`, TCTI `device:/dev/tpmrm0`) so transient handles are automatically flushed on process exit while persistent handles (`0x81000000`+) are managed explicitly. ([tpm2-software/tpm2-tools: man/tpm2_duplicate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_duplicate.1.md), weight 0.9854)

## 2. Name

tpm2_duplicate(1) -  Duplicates a loaded object so that it may be used in a
different hierarchy. ([tpm2_duplicate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_duplicate.1/), weight 0.9899)

## 3. Synopsis

**tpm2_duplicate** [*OPTIONS*] ([tpm2-software/tpm2-tools: man/tpm2_duplicate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_duplicate.1.md), weight 0.9854)

## 4. Description

**tpm2_duplicate**(1) - This tool duplicates a loaded object so that it may be
used in a different hierarchy. The new parent key for the duplicate may be on
the same or different TPM or TPM_RH_NULL. ([tpm2_duplicate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_duplicate.1/), weight 0.9899)

## 5. Options

These options control the key importation process:

  * **-G**, **\--wrapper-algorithm**=_ALGORITHM_:

    The symmetric algorithm to be used for the inner wrapper if -U is not used.
    Supports:
    * aes - AES 128 in CFB mode.
    * null - none
    The key algorithm associated with the public parent if -U is used.

  * **-G**, **\--key-algorithm**=_ALGORITHM_:

    The key algorithm associated with the public parent if -U is used.

  * **-i**, **\--encryptionkey-in**=_FILE_:

    Specifies the filename of the symmetric key (128 bit data) to be used for
    the inner wrapper. Valid only when specified symmetric algorithm is not null

  * **-o**, **\--encryptionkey-out**=_FILE_:

    Specifies the filename to store the symmetric key (128 bit data) that was
    used for the inner wrapper. Valid only when specified symmetric algorithm is
    not null and \--input-key-file is not specified. The TPM generates the key
    in this case.

  * **-C**, **\--parent-context**=_OBJECT_:

    The parent key object.

  * **-U**, **\--parent-public**=_FILE_:

    Specifies the file path to the public key of the parent object on the
    destination TPM.  This should be a `TPM2B_PUBLIC` formatted file.
    This public key is used for the wrapping of a PEM or DER key
    which will be exported for a remote TPM.

  * **-k**, **\--private-key**=_FILE_:

    Specifies the file path to the external private key be encrypted for
    the remote TPM.  This should be a PEM format private key.

  * **-r**, **\--private**=_FILE_:

    Specifies the file path to save the private portion of the duplicated object.
    **protection details** (`man/common/protection-details.md`): Objects that can move outside of TPM need to be protected (confidentiality and integrity). For instance, transient objects require that TPM protected data (key or seal material) be stored outside of the TPM. This is seen in tools like tpm2\_create(1), where the **-r** option outputs this protected data. This blob contains the sensitive portions of the object. The sensitive portions of the object are protected by the parent object, using the paren

  * **-u**, **\--public**=_FILE_:

    Specifies the file path to save the public portion of the duplicated object,
    if an external key is being duplicated.

  * **-s**, **\--encrypted-seed**=_FILE_:

    The file to save the encrypted seed of the duplicated object.

  * **-p**, **\--auth**=_AUTH_:

    The authorization value for the key, optional.

  * **-L**, **\--policy**=_FILE_:

    The input policy file, optional.

  * **-c**, **\--key-context**=_OBJECT_:

    The object to be duplicated.

  * **-a**, **\--attributes**=_ATTRIBUTES_:

    The object attributes, optional. The default for created objects is:

    `TPMA_OBJECT_SIGN_ENCRYPT|TPMA_OBJECT_DECRYPT|TPMA_OBJECT_USERWITHAUTH`

    Note: If a policy is specified without an auth value then `TPMA_OBJECT_USERWITHAUTH`
    is turned down.

  * **\--cphash**=_FILE_

    File path to record the hash of the command parameters. This is commonly
    termed as cpHash. NOTE: When this option is selected, The tool will not
    actually execute the command, it simply returns a cpHash.

### References

**context object format** (`man/common/ctxobj.md`): The type of a context object, whether it is a handle or file name, is determined according to the following logic *in-order*: * If the argument is a file path, then the file is loaded as a restored TPM transient object. * If the argument is a *prefix* match on one of: * owner: the owner hierarchy * platform: the platform hierarchy * endorsement: the endorsement hierarchy * lockout: the lockout control persistent object * If the argument argument  details the methods for specifying
_OBJECT_.

**authorization formatting** (`man/common/authorizations.md`): Authorization for use of an object in TPM2.0 can come in 3 different forms: 1. Password 2. HMAC 3. Sessions **NOTE:** "Authorizations default to the **EMPTY PASSWORD** when not specified". For authentication with auth values, the tool commands implicitly generate an HMAC session. Thus passwords are not transmitted unencrypted. This does not apply to passwords defined for objects. In this case, an HMAC session should be used (see tpm2\_startauthse details the methods for
specifying _AUTH_.

**algorithm specifiers** (`man/common/alg.md`): Options that take algorithms support "nice-names". There are two major algorithm specification string classes, simple and complex. Only certain algorithms will be accepted by the TPM, based on usage and conditions. These are strings with no additional specification data. When creating objects, non-specified portions of an object are assumed to defaults. You can find the list of known "Simple Specifiers" below. * rsa * ecc * aes * camellia * sm4 * details the options for specifying
cryptographic algorithms _ALGORITHM_.

**common options** (`man/common/options.md`): This collection of options are common to many programs and provide information that many users may expect. * **-h**, **\--help=[man|no-man]**: Display the tools manpage. By default, it attempts to invoke the manpager for the tool, however, on failure will output a short tool summary. This is the same behavior if the "man" option argument is specified, however if explicit "man" is requested, the tool will provide errors from man on stderr. If the  collection of common options that provide
information many users may expect.

**common tcti options** (`man/common/tcti.md`): The TCTI or "Transmission Interface" is the communication mechanism with the TPM. TCTIs can be changed for communication with TPMs across different mediums. To control the TCTI, the tools respect: 1. The command line option **-T** or **\--tcti** 2. The environment variable: _TPM2TOOLS\_TCTI_. **Note:** The command line option always overrides the environment variable. The current known TCTIs are: * tabrmd - The resource manager, called [tabrmd](h collection of options used to configure
the various known TCTI modules. ([tpm2-software/tpm2-tools: man/tpm2_duplicate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_duplicate.1.md), weight 0.9854)

## 6. Examples

#### Example-1: Duplicate a key created with a policy that allows for duplication:

```bash
tpm2_startauthsession -S session.dat
tpm2_policycommandcode -S session.dat -L policy.dat TPM2_CC_Duplicate
tpm2_flushcontext session.dat

tpm2_createprimary -C o -g sha256 -G rsa -c primary.ctxt
tpm2_create -C primary.ctxt -g sha256 -G rsa -r key.prv -u key.pub  -c key.ctxt \
-L policy.dat -a "sensitivedataorigin|userwithauth|decrypt|sign"

tpm2_createprimary -C o -g sha256 -G ecc -c new_parent.ctxt

tpm2_startauthsession \--policy-session -S session.dat
tpm2_policycommandcode -S session.dat -L policy.dat TPM2_CC_Duplicate
tpm2_duplicate -C new_parent.ctxt -c key.ctxt -G null -p "session:session.dat" \
-r duprv.bin -s seed.dat
tpm2_flushcontext session.dat
```

#### Example-2: As an end-to-end example, the following will transfer an RSA key generated on `TPM-A` to `TPM-B`

##### On TPM-B

Create a parent object that will be used to wrap/transfer the key.
```
tpm2_createprimary -C o -g sha256 -G rsa -c primary.ctx

tpm2_create  -C primary.ctx -g sha256 -G rsa \
-r new_parent.prv  -u new_parent.pub \
-a "restricted|sensitivedataorigin|decrypt|userwithauth"
```

Copy `new_parent.pub` to `TPM-A`.

##### On TPM-A

Create root object and auth policy allows duplication only

```
tpm2_createprimary -C o -g sha256 -G rsa -c primary.ctx

tpm2_startauthsession -S session.dat

tpm2_policycommandcode -S session.dat -L dpolicy.dat TPM2_CC_Duplicate

tpm2_flushcontext session.dat

rm session.dat
```

Generate an RSA keypair on TPM-A that will be duplicated 
(note the passphrase is 'foo')

```
tpm2_create -C primary.ctx -g sha256 -G rsa -p foo -r key.prv \
-u key.pub  -L dpolicy.dat -a "sensitivedataorigin|userwithauth|decrypt|sign"

tpm2_load -C primary.ctx -r key.prv -u key.pub -c key.ctx

tpm2_readpublic -c key.ctx -o dup.pub
```

Test sign and encryption locally (so we can compare later that the same key 
was transferred).

```
echo "meet me at.." >file.txt
tpm2_rsaencrypt -c key.ctx  -o data.encrypted file.txt
tpm2_sign -c key.ctx -g sha256 -f plain -p foo -o sign.raw file.txt
```

Compare the signature hash (we will use this later to confirm the key was 
transferred to TPM-B):

```
sha256sum sign.raw

a1b4e3fbaa29e6e46d95cff498150b6b8e7d9fd21182622e8f5a3ddde257879e
```

Start an auth session and policy command to allow duplication
```
tpm2_startauthsession --policy-session -S session.dat

tpm2_policycommandcode -S session.dat -L dpolicy.dat TPM2_CC_Duplicate
```

Load the new_parent.pub file transferred from `TPM-B`
```
tpm2_loadexternal -C o -u new_parent.pub -c new_parent.ctx
```

Start the duplication
```
tpm2_duplicate -C new_parent.ctx -c key.ctx -G null  \
-p "session:session.dat" -r dup.dpriv -s dup.seed
```

Copy the following files to TPM-B:
* dup.pub
* dup.dpriv
* dup.seed
* (optionally data.encrypted just to test decryption)

##### On TPM-B

Start an auth,policy session
```
tpm2_startauthsession --policy-session -S session.dat

tpm2_policycommandcode -S session.dat -L dpolicy.dat TPM2_CC_Duplicate
```

Load the context we used to transfer
```
tpm2_flushcontext --transient-object

tpm2_load -C primary.ctx -u new_parent.pub -r new_parent.prv -c new_parent.ctx
```

Import the duplicated context against the parent we used
```
tpm2_import -C new_parent.ctx -u dup.pub -i dup.dpriv \
-r dup.prv -s dup.seed -L dpolicy.dat
```

Load the duplicated key context 
```
tpm2_flushcontext --transient-object

tpm2_load -C new_parent.ctx -u dup.pub -r dup.prv -c dup.ctx
```

Test the imported key matches

* Sign

```bash
echo "meet me at.." >file.txt

tpm2_sign -c dup.ctx -g sha256 -o sig.rss -p foo file.txt

dd if=sig.rss of=sign.raw bs=1 skip=6 count=256
```

Compare the signature file hash:

```bash
$ sha256sum sign.raw

a1b4e3fbaa29e6e46d95cff498150b6b8e7d9fd21182622e8f5a3ddde257879e
```

* Decryption

```
tpm2_flushcontext --transient-object

tpm2_rsadecrypt -p foo -c dup.ctx -o data.ptext data.encrypted ([tpm2_duplicate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_duplicate.1/), weight 0.9899)

## 7. Cat Data.Ptext

meet me at..
```

#### Example-3: Exporting an OpenSSL RSA key for a remote TPM

To securely send an OpenSSL generated RSA key to a remote TPM such that
only that remote TPM will be able to load it, and without exposing the
private key to the host operating system on the remote machine:

* On the destination TPM-B, create a primary context and read its public key,
then send `primary.pub` to the source machine:

```bash
tpm2_createprimary -c primary.ctx
tpm2_readpublic -c primary.ctx -o primary.pub
```

* On the source machine create the RSA private key and wrap it for the destination
TPM's public key.  Similar to `tpm2_makecredential`, this step should not require
a TPM.

```bash
openssl genrsa -out rsa.pem
tpm2_duplicate -U primary.pub -G rsa -k rsa.pem -u rsa.pub -r rsa.dpriv -s rsa.seed
```

* Send the `rsa.pub`, `rsa.dpriv` and `rsa.seed` to the destination TPM-B
and import the files, which will decrypt them using the `primary.ctx` to
produce `rsa.priv`, which can then be loaded and used as a TPM key:

```bash
tpm2_import -C primary.ctx -G rsa -i rsa.dpriv -s rsa.seed -u rsa.pub -r rsa.priv
tpm2_load -C primary.ctx -c rsa.ctx -u rsa.pub -r rsa.priv
```

#### Example-4: Exporting an HMAC key for a remote TPM and restrict it from further exports

This procedure will export an HMAC key created inside `TPM-A` only to `TPM-B` and with a 
policy that prevents `TPM-B` from allowing any further exports.

* On the destination `TPM-B`, create a primary context:

```bash
tpm2_createprimary -C o -g sha256 -G rsa -c primary.ctx
tpm2_create  -C primary.ctx -g sha256 -G rsa -r new_parent.prv \
    -u new_parent.pub -a "fixedtpm|fixedparent|restricted|sensitivedataorigin|decrypt|userwithauth"
```

Copy `new_parent.pub` to `TPM-A`.

* On source `TPM-A`

load the remote key and save its "name"

```bash
tpm2_loadexternal -C o -u new_parent.pub -c new_parent.ctx -n new_parent.name
```

Create a primary object and a policy that restricts duplication to just `TPM-B` parent

```bash
tpm2_createprimary -C o -g sha256 -G rsa -c primary.ctx
tpm2_startauthsession -S session.dat
tpm2_policyduplicationselect -S session.dat  -N new_parent.name -L dpolicy.dat 
tpm2_flushcontext session.dat
```

Create an HMAC key with that policy

```bash
tpm2_create -C primary.ctx -g sha256 -G hmac -r key.prv -u key.pub \
   -L dpolicy.dat -a "sensitivedataorigin|userwithauth|sign"
```

Load the key and save its "name".  Generate a test HMAC

```bash
tpm2_load -C primary.ctx -r key.prv -u key.pub -c key.ctx
tpm2_readpublic -c key.ctx -n dupkey.name

export plain="foo"
echo -n $plain | tpm2_hmac -g sha256 -c key.ctx | xxd -p -c 256
   42a1fad918fa0e4cbea94d759da89ccdfac5a640672d0170f4930cafe14d179c
```

Start auth session for duplication with `tpm2_policyduplicationselect`

```bash
tpm2_startauthsession --policy-session -S session.dat
tpm2_policyduplicationselect -S session.dat  -N new_parent.name \
   -L dpolicy.dat  -n dupkey.name

tpm2_duplicate -C new_parent.ctx -c key.ctx -G null \
   -p "session:session.dat" -r dup.dup -s dup.seed
```

Copy `dup.dup` `dup.seed` `key.pub` to `TPM-B`

* On destination `TPM-B`

Reload the original new parent and import the key

```bash
tpm2_load -C primary.ctx -u new_parent.pub -r new_parent.prv -c new_parent.ctx

tpm2_import -C new_parent.ctx -u key.pub -i dup.dup  -r dup.prv -s dup.seed
tpm2_load -C new_parent.ctx -u key.pub -r dup.prv -c dup.ctx
```

Generate a sample HMAC

```bash
export plain="foo"
echo -n $plain | tpm2_hmac -g sha256 -c dup.ctx | xxd -p -c 256
   42a1fad918fa0e4cbea94d759da89ccdfac5a640672d0170f4930cafe14d179c
```


**returns** (`man/common/returns.md`): Tools can return any of the following codes: - 0 - Success. - 1 - General non-specific error. - 2 - Options handling error. - 3 - Authentication error. - 4 - TCTI related error. - 5 - Non supported scheme. Applicable to tpm2_testparams.

**footer** (`man/common/footer.md`): [Github Issues](https://github.com/tpm2-software/tpm2-tools/issues) See the [Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/tpm2) This work is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). ([tpm2-software/tpm2-tools: man/tpm2_duplicate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_duplicate.1.md), weight 0.9854)

## 8. Sources Considered

| # | Source | Query | Clef noul Weight | Status |
|---|---|---|---|---|
| 1 | [tpm2_duplicate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/latest/man/tpm2_duplicate.1/) | `tpm2_duplicate tpm2-tools man page options examples` | **0.9899** | authoritative (kept) |
| 2 | [tpm2_duplicate - tpm2-tools](https://tpm2-tools.readthedocs.io/en/stable/man/tpm2_duplicate.1/) | `tpm2_duplicate tpm2-tools man page options examples` | **0.9851** | authoritative (kept) |
| 3 | [tpm2 (1)  -  tpm2-tools  -  Debian testing  -  Debian Manpages](https://manpages.debian.org/testing/tpm2-tools/tpm2.1.en.html) | `tpm2_duplicate tpm2-tools man page options examples` | **0.7486** | authoritative (kept) |
| 4 | [tpm2-software/tpm2-tools: man/tpm2_duplicate.1.md  -  Official Upstream Manpage](https://github.com/tpm2-software/tpm2-tools/blob/master/man/tpm2_duplicate.1.md) | `tpm2_duplicate tpm2-tools man page options examples` | **0.9854** | authoritative (kept) |
