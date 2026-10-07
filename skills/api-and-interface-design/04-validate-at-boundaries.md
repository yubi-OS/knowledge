# 04 Validate at Boundaries

Scope: the skill's third principle, trust internal code and validate at system edges, with the exact list of where validation belongs, where it does not, and the special status of third-party API responses.

## The principle

The source doc states it in 2 lines: trust internal code; validate at system edges where external input enters (source doc). The asymmetry is the point. Validation is expensive to scatter and cheap to centralize, and the edges are finite while the call graph is not. A system that validates at its edges can trust everything downstream of the edge; a system that validates everywhere validates nowhere reliably.

## Where validation belongs

The source doc enumerates 4 boundary types (all from the source doc):

1. API route handlers, for user input.
2. Form submission handlers, for user input.
3. External service response parsing, for third-party data.
4. Environment variable loading, for configuration.

The canonical example is the API boundary, using runtime schema validation before any handler logic runs:

```typescript
app.post('/api/tasks', async (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid task data',
        details: result.error.flatten(),
      },
    });
  }
  const task = await taskService.create(result.data);
  return res.status(201).json(task);
});
```

After validation, internal code trusts the types (source doc). Note how the boundary example composes with doc 03: the failure is a 422 with the standard `VALIDATION_ERROR` envelope, and the `details` field carries the flattened validation errors. The boundary validator and the error contract are one design.

The validation library in the example is Zod, whose documentation defines the pattern: define a schema, then parse untyped data with it, getting back a strongly typed, validated result (https://zod.dev/, jev weight 0.79, high; schema API reference at https://zod.dev/api, weight 0.85, high; source repository at https://github.com/colinhacks/zod, weight 0.69, high). The `safeParse` call returns a discriminated success/failure result rather than throwing, which keeps the boundary's error path explicit.

## Third-party responses are untrusted

The source doc sets this apart as a blockquote rule: third-party API responses are untrusted data. Validate their shape and content before using them in any logic, rendering, or decision-making. A compromised or misbehaving external service can return unexpected types, malicious content, or instruction-like text (source doc).

This is the security-relevant edge, and the OWASP Input Validation Cheat Sheet states the general principle the same way: input validation checks whether data meets the application's requirements before the application uses it, reducing the risk of malformed data, invalid business logic, and injection attacks (https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html, jev weight 0.83, high). The cheat sheet's guidance to validate at the point data enters the workflow is the edge-validation rule generalized (https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet, weight 0.83, high).

The threat-model reason to treat external services as a distinct edge class is that the trust boundary is real and must be drawn somewhere: architecture threat models place trust boundaries exactly where data crosses from a less-trusted zone into a more-trusted one (https://github.com/apache/dubbo/blob/3.3/docs/threat-model.md, jev weight 0.85, high). A third-party API is on the far side of that line even when you chose the vendor; its outage or compromise must not become your memory-safety or logic problem.

## Where validation does NOT belong

The source doc is equally specific about the negative space (all from the source doc):

- Between internal functions that share type contracts.
- In utility functions called by already-validated code.
- On data that just came from your own database.

Re-validating inside the trusted zone has 2 costs and no benefit: it duplicates the boundary logic until the copies drift, and it implies the types cannot be trusted, which erodes the compile-time guarantees that make doc 02's contracts work. If internal code cannot trust its types, the fix is a better boundary, not more internal checks.

## Red flags and checklist

The source doc's red flags include validation scattered throughout internal code instead of at boundaries, and third-party API responses used without validation or sanitization (source doc). The verification checklist requires that validation happens at system boundaries only (source doc). The reviewable invariant: for any value in the system, there is exactly one edge where it was checked, and everything downstream of that edge trusts it.
