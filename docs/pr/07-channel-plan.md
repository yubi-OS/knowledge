# 07 - Channel plan and pitch angles

Scope: the 6 owned channels with roles and cadences, the earned and community channels with per-outlet timing rules, and the 6 pitch angles keyed to minimum gates and proof assets.

Grounding spine: yubi-OS/yubiOS docs/PR.md, sections "Channel plan" and "Pitch angles by maturity".

## Owned channels

The campaign's canonical surface is owned; social accounts route to it rather than replacing it (source doc: yubi-OS/yubiOS docs/PR.md):

| Channel | Role | Cadence |
|---|---|---|
| GitHub repository and releases | Canonical evidence and conversion point | Every material proof or release |
| Project site | Plain-language story, status, tested hardware, press kit | Update before each wave |
| Engineering notes under refs/ | Dated evidence and corrections | Every substantial research/proof cycle |
| Short demo video | Make physical presence and recovery legible | Gate 2 and Gate 3 |
| Project mailing list or newsletter | Durable update channel independent of social algorithms | Monthly or milestone-only |
| Maintainer social accounts | Route people to canonical evidence and answer questions | Concentrated around proofs |

## Earned and community channels

The governing rule: pitch only when the project has evidence appropriate to the outlet (source doc). The plan names 8 outlet groups with their angle and approach (source doc, with dig corroboration for the 2 outlets whose submission mechanics were verified):

| Channel | Best angle | Timing and approach |
|---|---|---|
| LWN | Deep technical architecture, systemd/bootc/FIDO2 composition, upstream lessons | Submit a concise evidence-backed story tip after Gate 2; LWN asks that general story submissions use its central address rather than individual writers |
| Phoronix | Named ARM64 hardware, boot results, performance or compatibility evidence | Send a news tip only when there is a reproducible hardware milestone |
| The Register | Owner control versus vendor trust, the AI-built/AI-resilient paradox, honest limitations | Brief Linux/open-source or security staff at Gate 2 or Gate 3 with proof; their contact guidance explicitly values documents and screenshots |
| The New Stack | A timely argument about verifiable image-based Linux and owner-held identity | Pitch analysis with a reason it matters that week; its current guidance says it wants a point of view rather than a generic technical tutorial |
| Fedora Magazine | Practical bootc integration and lessons that benefit Fedora users | Coordinate with the Fedora/bootc community; make the article useful without requiring adoption of yubiOS |
| OpenSSF community | Production/test separation, pinned inputs, provenance verification, AI-era contribution controls | Participate before pitching; offer a case study or tech talk, not a product announcement |
| Hacker News | A working demo and candid technical trade-offs | Use Show HN only after people can run or inspect something meaningful; post in the maintainer's own voice and stay available for the full discussion window |
| bootc, systemd, Fedora, OP-TEE, TF-A, U-Boot, and FIDO communities | Upstream-relevant findings and review requests | Engage through their normal issue, discussion, mailing-list, or conference processes; never drop a cross-posted press release |

Dig corroboration on submission mechanics: the LWN FAQ confirms that story submissions, questions, and general issues go to the central address lwn@lwn.net (https://lwn.net/op/FAQ.lwn, jev weight 0.61), which is exactly the "central address" rule the source doc encodes. The Hacker News guidelines confirm the norms the source doc relies on, including submitting the original source rather than a secondary writeup (https://news.ycombinator.com/newsguidelines.html, jev weight 0.62). LWN's homepage (https://lwn.net/, jev weight 0.45) and the Articles note repeating the submission address (https://lwn.net/Articles/14056/, jev weight 0.54) are corroborating only.

The document closes the earned-channel section with a spending rule: do not buy a mass press-release wire for the first campaign, because the audience is narrow, proof-sensitive, and more likely to respond to a primary artifact or direct technical briefing (source doc).

## Pitch angles by maturity

Each angle carries a hook, the minimum gate that must pass before it may be used, and the proof asset that must exist (source doc):

| Angle | Hook | Minimum gate | Proof asset |
|---|---|---:|---|
| The key is the owner control plane | One physical token spans signing, unlock, SSH, and PAM without making a TPM the sole owner gate | 2 | Four-workflow demo plus recovery |
| Why immutable is not enough | Verified /usr still leaves firmware, writable state, update selection, and active sessions as real boundaries | 1 | Threat-model walkthrough and failure demo |
| AI-built, verification-first | AI can accelerate both building and poisoning; authority must come from controls beyond authorship | 1 | Policy/provenance evidence and an honest semantic-safety caveat |
| ARM64 lets owners reach below the UKI | Open board firmware paths offer an ownership story unavailable on ordinary x86 PCs | 3 | Named-board Path A proof and provisioning record |
| A failed CI run can be a useful artifact | Publishing what a VM proved and exactly where it stopped builds more trust than a green badge alone | 1 | Dated CI evidence, correction, and follow-up run |
| Security for a solo owner, not only a fleet | Hardware-backed control and verification should not require an enterprise relationship | 2 | Tested setup, cost disclosure, recovery, and usability notes |

The gate column is the enforcement point: 2 angles are available from Gate 1 (the two earliest), 2 more unlock at Gate 2, and the ARM64 story waits for Gate 3. Nothing in the plan lets a channel be used before its evidence exists (source doc).
