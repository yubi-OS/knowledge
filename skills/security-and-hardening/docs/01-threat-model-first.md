# 01: Threat Model First

Scope: the skill's pre-code discipline. Map trust boundaries, name the assets, run STRIDE over each boundary, and write abuse cases next to use cases before any hardening control is added. Ground source: `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md` (source doc).

## Controls without a threat model are guesses

The source doc opens its process section with the claim that controls bolted on without a threat model are guesses, and that 5 minutes spent thinking like an attacker comes before hardening. That placement is not stylistic: OWASP classifies design-level failure as its own Top 10 category, A04:2021 Insecure Design. The OWASP A04 page (weight 0.97) frames the category as covering missing or ineffective control design, and prescribes the same sequence the skill encodes: establish and use usable security patterns, and "compile use-cases and misuse-cases for each tier of your application" plus "unit and integration tests to validate that all critical flows are resistant to the threat model" (https://owasp.org/Top10/2021/A04_2021-Insecure_Design/). If you cannot name the trust boundaries for a feature, the source doc says you are not ready to secure it.

## Step 1: map the trust boundaries, including the ones that look internal

The source doc's boundary list covers HTTP requests, form fields, file uploads, webhooks, third-party APIs, message queues, and LLM output. It then adds the subtler class: locally sourced values that look internal because the OS handed them to you, such as another process's command line or environment, filenames on a shared volume, or a path inside a job payload. The skill's rule is that trust follows who wrote a value, not which channel delivered it. Every boundary is attack surface.

The STRIDE method itself treats this as the core mechanic. The EdgeX Foundry project's published STRIDE threat model (weight 0.90) describes STRIDE as "a type of security threat modeling to identify security vulnerabilities and risks associated with IT systems," applied by walking each component, data flow, and trust-boundary crossing (https://docs.edgexfoundry.org/3.0/threat-models/stride-model/EdgeX-STRIDE/). Secondary walkthroughs of the same method agree on the mechanics but carry low source quality (strobes.co, weight 0.21, https://strobes.co/blog/threat-modeling-explained-stride/), so treat them as corroboration only.

## Step 2: name the assets

The source doc's asset list is credentials, PII, payment data, admin actions, and money movement. This step is what turns the STRIDE pass into a prioritization exercise: a boundary that only touches non-personal aggregate data is a different tier of risk from one that crosses payment data.

## Step 3: run STRIDE per boundary as a quick lens, not a ceremony

The source doc's STRIDE table maps each of the 6 categories to the question to ask and the typical mitigation:

- Spoofing: can someone impersonate a user or service? Authentication, signature verification.
- Tampering: can data be altered in transit or at rest? Integrity checks, parameterized queries, HTTPS.
- Repudiation: can an action be denied later? Audit logging of security events.
- Information disclosure: can data leak? Encryption, field allowlists, generic errors.
- Denial of service: can it be overwhelmed? Rate limiting, input size caps, timeouts.
- Elevation of privilege: can a user gain rights they should not have? Authorization checks, least privilege.

The mitigation column is a bridge to the rest of the corpus: tampering mitigation points at parameterized queries (doc 03), denial-of-service mitigation points at rate limiting (doc 08), and elevation-of-privilege mitigation points at the authorization checks in doc 03 and the least-privilege posture of the yubiOS primitive model.

## Step 4: write abuse cases next to use cases

The source doc's instruction is to ask "how would I misuse this?" for each feature and make that the first test. The OWASP Abuse Case Cheat Sheet (weight 0.76) gives the formal version of the same practice: abuse cases are built "from a practical attacker point of view," with examples such as an attacker noting that a server does not send security headers or sets them to insecure values (https://cheatsheetseries.owasp.org/cheatsheets/Abuse_Case_Cheat_Sheet.html). The cheat sheet positions abuse cases as the anti-document to pure functional requirements: the misuse spec drives the test suite the same way the use spec does.

OWASP's own framing of why this matters is blunt: the OWASP Top 10 project page (weight 0.97) describes the Top 10 as "the reference standard for the most critical web application security risks" (https://owasp.org/projects/top-ten), and the OWASP Foundation describes its mission as improving software security through open-source projects and education (weight 0.88, https://owasp.org/).

## Where this doc's claims come from

- Source doc claims: the 4-step process, the trust-boundary list including locally sourced values and LLM output, the STRIDE table, and the A04 attribution. Path: `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md`.
- Dig-backed claims: OWASP A04 misuse-case and threat-model-test guidance (0.97), the EdgeX STRIDE description (0.90), the OWASP Abuse Case Cheat Sheet attacker-perspective method (0.76), the OWASP Top 10 framing (0.97), and the OWASP Foundation description (0.88).
- Weakly backed corroboration (labeled): blog walkthroughs of STRIDE practice at weights 0.07 to 0.21 (strobes.co, inventivehq.com, cybersierra.co, architecturediagram.ai, securecodinghub.com). None of their claims are load-bearing here; they agree with the primary sources above.
