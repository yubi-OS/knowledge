# 07 REST Resource Design

Scope: the skill's REST patterns section: resource-oriented endpoints and sub-resources, the pagination envelope, query-parameter filtering, and PATCH partial updates.

## Resource-oriented endpoints

The source doc's endpoint table fixes the shape (all from the source doc):

```
GET    /api/tasks              → List tasks (with query params for filtering)
POST   /api/tasks              → Create a task
GET    /api/tasks/:id          → Get a single task
PATCH  /api/tasks/:id          → Update a task (partial)
DELETE /api/tasks/:id          → Delete a task

GET    /api/tasks/:id/comments → List comments for a task (sub-resource)
POST   /api/tasks/:id/comments → Add a comment to a task
```

The pattern: collections are plural nouns, items are collections plus an id, and related entities hang off the item as sub-resources. Combined with doc 05's naming table (no verbs in URLs), the method carries the operation and the URL carries only the resource path. Verbs in REST URLs (`/api/createTask`, `/api/getUsers`) are a listed red flag because they duplicate what the method already says and fragment the URL space (source doc).

REST as an architectural style was created in 2000 to guide the development of the World Wide Web (https://en.wikipedia.org/wiki/REST, jev weight 0.38, weak; label as weak context, the endpoint conventions themselves are the source doc's).

## Pagination

The source doc requires paginating list endpoints, with a fixed request and response envelope (source doc):

```typescript
// Request
GET /api/tasks?page=1&pageSize=20&sortBy=createdAt&sortOrder=desc

// Response
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 142,
    "totalPages": 8
  }
}
```

The rationalization table is blunt about why this is not optional: "we don't need pagination for now" is answered with "you will the moment someone has 100+ items. Add it from the start" (source doc). The red flag list includes list endpoints without pagination (source doc), and the checklist requires list endpoints to support pagination (source doc).

The envelope shown is the offset/page-number style. The pagination-patterns literature distinguishes offset, cursor, and keyset pagination, noting that keyset is the academic name for cursor pagination when it involves compound primary keys or sort keys, and that stateless cursors avoid storing pagination state server-side (https://faizahmed.in/offset-vs-cursor-vs-keyset-pagination/, jev weight 0.25, weak; also https://getknit.dev/blog/api-pagination-best-practices/ at 0.24, weak, and https://apiscout.dev/guides/api-pagination-patterns-cursor-vs-offset-2026 at 0.18, weak). All weak; use them as pointers only. The skill's enforceable rule is from the source doc: paginate from the start, with a consistent envelope across list endpoints. If a collection later needs cursor semantics for stability under writes, that is an evolution of the same envelope decision, not an excuse to ship unpaginated.

## Filtering

Filters are query parameters, not new endpoints (source doc):

```
GET /api/tasks?status=in_progress&assignee=user123&createdAfter=2025-01-01
```

Query params are camelCase per the naming table (doc 05), and the example shows the three filter families a list endpoint typically needs: enum-valued state (`status=in_progress`), relation (`assignee=user123`), and range (`createdAfter=2025-01-01`) (source doc).

## PATCH partial updates

PATCH accepts partial objects and only updates what's provided (source doc):

```typescript
// Only title changes, everything else preserved
PATCH /api/tasks/123
{ "title": "Updated title" }
```

The rationalization table pre-empts the pushback: "PATCH is complicated, let's just use PUT" is answered with "PUT requires the full object every time. PATCH is what clients actually want" (source doc). PUT's full-object requirement creates two failure modes the skill avoids: clients must fetch before writing (a read-modify-write race), and clients can clobber fields they did not mean to touch.

PATCH's semantics are standardized, and the dig surfaced the primary source: RFC 5789 defines the PATCH method for HTTP, where the difference between PUT and PATCH is reflected in the way the server processes the enclosed entity to modify the resource, and PATCH requests supply a set of instructions describing how a resource currently on the server should be modified (https://www.rfc-editor.org/info/rfc5789/, jev weight 0.97, high). RFC 5789 does not mandate a specific patch document format; the apply mechanism is defined by the patch document's media type (https://www.rfc-editor.org/info/rfc5789/, 0.97, high; secondary confirmation at https://qaskills.sh/blog/http-patch-method-api-testing-rfc-5789, 0.18, weak). The IETF RFC process (https://www.ietf.org/process/rfcs/, 0.91, high) and RFC Editor (https://www.rfc-editor.org/, 0.89, high) host the specification family. The skill's rule is the practical subset of the RFC: accept partial objects, update only provided fields, preserve everything else (source doc).

## Design-time questions this section forces

1. Is every mutating operation mapped to a resource path plus method, with no verbs in URLs?
2. Does every list endpoint paginate from day 1 with the shared envelope?
3. Are filters query parameters on the collection, camelCase, and documented?
4. Do update endpoints accept partial objects (PATCH) rather than requiring full replacement (PUT)?
5. For state-changing endpoints: does doc 06's idempotency discipline apply?

The checklist binds these: every endpoint has typed input and output schemas; list endpoints support pagination; new fields are additive and optional; naming follows consistent conventions across all endpoints; state-changing endpoints either honour an idempotency key or are documented as unsafe to retry (source doc).
