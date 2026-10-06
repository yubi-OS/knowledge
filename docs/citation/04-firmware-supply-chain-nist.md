# 04 - Firmware supply chain hardening (NIST)

Scope: the NIST special publications the citation doc names for firmware-supply-chain hardening: SP 800-147, SP 800-155 (draft), and SP 800-193. Grounded in yubi-OS/yubiOS [docs/CITATION.md](https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/CITATION.md) (source doc); dig claims carry URL and jev weight.

## What the source doc cites

The source doc's "Firmware-supply-chain hardening (NIST)" section lists 3 primary sources [source doc: yubi-OS/yubiOS docs/CITATION.md]:

1. NIST SP 800-147, *BIOS Protection Guidelines*, https://csrc.nist.gov/pubs/sp/800/147/final
2. NIST SP 800-155 (Draft), *BIOS Integrity Measurement Guidelines*
3. NIST SP 800-193, *Platform Firmware Resiliency Guidelines*, https://csrc.nist.gov/pubs/sp/800/193/final

## SP 800-193, verified by dig

The authoritative CSRC landing page for SP 800-193 is https://csrc.nist.gov/pubs/sp/800/193/final (jev weight 0.96). Its abstract states that the document provides technical guidelines and recommendations supporting resiliency of platform firmware and data against attack. The NIST publication-database entry (https://www.nist.gov/publications/platform-firmware-resiliency-guidelines, jev weight 0.93) mirrors that language, and the official PDF lives on the NIST publications server at https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-193.pdf (jev weight 0.93). A second NIST database entry (https://www.nist.gov/publications/platform-firmware-resiliency-guidelines-0, jev weight 0.9) identifies the author as Andrew Regenscheid. The CSRC also hosts the page for the initial public draft revision at https://csrc.nist.gov/Pubs/sp/800/193/IPD (jev weight 0.9). One high-weight mirror domain (https://csrc.nist.rip/publications/detail/sp/800/193/final, jev weight 0.7) is recorded but is a look-alike mirror, not csrc.nist.gov itself; it is labeled here and not used as the citation target.

## SP 800-147, verified by dig

The CSRC final page for SP 800-147 is https://csrc.nist.gov/pubs/sp/800/147/final (jev weight 0.93), which states that the document provides guidelines for preventing the unauthorized modification of BIOS firmware. The legacy-format PDF is at https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-147.pdf (jev weight 0.88), and the NIST publication page (https://www.nist.gov/publications/bios-protection-guidelines, jev weight 0.87) dates the publication April 29, 2011. The dig also surfaced SP 800-147B, the server-focused successor for BIOS protection on modern systems (https://csrc.nist.gov/pubs/sp/800/147/b/final, jev weight 0.93); the source doc does not cite 147B, and this corpus records it as adjacent context only, not as a source-doc claim. [source doc boundary: the source doc lists only 800-147]

## SP 800-155, verified by dig, draft status confirmed

The source doc labels SP 800-155 as "(Draft)" [source doc]. The dig confirms this is still accurate: the CSRC page at https://csrc.nist.gov/pubs/sp/800/155/ipd (jev weight 0.86) is an initial public draft, and its abstract states that the document outlines the security components and security guidelines needed to establish a secure Basic Input/Output System. SP 800-155 never reached a final SP under that number in the dig results; the CSRC URL path segment "ipd" matches the source doc's draft annotation. No contradiction between the source doc and the dig was found for this publication.

## How the 3 publications fit yubiOS

The 3 publications form a staircase, and the source doc's grouping makes the role of each visible [source doc: yubi-OS/yubiOS docs/CITATION.md]:

1. SP 800-147 (2011) is the prevention baseline: BIOS updates must be authorized, protected in transit, and verifiable.
2. SP 800-155 (draft) is the measurement layer: the BIOS establishes a baseline and measures changes into an integrity mechanism, which is the same architectural idea yubiOS carries into its measured-boot event logs.
3. SP 800-193 is the resiliency layer: protection plus detection plus recovery, so a platform can return to a known-good firmware state.

Numbering note: the dig shows SP 800-147 published April 29, 2011 (https://www.nist.gov/publications/bios-protection-guidelines, jev weight 0.87); the source doc does not give years for the NIST publications, so the date here is dig-sourced, not source-doc-sourced.

## Weak and off-topic results

One low-relevance result (the NIST agency homepage, https://www.nist.gov/, jev weight 0.96) scored high on source class but carries no topical content for this subtopic; it is recorded for provenance and not cited for any claim. No aggregator or forum results survived into this subtopic's citation set; NIST's own CSRC and nvlpubs properties dominated both queries.
