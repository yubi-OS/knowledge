# 04 The Complexity Pattern Catalog

Scope: the skill's Step 2 catalog of concrete simplification signals across 3 categories: structural complexity, naming and readability, and redundancy, with the external smell literature that corroborates each.

## What the catalog is

The source doc's Step 2 instructs scanning for patterns where "each one is a concrete signal, not a vague smell". It organizes 15 patterns into 3 tables: structural complexity, naming and readability, and redundancy. Each row carries a pattern, a signal for detecting it, and the prescribed simplification (source doc, The Simplification Process, Step 2).

## Structural complexity

The 5 structural patterns (source doc):

1. Deep nesting, 3 or more levels. Signal: hard to follow control flow. Simplification: extract conditions into guard clauses or helper functions.
2. Long functions, 50 or more lines. Signal: multiple responsibilities. Simplification: split into focused functions with descriptive names.
3. Nested ternaries. Signal: requires a mental stack to parse. Simplification: replace with if/else chains, switch, or lookup objects.
4. Boolean parameter flags, as in `doThing(true, false, true)`. Signal: unreadable call sites. Simplification: replace with options objects or separate functions.
5. Repeated conditionals, the same `if` check in multiple places. Signal: drift risk. Simplification: extract to a well-named predicate function.

The long-method smell is the best-corroborated row. Refactoring.Guru states that among all types of object-oriented code, classes with short methods live longest, that the longer a method or function is the harder it becomes to understand and maintain, and that long methods offer the perfect hiding place for unwanted duplicate code (https://refactoring.guru/smells/long-method, jev 0.62). The prescribed fix is extract method, and Refactoring.Guru's page on that refactoring gives the mechanics: the more lines found in a method, the harder it is to figure out what the method does, and the new method must be named to describe its purpose (https://refactoring.guru/extract-method, jev 0.62).

## Naming and readability

The 5 naming patterns (source doc):

1. Generic names: `data`, `result`, `temp`, `val`, `item`. Simplification: rename to describe the content, as in `userProfile` or `validationErrors`.
2. Abbreviated names: `usr`, `cfg`, `btn`, `evt`. Simplification: use full words unless the abbreviation is universal (`id`, `url`, `api`).
3. Misleading names: a function named `get` that also mutates state. Simplification: rename to reflect actual behavior.
4. Comments explaining "what", as in `// increment counter` above `count++`. Simplification: delete the comment, the code is clear enough.
5. Comments explaining "why", as in `// Retry because the API is flaky under load`. Simplification: keep these, they carry intent the code cannot express.

Rows 4 and 5 are the skill's editorial rule for comments: comments that duplicate the code are debt, comments that encode intent are signal. This is why the catalog separates them explicitly instead of issuing a blanket "remove comments" instruction.

## Redundancy

The 5 redundancy patterns (source doc):

1. Duplicated logic, the same 5 or more lines in multiple places. Simplification: extract to a shared function.
2. Dead code: unreachable branches, unused variables, commented-out blocks. Simplification: remove, after confirming it is truly dead.
3. Unnecessary abstractions: a wrapper that adds no value. Simplification: inline the wrapper, call the underlying function directly.
4. Over-engineered patterns: factory-for-a-factory, strategy-with-one-strategy. Simplification: replace with the simple direct approach.
5. Redundant type assertions: casting to a type that is already inferred. Simplification: remove the assertion.

Rows 3 and 4 map directly onto the speculative-generality smell: an unused class, method, field or parameter created "just in case" for anticipated future features that never get implemented, making code hard to understand and support; the treatment includes collapse hierarchy and inlining unnecessary delegation (https://refactoring.guru/smells/speculative-generality, jev 0.56). Anti-pattern catalogs treat this family as first-class: Wikipedia's list of software anti-patterns records that several books popularized the idea of anti-patterns in software (https://en.wikipedia.org/wiki/List_of_software_anti-patterns, jev 0.32, weak backing), and a weakly-weighted design writeup describes premature abstraction as an instinct, a reflex rooted in the desire for control rather than a rule of good design (https://techstories.blog/systemdesign/premature-abstraction/, jev 0.17, weak backing).

Adjacent smells in the same family are documented with their own pages, for example long parameter lists as a byproduct of moving object creation out of a method to its callers, so created objects get passed in as parameters (https://refactoring.guru/smells/long-parameter-list, jev 0.67) and magic numbers as unnamed constants that obscure intent (https://handwiki.org/wiki/Magic_number_(programming), jev 0.24, weak backing). The source doc does not list these rows, so treat them as corroborating context, not as part of the skill's catalog.

## Using the catalog

The catalog is a scan grid, not a priority list. The skill expects the agent to walk all 3 tables over the changed code, flag each concrete hit, and turn hits into the one-at-a-time changes of Step 3 (see doc 03). Because every row is behavioral-neutral by construction (renames, extractions, deletions of dead code), the catalog is also what makes the preserve-behavior test tractable: the prescribed simplifications are the ones that do not need behavioral reasoning to justify.

## Sources

- Source doc: yubi-OS/yubiOS skills/code-simplification/SKILL.md (The Simplification Process, Step 2).
- https://refactoring.guru/smells/long-method, jev 0.62.
- https://refactoring.guru/extract-method, jev 0.62.
- https://refactoring.guru/smells/long-parameter-list, jev 0.67.
- https://refactoring.guru/smells/speculative-generality, jev 0.56.
- https://handwiki.org/wiki/Magic_number_(programming), jev 0.24 (weak backing).
- https://en.wikipedia.org/wiki/List_of_software_anti-patterns, jev 0.32 (weak backing).
- https://techstories.blog/systemdesign/premature-abstraction/, jev 0.17 (weak backing).
