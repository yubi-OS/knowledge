# 05 Language-Specific Guidance

Scope: the skill's language-specific simplification examples for TypeScript/JavaScript, Python, and React, with the external idiom references behind each pattern.

## TypeScript / JavaScript

The source doc gives 4 worked before/after patterns for TypeScript and JavaScript (source doc):

1. Unnecessary async wrapper: an `async function` that only does `return await userService.findById(id)` becomes a plain function returning the promise directly. The async keyword adds a wrapper promise and a microtask hop with no behavioral gain.
2. Verbose conditional assignment: a `let` declared empty then filled by an if/else becomes a single `const displayName = user.nickname || user.fullName`.
3. Manual array building: a for-loop pushing filtered items becomes `users.filter((user) => user.isActive)`.
4. Redundant boolean return: `if (condition) { return true; } return false;` becomes `return input.length > 0 && input.length < 100`.

On the async wrapper, practitioner discussion lines up with the skill. An ESLint question on finding unnecessary `async` markers records the maintainer motivation: removing async where it is unnecessary makes the function cleaner to use and easier to test and reason about, since the marker indicates the function does not rely on asynchronous behavior (https://stackoverflow.com/questions/66810780/eslint-how-to-find-unnecessary-async-markers-on-functions, jev 0.14, weak backing). The official TypeScript home grounds the language context for these examples: TypeScript is JavaScript with syntax for types, a strongly typed language that builds on JavaScript (https://www.typescriptlang.org/, jev 0.92).

## Python

The source doc gives 2 Python patterns (source doc):

1. Verbose dictionary building: a for-loop assigning `result[item.id] = item.name` becomes the comprehension `{item.id: item.name for item in items}`.
2. Nested conditionals with early return: a 3-level nested if/else that raises at each level becomes a guard-clause sequence, each failure raised immediately (`raise TypeError` when data is None, `raise ValueError` when invalid, `raise PermissionError` when unauthorized), with the happy path flat at the bottom.

The early-return half of this pattern is a documented idiom beyond Python. A JavaScript guide describes the early return pattern, also called guard clauses, as reducing nesting and improving readability in real-world functions (https://shramko.dev/blog/the-early-return-pattern-in-javascript, jev 0.25, weak backing). A Python tutorial source defines the same shape: a guard clause is a return that fires at the top of a function for an edge case so the rest of the function can focus on the normal path (https://algomaster.io/learn/python/return-statement, jev 0.14, weak backing). The official Python project site anchors the language ecosystem these idioms belong to (https://www.python.org/, jev 0.84).

## React / JSX

The source doc gives 2 React patterns with different guidance strengths (source doc):

1. Verbose conditional rendering: a component returning one of two badges from an if/else becomes computed `variant` and `label` constants feeding a single `<Badge variant={variant}>{label}</Badge>` return. The data mapping is separated from the render.
2. Prop drilling through intermediate components: the source doc explicitly stops short here. It says to consider whether context or composition solves this better, calls it a judgment call, and instructs the agent to flag it rather than auto-refactor.

The React entry is the catalog's only soft row. Everything else in the skill prescribes a concrete transformation; prop drilling is marked as flag-and-discuss because the alternatives (context, composition) carry their own costs and the right answer depends on how widely the prop is consumed and how stable the tree is.

## What the examples share

All 7 worked examples follow the same shape: the before is functionally correct, the after is the same behavior expressed with fewer moving parts for the reader. None of them changes a signature, a return type, or an error. That is the skill's consistency test for adding new language examples: if a proposed pattern would change what the code does, or needs a behavioral argument to justify, it does not belong in this list.

The examples also bias toward the language's own idioms (comprehensions in Python, filter in JavaScript, computed props in JSX) rather than generic style rules, which keeps Principle 2 (follow project conventions) intact: the simplification target is always "what the language community already reads fluently".

## Sources

- Source doc: yubi-OS/yubiOS skills/code-simplification/SKILL.md (Language-Specific Guidance).
- https://www.typescriptlang.org/, jev 0.92.
- https://www.python.org/, jev 0.84.
- https://shramko.dev/blog/the-early-return-pattern-in-javascript, jev 0.25 (weak backing).
- https://stackoverflow.com/questions/66810780/eslint-how-to-find-unnecessary-async-markers-on-functions, jev 0.14 (weak backing).
- https://algomaster.io/learn/python/return-statement, jev 0.14 (weak backing).
