# API Documentation: Types Inline and OpenAPI Specs

Scope: the source doc's API documentation section: inline-with-types documentation for public TypeScript APIs (params, returns, throws, examples) and OpenAPI/Swagger YAML for REST APIs.

## The scope: public APIs (source doc)

The source doc scopes this section to "public APIs (REST, GraphQL, library interfaces)". The trigger from the When to Use list is "Adding or changing a public API": a public API is a contract with consumers who cannot read the implementation, so its documentation is part of the contract rather than a courtesy. This is why the skill treats undocumented public APIs as a red flag ("Public APIs with no documentation or types", source doc).

## Inline with types, preferred for TypeScript (source doc)

For TypeScript, the source doc prefers documentation living in the type annotations and JSDoc-style doc comment on the exported function. Its example:

```typescript
/**
 * Creates a new task.
 *
 * @param input - Task creation data (title required, description optional)
 * @returns The created task with server-generated ID and timestamps
 * @throws {ValidationError} If title is empty or exceeds 200 characters
 * @throws {AuthenticationError} If the user is not authenticated
 *
 * @example
 * const task = await createTask({ title: 'Buy groceries' });
 * console.log(task.id); // "task_abc123"
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
```

4 contract elements are documented here that the type signature alone cannot carry: the semantic constraint on `input` (title required, description optional), the response enrichment (server-generated ID and timestamps), the 2 error cases with their exception types, and a runnable example. The `@throws` tags are the highest-value part for consumers: they turn error handling from guesswork into an enumerated contract.

This doc-comment form is the standard TypeScript ecosystem mechanism. The TypeScript handbook documents which JSDoc types the compiler itself understands (https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html, jev weight 0.78, authoritative). TSDoc is the standard for authoring doc comments that downstream tools (API extractors, doc generators) can parse consistently across packages, with an explicit design goal of a standardized comment syntax for TypeScript (https://tsdoc.org/, jev weight 0.68, authoritative; https://tsdoc.org/pages/intro/approach/, jev weight 0.72, authoritative). TSDoc's `@inheritDoc` tag also matters for API docs: it lets an override inherit its base documentation instead of duplicating it (https://tsdoc.org/pages/tags/inheritdoc/, jev weight 0.67, authoritative). These 4 sources are the authoritative external anchors for the inline-types half of this doc.

## OpenAPI / Swagger for REST APIs (source doc)

For REST APIs, the source doc shows an OpenAPI YAML fragment documenting a `POST /api/tasks` operation: summary ("Create a task"), a required JSON request body referencing a `CreateTaskInput` schema, and 2 responses (201 with a `Task` schema, 422 for validation error). The doc's point is structural: request and response shapes live in reusable schema components, and the success/error contract is enumerated per operation.

The OpenAPI Initiative's own best-practices guidance is the authoritative anchor here: it covers describing operations, defining schemas for payloads, and enumerating response codes (https://learn.openapis.org/best-practices.html, jev weight 0.80, authoritative). A community-developers guide covers the same ground from the consumer side (https://advanced-infrastructure.github.io/developers-101/api_documentation.html, jev weight 0.19, weak backing). The weaker results in this dig (gravitee.io 0.17, restfulapi.net 0.18, a vendor API doc 0.14) corroborate the practice but are recorded as weakly-backed.

## How the two forms divide

The source doc's split is by interface kind: inline-with-types for in-repo, in-language contracts (TypeScript library interfaces), OpenAPI for cross-language HTTP contracts (REST). GraphQL is named in the scope line but the source doc shows no GraphQL-specific format, so the corpus does not invent one; the transferable principle is the same in all cases: document the contract (inputs, outputs, errors, an example) at the boundary where a consumer meets it.

The two forms also differ in who enforces them. A TypeScript doc comment sits next to the function signature the compiler checks, so drift between types and docs is at least visible in one file. An OpenAPI spec is a separate artifact from the server implementation, which is why spec-first workflows exist; the source doc does not prescribe spec-first or code-first, and neither does this corpus.

## Connection to the rest of the corpus

API documentation is the interface-level expression of the skill's why-over-what philosophy: the signature already says the what (types); the doc comment carries the why-adjacent what the signature cannot (constraints, error semantics, example usage). It pairs with the gotcha pattern from doc 05 when a public API has non-obvious preconditions: the gotcha comment documents the invariant, the API doc documents the contract, and both can point at the same ADR.

The verification checklist item "API functions have parameter and return type documentation" (source doc) is the pass/fail test for this doc's content. For a project following the skill, a public API surface is reviewable by scanning for exported functions missing doc comments and REST endpoints missing OpenAPI coverage, which is a mechanical check an agent can run (doc 08 develops the agent angle).
