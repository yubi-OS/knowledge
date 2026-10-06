# 01 Hyrum's Law and the One-Version Rule

Scope: why every observable behavior of an interface becomes a de facto contract, the design implications the source doc draws from that, and the One-Version Rule that keeps consumers off the diamond-dependency treadmill.

## The law

The source doc opens its Core Principles with Hyrum's Law, quoted directly: "With a sufficient number of users of an API, all observable behaviors of your system will be depended on by somebody, regardless of what you promise in the contract." The observation originates with Hyrum Wright, and the canonical statement on hyrumslaw.com phrases it the same way: with enough users of an API, it does not matter what you promise in the contract, because all observable behaviors of the system will be depended on by somebody (source doc; https://www.hyrumslaw.com/, jev weight 0.63, high).

The practical reading is that the boundary between a documented interface and its implementation blurs once users accumulate. Anything a consumer can observe, including undocumented quirks, error message text, timing, and ordering, is behavior somebody will eventually depend on. The source doc states this explicitly: every public behavior, including undocumented quirks, error message text, timing, and ordering, becomes a de facto contract once users depend on it (source doc).

## Design implications the skill draws

The source doc lists 4 implications, and each is a standing design discipline rather than a one-off rule:

1. Be intentional about what you expose. Every observable behavior is a potential commitment. Exposing more surface means inheriting more permanence (source doc).
2. Don't leak implementation details. If users can observe it, they will depend on it (source doc).
3. Plan for deprecation at design time. The skill routes removal work to its sibling skill `deprecation-and-migration` (source doc). This is the design-time counterpart of Hyrum's Law: because removal is expensive once users depend on behavior, the removal path must be designed before the behavior ships, not after.
4. Tests are not enough. Even with perfect contract tests, Hyrum's Law means "safe" changes can break real users who depend on undocumented behavior (source doc). Contract tests verify the promised surface; they cannot verify the unobserved surface, because the unobserved surface is unbounded.

Weak external backing note: secondary write-ups of Hyrum's Law from aggregator sites collected during research carried low trust weights (for example lawsofsoftwareengineering.com at weight 0.24 and laws-of-software.com at 0.33, both weak, below the 0.5 authoritative threshold), so this doc grounds the law on the canonical site and the source doc rather than on secondary summaries.

## What "observable" covers in practice

The source doc's error-semantics section makes the observation concrete: if some endpoints throw, others return null, and others return `{ error }`, consumers can't predict behavior, which means consumers will write code that depends on whichever pattern each endpoint happens to use (source doc). Inconsistency does not just hurt readability; it multiplies the observable surface that becomes load-bearing. A single consistent error shape is the cheapest way to shrink the observable contract.

The same logic applies to the red flags the source doc lists: endpoints that return different shapes depending on conditions, and inconsistent error formats across endpoints (source doc). Both are observable behaviors that Hyrum's Law converts into permanent commitments.

## The One-Version Rule

The source doc's second principle: avoid forcing consumers to choose between multiple versions of the same dependency or API. Diamond dependency problems arise when different consumers need different versions of the same thing. Design for a world where only one version exists at a time, and extend rather than fork (source doc).

The diamond problem is structural: when 2 of your dependencies depend on different versions of a common artifact, most build systems resolve them to a single version, and the choice constrains your whole tree. The dependency-management literature describes this as the case where two or more libraries in a dependency tree consume a common library using versioned references and no single version satisfies all of them (http://jlbp.dev/what-is-a-diamond-dependency-conflict, jev weight 0.14, weak). Treat that source as weak backing; the mechanism itself is stated by the source doc and is not in dispute.

The design consequence the skill draws is not "manage versions better" but "make versioning rare": prefer additive extension (see doc 05) so a single version can serve all consumers, and treat maintaining two versions as the failure mode it is. The source doc's rationalization table is blunt on this point: "We can just maintain two versions" is answered with "multiple versions multiply maintenance cost and create diamond dependency problems; prefer the One-Version Rule" (source doc).

## How to apply this doc

When designing any public surface, inventory what is observable: response shapes, error text, ordering, timing, status codes. For each, ask whether you are prepared to support it forever. If not, hide it, normalize it, or plan its deprecation at design time. And when tempted to fork a contract into v1 and v2, extend instead: optional fields and additive endpoints keep one version alive where a fork creates two.
