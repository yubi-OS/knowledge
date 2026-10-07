# API Documentation

Scope: the source doc's two-form rule for public API documentation (inline types with TSDoc for TypeScript, OpenAPI/Swagger for REST), what each form must carry, and the standards behind them.

## The two-form rule

Per the source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md, "API Documentation"), public APIs (REST, GraphQL, library interfaces) get documentation in one of 2 forms, chosen by surface type: inline with types for TypeScript code, and OpenAPI/Swagger for REST APIs. The trigger from doc 01 applies here: adding or changing a public API is one of the skill's 6 documentation triggers.

## Form 1: inline with types (preferred for TypeScript)

The source doc marks inline-with-types as the preferred form for TypeScript and gives the canonical shape as a JSDoc block on an exported function:

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

The block carries 5 kinds of information: the one-line summary, the parameter contract (title required, description optional), the return shape (server-generated ID and timestamps), the error contract (which exceptions under which conditions), and a runnable example with expected output.

The standards behind this form are well grounded by the dig:

- The TypeScript Handbook's JSDoc Reference (https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html, weight 0.91) documents how JSDoc annotations interact with the TypeScript type system, including the `@param`, `@returns`, and `@throws` tags used in the source doc's example.
- TSDoc (https://tsdoc.org/, weight 0.87) is the standard comment syntax for TypeScript API documentation, designed for extraction and rendering by tools like API Extractor; the source doc's block is TSDoc-shaped.
- The TypeScript documentation portal (https://www.typescriptlang.org/docs/, weight 0.86) and the language home page (https://www.typescriptlang.org/, weight 0.63) ground the claim that types themselves are part of the documentation: the signature `Promise<Task>` is the machine-checked half of the contract, and the JSDoc block is the human-readable half.

## Form 2: OpenAPI/Swagger for REST

For REST endpoints, the source doc prescribes an OpenAPI spec. Its example describes `POST /api/tasks` with a required JSON request body referencing a `CreateTaskInput` schema component, and 2 response codes: 201 for task created and 422 for validation error, each with a JSON schema reference.

The standards behind this form are equally well grounded:

- The OpenAPI Specification version 3.2 at https://swagger.io/specification/v3.2/ (weight 0.83) is the current specification document covering the `paths`, `requestBody`, `responses`, and `$ref` schema components the source doc's example uses.
- The OpenAPI Initiative's "What is OpenAPI?" page (https://www.openapis.org/what-is-openapi, weight 0.80) defines OpenAPI as a standard, language-agnostic interface description for REST APIs, which allows both humans and computers to discover and understand the service's capabilities.
- The OpenAPI Initiative home (https://www.openapis.org/, weight 0.66) grounds the ecosystem claim: OpenAPI definitions drive documentation generators, client SDKs, and server stubs, which is why the spec form earns its overhead for REST surfaces.

## Which form when

The split is by surface, not preference alone: a library interface or internal function consumed from TypeScript gets inline types (the types are checked by the compiler and the JSDoc rides on the same declaration); a network boundary gets OpenAPI (consumers are not in the codebase and cannot read the source). The source doc's heading "Inline with Types (Preferred for TypeScript)" signals that when both are possible for a TypeScript-only audience, inline wins on proximity: the documentation lives exactly where the contract is enforced.

## Connection to the rest of the skill

The API documentation rule connects to 2 other corpus docs. The throws clauses reference error classes whose existence is itself an API decision (doc 02's API-architecture trigger), and the gotcha pattern from doc 04 extends naturally to exported functions: a non-obvious lifecycle requirement (like the theme-initialization example) belongs on the public surface where callers will actually see it. The red-flags list (doc 09) closes the loop with "public APIs with no documentation or types": an API missing either half of the contract is a flagged violation.
