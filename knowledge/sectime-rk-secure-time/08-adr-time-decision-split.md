# ADR decision split: what may consume secure elapsed time

Scope: the ADR decision split from the yubiOS refs source doc, decisions allowed to use secure-world elapsed time versus decisions that require stronger state such as RPMB or fTPM NV counters, sealed state, or verifier freshness, grounded in the mechanisms each side actually needs.

## What the strong side looks like in OP-TEE

OP-TEE's secure storage documentation states the rollback-protection mapping directly: with `CFG_RPMB_FS=y` the protection against rollback is controlled by the TEE and the protection level is set to 1000; with `CFG_RPMB_FS=n` there is no protection against rollback and the protection level is set to 0 (weight 0.59, authoritative backing: https://optee.readthedocs.io/en/latest/architecture/secure_storage.html). The RPMB-specific documentation describes the RPMB secure storage implementation enabled by `CFG_RPMB_FS=y`, usable by Trusted Applications via the `TEE_STORAGE_PRIVATE_RPMB` storage ID (weight 0.96, authoritative backing: https://optee.readthedocs.io/en/3.16.0/architecture/secure_storage.html).

The mechanism is the eMMC RPMB partition's hardware-enforced write counter: an independent writeup of the NXP OP-TEE fork describes the RPMB file system as using the eMMC RPMB partition, which provides hardware-enforced write counter functionality to prevent rollback attacks, at the cost of limited capacity (weight 0.60, authoritative backing: https://deepwiki.com/nxp-imx/imx-optee-os/2.5-secure-storage).

The same pattern generalizes beyond eMMC: Intel's Dynamic Application Loader documentation describes monotonic counters as allowing trusted applications to detect offline storage data replay attacks, with a separate counter per applet (weak backing, weight 0.43: https://www.intel.com/content/www/us/en/docs/dynamic-application-loader/developer-guide/1-0/monotonic-counters.html). An academic treatment of rollback defense likewise references TPMs and trusted hardware supporting secure persistent storage or monotonic counters adapted for rollback defense (weak backing, weight 0.37: https://newtraell.cs.uchicago.edu/files/ms_paper/bd3.pdf).

## Why freshness for remote attestation needs a nonce, not a clock

For anything a remote verifier consumes, the freshness primitive is challenge-response, not elapsed time. The IETF LAMPS draft on attestation freshness states that when an end entity includes attestation statements in a Certificate Signing Request, the freshness of the conveyed Evidence often needs to be established, and the common mechanism is a nonce obtained from a Relying Party or Verifier and included by the Attester in the Evidence (weight 0.83, authoritative backing: https://datatracker.ietf.org/doc/draft-ietf-lamps-attestation-freshness/). Earlier draft revisions carry the same position: nonces are provided by an RA or CA to the end entity for inclusion in Evidence (weight 0.82, authoritative backing: https://www.ietf.org/archive/id/draft-ietf-lamps-attestation-freshness-01.html; weight 0.80, authoritative backing: https://www.ietf.org/archive/id/draft-ietf-lamps-attestation-freshness-00.html).

The RATS architecture RFC defines the roles this maps onto: the Attester produces believable information about itself (Evidence) to enable a remote Relying Party to decide whether to consider the Attester trustworthy (weight 0.85, authoritative backing: https://datatracker.ietf.org/doc/html/rfc9334). A vendor implementation guide shows the production pattern: remote attestation proving which code is running inside a deployment, verifier-side (weight 0.94, authoritative backing: https://docs.cohere.com/docs/model-vault/encrypted/attestation).

## The split, per the yubiOS refs source doc

The source doc (sectime-rk-secure-time-2026-07-17) requires future ADR language to separate:

Decisions allowed to use secure-world elapsed time: same-boot ordering, telemetry timestamps marked as TEE-elapsed, and Frost event sequencing.

Decisions that require stronger state: lockout persistence, owner recovery cooldowns, anti-rollback, remote attestation freshness, and anything crossing reboot or power loss. Those need RPMB or fTPM NV counters, sealed state, or verifier freshness.

The dig supports each half of the split with the mechanism that makes it true. The allowed half works because the CNTPCT-backed source is monotonic within a boot (doc 02, doc 06). The forbidden half fails because a clock resets at power loss and carries no anti-rollback property; the matching primitives are hardware write counters (RPMB, weight 0.96, doc above), monotonic counters (Intel pattern, weak backing 0.43), and verifier-supplied nonces for freshness (IETF drafts, weights 0.82 to 0.83). An ADR that conflates the two halves inherits an attacker-controlled clock in exactly the decisions where an adversary profits most, such as extending a lockout or cooling down an owner recovery path.
