# Interactive versus batch: where the human prompt lives in the chain

Scope: the TTY axis of execution modes: why nothing in the attestation path prompts a human, where the single interactive moment is, and how the same checks run in batch under CI.

## The default is non-interactive

Every step documented in this corpus runs without a human in the loop. The one-shot verifiers produce exit codes or refusals, the measurement daemon produces log events, the quote is a request/response exchange. This is not an accident: attestation steps have to work identically at boot (where nobody is watching a terminal), in CI (where there is no TTY at all), and under a verifier (where the caller is software). Any step that required a prompt would break at two of those three trigger points.

In batch mode the checks run inside scripts that manage their own error handling, capturing the exit code of each step while keeping the rest of the script's error discipline intact. CI runners fail a job when any command returns a non-zero exit code, which is the machine-readable contract the batch scripts build on (Dojo Five on CI pipeline scripts and exit codes, weight 0.10, weak backing: https://dojofive.com/blog/how-ci-pipeline-scripts-and-exit-codes-interact/).

## The one interactive moment: FIDO2 unlock

The single place in the yubiOS boot chain where a human prompt appears is the FIDO2 unlock of the encrypted root. With systemd-cryptenroll, enrolling a FIDO2 token into the LUKS2 header defaults to requiring both client PIN and user presence, and both are individually controllable with `--fido2-with-client-pin` and `--fido2-with-user-presence` (systemd-cryptenroll man page, weight 0.77: https://freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html).

At boot the interaction is: the system prompts for the FIDO2 PIN if enabled, then requests a touch of the YubiKey to confirm presence (ArchWiki systemd-cryptenroll, weight 0.66: https://wiki.archlinux.org/title/Systemd-cryptenroll). Users report the same two-step prompt in practice: PIN first, then touch (a walkthrough of YubiKey LUKS unlock, weight 0.35, weak backing: https://mhdez.com/posts/unlocking-encrypted-linux-with-a-yubikey/). With multiple FIDO2 tokens enrolled, systemd-cryptsetup attempts to identify the right one, and tokens requiring user verification can produce sequential prompts for each enrolled device (systemd-cryptenroll man page, weight 0.77: https://freedesktop.org/software/systemd/man/latest/systemd-cryptenroll.html).

This moment belongs to the boot-unlock path, not to attestation. The distinction matters for the mode table: an interactive prompt in the unlock path is a security feature (presence proof), while an interactive prompt in an attestation step would be a design bug (the step would hang in CI and at boot).

## What non-interactive mode requires from the tools

Running without a TTY imposes requirements that are easy to miss when testing in a terminal:

1. Every step must have an exit code. The exit-code contract (doc 08) is what replaces the conversation a human would otherwise have.
2. Failure output must go somewhere durable. A daemon's diagnostics live in stdout/stderr and are read back through journalctl (Falco troubleshooting docs, weight 0.92: https://falco.org/docs/troubleshooting/start-up-error/).
3. Validation must be possible without side effects, so CI can run the dry-run forms (doc 06) rather than the enforcing forms.

Interactive inventory-style checks do exist in the wider ecosystem, for example inspection scripts that check Secure Boot certificate status and are designed to run unattended from management tooling (Technibble resource, weight 0.04, weak backing: https://www.technibble.com/forums/resources/powershell-scripts-to-analyze-2023-secure-boot-certificate.34/), but the attestation steps themselves stay non-interactive.

## The batch contract is the CI contract

Because the same commands run in CI and at boot, the batch mode inherits an important property: the CI run and the boot run should agree. `sbverify --cert` in CI and the firmware's signature check at boot verify the same relationship between image bytes and a key; `veritysetup verify` in CI and the kernel's mount-time check verify the same hash tree. Divergence between the two runs is a bug class of its own (a CI pass that boots into refusal usually means the two runs checked different inputs, not different logic).

The mode table's honest summary: attestation is non-interactive everywhere, the FIDO2 touch is interactive once, and every other prompt you might see in testing is a sign you are running a step outside its intended mode.
