# 07. Rejected alternatives and why they lost

Scope: the 5 rejected variations in ADR-033's generation log, the recorded critique for each, and what the supporting literature says about the same trade-offs.

## The rejection landscape

Of 6 variations generated, 4 fell below the scoring threshold (V1, V2, V4, V5, all at 13 or below), and the runner-up finalist (V6, 14) lost to V3 (17) on scope fit (source one-pager, adr-033-misbehavior-cutoff-policy-2026-07-28). The critiques below are the record's own; the literature citations show the same trade-offs appear outside the ADR.

## V1: kill the VM (simplification lens, sum 13, dropped)

The trivial policy: on detected misbehavior, terminate the VM. The record's critique: it "destroys state, contradicts the user's framing of cutoff point (which implies preservation)" and "cures the symptom but loses forensic state" (source one-pager). This is the classic containment-versus-evidence tension in incident response. DFIR practice treats identification and investigation of the stopped threat as the core of the discipline, not just its termination: Sygnia describes DFIR as a cycle of identifying, investigating, and stopping threats [1] (jev weight 0.544). Practitioner guidance on AI-agent containment draws the same boundary design lesson: containment should be an architected boundary rather than an ad hoc kill, with "deterministic kill-switches" and "containment boundaries (network, filesystem)" as separate mechanisms (weak backing, compelframework [2], weight 0.408). Killing the workload confuses the two: it is a last-resort kill-switch pretending to be a containment boundary.

## V2: network-only cutoff (inversion lens, sum 12, dropped)

Cut the network, keep the GPU. The record's critique: it "misses the threat model ADR-031 establishes, DMA from GPU can read LUKS keys directly, no network needed" (source one-pager). The Thunderclap research backs the underlying mechanism: DMA-capable peripherals with IOMMU-mapped access can extract private data from shared memory without a network path in the loop (doc 02, NDSS 2019 paper, weight 0.838). A network cut leaves the device-level exfiltration channel intact.

## V4: host-side watchdog with operator approval (audience-shift lens, sum 11, dropped)

Shift the audience to enterprise SOC operators who want a human approval step before any cutoff. Scores: painkiller 4, switching cost 2, defensibility 3, testability 2; the record's critique: "too operational for the early-stage policy; better as a downstream operator console issue" (source one-pager). The recorded second-order concern is the same one later applied to the winning design's alert tier: operator workflows add latency, and a human-in-the-loop gate in front of a SEVER action widens the model-state-preservation window that assumption A3 has to survive (source one-pager). Escalation tooling exists to make human routing fast and structured (Atlassian [3], weight 0.614), but the record judged the dependency unacceptable for an MVP policy.

## V5: remove the trust-boundary constraint (constraint-removal lens, sum 6, dropped)

The lowest-scoring variation: drop ADR-031's rule that no trust-boundary component may consume GPU state, so state capture could happen guest-side. The record's critique: "this inverts the project's GPU-as-attack-vector posture; would be a security regression, not a feature" (source one-pager). Sum of 6 against a threshold of 13; this is the record's clearest example of a lens used to enumerate the option space, not to endorse it.

## V6: pre-deployment fingerprint check (constraint-removal variant, sum 14, finalist runner-up)

Screen model binaries at deploy time; refuse to let an un-fingerprinted model touch the GPU. The record's critique: fingerprinting "is static, it doesn't catch runtime misbehavior (a well-signed model that goes rogue at inference time). Misses the user's misbehaving model framing" (source one-pager).

The ecosystem evidence shows V6's mechanism is real and maturing, which strengthens the record's decision to park it as downstream work rather than discard it. OpenSSF shipped Model Signing v1.0 in April 2025 to "secure the machine learning model supply chain" [4] (jev weight 0.866). Practitioner guides connect model provenance to Sigstore signing and SLSA attestations (weak backing, aidefense.dev [5], weight 0.383; kindatechnical [6], weight 0.306). The record's stress test adds the adoption-side risk: "That operators will actually verify fingerprints before every deploy (workflow problem, not technical)" (source one-pager).

The recorded second-order effect is worth keeping with the parked issue: fingerprinting "pairs naturally with SLSA provenance (existing skill), model supply chain becomes auditable" (source one-pager).

## What the rejections share

Three rejections (V1, V2, V5) fail on the same axis: they weaken or bypass the property the design exists to protect (state preservation, device-level coverage, trust-boundary neutrality). One rejection (V4) fails on sequencing: it front-loads operational dependency into an early-stage policy. One (V6) fails on scope fit while remaining a valid adjacent control. That split, discard versus park, is the reusable pattern in the log.

## Sources

1. Sygnia, digital forensics and incident response: https://www.sygnia.co/blog/digital-forensics-and-incident-response/ (weight 0.544)
2. Compel Framework, kill-switch containment and incident response (weak backing): https://www.compelframework.org/articles/kill-switch-containment-and-incident-response (weight 0.408)
3. Atlassian, escalation policies: https://www.atlassian.com/incident-management/on-call/escalation-policies (weight 0.614)
4. OpenSSF blog, launch of Model Signing v1.0: https://openssf.org/blog/2025/04/04/launch-of-model-signing-v1-0-openssf-ai-ml-working-group-secures-the-machine-learning-model-supply-chain/ (weight 0.866)
5. AIDefense.dev, ML model provenance signing guide (weak backing): https://aidefense.dev/posts/securing-the-ml-model-supply-chain/ (weight 0.383)
6. KindaTechnical, ML supply chain security (weak backing): https://kindatechnical.com/mlops-guide/ml-supply-chain-security-model-provenance-and-signing.html (weight 0.306)
