# 02 Contract First

Scope: the skill's rule that the interface is defined before it is implemented, why the contract is the spec rather than a description of the spec, and what that means for module boundaries and team parallelism.

## The rule

The source doc states it in one line: define the interface before implementing it. The contract is the spec, and implementation follows (source doc). This is the first numbered principle of the skill, ahead of error semantics, validation, and evolution, because every later principle operates on the contract: consistent errors are consistent across a contract, validation happens at the contract's edge, and additive evolution edits the contract, not the implementation.

The idea has an academic lineage. Design by contract prescribes that software designers define formal, precise and verifiable interface specifications for software components, built on the notions of preconditions, postconditions and invariants (https://en.wikipedia.org/wiki/Design_by_contract, jev weight 0.41, weak). Treat that as weak backing for the lineage only; the skill's operational rule comes from the source doc.

## What contract-first looks like

The source doc's example defines a typed `TaskAPI` interface before any implementation exists:

```typescript
interface TaskAPI {
  createTask(input: CreateTaskInput): Promise<Task>;
  listTasks(params: ListTasksParams): Promise<PaginatedResult<Task>>;
  getTask(id: string): Promise<Task>;
  updateTask(id: string, input: UpdateTaskInput): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}
```

Three properties of this contract carry the skill's teaching (all from the source doc):

1. Each method's doc comment states the behavioral contract, not the mechanics: createTask "returns the created task with server-generated fields", getTask "returns a single task or throws NotFoundError", deleteTask is "idempotent delete, succeeds even if already deleted". The contract specifies semantics consumers can rely on, which is exactly what implementation-first specs tend to omit.
2. Input and output are named types (`CreateTaskInput`, `ListTasksParams`, `PaginatedResult<Task>`), which makes the contract reviewable and diffable. A change to the contract is a visible change to a named type, not an invisible change to a function body.
3. The contract commits to error behavior (NotFoundError) and to idempotency (deleteTask), so consumers can code against retry and failure without reading the implementation.

## Why the contract precedes implementation

The source doc's rationalization table names the failure mode directly: "We'll document the API later" is answered with "the types ARE the documentation. Define them first" (source doc). Implementation-first "documentation" is a post-hoc description of whatever got built, including whatever Hyrum's Law has already made load-bearing. Contract-first inverts that: the durable artifact is written when changing it is still cheap.

The API-first development literature makes the same argument at the process level: specifying the API before building services improves team communication and agility because consumers can start against the agreed spec (https://www.baeldung.com/spring-boot-openapi-api-first-development, jev weight 0.37, weak). Label as weak; the skill needs no external justification, but the pattern is widely practiced.

## Contracts enable parallel work

The source doc's rationalization table also closes the internal-API loophole: "Internal APIs don't need contracts" is answered with "internal consumers are still consumers. Contracts prevent coupling and enable parallel work" (source doc). This is the practical payoff of contract-first inside a codebase: once the interface type exists, the producer and consumers can be built, tested, and changed independently against it. Module boundaries become real because the boundary is a type, not a convention.

Contract testing tools operationalize the same idea across services: consumer-driven contract testing verifies that a provider satisfies the expectations its consumers have recorded (https://pactflow.io/what-is-consumer-driven-contract-testing, jev weight 0.42, weak; also https://pactflow.io/what-is-consumer-driven-contract-testing/ at 0.41, weak). The skill's typed-contract version is the compile-time analogue: shared interface types between modules are the cheap, always-checked form of the same discipline.

## Contract-first and boundaries

The skill applies contract-first to more than HTTP endpoints. Its description covers REST APIs, GraphQL schemas, module boundaries, component props, and any surface where one piece of code talks to another (source doc, Overview). The When to Use list includes defining module boundaries or contracts between teams, creating component prop interfaces, and establishing database schema that informs API shape (source doc). In each case the discipline is identical: write the type first, write the semantics in its comments, and treat the type as the thing that changes last.

## Practice notes

- Review contracts, not implementations. A code review that reads only the implementation cannot see the contract's semantics commitments.
- Keep contracts in source control next to the code (the verification checklist requires API documentation or types committed alongside the implementation; source doc).
- When a contract must change, prefer additive evolution (doc 05); when it must break, that is deprecation-and-migration territory, planned at design time per doc 01.
