# 06. C2PA formal-methods security analysis

Scope: The first formal-methods security analysis of the C2PA specification and its implementations, the specific failure modes it documents, and their direct consequences for a browser that validates provenance manifests.

## The paper

"Verifying Provenance of Digital Media: Security Analysis of C2PA and its Implementation" (Krawetz et al., IACR ePrint 2026/804) is the first formal-methods analysis of C2PA specifications 2.2 through 2.4 [w=0.670] (https://eprint.iacr.org/2026/804). The same work is available as an arXiv preprint, titled "Verifying Provenance of Digital Media: Why the C2PA Specifications Fail to Deliver Trustworthy Provenance" [w=0.814] (https://arxiv.org/abs/2604.24890), with the full text PDF also indexed [w=0.584] (https://arxiv.org/pdf/2604.24890). A university security-lab mirror carries the abstract [w=0.472, weak] (https://cisa.umbc.edu/verifying-provenance-of-digital-media-security-analysis-of-c2pa-and-its-implement/).

## Documented failure modes

As recorded in the yubiOS prior-art note, the paper's findings are:

1. Generators and validators disagree on the trusted timestamp bound to the manifest signature.
2. Certificate revocation is inadequate: validators accept manifests signed with known-compromised certificates.
3. Conforming validators produce inconsistent results for the same input.
4. The C2PA "exclusion range" construct enables undetectable alterations of signed content.
5. The C2PA conformance program certifies implementations without technical review.

Some fixes were adopted in C2PA 2.3 and shipped in the Pixel 10 Pro. The official C2PA implementation guidance documents the normative behavior these findings are measured against, for specification 1.3 [w=0.779] (https://spec.c2pa.org/specifications/specifications/1.3/guidance/_attachments/Guidance.pdf) and 2.2 [w=0.786] (https://spec.c2pa.org/specifications/specifications/2.2/guidance/_attachments/Guidance.pdf). Practitioner material on reviewing revoked signing certificates corroborates that revocation review is a live operational concern [w=0.209, weak] (https://deepfakecheck.io/blog/c2pa-credential-revocation-review/).

## Consequences for a provenance-gated browser

The mapping to yubiOS's provenance-gated Chromium (OMN-165) is direct and unflattering in a useful way:

1. The yubiOS C2PA parser (patch 0007) extracts claimed-action metadata and deliberately does not validate signatures yet. This paper shows that signature validation is exactly where C2PA implementations break, and certificate revocation is the weakest link. The deferred c2pa-rs vendoring work (signature validation) is therefore walking into the hardest part of the problem, not an incidental follow-up.
2. The paper supplies the concrete test suite: timestamp-disagreement cases, compromised-certificate acceptance, exclusion-range edits, and cross-validator inconsistency. A validator must be tested against those four failure classes before it can gate any content.
3. "Conforming validators produce inconsistent results" means a browser cannot outsource the verdict to "whatever library is conformant"; it needs its own pinned, tested validator behavior with a documented verdict policy for ambiguous manifests.

The design implication is that the gate's provenance layer should treat validation failures and validation ambiguity as first-class states with distinct user-facing treatments, not as a binary "valid or invalid". The paper's failure taxonomy is the checklist for those states.

## Sources

- https://arxiv.org/abs/2604.24890 [w=0.814]
- https://spec.c2pa.org/specifications/specifications/2.2/guidance/_attachments/Guidance.pdf [w=0.786]
- https://spec.c2pa.org/specifications/specifications/1.3/guidance/_attachments/Guidance.pdf [w=0.779]
- https://eprint.iacr.org/2026/804 [w=0.670]
- https://arxiv.org/pdf/2604.24890 [w=0.584]
- https://cisa.umbc.edu/verifying-provenance-of-digital-media-security-analysis-of-c2pa-and-its-implement/ [w=0.472, weak]
- https://deepfakecheck.io/blog/c2pa-credential-revocation-review/ [w=0.209, weak]
