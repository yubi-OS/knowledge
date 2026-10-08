# 09: Data Privacy and Compliance

Scope: the distinction between securing data and having a right to hold it, the 3-class data taxonomy, and the 5 operating rules for minimization, retention, data-subject rights, consent, and localized defaults. Ground source: `yubi-OS/yubiOS skills/security-and-hardening/SKILL.md` (source doc).

## Security is not privacy

The source doc's framing: securing data asks "can an attacker read it?" while privacy asks "should we even hold it, and for how long?" These are separate questions and hardening answers only the first. The cheapest data to protect, to breach, and to comply over is the data you never collected. Personal data is a liability to minimize, not an asset to hoard. The rationale is loss arithmetic: data you do not hold cannot be breached, subpoenaed, or mis-deleted.

## Know what you hold: the 3 classes

You cannot protect or honor a deletion request for data you cannot find, so the source doc requires classifying fields as they are added:

| Class | Examples | Handling |
|---|---|---|
| Non-personal | Aggregates, anonymized counts | Normal handling |
| Personal (PII) | Name, email, IP, device or user IDs | Minimize, access-control, include in export and delete |
| Sensitive | Health, finance, location, biometrics, government IDs, anything about minors | Extra basis to collect, stricter access, often encryption plus audit logging |

## The legal frame the rules map to

GDPR is Regulation (EU) 2016/679, and the official consolidated text at EUR-Lex (weight 0.96, https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng) is the primary source for its obligations, including the Article 17 right to erasure. The UK Information Commissioner's Office publishes the operational guidance for individual rights, access, correction, deletion, and objection (weight 0.89 to 0.95, https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/ and https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/). The California side is covered by the state Attorney General's CCPA page (weight 0.94, https://www.oag.ca.gov/privacy/ccpa) and consumer privacy resources (weight 0.91, https://oag.ca.gov/privacy/consumer-privacy-resources), plus the California Privacy Protection Agency's FAQ (weight 0.89, https://cppa.ca.gov/faq.html). The source doc names GDPR and CCPA as the reference jurisdictions and requires supporting the data-subject rights your jurisdiction requires: export, correct, and delete on request.

## The 5 operating rules

1. **Minimize and set a purpose.** Collect a field only against a stated use. "It might be useful later" is not a purpose; it is latent breach scope. Do not log PII into telemetry (the source doc notes the `observability-and-instrumentation` skill makes the same point from the ops side).
2. **Set retention up front, then actually delete.** Every personal-data store needs a TTL and a working deletion path, including backups, caches, search indexes, and analytics copies. Data with no expiry is a breach scheduled for later. A weakly backed writeup on backups (0.12, https://www.probackup.io/blog/gdpr-and-backups-how-to-handle-deletion-requests) describes the practical mechanics, a defined retention schedule and a deletion index so restored records get re-deleted; consistent with the source doc, weak weight.
3. **Support the data-subject rights your jurisdiction requires.** These are engineering features: design the schema so a user's data is findable and erasable, not smeared irreversibly across systems. The source doc's rationale is blunt: manual erasure misses backups, caches, and analytics copies, and if the schema cannot find a user's data, the request cannot be honored.
4. **Get consent before collection or third-party sharing, and make it auditable.** Sending PII to an analytics, ad, or LLM vendor is sharing. The user's choice gates it, and the vendor needs a data-processing agreement.
5. **Localize defaults, do not hardcode one region's law.** Data-residency and rules differ by user location; make the policy a configurable boundary, not an assumption.

The weakly backed implementation writeups (0.14 to 0.20: linqs.net, complyjudge.com, evnedev.com, the-algo.com) describe minimization patterns such as field filtering and purpose-bound schemas at the data-model layer; they corroborate rule 1 but anchor nothing.

## Where this sits in the skill's tiers

The checklist carries the rules as checkable items: personal data classified, collected against a stated purpose, and minimized; personal data carrying a retention limit and a working deletion path including backups and indexes; export and delete requests supported where required; third-party sharing gated by consent. The red flags list names the anti-patterns: personal data collected with no stated purpose, retention limit, or deletion path; PII sent to vendors with no consent or data-processing agreement; and a "delete my account" that only flips a flag while the personal data lingers in stores and backups. The source doc also wires privacy into the other docs: data crossing a trust boundary is validated as untrusted (doc 05), and a privacy incident exposing personal data puts the breach-notification clock into the postmortem (the `debugging-and-error-recovery` skill).

## Provenance

Source doc claims: the security-versus-privacy distinction, the 3-class table, all 5 operating rules, the tier and checklist placements, and the cross-skill wiring. Dig-backed claims: the EUR-Lex GDPR text (0.96), ICO individual-rights guidance (0.89 to 0.95), CA AG CCPA and resources (0.91 to 0.94), and CPPA FAQ (0.89). Weakly backed corroboration (labeled): backup deletion-index mechanics (0.12) and minimization-pattern writeups at 0.14 to 0.20.
