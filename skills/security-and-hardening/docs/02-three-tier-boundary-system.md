# 02: The Three-Tier Boundary System

Scope: the skill's decision layer for agent and developer behavior. Every security action sorts into Always Do (no exceptions), Ask First (requires human approval), or Never Do. Internal-record subtopic, no dig: this doc explicates rules that exist only in the source doc, `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md`. Every claim below is attributed to the source doc.

## Why a tier system instead of a flat checklist

The source doc's design insight is that security rules differ in who gets to decide them. Always Do rules are mechanical: no judgment call is ever correct that skips them. Ask First rules change the system's trust posture: adding an auth flow, a new sensitive data category, or a new external integration is a decision with blast radius, so it requires human approval. Never Do rules are the ones that look tempting under deadline pressure and are always wrong. A flat checklist cannot express that difference; a tier system forces the acting agent (or the reviewing human) to confront which kind of rule they are about to bend.

## Tier 1: Always Do (no exceptions)

The source doc lists 8 always-do rules:

1. Validate all external input at the system boundary (API routes, form handlers).
2. Parameterize all database queries; never concatenate user input into SQL.
3. Encode output to prevent XSS, using framework auto-escaping and never bypassing it.
4. Use HTTPS for all external communication.
5. Hash passwords with bcrypt, scrypt, or argon2; never store plaintext.
6. Set security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options.
7. Use httpOnly, secure, sameSite cookies for sessions.
8. Run `npm audit` (or the ecosystem equivalent) before every release.

The "no exceptions" framing is the operative part. Each of these has a cheap correct implementation and an expensive incorrect one, and the tier asserts that no performance, convenience, or schedule argument flips tier 1 into tier 2. Doc 03 carries the concrete code patterns for items 2, 3, 5, and 6; doc 08 covers the rate-limiting and secrets halves of the operational surface.

## Tier 2: Ask First (requires human approval)

The source doc lists 7 ask-first actions:

1. Adding new authentication flows or changing auth logic.
2. Storing new categories of sensitive data (PII, payment info).
3. Adding new external service integrations.
4. Changing CORS configuration.
5. Adding file upload handlers.
6. Modifying rate limiting or throttling.
7. Granting elevated permissions or roles.

The common property is that each item changes what the system will accept, emit, or expose, which is exactly the surface an attacker probes. The tier exists so that an agent working autonomously pauses instead of silently widening the attack surface. Note the pairing with the STRIDE lens in doc 01: several of these (new integrations, new upload handlers, changed CORS) are new trust boundaries, which the threat-model step says must be mapped before they are secured.

## Tier 3: Never Do

The source doc lists 7 never-do rules:

1. Never commit secrets to version control (API keys, passwords, tokens).
2. Never log sensitive data (passwords, tokens, full credit card numbers).
3. Never trust client-side validation as a security boundary.
4. Never disable security headers for convenience.
5. Never use `eval()` or `innerHTML` with user-provided data.
6. Never store sessions in client-accessible storage such as localStorage for auth tokens.
7. Never expose stack traces or internal error details to users.

Several of these are restatements of tier 1 in negative form (headers, XSS sinks), but 3 are distinct: client-side validation is UX, not security; client-accessible session storage defeats httpOnly; and stack-trace exposure converts an error into an information-disclosure bug. The secrets rule has its own doc (08) because the failure mode extends past committing: once a secret reaches a remote, the source doc says rotation comes first and history rewriting comes second.

## How the tiers interact with the rest of the skill

The source doc's security review checklist and verification section operationalize tier 1 as checkable items (passwords hashed with salt rounds of 12 or more, sessions httpOnly/secure/sameSite, input validated at boundaries, SQL parameterized). The red flags section operationalizes tier 3 as review signals (secrets in source or history, endpoints without auth or authz checks, wildcard CORS origins, stack traces shown to users). The Common Rationalizations table is the pressure map on the tiers: "this is an internal tool," "we'll add security later," "the framework handles security," and "it's just a prototype" are all attempts to move tier 1 items into tier 2 or off the list, and the source doc rejects each one explicitly.

## Provenance

Internal-record subtopic, no dig. No searXNG queries were run for this doc (dig budget preserved for web-shaped subtopics). All content is grounded in the source doc at `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md` and does not contradict it. External mechanism names mentioned by the source doc (bcrypt, CSP, HSTS, `npm audit`, localStorage, `eval`, `innerHTML`) are treated as stable ecosystem references and are covered by digs in docs 03 and 08.
