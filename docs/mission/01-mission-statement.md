# 01: The mission statement and structural trust

Scope: the mission statement itself, the builder-tool paradox it names, and the structural-not-procedural trust answer the source doc gives.

## The statement

The source doc (yubi-OS/yubiOS docs/MISSION.md, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/docs/MISSION.md) states the mission in one line: "To build AI resilient systems using AI." Last reviewed 2026-07-11. The doc immediately names the paradox: yubiOS is built, reviewed, and tested with heavy AI assistance, and the same class of tools that accelerate development can also generate plausible-looking code, forge provenance, and automate supply-chain attacks at scale (source doc). The conclusion it draws is that shipped systems must hold up even when the thing that built them cannot be trusted (source doc).

## The threat the paradox names is measured, not hypothetical

External research corroborates the attack surface the source doc describes, though every dig result for this subtopic weighted below the 0.5 authoritative line (weak backing throughout).

- Volume: a 2026 mid-year report from phoenix.security claims 59 supply-chain campaigns and 657 malicious packages in the first half of 2026, with zero CVEs issued for them (https://phoenix.security/accelerating-supply-chain-attacks-npm-pypi-vsx-ai-enabled-2026/, weight 0.09, weak). The same publisher's two-year acceleration report claims growth from 6 campaigns in 2024 to 52 in 2026 through mid-July (https://phoenix.security/open-source-supply-chain-attacks-2024-2026/, weight 0.12, weak).
- AI-specific technique: the Cloud Security Alliance research note on slopsquatting records security researcher Andrew Nesbitt's April 2026 observation that agents resolve packages programmatically, without a human glancing at the result (https://labs.cloudsecurityalliance.org/research/csa-research-note-slopsquatting-ai-supply-chain-20260419-csa/, weight 0.12, weak). A practitioner writeup defines slopsquatting as adversaries registering package names that AI coding assistants tend to hallucinate (https://cloudradix.com/blog/slopsquatting-ai-coding-hallucinated-packages-defense-2026/, weight 0.05, weak).
- Scale of single incidents: a 2026 npm compromise of 140+ Mastra AI packages in 19 minutes is attributed to North Korea's Sapphire Sleet by tech-insider.org (https://tech-insider.org/npm-supply-chain-attack-2026/, weight 0.05, weak); a LinkedIn post covering the May 12, 2026 TanStack/Mistral AI/Guardrails AI compromise claims 170+ npm/PyPI packages affected (https://www.linkedin.com/pulse/just-new-supply-chain-attack-today-may-12-2026-tanstack-chandra-sfawc, weight 0.05, weak).

These dig results are practitioner and vendor reporting, not primary advisories, so the corpus treats them as directional evidence that the paradox in the source doc points at a live 2026 threat landscape, not as verified incident counts.

## The answer: structural, not procedural

The source doc's central claim is that the answer is structural, not procedural: "Nothing in yubiOS asks you to trust an author, human or machine. Every layer is verified before it runs" (source doc). It lists four verification layers, each mapped to a repo mechanism:

1. Digest pinning and build policy: every base image and CI action is digest-pinned in PINNED.md, and mutable tags are rejected by build policy in yubiOS.rego (source doc).
2. Supply-chain gating and attestations: every build passes an OPA/Rego supply-chain gate before a single layer executes, and ships with SLSA provenance and SBOM attestations (source doc).
3. Runtime integrity: every byte of /usr is validated on read by dm-verity; every UKI is signed by a key on hardware the owner physically holds (source doc).
4. Recorded decisions and mapped surface: every architectural decision is recorded with rationale and sources in ADR.md, and every attack surface is mapped to a control in MITIGATE.md (source doc).

The doc then compresses the whole stance into a definition: "An AI resilient system is one where a poisoned contribution, wherever it came from, either fails verification or never had the authority to matter" (source doc).

## Reading the definition

Two properties in that definition do the work. Fails verification covers contributions that pass through a verified channel: a poisoned layer is caught by pinning, the build gate, or dm-verity. Never had the authority to matter covers the structural alternative: even a successful poison is inert if it cannot become a trust anchor. The doc's non-negotiables section (see doc 08) makes that second property concrete by requiring owner-held keys first, so a vendor or OEM key can never be the mandatory trust anchor for owner workflows (source doc).

The dig evidence above strengthens the "why now": if agents resolve dependencies programmatically and attacker campaigns are industrialized (both weakly backed, weights 0.12 and 0.09), then procedural review by humans at contribution time is the layer most easily bypassed, which is exactly the gap a structural model is designed to close.
