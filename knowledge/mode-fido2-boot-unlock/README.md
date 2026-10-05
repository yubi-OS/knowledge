# mode-fido2-boot-unlock

Knowledge corpus on FIDO2 unlock at boot as an execution-mode problem: the one interactive step in an otherwise automated boot chain, its modes of operation at each boundary, and what it means for unattended systems.

## Docs

| NN | doc | scope |
|---|---|---|
| 01 | 01-luks2-root-unlock-mode.md | systemd-cryptsetup FIDO2 unlock of the LUKS2 root volume in the initrd: interactive touch, token retries, fallback to the passphrase prompt |
| 02 | 02-homed-home-unlock-mode.md | systemd-homed FIDO2 unlock at login: prompt loop, passphrase fallback, home stays locked on no touch |
| 03 | 03-pam-u2f-login-gate.md | pam-u2f login gate: interactive touch, cue, sequential key attempts, then denial |
| 04 | 04-unattended-reboot-semantics.md | unattended reboot semantics with FIDO2-only unlock: the machine waits, and the network paths not taken |
| 05 | 05-ci-software-authenticator.md | the non-interactive CI leg: a software FIDO2 authenticator answers instantly in a VM |
| 06 | 06-hardware-ci-usb-passthrough.md | the hardware CI leg: a real YubiKey over USB passthrough with touch policy managed |
| 07 | 07-exit-semantics-idempotency.md | exit semantics and idempotency: same key, same volume key, no partial state |
| 08 | 08-why-interactive-exception.md | why the interactive touch is the deliberate exception in the automated boot chain |
| 09 | 09-fido2-user-presence-boot.md | user presence, signed presence bits, and authenticator timeouts under CTAP2 and libfido2 |

## Research summary

- Results collected: 108 raw from 18 searXNG queries (2 per subtopic), 82 kept after URL deduplication.
- Weight split (jev noul, model clef): 48 results at weight >= 0.5 (authoritative backing), 34 results below 0.5 (weak backing, labeled in text).
- jev requests: 19 total (1 preflight probe, 1 outline validation with 9 score questions, 17 noul weighting batches of 5). Usage: 14983 input tokens, 0 output tokens.
- Redos: 0 dig redos. 7 transient 429s on /api/decide during weighting were retried per the redo rule and all succeeded; no results shipped unweighted.
- Skipped docs: none. All 9 subtopics authored; none scored 0 in outline validation.
- Outline validation: scores 0.72 to 1.87 on the 0 to 2 scale; no subtopic dropped.

Preflight 2026-10-05: searXNG 85 results healthy; /api/decide (clef) 200
