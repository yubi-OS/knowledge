# pq-timeline-alignment knowledge corpus

Minted 2026-10-05 from yubi-OS/yubiOS refs/pq-timeline-alignment-2026-10-03.md. Topic: aligning post-quantum migration timelines: crypto-agility planning, standardization milestones, and how an OS project should sequence PQ adoption against upstream signals.

## Docs

- `01-timeline-fragmentation.md`: Why post-quantum migration splits into independent transport, signature, and verification timelines and why their convergence is the real ship gate.
- `02-standardization-milestones.md`: The NIST FIPS 203/204/205 and IETF milestone map: what became final when, and which RFCs and drafts define PQ TLS and PQ signatures.
- `03-crypto-agility-design.md`: Crypto-agility as an architectural principle: designing OS-level systems so algorithms can be swapped without re-architecture, and what NIST guidance says.
- `04-transport-timeline-state.md`: Current state of the PQ transport timeline: OpenSSL 3.5 native ML-KEM, Go X25519MLKEM768 defaults, large-scale deployments like Cloudflare.
- `05-signature-timeline-state.md`: Current state of the PQ signature timeline: ML-DSA / FIPS 204 support in cosign, Sigstore, and hardware keys like YubiKey PIV.
- `06-verification-timeline-state.md`: Current state of the PQ verification timeline: slsa-verifier and cosign verify algorithm coverage, and why verification lags signing.
- `07-upstream-signal-tracking.md`: How an OS project tracks upstream signals (release notes, RFC milestones, vendor roadmaps, CI experiments) and translates them into adoption sequencing.
- `08-harvest-now-threat-model.md`: The harvest-now-decrypt-later threat model versus later signature forgery: why the two PQ timelines carry different urgency for long-lived OS artifacts.
- `09-os-sequencing-strategy.md`: Sequencing PQ adoption for an OS project: what to enable first, how to handle partial PQ states, and the danger of shipping PQ transport ahead of PQ artifact integrity.

## Research summary

- Results collected: 118 (archive.json entries, every one carrying a jev noul weight)
- Weight split: 61 primary (>= 0.5) / 57 low (< 0.5); low-weight sources are labeled as weak backing in the docs
- jev requests: 31 (outline validation + result weighting + redo batch), usage 20824 input / 0 output tokens
- Redos: 1 (doc 07 upstream-signal-tracking, thin original dig re-run with different queries)
- Skipped docs: none. All 9 subtopics scored > 0 at outline validation and all 9 digs produced authored docs.
- Gaps: the Go 1.24 X25519MLKEM768 default claim in doc 04 rests on secondary sources (weights below 0.5) because the dig did not surface the Go release notes; the absence of PQ support evidence for slsa-verifier in doc 06 is stated as a dig outcome, not a verified fact.

Preflight 2026-10-05: searXNG 88 results healthy; /api/decide (clef) 200.
