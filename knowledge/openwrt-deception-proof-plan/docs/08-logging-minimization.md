# 08: Logging minimization and notifications

Scope: Minimal-metadata logging for decoy services: what to store, what never to store, retention defaults, and notification payloads.

## The minimal record

The proof plan fixes the logging contract: store minimal metadata only. The permitted fields are:

1. Timestamp
2. Source address and port
3. Decoy address and port
4. Connection duration
5. Service action

Retention defaults are short and owner-configurable. Everything else is excluded by construction, not by policy review: attempted passwords, private keys, command payloads, banners that include secrets, and packet payload bodies are never stored. With Endlessh as the decoy, this contract is nearly free: the tarpit never completes an SSH handshake, so no credentials or commands ever arrive (https://github.com/skeeto/endlessh, weight 0.91, see doc 04). The discipline matters for the package's logging layer and the notification path, which must transmit the same minimal tuple.

## Why the exclusion list is the right default

High-interaction honeypots record everything an attacker does, and research datasets show what that looks like: a 4-month dataset of interactive SSH honeypot logs and command payloads provides high-fidelity telemetry of post-authentication behavior including raw command-line payloads, so researchers can differentiate attacker behaviors (https://www.sciencedirect.com/science/article/pii/S2352340926004129, weight 0.88; the same dataset is mirrored on Zenodo, https://zenodo.org/records/20052407, weight 0.92). That is exactly the data class the yubiOS decoy refuses to collect: once a decoy logs raw payloads and credential attempts, it becomes a store of sensitive captured material on the router itself, which raises the cost of any compromise or subpoena far above the signal value for a home or lab deployment.

Low-interaction SSH honeypots that log every authentication attempt and drop successful logins into emulated shells sit in the middle of this spectrum (https://github.com/Alternated/ssh-honeypot, weight 0.46, weak backing). The plan's position is deliberately at the minimal end: detect and count, do not harvest.

## Notification payloads

The owner-selected notification path receives an event count, source, and decoy tuple, not sensitive payloads. The notification is a summary channel: how many decoy connections occurred, from which sources, against which decoys. Because the underlying log holds only the same fields, the notification cannot leak more than the log contains, which keeps the notification path (email, webhook, or otherwise) out of the sensitive-data handling perimeter.

## Isolation context

Honeypot isolation guidance reinforces the same posture: proper isolation uses network segmentation and containment controls so attackers gain nothing from the decoy while the operator gains intelligence (https://www.danharkey.com/posts/honeypot-isolation-controls-that-keep-attackers-contained, weight 0.52, mid-strength secondary source). On OpenWrt the segmentation is the WireGuard zone boundary from doc 05; the logging contract here is the data-side half of the same containment.

## Retention design

Defaults the ADR should pin:

1. Short retention by default, owner-configurable, expressed in the UCI config (for example a log rotate count and an expiry interval).
2. Logs stored on the router or the owner's chosen sink, not a third-party service.
3. Deletion on package uninstall leaves no orphaned decoy logs.
4. The evidence run itself respects the same rules: packet captures are header-only (see doc 07), and no evidence artifact contains payloads.

## Proof requirements for the logging stage

The logging proof passes when:

1. Service logs contain only the five permitted fields for every recorded event.
2. A grep-based audit of the log store finds no password strings, key material, or payload bodies.
3. Retention settings from UCI are honored: reducing the retention value deletes older entries.
4. The notification path delivers the count/source/decoy tuple and nothing else.
5. Uninstall removes logs, or leaves them in the owner-controlled location the ADR specifies.

General OpenSSH background (encrypted transport, no eavesdropping) is context for why the real endpoint's logs are out of scope here (https://www.openssh.org/, weight 0.77). Curated honeypot resource collections exist for survey purposes only (https://github.com/paulveillard/cybersecurity-honeypots, weight 0.47, weak backing). General honeypot best-practice articles recommending "thorough logging" point in the opposite direction of this plan's minimization contract and should not be cited as support for it (https://www.thelasttech.com/post/honeypot-in-cybersecurity, weight 0.25, weak backing; https://www.privacyengine.io/resources/glossary/honeypots/, weight 0.22, weak backing).
