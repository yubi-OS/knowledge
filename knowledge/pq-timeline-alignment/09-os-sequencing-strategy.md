# 09 - OS sequencing strategy

Scope: sequencing PQ adoption for an OS project: what to enable first, how to handle partial PQ states, and the danger of shipping PQ transport ahead of PQ artifact integrity.

## Start with the planning doctrine

The federal guidance is unambiguous that planning precedes everything: CISA, NSA, and NIST "urge organizations to begin preparing now by creating quantum-readiness roadmaps, conducting inventories, applying risk assessments and analysis, and engaging vendors" (https://www.nccoe.nist.gov/sites/default/files/2023-08/quantum-readiness-fact-sheet.pdf, weight 0.93). Vendor planning guidance adds the prioritization axis: understand how long your data must stay secure, estimate how long preparation and execution will take, and start early because "the earlier you start, the easier it is to keep quality high and costs predictable" (https://docs.paloaltonetworks.com/network-security/quantum-security/administration/quantum-security-concepts/post-quantum-migration-planning-and-preparation, weight 0.91).

A distribution vendor has already executed this play. Red Hat describes shipping PQC components in Red Hat Enterprise Linux and how that "helps protect entire ecosystems and bridge the gap between security teams and application teams" (https://www.redhat.com/en/blog/building-levee-why-red-hats-post-quantum-strategy-already-production, weight 0.65). The RHEL 10.1 release notes document the concrete step: OpenSSL 3.5 in the platform with ML-KEM, ML-DSA, and SLH-DSA support and hybrid ML-KEM in the default TLS configuration (https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/10/html/10.1_release_notes/overview, weight 0.95). A distribution adopting PQ at the OS level propagates it to everything built on the distribution, which is the leverage that makes OS-level sequencing worth the effort.

## The sequencing order that falls out of the timelines

Combining the timeline states (docs 04 through 06) with the threat clocks (doc 08) gives a defensible ordering:

1. Inventory and agility first. The NIST fact sheet lists inventories before any deployment step (weight 0.93), and the crypto-agility literature makes the swap capability a precondition for following any upstream timeline (doc 03).
2. Transport PQ second, because it is ready and urgent. The standards are published (RFC 10024), an LTS library defaults to hybrid groups, and HNDL exposure accumulates today. The cost is configuration and compatibility testing, not waiting.
3. Signing and verification PQ third and fourth, as followers of their upstream signals. The signing stack has a roadmap and draft hardware standards (doc 05); verification has no documented PQ-capable verifier yet (doc 06). The work here is tracking and preparation, not deployment.

## The partial PQ state and why it is a trap

The central sequencing hazard is the gap between timeline 1 and timelines 2 and 3. An OS image that ships PQ-hybrid TLS while its artifact chain is classical has moved the confidentiality clock but not the integrity clock. The integrity risk is not hypothetical: the signature asymmetry is that forgery becomes possible once a quantum computer exists while authentication infrastructure takes longer to migrate (https://www.sdxcentral.com/sdx-explainers/what-is-post-quantum-cryptography-a-practical-guide-to-surviving-q-day/, weight 0.80). A partial PQ state that is never labeled as partial invites the false conclusion that the migration is done.

The boot chain is where the stakes concentrate. A vendor migration guide dedicated to quantum-readiness describes "further hardening of the boot sequence with quantum-resistant signatures, ensuring that the SNP-verified hardware remains protected against attackers armed with future quantum capabilities," and warns of malware injection during boot that "operates at a level deeper than the Operating System," invisible to standard monitoring while providing persistent elevated access (https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Quantum-Ready-Migration-Guide.html, weight 0.87; the PDF is at https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/Quantum-Ready-Migration-Guide.pdf, weight 0.95). For an immutable OS image with a signed boot chain, this is the artifact class where classical signatures are most dangerous to leave in place, because a forged boot artifact defeats everything downstream.

## Handling partial states honestly

Practical rules for living in the staggered period:

1. Label the state per timeline. Ship notes and policy documents should state which timelines are PQ and which are classical, per artifact class. A migration playbook that frames the whole transition as "the largest design-level decision the industry has faced in a generation," with standards finalized but libraries still catching up and regulatory clocks running, captures the environment a partial state lives in (https://pq-migration.symbolic.software/static/pdf/playbook.pdf, weight 0.42, weak backing).
2. Keep the classical path alive until convergence. Because verification tooling lags, an OS that adopts PQ signatures before verifiers exist would be unverifiable by its own consumers. Rollback and classical fallback are part of the design, not an admission of failure.
3. Sequence against signals, not dates. The upstream states that gate each step are documented in doc 07; internal milestones should reference them.
4. Treat the convergence point as the goal. Industry timeline surveys track when organizations expect to complete migration across sectors (https://thequantuminsider.com/2026/08/07/post-quantum-cryptography-timelines/, weight 0.38, weak backing), useful for calibration only.

The closing principle: for an OS project, PQ adoption is a sequencing problem across three independent upstream timelines with different clocks and different readiness. The ship gate is the convergence of all three for each artifact class, and the discipline that gets there is crypto-agility plus signal tracking, not a single cutover date.
