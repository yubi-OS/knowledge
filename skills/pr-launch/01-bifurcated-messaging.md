# 01 - Bifurcated Messaging: One Project, Two Stories

**Scope:** How the pr-launch skill writes separate technical and general message frameworks for the same project, so the story travels to engineers and to privacy-conscious users without being diluted for either.

Ground spine: the source doc, yubi-OS/yubiOS skills/pr-launch/SKILL.md, section "Message Frameworks". Every claim below is attributed either to the source doc or to a dug result with its URL and jev noul weight.

## The two audiences are defined by channel, not by tone alone

The source doc fixes two audience definitions with explicit channel lists. The technical audience is "Linux engineers, security researchers, homelab operators, corporate Linux admins" reached through HN, LWN.net, r/linux, r/netsec, r/linuxhardware, Phoronix, The Register, and Lobste.rs. The general audience is "privacy-conscious users tired of vendor lock-in, people who own YubiKeys and don't know this is possible, hardware enthusiasts" reached through r/privacy, r/hardware, broader tech press (Ars Technica, Wired), and product-focused newsletters.

This is a routing-first definition: you decide what the story is by deciding where it has to run. The dug corpus supports the routing-first view. The TODO Group's marketing guide for open source projects states that "Marketing is as crucial as code to any open source project's success" and that organizations participating in projects play a vital role in a sustainable ecosystem (https://todogroup.org/resources/guides/marketing-open-source-projects/, weight 0.55). The developer-marketing playbook at tools.gingiris.com makes the audience-default point explicitly: most technical founders communicate for technical audiences by default, which is fine when the buyers or users are technical, and wrong when they are not (https://tools.gingiris.com/blog/2026/03/24/developer-marketing-playbook-how-to-reach-technical-audiences-in-2026/, weight 0.18, weak backing).

## The technical headline carries the differentiator as a parenthetical

The source doc's technical headline pattern is a "Show HN" title that names the project, states the technical claim, and brackets the differentiator: "Show HN: yubios - bootable Linux with YubiKey as the only root of trust (no TPM)". The "(no TPM)" parenthetical is doing audience-filtering work: an engineer who cares about the TPM question self-selects in.

The technical core message then leads with the mechanism and the failure of the default: YubiKeys are ubiquitous in enterprise security, they support FIDO2/U2F, PIV/CCID, and resident keys, yet most Linux distributions still build their security model around a TPM that is OEM-controlled, opaque, and often absent on ARM hardware (source doc). Supporting points are all verifiable specifics: TPM-free means it works on any hardware including Surface Snapdragon ARM64; every decision has a source citation or ADR; pam-u2f is pinned to >= 1.3.1 because of CVE-2025-23013 (YSA-2025-01); onboarding walks from zero to resident SSH keys in under 10 minutes (source doc).

## The general headline is second-person and outcome-shaped

The general headline is "This bootable Linux uses your YubiKey for everything - boot, encryption, login, SSH". The core message reframes ownership: if you have a YubiKey, you already have better security hardware than most laptops ship with (source doc). Supporting points drop every acronym barrier: works on mainstream hardware including Microsoft Surface, step-by-step onboarding where "you don't need to know what FIDO2 is to start", keys never leave the YubiKey hardware, open source and auditable (source doc).

The dug corpus converges on the same mechanism, described as reordering rather than rewording. The prolificstudio guide states: "Learning how to explain technical products starts with reordering, not rewording. Outcome first, mechanism second, proof third. Lead with what it does for them, then" the mechanism (https://prolificstudio.co/blog/explain-technical-products-to-non-technical-buyers, weight 0.24, weak backing). Lucidchart's guide makes the stakeholder point: any project has many stakeholders, and technical information has to be translated for senior and executive stakeholders rather than repeated (https://www.lucidchart.com/blog/how-to-explain-technical-ideas-to-a-non-technical-audience, weight 0.21, weak backing). Forbes' communications council frames the need the same way: powerful technologies create the need to explain them to nontechnical audiences, for example nontechnical staff inside the same organization (https://www.forbes.com/councils/forbescommunicationscouncil/2024/09/16/how-to-explain-complex-tech-products-to-nontechnical-audiences/, weight 0.34, weak backing). The artech guide collects six strategies for the same translation problem (https://www.artech.com/blog/communicating-tech-concepts-to-non-technical-audience/, weight 0.25, weak backing).

## The banned-word rule is a positioning rule

The source doc bans "revolutionary," "game-changing," and anything that sounds like marketing from the technical track, on the grounds that these words "signal insecurity. Let the tech speak." This is not a style preference. In a channel like HN where the readers are the people who would have written the code, hype language is a credibility tax, and the anti-pattern section repeats it as guideline 5.

The general track does not get the same ban, but it gets a different constraint: no assumed knowledge. The general post explains what the chain does for the reader (proves the OS has not been tampered with, unlocks the drive, keeps SSH keys off disk) without requiring FIDO2 literacy (source doc).

## Same project, different story, one truth

Both frameworks must stay consistent with the repo. The technical story and the general story name the same 4 integration points (Secure Boot key custody via PIV, disk unlock via FIDO2, app auth via pam-u2f, SSH via resident ed25519-sk) at different levels of detail (source doc). Nothing in either track invents a capability the repo cannot demonstrate, because the first technical reader will check.

Note on drift: the dug results on this subtopic are all post-hoc practitioner or vendor guides with weak-to-moderate weights, so they are used here as corroboration of the reordering principle, not as the source of the audience definitions. The audience definitions come from the source doc.
