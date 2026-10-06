# 06. API documentation: inline types and OpenAPI

Scope: the skill's API documentation rules for public interfaces: inline typed documentation preferred for TypeScript, OpenAPI/Swagger for REST endpoints, with parameter, return, error, and example coverage.

## The skill's 2 mechanisms (source doc)

The source doc (yubi-OS/yubiOS skills/documentation-and-adrs/SKILL.md) applies to "public APIs (REST, GraphQL, library interfaces)" and prescribes 2 mechanisms:

1. Inline with types, preferred for TypeScript. Its example is a `createTask` function documented in a docblock with @param input, @returns (created task with server-generated ID and timestamps), 2 @throws entries (ValidationError if title is empty or exceeds 200 characters; AuthenticationError if the user is not authenticated), and an @example showing a call and its result. The error cases are documented with the exception type and the condition that raises it.
2. OpenAPI/Swagger for REST APIs. Its example is a YAML path document for POST /api/tasks with a required requestBody referencing a CreateTaskInput schema, and 2 responses: 201 Task created, and 422 Validation error.

The pairing rule: typed library interfaces get their documentation attached to the declaration; HTTP surfaces get a machine-readable interface description.

## TypeScript-side grounding

The TypeScript handbook documents the mechanism the skill relies on: JSDoc annotations supported in JavaScript files, and "Only documentation tags are supported in TypeScript files" (https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html, jev 0.95). In a strongly typed codebase the type annotation already carries the what; the docblock carries the why and the failure modes, which is why the skill's example spends most of its lines on @throws and @example rather than on the types.

TSDoc exists precisely because the JSDoc grammar is underspecified: "The JSDoc grammar is not rigorously specified, but rather inferred from the behavior of a particular implementation," and most JSDoc tags exist "to provide type annotations for plain JavaScript, which is not a primary concern for a strongly-typed language such as TypeScript" (https://tsdoc.org/, jev 0.89). Teams standardizing docblocks for public TS APIs should treat TSDoc as the grammar to converge on; the skill's example (@param, @returns, @throws, @example) is inside that tag set.

## OpenAPI-side grounding

The OpenAPI Initiative frames the specification as "a formal standard for describing HTTP APIs" that lets people and tools "understand how an API works, how a sequence of APIs work together, generate client code, create tests, apply design standards, and much more" (https://www.openapis.org/, jev 0.87). The specification itself defines "a standard interface to RESTful APIs which allows both humans and computers to understand service capabilities without access to source code, documentation, or network traffic inspection" (https://swagger.io/specification/v3.2/, jev 0.87). The spec is community-driven inside the OpenAPI Initiative, a Linux Foundation Collaborative Project (https://github.com/OAI/OpenAPI-Specification, jev 0.96), and a spec document can be encoded in JSON or YAML (https://www.openapis.org/what-is-openapi, jev 0.91), which is the format the skill's example uses.

The skill's example includes the 422 Validation error response as a first-class documented response. That matches the standard's design: responses are described per status with schemas, so error behavior is part of the contract rather than prose elsewhere.

## Why this section exists in a decisions skill

The skill's trigger list includes "Adding or changing a public API" as a documentation event, and its red flags include "Public APIs with no documentation or types". The API documentation section is the concrete payoff of those triggers: when the trigger fires, the output is either a typed docblock on the interface or an updated OpenAPI document, not a wiki page. The skill's rationalization table also answers the common excuse here: "APIs stabilize faster when you document them. The doc is the first test of the design."

## Practice notes

1. For a TS public function, the minimum contract is @param, @returns, every @throws with its condition, and 1 @example.
2. Document error conditions with the exact exception or status code and the condition that produces them; "throws on error" documents nothing.
3. Keep the OpenAPI document in the repo and update it in the same PR as the endpoint change; a stale spec is worse than none because consumers trust it.
4. For GraphQL and library interfaces, the inline-with-types pattern extends naturally; the skill names them covered cases.
5. Types are part of the documentation surface, not a substitute for it: the skill wants both the signature and the why.
