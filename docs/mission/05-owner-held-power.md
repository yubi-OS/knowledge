# 05: Concentrated power and responsibility

Scope: the source doc's section on the root of trust as concentrated power, the owner-only holding rule, and the discipline around irreversible operations.

## What the source doc claims

The source doc (yubi-OS/yubiOS docs/MISSION.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) states: "A root of trust is concentrated power. Whoever holds the signing key, the ROTPK, or the RPMB write key holds the machine" (source doc). yubiOS's stance is that this power belongs to the owner of the hardware and to no one else: not the OEM, not the SoC vendor, not us (source doc).

The responsibility cuts inward too. Irreversible operations (fuse burns, RPMB key writes, Secure Boot key enrollment) are treated like production secrets: documented, rehearsed on sacrificial hardware, never automated past a human gate (source doc). Recovery paths are mandatory, because "locking an owner out of their own machine is a failure of exactly the power we claim to return to them" (source doc).

## Why the RPMB key is on this list

The dig set explains what the RPMB write key actually controls, and why its ownership is a power question rather than a configuration question. All weights below are weak (< 0.5).

- An eMMC security explainer states the RPMB authentication key "needs to be created in a secure environment like in an OEM production, written to the RPMB device, and securely stored somewhere" (https://sergioprado.blog/rpmb-a-secret-place-inside-the-emmc/, weight 0.07, weak). That is the default world the source doc is arguing against: keys provisioned in OEM production.
- The vendor application note from SkyHigh Memory describes RPMB's purpose of protecting data from replay attacks and lists secure key storage among its real-life uses (https://www.skyhighmemory.com/download/applicationNotes/Understanding%20and%20Using%20eMMC%20RPMB.pdf, weight 0.20, weak). A Western Digital white paper describes RPMB as a self-contained security protocol with its own command opcodes and data structures, involving a shared key (https://documents.westerndigital.com/content/dam/doc-library/en_us/assets/public/western-digital/collateral/white-paper/white-paper-emmc-security.pdf, weight 0.16, weak).
- On ownership: a Super User answer records that TEE solutions essentially claim ownership of the RPMB partition, with a unique key established during the manufacturing process (https://superuser.com/questions/1645249/how-should-emmc-rpmb-shared-keys-be-stored, weight 0.05, weak). A DFRWS forensic paper states that the security of data stored in RPMB relies on the secure storage of the pre-shared secret key (https://dfrws.org/wp-content/uploads/2024/03/Exploiting-RPMB-authentication-in-a-clos_2024_Forensic-Science-International.pdf, weight 0.22, weak).
- OP-TEE's secure-storage documentation describes deriving keys from secrets to avoid storing them in memory, reducing attack surface (https://optee.readthedocs.io/en/latest/architecture/secure_storage.html, weight 0.37, weak), the strongest-weighted result in this subtopic and one that shows the TEE-side key management the source doc's owner-first stance would have to subordinate.

Reading these together: whoever writes the RPMB key owns the anti-replay storage root for the life of the device, and the default provisioning story puts that act in the OEM's factory. The source doc's "not the OEM" (source doc) is therefore not rhetorical; it names the exact actor the default flow empowers. Two aggregator results (https://laptopjudge.com/what-is-rpmb-secure-storage-in-emmc/, weight 0.07; https://www.scribd.com/document/891814444/RPMB-A-Secret-Place-Inside-the-EMMC-Sergioprado-blog, weight 0.12) repeat the same mechanism and are recorded for completeness.

## The human gate on irreversible operations

The source doc treats fuse burns, RPMB key writes, and Secure Boot key enrollment as a class: operations that cannot be undone and therefore cannot be automated past a human gate (source doc). The dig set did not return results on secure-boot enrollment risk specifically, so the general claim (irreversibility plus recovery planning) is grounded in the source doc, with the RPMB mechanics above providing the technical texture.

The design logic is visible in the doc's own framing: because the owner holds the power, the owner also carries the risk of locking themselves out, and mandatory recovery paths are the doc's answer to that asymmetry (source doc). This pairs with doc 04's finding that even vendor documentation warns bad recovery processes reintroduce the social-engineering vulnerabilities hardware keys exist to prevent (Yubico, https://www.yubico.com/authentication-standards/fido2/, weight 0.37, weak): recovery is not an afterthought in either direction.
