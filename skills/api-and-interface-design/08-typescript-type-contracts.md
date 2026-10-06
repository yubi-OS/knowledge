# 08 TypeScript Interface Patterns

Scope: the three type-level patterns the skill prescribes for in-code contracts: discriminated unions for variants, input/output type separation, and branded types for identifiers.

## Discriminated unions for variants

The source doc prescribes discriminated unions when a value has variants, because each variant is explicit and the consumer gets type narrowing (source doc):

```typescript
type TaskStatus =
  | { type: 'pending' }
  | { type: 'in_progress'; assignee: string; startedAt: Date }
  | { type: 'completed'; completedAt: Date; completedBy: string }
  | { type: 'cancelled'; reason: string; cancelledAt: Date };

function getStatusLabel(status: TaskStatus): string {
  switch (status.type) {
    case 'pending': return 'Pending';
    case 'in_progress': return `In progress (${status.assignee})`;
    case 'completed': return `Done on ${status.completedAt}`;
    case 'cancelled': return `Cancelled: ${status.reason}`;
  }
}
```

The pattern's mechanics are documented in the official TypeScript handbook: a discriminated union is a union of object types sharing a literal tag property, and checking the tag narrows the whole object; the `never` type is assignable to every type but no type is assignable to `never` except itself, which is what lets narrowing do exhaustive checking in a default case (https://www.typescriptlang.org/docs/handbook/2/narrowing.html, jev weight 0.94, high). The `switch` in the source doc's example exercises exactly that: after the 4 cases, any unhandled variant would surface as a type error, so adding a `type: 'archived'` variant forces every consumer to handle it. That is the union pattern's real payoff at API scale: variants are not just modeled, their addition is a compile-time event that reaches every consumer.

The alternative, a single loose shape with optional fields for every possible variant (`completedAt?`, `assignee?`, `reason?`, ...), encodes no invariants: nothing stops `pending` from carrying a `completedAt`. The union makes illegal states unrepresentable, which is why the skill uses it for statuses, event payloads, and any API response with variants (source doc).

## Input/output separation

The source doc separates what the caller provides from what the system returns, with distinct types (source doc):

```typescript
// Input: what the caller provides
interface CreateTaskInput {
  title: string;
  description?: string;
}

// Output: what the system returns (includes server-generated fields)
interface Task {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

Three contrasts in those 2 types carry the teaching (all from the source doc):

1. The input has optional fields; the output has none. `description?: string` in, `description: string | null` out. The server normalizes optionality at the boundary, so consumers of the output never branch on undefined.
2. The output carries server-generated fields (`id`, `createdAt`, `updatedAt`, `createdBy`) that the input must not accept. A shared type would let a caller spoof them; separate types make that a compile error. This is also the type-level version of doc 04's boundary validation: the input type is what the boundary validates into, and the output type is what the system vouches for.
3. The names are paired (`CreateTaskInput` producing `Task`), which makes the contract diffable: doc 05's additive-evolution rules apply to each side independently.

## Branded types for IDs

The source doc brands identifier types so stringly-typed IDs cannot be swapped:

```typescript
type TaskId = string & { readonly __brand: 'TaskId' };
type UserId = string & { readonly __brand: 'UserId' };

// Prevents accidentally passing a UserId where a TaskId is expected
function getTask(id: TaskId): Promise<Task> { ... }
```

Branded types exist because TypeScript has no built-in nominal typing support; branding adds a unique marker to the base type via an intersection to create distinct types from the same underlying representation (https://www.learningtypescript.com/articles/branded-types, jev weight 0.19, weak; the branded-types documentation at https://effect.website/docs/v3/code-style/branded-types states the same mechanism with a symbolic identity tag, weight 0.81, high). The compile-time cost is zero and the caught bug class, passing a UserId where a TaskId is expected, is the classic structural-typing leak in services that mostly traffic in string IDs (source doc; mechanism support at https://effect.website/docs/v3/code-style/branded-types, 0.81, high; https://typescript.tv/hands-on/understanding-branded-types-in-typescript/ is a weaker secondary at 0.47).

## How the patterns compose

The three patterns are layers of the same contract (doc 02). The discriminated union models the output's variant states; the input/output split models the boundary; the branded types model identity flowing through both. Together they satisfy the checklist's first line: every endpoint has typed input and output schemas (source doc). And because they are types committed alongside the implementation, they are also the documentation (source doc, doc 02).

## Applying this doc

1. Any field with variants in a response becomes a discriminated union with a literal `type` tag, and consumers switch on the tag.
2. Every mutating endpoint gets its own `XInput` type; outputs get their own complete, non-optional types.
3. Every ID that crosses a module boundary is branded. Unbranded strings stay inside implementation details.
4. Exhaustiveness: prefer switch-with-never checks so adding a variant breaks compilation, not production.
