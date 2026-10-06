# Rationalizations, Red Flags, and the Verification Checklist

Scope: the skill's defenses against self-deception: the 6 common rationalizations for not deprecating, the 7 red flags of a broken deprecation program, and the 6-item post-deprecation verification checklist (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md, sections "Common Rationalizations", "Red Flags", "Verification").

## The rationalizations

The source doc pairs each rationalization with its reality:

1. "It still works, why remove it?" Working code that nobody maintains accumulates security debt and complexity. Maintenance cost grows silently.
2. "Someone might need it later." If it is needed later, it can be rebuilt. Keeping unused code just in case costs more than rebuilding.
3. "The migration is too expensive." Compare migration cost to ongoing maintenance cost over 2 to 3 years. Migration is usually cheaper long-term.
4. "We'll deprecate it after we finish the new system." Deprecation planning starts at design time. By the time the new system is done, priorities have moved. Plan now.
5. "Users will migrate on their own." They will not. Provide tooling, documentation, and incentives, or do the migration yourself (the Churn Rule, see 04-migration-process.md).
6. "We can maintain both systems indefinitely." Two systems doing the same thing doubles maintenance, testing, documentation, and onboarding cost.

The structure of this table is the pattern general anti-pattern literature recommends: name the anti-pattern, describe its appeal (why teams choose it), and state what it produces (https://architecting-agentic-systems.net/en/11_failure_modes_and_anti_patterns, jev weight 0.24, weak backing). Architectural failure modes are easier to fix when teams can name them early (https://softwarepatternslexicon.com/microservices-boundaries-and-service-decomposition/anti-patterns/, jev weight 0.21, weak backing). The rationalizations table is that technique applied to deprecation: each row is a named, disarmed excuse.

A contractual lens sharpens rationalization 1: organizations assessing whether a software solution is positioned as a long-term strategic platform or is likely to be displaced or retired within the contract term treat sunset positioning as a first-class procurement question, not an afterthought (https://www.pillsburylaw.com/en/news-and-insights/software-sunsetting-contractual-postcontractual-best-practices.html, jev weight 0.53). "It still works" is not a strategy if the contract or the market has already decided the system's horizon.

## The red flags

The source doc lists 7 signals that a deprecation program is broken:

1. Deprecated systems with no replacement available.
2. Deprecation announcements with no migration tooling or documentation.
3. "Soft" deprecation that has been advisory for years with no progress.
4. Zombie code with no owner and active consumers (see 07-zombie-code.md).
5. New features added to a deprecated system (invest in the replacement instead).
6. Deprecation without measuring current usage.
7. Removing code without verifying zero active consumers.

Flags 1 and 2 are violations of the migration process's steps 1 and 2 (build the replacement, announce with documentation). Flag 3 is advisory deprecation without an escalation trigger (see 03-advisory-vs-compulsory.md). Flags 5 through 7 are measurement failures: each one is detectable with metrics, logs, and dependency analysis, which is why the skill's deprecation decision framework makes quantifying consumers question 2 (see 02-deprecation-decision.md).

## The verification checklist

After completing a deprecation, the source doc requires 6 checks:

1. Replacement is production-proven and covers all critical use cases.
2. Migration guide exists with concrete steps and examples.
3. All active consumers have been migrated (verified by metrics and logs).
4. Old code, tests, documentation, and configuration are fully removed.
5. No references to the deprecated system remain in the codebase.
6. Deprecation notices are removed (they served their purpose).

Check 3 is the gate; checks 4 through 6 are the cleanup sweep that prevents the removed system from leaving residue. Verification practice generally holds that verification is not just about running tests but about knowing when to stop, which requires measurement rather than assertion (https://chipverify.com/verification/verification-metrics, jev weight 0.14, weak backing). Review-oriented checklists structure exactly this kind of systematic inspection across axes (https://hidekazu-konishi.com/entry/code_review_checklist_and_antipatterns.html, jev weight 0.16, weak backing).

The checklist closes the loop with the Churn Rule: a deprecation where the owner did the migrating (or shipped no-migration backward-compatible updates) passes checks 1 through 3 naturally. A deprecation that announced a deadline and walked away fails check 3, and the honest response is to reopen the program rather than mark it complete.

## How to use this document

Run the rationalizations table in design review (it is a list of sentences someone will say; having the counterargument written down is the defense). Run the red flags as a periodic audit of every in-flight deprecation. Run the verification checklist as the exit gate of every completed one. The 3 lists are one instrument at 3 stages of the same lifecycle, and all of them are grounded in the source doc; the dig record contributes the supporting practice literature at weak strength.
