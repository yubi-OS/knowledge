# Advisory versus Compulsory Deprecation

Scope: the skill's two-mode classification of deprecation programs, when to use each, and the HTTP-standard machinery (Deprecation and Sunset headers) the industry has standardized for the compulsory case (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, section "Compulsory vs Advisory Deprecation").

## The two modes

The source doc defines the split in one table:

- Advisory deprecation: migration is optional and the old system is stable. Mechanism: warnings, documentation, nudges. Users migrate on their own timeline.
- Compulsory deprecation: the old system has security issues, blocks progress, or its maintenance cost is unsustainable. Mechanism: a hard deadline. The old system will be removed by date X. Migration tooling must be provided.

The skill's default is explicit: "Default to advisory. Use compulsory only when the maintenance cost or risk justifies forcing migration." And compulsory deprecation carries an obligation, not just a date: it requires providing migration tooling, documentation, and support. "You can't just announce a deadline."

The decision inputs for choosing a mode come from the deprecation-decision framework (see 02-deprecation-decision.md): consumer count, migration cost per consumer, and the maintenance cost of keeping the old system alive. A large, low-cost consumer base with a stable old system can be left on advisory indefinitely; a consumer base blocking a security fix cannot.

## What the industry standardized for the compulsory case

The source doc predates no standard here, but the dig record shows the industry has converged on HTTP headers that encode exactly the advisory/compulsory distinction. RFC 9745 defines the Deprecation header and RFC 8594 defines the Sunset header, used to signal API retirement and set migration timelines (https://apiguide.dev/guides/deprecation-sunsetting/, jev weight 0.18, weak backing). One practitioner walkthrough describes the vocabulary precisely: "Deprecation to start the clock, Sunset to set the deadline, a sunset link to explain the migration, and 410 Gone to close it out" (https://blog.teliaz.com/2026/09/15/deprecating-api-endpoints-without-breaking-consumers-deprecation-and-sunset-headers/, jev weight 0.23, weak backing).

Read against the source doc's table, the mapping is clean. The Deprecation header is the advisory phase: the clock starts, consumers are nudged, nothing breaks. The Sunset header is the compulsory declaration: a date certain after which the old path stops working. The compulsory promise in the source doc ("you can't just announce a deadline" without migration tooling, documentation, and support) is exactly what the Sunset date encodes on the wire: clients must move before the date, and the provider must not break anything until then (source doc). API-lifecycle writing confirms deprecation sits at a predictable stage of the API lifecycle with its own best practices (https://nordicapis.com/how-to-smartly-sunset-and-deprecate-apis/, jev weight 0.28, weak backing), and current best-practice write-ups combine the headers with monitoring strategies and communication timelines (https://khimananda.com/blog/api-deprecation-and-sunset-best-practices, jev weight 0.17, weak backing; https://kokil.com.np/blog/api-deprecation-and-sunset-best-practices, jev weight 0.15, weak backing).

Dated correction note (2026-10-06): the source doc's mechanism column ("Warnings, documentation, nudges" versus "Hard deadline") describes intent, not protocol. The dig record documents that intent now has a standard wire format: Deprecation (RFC 9745) for the advisory phase and Sunset (RFC 8594) for the compulsory deadline. This is complementary, not contradictory, and it strengthens the skill's rule that compulsory deprecation must include tooling and support, because the Sunset date is a promise to consumers.

## Operating rules

Three rules follow from combining the source doc with the dig record:

1. Announce advisory deprecation with the Deprecation header plus documentation and migration guides. Measure usage (the skill's red flags list "deprecation without measuring current usage").
2. Escalate to compulsory only with justification: security exposure, blocked progress, or unsustainable maintenance cost. When escalating, set the Sunset header to the removal date and ship migration tooling before the date, not after.
3. After the Sunset date passes, serve 410 Gone on the old path. This closes the loop the teliaz walkthrough describes and gives laggard consumers an unambiguous signal.

## The anti-pattern the mode split prevents

The skill's red flags include "soft deprecation that's been advisory for years with no progress." That is the failure mode of advisory deprecation without an escalation trigger. The two-mode discipline exists precisely to force that decision: either the advisory case produces measurable migration progress, or the justification for compulsory escalation is written down and executed. A deprecation that is neither migrating nor escalating is a zombie (see 07-zombie-code.md).

Weak-backing note: most dig sources in this document fall below the 0.5 noul bar. The RFC references carried by apiguide.dev (0.18) are the structural spine of the header discussion; verify RFC numbers against the IETF datatracker before citing this document externally.
