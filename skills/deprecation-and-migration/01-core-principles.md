# Core Principles: Code as a Liability, Hyrum's Law, and Design-Time Deprecation

Scope: the three load-bearing principles behind the deprecation-and-migration skill (ground source: yubi-OS/yubiOS skills/deprecation-and-migration/SKILL.md): every line of code is an ongoing cost, user dependencies on observable behavior make removal hard, and deprecation must be planned when a system is designed, not when it dies.

## Code is a liability, not an asset

The source doc states the thesis directly: "Code is a liability, not an asset. Every line of code has ongoing maintenance cost." The cost list it gives is concrete: bugs to fix, dependencies to update, security patches to apply, and new engineers to onboard. The skill's operational conclusion is that the value of code is the functionality it provides, not the code itself. When the same functionality can be delivered with less code, less complexity, or better abstractions, the old code should go.

This framing matches the technical-debt literature. Curtis's widely cited measurement model splits technical debt into three parts: principal (the cost of fixing the underlying problems), interest (the continuing IT costs attributable to the violations, such as higher maintenance and greater resource usage), and liability (business costs of outages, breaches, and corrupted data) (https://www.clubdeinvestigacion.com/wp-content/uploads/2021/03/Curtis-Measuring-and-Managing-Technical-Debt.pdf, jev weight 0.20, weak backing). The same weak-backed reading appears in practitioner writing: few systems, hardware or software, can be installed and then ignored; most require ongoing attention (https://www.informit.com/articles/article.aspx?p=458170&seqNum=3, jev weight 0.35, weak backing), and a personal essay on first principles makes the same argument that glorifying "elegant solutions" hides the liability they carry (https://tankthinks.net/posts/2024/09/first-principles-5-code-is-liability/, jev weight 0.14, weak backing).

The skill's practical use of this principle is a decision rule, not a slogan: before defending a line of code, ask what functionality it delivers and what it costs per year to keep. If a smaller or cleaner implementation delivers the same functionality, the old code is a candidate for deprecation.

## Hyrum's Law makes removal hard

The source doc leans on Hyrum's Law to explain why deprecation requires active migration rather than announcement. The canonical statement: "With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody" (https://www.hyrumslaw.com/, jev weight 0.43, weak backing). The observation is attributed to Hyrum Wright in 2012 (https://www.laws-of-software.com/laws/hyrum/, jev weight 0.32, weak backing). A dedicated law catalog records it the same way: as user count grows, everything the system does becomes a dependency point (https://lawsofsoftwareengineering.com/laws/hyrums-law/, jev weight 0.23, weak backing).

The engineering consequence, as one practitioner summary puts it, is that "your implementation details become your API contract, regardless of documentation or intent" (https://lyletagawa.com/posts/hyrums-law/, jev weight 0.18, weak backing). That is exactly the mechanism the source doc describes: users cannot "just switch" when they depend on behaviors, bugs, timing quirks, or undocumented side effects that the replacement does not replicate.

The remediation the dig literature adds is behavioral: for legacy systems, teams should identify the critical observable behaviors and ensure they are preserved during updates (https://dev.to/ashokan/hyrums-law-the-unseen-force-shaping-software-dependencies-5c33, jev weight 0.11, weak backing). This dovetails with the skill's incremental migration process, where each consumer migration ends with "verify behavior matches (tests, integration checks)."

## Deprecation planning starts at design time

The source doc's third principle asks designers a question at build time: "How would we remove this in 3 years?" Systems designed with clean interfaces, feature flags, and minimal surface area are easier to deprecate than systems that leak implementation details everywhere. The skill returns to this in its rationalizations table: "We'll deprecate it after we finish the new system" is listed as a rationalization, because by the time the new system is done, priorities have moved. Plan now.

The skill's own feature-flag migration pattern is the design-time mechanism in action: routing consumers per user between the old and new implementation from day 1 is only possible if the seam was built in. A system with no seam cannot be strangler-migrated or flag-migrated; it can only be big-bang cut over, which the skill's migration process explicitly avoids.

## How the three principles compose

The three principles form the skill's causal chain. Code-as-liability gives the reason to deprecate (cost without value). Hyrum's Law gives the reason removal is expensive (invisible dependencies). Design-time planning gives the reason to prepare before either bites (clean seams make future removal cheap). The skill's deprecation-decision framework, migration process, and patterns (see 02-deprecation-decision.md, 04-migration-process.md, and 05-migration-patterns.md in this corpus) are the operational machinery that executes this chain.

One honest caveat from the dig record: the strongest external backing in this document comes from the Hyrum's Law cluster, and even those sources score below the 0.5 authoritative bar under the noul decision model. The core claims of this document are grounded in the source doc itself; the dig sources corroborate the framing but should be treated as weak backing until stronger primary sources (for example the original Google SWE book chapter on Hyrum's Law) are collected in a later refresh cycle.
