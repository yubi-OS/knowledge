# Corpus: `tpm2-tools`

**Topic:** Complete 103-command `tpm2-tools` (TCG Software Stack `tpm2-software/tpm2-tools`) reference and yubiOS fTPM/measured-boot operational corpus, with one authored markdown document per subcommand (`001-tpm2.md` through `103-tpm2-zgen2phase.md`).
**Minted:** 2026-11-15 via `knowledge-corpus-mint` (Schema v2, Cloudflare Clef `@cf/cloudflare/clef`).
**Source Skill:** `yubi-OS/yubiOS/skills/tpm2-tools/SKILL.md`
**Companion Reference:** `yubi-OS/yubiOS/refs/tpm2-tools-2026-11-15.md`

## Summary Metrics

- **Subcommand Documents:** 103 authored (`001` to `103`), 0 skipped, 0 gaps
- **Clef Outline Validation:** 103 subtopics scored via `@cf/cloudflare/clef` (`score` metric, min `0.5666`, max `1.9689`, mean `1.3495`)
- **Results Weighted (`archive.json`):** 408 total (335 authoritative `>= 0.5`, 73 low-weight `< 0.5`)
- **Clef Requests (`jev-log.json`):** 19 requests (143634 input tokens, 0 output tokens)
- **Phase 0 Preflight:** searXNG HTTP 200 (88 results on probe), `/api/decide` HTTP 200 (`model: clef`, smoke `noul: 0.9786`)

## Document Outline & Clef Validation (103 Subcommands)

| NN | Document | Subcommand | Scope | Clef Outline Score | Kept / Total Results |
|---|---|---|---|---|---|
| `001` | [`001-tpm2.md`](./001-tpm2.md) | `tpm2` | tpm2(1): A single small executable that combines the various tpm2-tools much like a BusyBox that provides a fairly complete environment for any small or embedded system. | **1.6236** (`load-bearing`) | 4 / 4 |
| `002` | [`002-tpm2-activatecredential.md`](./002-tpm2-activatecredential.md) | `tpm2_activatecredential` | tpm2_activatecredential(1): Enables access to the credential qualifier to recover the credential secret. | **1.3522** (`load-bearing`) | 3 / 4 |
| `003` | [`003-tpm2-certify.md`](./003-tpm2-certify.md) | `tpm2_certify` | tpm2_certify(1): Prove that an object is loaded in the TPM. | **1.8667** (`load-bearing`) | 3 / 4 |
| `004` | [`004-tpm2-certifyx509certutil.md`](./004-tpm2-certifyx509certutil.md) | `tpm2_certifyX509certutil` | tpm2_certifyX509certutil(1): Generate partial X509 certificate. | **1.0337** (`marginal-kept`) | 3 / 4 |
| `005` | [`005-tpm2-certifycreation.md`](./005-tpm2-certifycreation.md) | `tpm2_certifycreation` | tpm2_certifycreation(1): Attest the association between a loaded public area and the provided hash of the creation data. | **1.0571** (`marginal-kept`) | 3 / 4 |
| `006` | [`006-tpm2-changeauth.md`](./006-tpm2-changeauth.md) | `tpm2_changeauth` | tpm2_changeauth(1): Changes authorization values for TPM objects. | **1.8706** (`load-bearing`) | 4 / 4 |
| `007` | [`007-tpm2-changeeps.md`](./007-tpm2-changeeps.md) | `tpm2_changeeps` | tpm2_changeeps(1): Replaces the active endorsement primary seed with a new one generated off the TPM2 RNG. | **0.8473** (`marginal-kept`) | 4 / 4 |
| `008` | [`008-tpm2-changepps.md`](./008-tpm2-changepps.md) | `tpm2_changepps` | tpm2_changepps(1): Replaces the active platform primary seed with a new one generated off the TPM2 RNG. | **0.7737** (`marginal-kept`) | 3 / 4 |
| `009` | [`009-tpm2-checkquote.md`](./009-tpm2-checkquote.md) | `tpm2_checkquote` | tpm2_checkquote(1): Validates a quote provided by a TPM. | **1.7514** (`load-bearing`) | 3 / 4 |
| `010` | [`010-tpm2-clear.md`](./010-tpm2-clear.md) | `tpm2_clear` | tpm2_clear(1): Clears lockout, endorsement and owner hierarchy authorization values and other TPM data. | **1.8929** (`load-bearing`) | 3 / 4 |
| `011` | [`011-tpm2-clearcontrol.md`](./011-tpm2-clearcontrol.md) | `tpm2_clearcontrol` | tpm2_clearcontrol(1): Set/ Clear TPMA_PERMANENT.disableClear attribute to effectively block/ unblock lockout authorization handle for issuing TPM clear. | **0.7732** (`marginal-kept`) | 3 / 4 |
| `012` | [`012-tpm2-clockrateadjust.md`](./012-tpm2-clockrateadjust.md) | `tpm2_clockrateadjust` | tpm2_clockrateadjust(1): Sets the clock rate period on the TPM. | **0.5666** (`marginal-kept`) | 2 / 4 |
| `013` | [`013-tpm2-commit.md`](./013-tpm2-commit.md) | `tpm2_commit` | tpm2_commit(1): Performs the first part of an ECC anonymous signing operation. | **0.8297** (`marginal-kept`) | 4 / 4 |
| `014` | [`014-tpm2-create.md`](./014-tpm2-create.md) | `tpm2_create` | tpm2_create(1): Create a child object. | **1.9634** (`load-bearing`) | 4 / 4 |
| `015` | [`015-tpm2-createak.md`](./015-tpm2-createak.md) | `tpm2_createak` | tpm2_createak(1): Generate attestation key with given algorithm under the endorsement hierarchy. | **1.6666** (`load-bearing`) | 3 / 4 |
| `016` | [`016-tpm2-createek.md`](./016-tpm2-createek.md) | `tpm2_createek` | tpm2_createek(1): Generate TCG profile compliant endorsement key. | **1.7898** (`load-bearing`) | 4 / 4 |
| `017` | [`017-tpm2-createpolicy.md`](./017-tpm2-createpolicy.md) | `tpm2_createpolicy` | tpm2_createpolicy(1): Creates simple assertion authorization policies based on multiple PCR indices values across multiple enabled banks. | **1.8577** (`load-bearing`) | 3 / 4 |
| `018` | [`018-tpm2-createprimary.md`](./018-tpm2-createprimary.md) | `tpm2_createprimary` | tpm2_createprimary(1): Create a primary key. | **1.9270** (`load-bearing`) | 3 / 4 |
| `019` | [`019-tpm2-dictionarylockout.md`](./019-tpm2-dictionarylockout.md) | `tpm2_dictionarylockout` | tpm2_dictionarylockout(1): Setup or clear dictionary-attack-lockout parameters. | **0.8363** (`marginal-kept`) | 3 / 4 |
| `020` | [`020-tpm2-duplicate.md`](./020-tpm2-duplicate.md) | `tpm2_duplicate` | tpm2_duplicate(1): Duplicates a loaded object so that it may be used in a different hierarchy. | **1.4671** (`load-bearing`) | 4 / 4 |
| `021` | [`021-tpm2-ecdhkeygen.md`](./021-tpm2-ecdhkeygen.md) | `tpm2_ecdhkeygen` | tpm2_ecdhkeygen(1): Creates an ephemeral key and uses it to generate the shared secret value using the parameters from a ECC public key. | **0.9129** (`marginal-kept`) | 3 / 4 |
| `022` | [`022-tpm2-ecdhzgen.md`](./022-tpm2-ecdhzgen.md) | `tpm2_ecdhzgen` | tpm2_ecdhzgen(1): Recovers the shared secret value (Z) from a public point and a specified private key. | **0.9116** (`marginal-kept`) | 3 / 4 |
| `023` | [`023-tpm2-ecephemeral.md`](./023-tpm2-ecephemeral.md) | `tpm2_ecephemeral` | tpm2_ecephemeral(1): Creates an ephemeral key for use in a two-phase key exchange protocol. | **0.8320** (`marginal-kept`) | 3 / 4 |
| `024` | [`024-tpm2-encodeobject.md`](./024-tpm2-encodeobject.md) | `tpm2_encodeobject` | tpm2_encodeobject(1): Encode an object into a combined PEM format. | **1.1502** (`marginal-kept`) | 3 / 4 |
| `025` | [`025-tpm2-encryptdecrypt.md`](./025-tpm2-encryptdecrypt.md) | `tpm2_encryptdecrypt` | tpm2_encryptdecrypt(1): Performs symmetric encryption or decryption. | **1.5301** (`load-bearing`) | 3 / 4 |
| `026` | [`026-tpm2-eventlog.md`](./026-tpm2-eventlog.md) | `tpm2_eventlog` | tpm2_eventlog(1): Display tpm2 event log. | **1.6146** (`load-bearing`) | 4 / 4 |
| `027` | [`027-tpm2-evictcontrol.md`](./027-tpm2-evictcontrol.md) | `tpm2_evictcontrol` | tpm2_evictcontrol(1): Make a transient object persistent or evict a persistent object. | **1.8369** (`load-bearing`) | 4 / 4 |
| `028` | [`028-tpm2-flushcontext.md`](./028-tpm2-flushcontext.md) | `tpm2_flushcontext` | tpm2_flushcontext(1): Remove a specified handle, or all contexts associated with a transient object, loaded session or saved session from the TPM. | **1.2560** (`load-bearing`) | 3 / 4 |
| `029` | [`029-tpm2-getcap.md`](./029-tpm2-getcap.md) | `tpm2_getcap` | tpm2_getcap(1): Display TPM capabilities in a human readable form. | **1.5075** (`load-bearing`) | 3 / 4 |
| `030` | [`030-tpm2-getcommandauditdigest.md`](./030-tpm2-getcommandauditdigest.md) | `tpm2_getcommandauditdigest` | tpm2_getcommandauditdigest(1): Retrieve the command audit attestation data from the TPM. | **0.8592** (`marginal-kept`) | 3 / 4 |
| `031` | [`031-tpm2-geteccparameters.md`](./031-tpm2-geteccparameters.md) | `tpm2_geteccparameters` | tpm2_geteccparameters(1): Retrieves the parameters of an ECC curve identified by its TCG-assigned curveID. | **1.0187** (`marginal-kept`) | 3 / 4 |
| `032` | [`032-tpm2-getekcertificate.md`](./032-tpm2-getekcertificate.md) | `tpm2_getekcertificate` | tpm2_getekcertificate(1): Retrieve the Endorsement key Certificate. | **1.4076** (`load-bearing`) | 3 / 3 |
| `033` | [`033-tpm2-getpolicydigest.md`](./033-tpm2-getpolicydigest.md) | `tpm2_getpolicydigest` | tpm2_getpolicydigest(1): Retrieves the policy digest from session. | **1.2870** (`load-bearing`) | 3 / 4 |
| `034` | [`034-tpm2-getrandom.md`](./034-tpm2-getrandom.md) | `tpm2_getrandom` | tpm2_getrandom(1): Retrieves random bytes from the TPM. | **1.6638** (`load-bearing`) | 3 / 4 |
| `035` | [`035-tpm2-getsessionauditdigest.md`](./035-tpm2-getsessionauditdigest.md) | `tpm2_getsessionauditdigest` | tpm2_getsessionauditdigest(1): Retrieve the command audit attestation data from the TPM. | **1.0599** (`marginal-kept`) | 3 / 4 |
| `036` | [`036-tpm2-gettestresult.md`](./036-tpm2-gettestresult.md) | `tpm2_gettestresult` | tpm2_gettestresult(1): Get the result of tests performed by the TPM | **0.7807** (`marginal-kept`) | 3 / 4 |
| `037` | [`037-tpm2-gettime.md`](./037-tpm2-gettime.md) | `tpm2_gettime` | tpm2_gettime(1): Get the current time and clock from the TPM in a signed form. | **1.4566** (`load-bearing`) | 3 / 4 |
| `038` | [`038-tpm2-hash.md`](./038-tpm2-hash.md) | `tpm2_hash` | tpm2_hash(1): Performs a hash operation with the TPM. | **1.9492** (`load-bearing`) | 4 / 4 |
| `039` | [`039-tpm2-hierarchycontrol.md`](./039-tpm2-hierarchycontrol.md) | `tpm2_hierarchycontrol` | tpm2_hierarchycontrol(1): Enable and disable use of a hierarchy and its associated NV storage. | **1.6463** (`load-bearing`) | 3 / 4 |
| `040` | [`040-tpm2-hmac.md`](./040-tpm2-hmac.md) | `tpm2_hmac` | tpm2_hmac(1): Performs an HMAC operation with the TPM. | **1.3664** (`load-bearing`) | 3 / 4 |
| `041` | [`041-tpm2-import.md`](./041-tpm2-import.md) | `tpm2_import` | tpm2_import(1): Imports an external key into the tpm as a TPM managed key object. | **1.9262** (`load-bearing`) | 3 / 3 |
| `042` | [`042-tpm2-incrementalselftest.md`](./042-tpm2-incrementalselftest.md) | `tpm2_incrementalselftest` | tpm2_incrementalselftest(1): Request testing of specified algorithm list | **0.7707** (`marginal-kept`) | 3 / 4 |
| `043` | [`043-tpm2-load.md`](./043-tpm2-load.md) | `tpm2_load` | tpm2_load(1): Load an object into the TPM. | **1.9689** (`load-bearing`) | 3 / 4 |
| `044` | [`044-tpm2-loadexternal.md`](./044-tpm2-loadexternal.md) | `tpm2_loadexternal` | tpm2_loadexternal(1): Load an external object into the TPM. | **1.5808** (`load-bearing`) | 4 / 4 |
| `045` | [`045-tpm2-makecredential.md`](./045-tpm2-makecredential.md) | `tpm2_makecredential` | tpm2_makecredential(1): Generate the encrypted-user-chosen-data and the wrapped-secret-data-encryption-key for the privacy-sensitive credentialing process of a TPM object. | **1.3974** (`load-bearing`) | 3 / 4 |
| `046` | [`046-tpm2-nvcertify.md`](./046-tpm2-nvcertify.md) | `tpm2_nvcertify` | tpm2_nvcertify(1): Provides attestation of the contents of an NV index. | **1.4280** (`load-bearing`) | 2 / 3 |
| `047` | [`047-tpm2-nvdefine.md`](./047-tpm2-nvdefine.md) | `tpm2_nvdefine` | tpm2_nvdefine(1): Define a TPM Non-Volatile (NV) index. | **1.9357** (`load-bearing`) | 4 / 4 |
| `048` | [`048-tpm2-nvextend.md`](./048-tpm2-nvextend.md) | `tpm2_nvextend` | tpm2_nvextend(1): Extend an Non-Volatile (NV) index like it was a PCR. | **1.2504** (`load-bearing`) | 3 / 4 |
| `049` | [`049-tpm2-nvincrement.md`](./049-tpm2-nvincrement.md) | `tpm2_nvincrement` | tpm2_nvincrement(1): Increment counter in a Non-Volatile (NV) index. | **0.9093** (`marginal-kept`) | 3 / 4 |
| `050` | [`050-tpm2-nvread.md`](./050-tpm2-nvread.md) | `tpm2_nvread` | tpm2_nvread(1): Read the data stored in a Non-Volatile (NV)s index. | **1.9231** (`load-bearing`) | 3 / 4 |
| `051` | [`051-tpm2-nvreadlock.md`](./051-tpm2-nvreadlock.md) | `tpm2_nvreadlock` | tpm2_nvreadlock(1): Lock the Non-Volatile (NV) index for further reads. | **0.7736** (`marginal-kept`) | 3 / 4 |
| `052` | [`052-tpm2-nvreadpublic.md`](./052-tpm2-nvreadpublic.md) | `tpm2_nvreadpublic` | tpm2_nvreadpublic(1): Display all defined Non-Volatile (NV)s indices. | **1.5205** (`load-bearing`) | 3 / 4 |
| `053` | [`053-tpm2-nvsetbits.md`](./053-tpm2-nvsetbits.md) | `tpm2_nvsetbits` | tpm2_nvsetbits(1): Bitwise OR bits into a Non-Volatile (NV). | **0.7531** (`marginal-kept`) | 3 / 4 |
| `054` | [`054-tpm2-nvundefine.md`](./054-tpm2-nvundefine.md) | `tpm2_nvundefine` | tpm2_nvundefine(1): Delete a Non-Volatile (NV) index. | **1.5356** (`load-bearing`) | 4 / 4 |
| `055` | [`055-tpm2-nvwrite.md`](./055-tpm2-nvwrite.md) | `tpm2_nvwrite` | tpm2_nvwrite(1): Write data to a Non-Volatile (NV) index. | **1.9163** (`load-bearing`) | 4 / 4 |
| `056` | [`056-tpm2-nvwritelock.md`](./056-tpm2-nvwritelock.md) | `tpm2_nvwritelock` | tpm2_nvwritelock(1): Lock the Non-Volatile (NV) index for further writes. | **0.9256** (`marginal-kept`) | 3 / 4 |
| `057` | [`057-tpm2-pcrallocate.md`](./057-tpm2-pcrallocate.md) | `tpm2_pcrallocate` | tpm2_pcrallocate(1): Configure PCRs and bank algorithms. | **1.1200** (`marginal-kept`) | 3 / 4 |
| `058` | [`058-tpm2-pcrevent.md`](./058-tpm2-pcrevent.md) | `tpm2_pcrevent` | tpm2_pcrevent(1): Hashes a file and optionally extends a pcr. | **1.3677** (`load-bearing`) | 3 / 4 |
| `059` | [`059-tpm2-pcrextend.md`](./059-tpm2-pcrextend.md) | `tpm2_pcrextend` | tpm2_pcrextend(1): Extends a PCR. | **1.7943** (`load-bearing`) | 4 / 4 |
| `060` | [`060-tpm2-pcrread.md`](./060-tpm2-pcrread.md) | `tpm2_pcrread` | tpm2_pcrread(1): List PCR values. | **1.8795** (`load-bearing`) | 4 / 4 |
| `061` | [`061-tpm2-pcrreset.md`](./061-tpm2-pcrreset.md) | `tpm2_pcrreset` | tpm2_pcrreset(1): Reset one or more PCR banks | **1.4394** (`load-bearing`) | 4 / 4 |
| `062` | [`062-tpm2-policyauthorize.md`](./062-tpm2-policyauthorize.md) | `tpm2_policyauthorize` | tpm2_policyauthorize(1): Allows for mutable policies by tethering to a signing authority. | **1.6488** (`load-bearing`) | 3 / 4 |
| `063` | [`063-tpm2-policyauthorizenv.md`](./063-tpm2-policyauthorizenv.md) | `tpm2_policyauthorizenv` | tpm2_policyauthorizenv(1): Allows for mutable policies by referencing to a policy from an NV index. | **1.1320** (`marginal-kept`) | 4 / 4 |
| `064` | [`064-tpm2-policyauthvalue.md`](./064-tpm2-policyauthvalue.md) | `tpm2_policyauthvalue` | tpm2_policyauthvalue(1): Enables binding a policy to the authorization value of the authorized TPM object. | **1.0121** (`marginal-kept`) | 3 / 4 |
| `065` | [`065-tpm2-policycommandcode.md`](./065-tpm2-policycommandcode.md) | `tpm2_policycommandcode` | tpm2_policycommandcode(1): Restrict TPM object authorization to specific TPM commands. | **1.0285** (`marginal-kept`) | 4 / 4 |
| `066` | [`066-tpm2-policycountertimer.md`](./066-tpm2-policycountertimer.md) | `tpm2_policycountertimer` | tpm2_policycountertimer(1): Enables policy authorization by evaluating the comparison operation on the TPM parameters time, clock, reset count, restart count and TPM clock safe flag. | **1.2338** (`load-bearing`) | 3 / 4 |
| `067` | [`067-tpm2-policycphash.md`](./067-tpm2-policycphash.md) | `tpm2_policycphash` | tpm2_policycphash(1): Couples a policy with command parameters of the command. | **0.9800** (`marginal-kept`) | 3 / 4 |
| `068` | [`068-tpm2-policyduplicationselect.md`](./068-tpm2-policyduplicationselect.md) | `tpm2_policyduplicationselect` | tpm2_policyduplicationselect(1): Restricts duplication to a specific new parent. | **0.9234** (`marginal-kept`) | 3 / 4 |
| `069` | [`069-tpm2-policylocality.md`](./069-tpm2-policylocality.md) | `tpm2_policylocality` | tpm2_policylocality(1): Restrict TPM object authorization to specific localities. | **1.5748** (`load-bearing`) | 3 / 4 |
| `070` | [`070-tpm2-policynamehash.md`](./070-tpm2-policynamehash.md) | `tpm2_policynamehash` | tpm2_policynamehash(1): Couples a policy with names of specific objects. | **1.0009** (`marginal-kept`) | 3 / 4 |
| `071` | [`071-tpm2-policynv.md`](./071-tpm2-policynv.md) | `tpm2_policynv` | tpm2_policynv(1): Evaluates policy authorization by comparing a specified value against the contents in the specified NV Index. | **1.7513** (`load-bearing`) | 4 / 4 |
| `072` | [`072-tpm2-policynvwritten.md`](./072-tpm2-policynvwritten.md) | `tpm2_policynvwritten` | tpm2_policynvwritten(1): Restrict TPM object authorization to the written state of an NV index. | **0.9705** (`marginal-kept`) | 3 / 4 |
| `073` | [`073-tpm2-policyor.md`](./073-tpm2-policyor.md) | `tpm2_policyor` | tpm2_policyor(1): logically OR's two policies together. | **1.8126** (`load-bearing`) | 4 / 4 |
| `074` | [`074-tpm2-policypassword.md`](./074-tpm2-policypassword.md) | `tpm2_policypassword` | tpm2_policypassword(1): Enables binding a policy to the authorization value of the authorized TPM object. | **1.3325** (`load-bearing`) | 3 / 4 |
| `075` | [`075-tpm2-policypcr.md`](./075-tpm2-policypcr.md) | `tpm2_policypcr` | tpm2_policypcr(1): Create a policy that includes specific PCR values. | **1.9388** (`load-bearing`) | 3 / 4 |
| `076` | [`076-tpm2-policyrestart.md`](./076-tpm2-policyrestart.md) | `tpm2_policyrestart` | tpm2_policyrestart(1): Restart an existing session with the TPM. | **1.4933** (`load-bearing`) | 2 / 4 |
| `077` | [`077-tpm2-policysecret.md`](./077-tpm2-policysecret.md) | `tpm2_policysecret` | tpm2_policysecret(1): Couples the authorization of an object to that of an existing object. | **1.7379** (`load-bearing`) | 3 / 4 |
| `078` | [`078-tpm2-policysigned.md`](./078-tpm2-policysigned.md) | `tpm2_policysigned` | tpm2_policysigned(1): Enables policy authorization by verifying signature of optional TPM2 parameters. The signature is generated by a signing authority. | **1.6755** (`load-bearing`) | 3 / 4 |
| `079` | [`079-tpm2-policytemplate.md`](./079-tpm2-policytemplate.md) | `tpm2_policytemplate` | tpm2_policytemplate(1): Couples a policy with public template data digest of an object. | **0.8557** (`marginal-kept`) | 3 / 4 |
| `080` | [`080-tpm2-policyticket.md`](./080-tpm2-policyticket.md) | `tpm2_policyticket` | tpm2_policyticket(1): Enables policy authorization by verifying a ticket that represents a validated authorization that had an expiration time associated with it. | **0.9782** (`marginal-kept`) | 3 / 4 |
| `081` | [`081-tpm2-print.md`](./081-tpm2-print.md) | `tpm2_print` | tpm2_print(1): Prints TPM data structures | **1.6187** (`load-bearing`) | 3 / 4 |
| `082` | [`082-tpm2-quote.md`](./082-tpm2-quote.md) | `tpm2_quote` | tpm2_quote(1): Provide a quote and signature from the TPM. | **1.9182** (`load-bearing`) | 4 / 4 |
| `083` | [`083-tpm2-rc-decode.md`](./083-tpm2-rc-decode.md) | `tpm2_rc_decode` | tpm2_rc_decode(1): Decode TPM2 error codes to a human readable format. | **1.0860** (`marginal-kept`) | 3 / 4 |
| `084` | [`084-tpm2-readclock.md`](./084-tpm2-readclock.md) | `tpm2_readclock` | tpm2_readclock(1): Retrieves the time information from the TPM. | **0.8513** (`marginal-kept`) | 3 / 4 |
| `085` | [`085-tpm2-readpublic.md`](./085-tpm2-readpublic.md) | `tpm2_readpublic` | tpm2_readpublic(1): Read the public area of a loaded object. | **1.8940** (`load-bearing`) | 3 / 4 |
| `086` | [`086-tpm2-rsadecrypt.md`](./086-tpm2-rsadecrypt.md) | `tpm2_rsadecrypt` | tpm2_rsadecrypt(1): Performs an RSA decryption operation using the TPM. | **1.2057** (`load-bearing`) | 4 / 4 |
| `087` | [`087-tpm2-rsaencrypt.md`](./087-tpm2-rsaencrypt.md) | `tpm2_rsaencrypt` | tpm2_rsaencrypt(1): Performs an RSA encryption operation using the TPM. | **1.1275** (`marginal-kept`) | 3 / 4 |
| `088` | [`088-tpm2-selftest.md`](./088-tpm2-selftest.md) | `tpm2_selftest` | tpm2_selftest(1): Run TPM's self-test internal routines | **0.8813** (`marginal-kept`) | 3 / 4 |
| `089` | [`089-tpm2-send.md`](./089-tpm2-send.md) | `tpm2_send` | tpm2_send(1): Send a raw command buffer to the TPM. | **0.8932** (`marginal-kept`) | 4 / 4 |
| `090` | [`090-tpm2-sessionconfig.md`](./090-tpm2-sessionconfig.md) | `tpm2_sessionconfig` | tpm2_sessionconfig(1): Configure session attributes and print session info from a session file. | **1.2062** (`load-bearing`) | 4 / 4 |
| `091` | [`091-tpm2-setclock.md`](./091-tpm2-setclock.md) | `tpm2_setclock` | tpm2_setclock(1): Sets the time on the TPM. | **0.9480** (`marginal-kept`) | 3 / 4 |
| `092` | [`092-tpm2-setcommandauditstatus.md`](./092-tpm2-setcommandauditstatus.md) | `tpm2_setcommandauditstatus` | tpm2_setcommandauditstatus(1): Add or remove TPM2 commands to the audited commands list. | **1.0932** (`marginal-kept`) | 3 / 4 |
| `093` | [`093-tpm2-setprimarypolicy.md`](./093-tpm2-setprimarypolicy.md) | `tpm2_setprimarypolicy` | tpm2_setprimarypolicy(1): Sets the authorization policy for the lockout (lockoutPolicy), the platform hierarchy (platformPolicy), the storage hierarchy (ownerPolicy), and the endorsement hierarchy (endorsementPolicy). | **1.3166** (`load-bearing`) | 3 / 4 |
| `094` | [`094-tpm2-shutdown.md`](./094-tpm2-shutdown.md) | `tpm2_shutdown` | tpm2_shutdown(1): Send a shutdown command to the TPM. | **1.2103** (`load-bearing`) | 3 / 4 |
| `095` | [`095-tpm2-sign.md`](./095-tpm2-sign.md) | `tpm2_sign` | tpm2_sign(1): Sign a hash or message using the TPM. | **1.9517** (`load-bearing`) | 4 / 4 |
| `096` | [`096-tpm2-startauthsession.md`](./096-tpm2-startauthsession.md) | `tpm2_startauthsession` | tpm2_startauthsession(1): Start a session with the TPM. | **1.8647** (`load-bearing`) | 3 / 4 |
| `097` | [`097-tpm2-startup.md`](./097-tpm2-startup.md) | `tpm2_startup` | tpm2_startup(1): Send a startup command to the TPM. | **1.6725** (`load-bearing`) | 3 / 4 |
| `098` | [`098-tpm2-stirrandom.md`](./098-tpm2-stirrandom.md) | `tpm2_stirrandom` | tpm2_stirrandom(1): Add "additional information" into TPM RNG state. | **0.7485** (`marginal-kept`) | 3 / 4 |
| `099` | [`099-tpm2-testparms.md`](./099-tpm2-testparms.md) | `tpm2_testparms` | tpm2_testparms(1): Verify that specified algorithm suite is supported by TPM | **1.0223** (`marginal-kept`) | 3 / 3 |
| `100` | [`100-tpm2-tr-encode.md`](./100-tpm2-tr-encode.md) | `tpm2_tr_encode` | tpm2_tr_encode(1): Encodes a peristent handle and `TPM2B_NAME` as a serialized `ESYS_TR` as output. | **0.9959** (`marginal-kept`) | 4 / 4 |
| `101` | [`101-tpm2-unseal.md`](./101-tpm2-unseal.md) | `tpm2_unseal` | tpm2_unseal(1): Returns a data blob in a loaded TPM object. The data blob is returned in clear. | **1.8805** (`load-bearing`) | 4 / 4 |
| `102` | [`102-tpm2-verifysignature.md`](./102-tpm2-verifysignature.md) | `tpm2_verifysignature` | tpm2_verifysignature(1): Validates a signature using the TPM. | **1.7701** (`load-bearing`) | 4 / 4 |
| `103` | [`103-tpm2-zgen2phase.md`](./103-tpm2-zgen2phase.md) | `tpm2_zgen2phase` | tpm2_zgen2phase(1): Command to enable the TPM to combine data from the other party with the ephemeral key generated in the first phase of two-phase key exchange protocols. | **0.8528** (`marginal-kept`) | 3 / 4 |

## Research Database (`research-db/` Schema v2)

- [`research-db/preflight.json`](./research-db/preflight.json) - Phase 0 searXNG and `/api/decide` probe records.
- [`research-db/outline.json`](./research-db/outline.json) - 103 subcommand specifications, seed queries, and Clef `score` validation outputs.
- [`research-db/archive.json`](./research-db/archive.json) - All 408 collected results with full Clef `noul` decision records and token usage.
- [`research-db/digs/`](./research-db/digs/) - 103 per-subcommand dig records (`001-tpm2.json` through `103-tpm2-zgen2phase.json`).
- [`research-db/jev-log.json`](./research-db/jev-log.json) - Request-level Clef audit trail across outline scoring and result weighting.
- [`research-db/db.ts`](./research-db/db.ts) - TypeScript schema interfaces for all `research-db/` artifacts.
