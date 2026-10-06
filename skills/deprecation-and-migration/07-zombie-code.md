# Zombie Code: Nobody Owns It, Everybody Depends On It

Scope: the skill's zombie-code category: how to detect code that is unmaintained but still consumed, why it is dangerous, and the skill's invest-or-remove rule (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, section "Zombie Code").

## Definition

The source doc defines zombie code as "code that nobody owns but everybody depends on." It is not actively maintained, has no clear owner, and accumulates security vulnerabilities and compatibility issues. The definition's two halves are both load-bearing: without consumers, the code is merely dead and can be deleted; without an owner, the consumers have no one to demand fixes from.

Independent write-ups converge on the same condition. A glossary entry describes zombie code as a software maintenance concern that makes future changes, verification, operation, or ownership harder, with practical importance depending on supported behavior and rate of change (https://weaveos.com/glossary/zombie-code, jev weight 0.32, weak backing). An IT-glossary entry frames removal as crucial for maintaining clean, efficient, reliable systems (https://www.ituonline.com/it-glossary/zombie-code/, jev weight 0.19, weak backing).

## Detection signs

The source doc lists 5 signs:

1. No commits in 6 or more months but active consumers exist.
2. No assigned maintainer or team.
3. Failing tests that nobody fixes.
4. Dependencies with known vulnerabilities that nobody updates.
5. Documentation that references systems that no longer exist.

Sign 4 is where the strongest external evidence lives. A peer-reviewed ICSE 2022 paper studied orphan vulnerabilities from code reuse in open source: patches were provided to maintainers of orphaned projects, and only a small percentage accepted and applied them (https://web.eecs.utk.edu/~dreid6/ICSE2022_Orphan.pdf, jev weight 0.61). That is the zombie-code failure mode measured empirically: the vulnerability is known, the fix exists, and nobody with authority ships it.

Practitioner writing extends the risk to the supply chain: some of the most trusted code on the internet has no maintainer; abandoned libraries, archived repos, and packages whose owner stopped responding years ago quietly underpin production systems (https://foxfoster.com/blog/posts/zombie-dependencies-abandoned-code.html, jev weight 0.14, weak backing).

## Why zombie code is a deprecation problem, not a cleanup problem

The source doc's response rule is binary: "Either assign an owner and maintain it properly, or deprecate it with a concrete migration plan. Zombie code cannot stay in limbo; it either gets investment or removal."

This is where zombie code differs from ordinary dead code. Ordinary dead code has no consumers, so removal is a cleanup task. Zombie code has active consumers and no owner, so removal requires the full migration process from the skill (see 04-migration-process.md): a replacement must exist, consumers must be identified and migrated incrementally, and zero active usage must be verified before deletion. Assigning an owner is the cheaper path only when the system still provides unique value (question 1 of the deprecation-decision framework, see 02-deprecation-decision.md).

The connection to Hyrum's Law (see 01-core-principles.md) explains why zombie code is so sticky: every observable behavior of the zombie has had years to become a dependency. Consumers depend not only on documented behavior but on bugs and timing quirks, and with no owner, nobody is collecting the inventory of those dependencies. The deprecation decision framework's question 2 (how many consumers depend on it) is often unanswerable for a zombie without measurement, which is why the skill's red flags list "deprecation without measuring current usage."

## The limbo failure mode

The skill's insistence on the binary response targets a specific organizational failure: zombie code in limbo, where everyone hopes someone else will deal with it. Limbo has a cost curve that only gets worse: security vulnerabilities accumulate (sign 4), compatibility drifts (sign 5), and the eventual migration gets harder as more consumers accrete onto the unowned surface. The invest-or-remove rule forces the decision while the migration is still tractable.

A related anti-pattern the skill flags elsewhere: new features added to a deprecated or zombie system. Investment without ownership is the worst quadrant, because it grows the dependency surface that a future deprecation must migrate.

Weak-backing note: the ICSE 2022 orphan-vulnerability paper (0.61) is the only dig source in this document above the 0.5 bar. The glossary and blog sources corroborate the source doc's framing at weak strength. The source doc's definition, signs, and response rule are the authoritative spine of this corpus document.
