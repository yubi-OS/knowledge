# Idempotency and resume: why the mode decides whether a re-run is safe

Scope: the idempotency axis of execution modes, why a non-idempotent measurement breaks resume-from-suspend, and which checks in the chain are safe to re-run and which are not.

## The two classes

Every step in the attestation and measurement chain is either a pure function of its input or a stateful accumulator. The pure functions are the one-shot verifiers from doc 01: `sbverify --cert` computes a verdict from the image bytes and the certificate, and `veritysetup verify` computes a verdict from the devices and the root hash, creating no kernel device (Ubuntu veritysetup man page, weight 0.89: https://manpages.ubuntu.com/manpages/xenial/man8/veritysetup.8.html). Run either twice and the second run returns the same verdict. These steps are idempotent in the strict sense: repeated application has no further effect.

The accumulator is the PCR extend. Extending a PCR mixes new data into the register's digest, and the TPM performs the extend for all currently active PCR banks (tss2_pcrextend man page, weight 0.87: https://tpm2-tools.readthedocs.io/en/latest/man/tss2_pcrextend.1/). The log events are extended into the TPM as they occur, and auditing works by recomputing the expected PCR value from the log and comparing it to the TPM (Microsoft Learn, PCR banks on TPM 2.0 devices, weight 0.86: https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/switch-pcr-banks-on-tpm-2-0-devices). PCR_Extend and PCR_Event both update the indicated PCR and its banks (Stack Overflow on the two commands, weight 0.03, weak backing: https://stackoverflow.com/questions/59352618/tpm-pcr-event-vs-pcr-extend).

Extend is the opposite of idempotent: extending the same measurement twice produces a different final value than extending it once. There is no undo; the only reset is a reboot.

## The resume-from-suspend failure

This asymmetry is where the mode column earns its keep. Consider a measurement step that is triggered on resume from suspend and re-runs a boot-stage measurement by extending a PCR. The second extend corrupts the PCR state relative to the event log: the log now describes one boot, the PCR reflects one and a half. A verifier replaying the log computes an expected value that no longer matches, and the platform fails attestation even though nothing was tampered with.

The failure is not hypothetical in shape. PCR validation errors are exactly how BitLocker triggers unexpected recovery at boot: the expected PCR state no longer matches what the TPM holds, so the key is not released (Dell support article on TPM PCR validation error causing BitLocker recovery, weight 0.93: https://www.dell.com/support/kbdoc/en-us/000204144/tpm-pcr-validation-error-causing-bitlocker-recovery-at-boot). Microsoft's own guidance around PCR bank switching says to suspend BitLocker or have the recovery key ready, because any change to measured state can invalidate the seal (Microsoft Learn, weight 0.86: https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/switch-pcr-banks-on-tpm-2-0-devices).

The general rule: a non-idempotent step must never be wired to an event that can fire more than once per logical boot. Resume, retry, and watchdog re-runs are all such events. A one-shot measurement that appends to a PCR on every re-run turns every resume into a policy mismatch.

## What survives a re-run

The verification steps survive. `sbverify --cert` re-run after resume returns the same verdict on the same image (Arch sbverify man page, weight 0.83: https://man.archlinux.org/man/extra/sbsigntools/sbverify.1.en). `veritysetup verify` re-run returns the same verdict. The quote (doc 04) survives because it reads state instead of writing it. The only unsafe re-runs are the extends, and the fix is structural: either gate measurement on a "first run since boot" flag, or make the re-run a pure verification (replay the log against the current PCR) instead of a second extend.

## The distinction is not academic

The terms matter because they are not synonyms. A pure function's output depends only on its input; an idempotent function can be called repeatedly with the same effect as once (Stack Overflow on idempotent versus pure, weight 0.04, weak backing: https://stackoverflow.com/questions/40296211/are-idempotent-functions-the-same-as-pure-functions). For the resume hazard the operative property is idempotency, not purity: a verifier that records its verdict to disk is not pure, but it is still safe to re-run. Classifying every step in the chain by "what happens if this runs twice" is the cheapest correctness check available, and it is a property of the mode, not of the tool's quality.
