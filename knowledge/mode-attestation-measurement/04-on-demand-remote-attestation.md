# On-demand remote attestation: the quote as a requestable verdict

Scope: the remote attestation quote as the on-demand, non-interactive execution mode: who triggers it, what it proves, why it is idempotent, and what its exit contract looks like.

## The mode

A quote is generated when someone asks for it: a verifier, a CI job, or an operator. This is the third mode in the corpus. It is not one-shot-at-boot (the trigger is not the firmware) and not daemon-streaming (the output is a single verdict, not an event flow). It is a request/response interaction with an attestation service, and it is non-interactive throughout: nothing in the quote path prompts a human.

Keylime is the reference implementation of this shape. Its agent is a long-running service on the attested system that communicates with the TPM to generate quotes and collects IMA and measured boot event logs (Keylime agent man page, weight 0.82: https://keylime.readthedocs.io/en/latest/man/keylime_agent.8.html). The cloud verifier requests quotes from agents and validates them against the agent's public key (DeepWiki on Keylime attestation, weight 0.63: https://deepwiki.com/keylime/keylime/3-attestation-and-verification). Keylime as a whole provides remote boot attestation and runtime integrity measurement on a hardware root of trust (keylime.dev, weight 0.85: https://keylime.dev/).

## What a quote proves

The quote is a cryptographic signature over the state of the PCRs. The TPM signs a hash of the PCR values with a key only the TPM knows, and the verifier checks the signature against the TPM's public key (Keylime attestation security docs, weight 0.97: https://keylime.readthedocs.io/en/latest/design/security.html). An important subtlety of TPM2_Quote: the PCR values themselves are not inside the quote. The verifier reviews the (unsigned) event log, checks that replaying it leads to the PCR values the client also supplied, and then verifies that the hash of those PCR values is what the quote signed (tpm.dev TPM2_Quote tutorial, weight 0.77: https://github.com/tpm2dev/tpm.dev.tutorials/blob/master/TPM-Commands/TPM2_Quote.md). A verifier can also request a signed quote for a specific PCR such as PCR 10 to check the IMA measurement list against an allowlist (SUSE Security and Hardening Guide, weight 0.90: https://documentation.suse.com/sle-micro/5.3/html/SLE-Micro-all/cha-security-attestation.html).

So the quote proves: at the moment of the request, the TPM held these PCR values, signed by the hardware. Combined with the event log it proves how those values were derived. It does not by itself prove the log is complete or the values are good; policy comparison happens in the verifier.

## Why the mode is idempotent

Generating a quote changes no persistent state on the platform. PCR values are inputs, not outputs, of the quote operation. Two quotes in a row on an unchanged machine return signatures over the same PCR digest, differing only in freshness. That is what distinguishes this mode from the measurement mode (doc 02), where every event mutates the PCR state. The quote is safe to re-run after any interruption, which makes it suitable for both CI verifiers and polling verifiers without special resume logic.

The server side of the check needs no TPM at all: quote verification is ordinary software, which is what makes the verifier side easy to run anywhere (safeboot tpm2-attest, weight 0.59: https://safeboot.dev/attestation/). The tpm2-tools suite splits the roles the same way: tpm2_quote on the device, tpm2_checkquote on the verifier (DeepWiki on tpm2-tools quoting, weight 0.59: https://deepwiki.com/tpm2-software/tpm2-tools/3.4.1-quoting-and-certification). Standalone verification libraries exist for the same purpose (tpm2-quote-attest, weight 0.31, weak backing: https://github.com/Kioubit/tpm2-quote-attest).

## The exit contract and the dry-run gap

In yubiOS the quote step carries an explicit exit contract in batch use: exit 0 means the quote verified, exit 2 means the quote was refused, and any other code is an operational error. This is a design convention of the project's attestation tooling rather than a property of the TPM hardware.

The dry-run story for this mode is the least developed of the modes in this corpus: a `--dry-run` for the quote path is proposed but not shipped. Until it exists, the only way to exercise the verifier against a real quote is to run the full request, which couples the check to platform availability. The gap is worth naming because it is the only mode in the chain where a wrong exit code is indistinguishable from a wrong verdict without a second quote to compare against.

## What the mode cannot prove

A quote proves the PCR state at request time. It cannot prove what happened between requests (that is the streaming daemon's territory, doc 03), and it cannot prove the attested machine is the machine you think it is unless the verifier anchors the TPM key, for example through a credential established at provisioning (TigerTrust attestation guide, weight 0.51: https://www.tigertrust.io/guides/tpm-attestation). The on-demand mode therefore composes with the boot-time modes rather than replacing them: the boot chain fills the PCRs, the daemon watches continuously, and the quote answers "prove it now" whenever asked.
