# 02 - The 4-component evidence shape

Scope: the canonical 4-component evidence shape (quote / measurement / evidence bundle / Rekor v2 anchor) that the source doc declares as shared across Keylime, in-toto, and confidential-containers. Internal-record subtopic, no dig: this shape is the skill's own canonical claim, grounded in the source doc rather than web research.

## The shape, as the source doc states it

The source doc (`yubi-OS/yubiOS skills/runtime-attestation-keylime/SKILL.md`) is explicit: this skill is "the yubiOS canonical reference for the 4-component evidence shape (quote / measurement / bundle / Rekor anchor) that all attestation frameworks share." The four components are:

1. Quote. A hardware-signed assertion, produced by a TPM2 quote on the runtime leg.
2. Measurement. The state the quote attests to: PCR values, IMA measurement lists, or boot measurements.
3. Evidence bundle. A packaged, portable artifact that carries the quote, the measurement, and the policy evaluation together.
4. Rekor v2 anchor. A transparency-log entry that makes the bundle publicly verifiable and tamper-evident after the fact.

The source doc further states that the skill is "the canonical body for that primitive's runtime + supply-chain + confidential-VM legs," which is the load-bearing claim of this doc: three very different attestation frameworks instantiate the same four components.

## How each leg instantiates the shape

Runtime leg (Keylime). The quote is the TPM2 quote over PCR 10; the measurement is the IMA measurement list and golden-hash policy comparison; Keylime's verifier produces the decision. Sources: https://keylime.dev/ (jev 0.80), https://keylime.readthedocs.io/en/latest/user_guide/runtime_ima.html (jev 0.88).

Supply-chain leg (in-toto and SLSA). The quote role is played by the signed in-toto attestation; the measurement role is played by the provenance payloads (SLSA provenance describes "where, when, and how" an artifact was produced). Sources: https://github.com/in-toto/attestation (jev 0.80), https://slsa.dev/provenance/ (jev 0.89). The bundle is the in-toto statement and its predicate; the anchor is again Rekor.

Confidential-VM leg (TDX, SEV-SNP, NVIDIA CC). The quote is the hardware attestation report (TD report or SNP attestation report); the measurement is the launch measurement and runtime data bound into the report. The CoCo documentation describes binding runtime data into the attestation report, typically to bind a nonce or the hash of a key to the evidence (source: https://confidentialcontainers.org/docs/features/get-attestation/, jev 0.78). The evidence bundle and Rekor anchor are the same downstream packaging step.

Anchoring leg (Rekor v2). The anchor component is shared rather than per-framework: once any leg's evidence bundle exists, it gets a transparency-log entry so third parties can verify inclusion and detect tampering later. Source doc names Rekor v2 as the anchor; doc 05 covers the mechanics.

## Why a shared shape matters for yubiOS

The yubiOS attestation layer has to answer three different questions with one reviewable artifact grammar:

- Is the booted system still trustworthy while it runs (Keylime).
- Was this artifact built by the pipeline we think built it (in-toto / SLSA).
- Is this workload executing in a memory-encrypted, attested environment (TDX / SEV-SNP / CC).

If each framework shipped a different evidence grammar, every downstream consumer would need three parsers and three trust policies. The source doc's contribution is to fix one 4-component grammar as canonical, so the CI attestations gate, the audit-evidence rollup, and the internal-big-picture primitive map all consume one shape (see doc 07).

## The policy connection

The source doc maps the skill to P0 attestation as the primary primitive, and notes that "the attestation policy itself is declarative," contributing to P3, and that "the bundle is the audit artifact," contributing to P6. In shape terms: components 1 and 2 are the evidence, the declarative policy is the expectation the evidence is judged against, and components 3 and 4 are the packaging that turns a verdict into an auditable, verifiable record.

## Limits of this doc

The 4-component decomposition is the source doc's own framing, stated as yubiOS canonical. External sources in this corpus confirm each component exists and works in each framework (docs 01, 03, 04, 05), but the claim that the shape is "shared" across all three is the source doc's synthesis, cited here as source-doc attribution rather than as an externally verified fact.
