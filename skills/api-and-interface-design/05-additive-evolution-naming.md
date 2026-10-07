# 05 Prefer Addition Over Modification, and Predictable Naming

Scope: the skill's 4th principle (extend interfaces without breaking existing consumers) and its 5th (predictable naming conventions), which together keep an interface stable while it grows.

## Prefer addition over modification

The source doc's rule: extend interfaces without breaking existing consumers (source doc). The good and bad examples make the boundary precise. Good: add optional fields to `CreateTaskInput`, such as a later-added optional `priority` and optional `labels` (source doc). Bad: remove a field like `description`, or change an existing field's type, as in changing `priority` from string to number (source doc). Both bad moves break existing consumers, and under Hyrum's Law (doc 01) the breakage is not hypothetical: whatever observed the old shape depends on it.

The mechanics that make addition safe are in the type system: an optional field added to an input type compiles for every existing caller (source doc). That is why the checklist requires new fields to be additive and optional, that is, backward compatible (source doc). Required fields cannot be added safely for the same reason optional ones can: every existing caller that omits them now fails.

The API-evolution literature states the same constraint at the system scale: breaking changes force coordinated updates across independent teams and external customers, which is often impossible at scale, so the solution is designing for evolution from the start with additive changes (https://www.systemoverflow.com/learn/design-fundamentals/api-design-basics/api-evolution-and-backward-compatibility-strategies, jev weight 0.17, weak; treat as weak backing). Schema-evolution guides describe the corresponding vocabulary: additive changes, field aliases, and expand/contract patterns for the rare non-additive cases (https://kindatechnical.com/api-design-development/schema-evolution-additive-changes.html, jev weight 0.31, weak). Public-API practice is consistent with this: Microsoft's REST API Guidelines exist precisely to give service teams stable conventions for building and modifying services without breaking clients (https://github.com/microsoft/api-guidelines, jev weight 0.89, high), and a shipping API's changelog discipline (per-endpoint, per-schema change records, as in https://cursor.com/docs/api/origin/changelog, weight 0.75, high) is the observable artifact of a contract that evolves additively.

When a change cannot be additive, it is no longer this skill's job: removal and type changes are the deprecation-and-migration discipline the source doc routes to at design time (source doc, doc 01).

## Predictable naming

The source doc's naming table fixes 5 conventions (all from the source doc):

| Pattern | Convention | Example |
|---|---|---|
| REST endpoints | Plural nouns, no verbs | `GET /api/tasks`, `POST /api/tasks` |
| Query params | camelCase | `?sortBy=createdAt&pageSize=20` |
| Response fields | camelCase | `{ createdAt, updatedAt, taskId }` |
| Boolean fields | is/has/can prefix | `isComplete`, `hasAttachments` |
| Enum values | UPPER_SNAKE | `"IN_PROGRESS"`, `"COMPLETED"` |

The pattern behind the table is one rule applied at every layer: the resource model is expressed in nouns, the operations are expressed by HTTP methods, and the data fields follow one casing convention end to end. The REST naming literature phrases it the same way: URIs should convey the API's resource model to clients, and well-named resources make the API intuitive (https://restfulapi.net/resource-naming/, jev weight 0.26, weak; the general REST framing at https://restfulapi.net/ is 0.23, weak). Label those weak; the conventions themselves are the source doc's and the Microsoft guidelines (0.89, high) are the industry-scale precedent that conventions like this get written down and enforced centrally.

Naming is not cosmetic under this skill's model. Verbs in REST URLs (`/api/createTask`, `/api/getUsers`) are a listed red flag (source doc) because they duplicate the method semantics and fragment the URL space: the same operation becomes reachable under names the contract never standardized. Inconsistent casing across endpoints is the error-semantics problem again (doc 03): each variation is an observable behavior somebody will depend on.

## Rationalizations

The source doc's table disposes of the common ones (all from the source doc):

- "We'll document the API later": the types are the documentation; define them first (doc 02).
- "We don't need pagination for now": you will the moment someone has 100+ items; add it from the start (doc 07).
- "PATCH is complicated, let's just use PUT": PUT requires the full object every time; PATCH is what clients actually want (doc 07).
- "We'll version the API when we need to": breaking changes without versioning break consumers; design for extension from the start.
- "Nobody uses that undocumented behavior": Hyrum's Law says otherwise (doc 01).

## Applying this doc

1. Before shipping any interface change, classify it: additive-optional (safe), additive-required (breaking), removal or type change (deprecation path).
2. Write the naming table into the codebase's lint or review checklist; enforce plural nouns, camelCase params and fields, is/has/can booleans, UPPER_SNAKE enums.
3. Treat a proposed breaking change as a trigger for the deprecation-and-migration skill, not a normal review.
