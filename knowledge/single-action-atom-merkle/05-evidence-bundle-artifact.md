# 05. Evidence Bundles as Change Artifacts

**Scope:** Evidence bundles and provenance attestations: in-toto attestations and SLSA provenance packaging logs and build events into one hash-chained, signed, auditable unit.

## The attestation model

A software attestation is "an authenticated statement (metadata) about a software artifact or collection of software artifacts. The primary intended use case is to feed into automated policy engines, such as in-toto and Binary Authorization" (https://slsa.dev/attestation-model, weak backing, weight 0.33). The attestation is therefore not the artifact itself but a signed statement about it: what was built, from what sources, by which process, at which time. That separation matters for audit because the statement can be verified without re-running the build.

The in-toto Attestation Framework defines the transportable format, and the SLSA project treats it as part of its recommended suite: "in-toto attestations are part of SLSA's recommended suite for expressing software supply chain claims" (https://slsa.dev/blog/2023/05/in-toto-and-slsa, weight 0.61). The framework's stated design principle is minimalism in the envelope: "this is the model that SLSA provenance, SBOM attestations, vulnerability scan results, and most modern supply chain evidence use. The framework is deliberately minimal so that the predicate ecosystem can evolve independently of the envelope format" (https://safeguard.sh/resources/blog/in-toto-attestation-framework-walkthrough-2026, weak backing, weight 0.31). In other words, the wrapper stays stable while new kinds of claims are added as predicates, which is what lets one packaging format serve audit evidence of many shapes.

## Layering: what each integrity mechanism proves

An evidence bundle can be anchored in several ways, and they are not interchangeable. A detailed implementation writeup separates them: it covers "what a hash chain, a Merkle tree with signed checkpoints, and an external anchor each prove" (https://zatona.dev/blog/tamper-evident-audit-logs, weight 0.64). Read as a checklist for packaging evidence:

1. A hash chain proves that records were not altered or reordered after the fact, and it is cheap to append to.
2. A Merkle tree over the records plus signed checkpoints proves the same, and additionally lets a verifier confirm a single record's inclusion without holding the full bundle.
3. An external anchor (publishing the root or checkpoint somewhere outside the system that generates the records) proves the state existed at a time even if the generating system is later fully compromised.

The layered view matters because a bundle that only hash-chains internally can be replaced wholesale, chain and all, by whoever controls its storage. The external anchor is what converts internal integrity into externally auditable integrity.

Compliance frameworks make the demand explicit: "SOC 2, ISO 27001, and FedRAMP all require audit trail integrity" (https://usecorelink.com/blog/tamper-evident-audit-logs, weak backing, weight 0.33). The auditable unit those regimes accept is not a pile of logs but an integrity-protected trail whose completeness can be demonstrated.

## The bundle as the unit of change

Combining the attestation model with the layering gives a concrete design for an improvement-cycle artifact:

1. Collect. The cycle's raw materials become leaves: the data file, the source document, the decision record, the measured result, the final output.
2. Commit. Hash each leaf, build the Merkle tree, compute the root. The root is the bundle's identity.
3. Attest. Sign a statement about the bundle: which root, which cycle, what the single action was, what the measured delta was. This is the in-toto-style predicate layer.
4. Anchor. Publish the signed root somewhere the artifact's own storage cannot rewrite: a repository manifest, an issue, a changelog entry, or a transparency log (doc 04).
5. Verify. Later, any auditor recomputes the root from the leaves, checks the signature, and optionally walks an inclusion proof per leaf.

The worked example this corpus descends from is exactly steps 1 through 4 at small scale: 6 artifacts hashed as leaves of a SHA-256 tree, paired into 3 level-1 nodes, then 2, then a single root, with the root recorded in a refs manifest, a Linear issue, and a changelog. The bundle made one improvement session independently verifiable without requiring an auditor to re-trust the agent that produced it.

## What the weak sources leave open

The two strongest sources in this dig (the in-toto framework repository at 0.68 and the tamper-evident logging implementation at 0.64) cover the format and the integrity layering respectively. The compliance framing (SOC 2 and friends at 0.33) and the attestation-model overview (0.33) are below the authority threshold and are labeled accordingly. What remains an engineering position rather than cited doctrine is the claim that steps 1 through 5 are the right decomposition for non-build artifacts like improvement cycles: in-toto and SLSA were designed for software supply chains, and their application to process evidence is this framework's own extension of them, not part of either specification.
