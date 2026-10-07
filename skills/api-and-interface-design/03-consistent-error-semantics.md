# 03 Consistent Error Semantics

Scope: the skill's second principle, one error strategy everywhere, the structured error shape it prescribes, the status code mapping it commits to, and why mixing patterns is the failure mode.

## One strategy, everywhere

The source doc's rule is short: pick one error strategy and use it everywhere (source doc). The rationale is predictability. If some endpoints throw, others return null, and others return `{ error }`, the consumer can't predict behavior (source doc). Under Hyrum's Law (doc 01), that unpredictability is worse than inconvenient: each pattern becomes an observable behavior somebody depends on, so the inconsistency fossilizes.

The prescribed shape for REST errors is a structured error body with a stable envelope:

```typescript
interface APIError {
  error: {
    code: string;        // Machine-readable: "VALIDATION_ERROR"
    message: string;     // Human-readable: "Email is required"
    details?: unknown;   // Additional context when helpful
  };
}
```

The 3 fields split the audience: `code` is machine-readable (a stable string like "VALIDATION_ERROR" that client code branches on), `message` is human-readable text for the user or the developer debugging, and `details` carries additional context when helpful (source doc). All from the source doc.

## The status code mapping

The source doc commits to a fixed mapping of semantics onto status codes (all from the source doc):

- 400: client sent invalid data
- 401: not authenticated
- 403: authenticated but not authorized
- 404: resource not found
- 409: conflict (duplicate, version mismatch)
- 422: validation failed (semantically invalid)
- 500: server error, never expose internal details

Two distinctions in that list are the ones teams most often blur. First, 401 versus 403: 401 answers "who are you", 403 answers "you are known but not allowed". Second, 400 versus 422: the source doc uses 400 for malformed requests and 422 for validation failures where the request is well-formed but semantically invalid, which is exactly the split used at the boundary-validation example in doc 04 (source doc).

This mapping is consonant with the HTTP standardization world: RFC 9457 defines a standard "problem detail" format to carry machine-readable details of errors in HTTP response content, precisely to avoid the need to define new error response formats for HTTP APIs (https://datatracker.ietf.org/doc/html/rfc9457, jev weight 0.95, high; RFC 9457 obsoletes RFC 7807, per the same source). The source doc's `APIError` shape is a specific implementation of the same idea: one error envelope, machine-readable fields, standardized across every endpoint. The IETF RFC process (https://www.ietf.org/process/rfcs/, weight 0.91, high) and the RFC Editor (https://www.rfc-editor.org/, weight 0.89, high) are the primary homes of these specifications, and MDN's HTTP reference (https://developer.mozilla.org/en-US/docs/Web/HTTP, weight 0.82, high) is the standard secondary reference for status code semantics.

Drift note: the standards world has converged on RFC 9457 problem details as the shared error envelope for HTTP APIs. Teams starting fresh may prefer a `problem+json` document over a bespoke `APIError` shape; either way the skill's rule holds: one envelope, one mapping, everywhere (dig source: https://datatracker.ietf.org/doc/html/rfc9457).

## What 500 must not do

The mapping's last line carries a security rule: 500 means server error and never exposes internal details (source doc). Error responses are attacker-readable. Stack traces, SQL fragments, and internal identifiers in a 500 body leak implementation details that both violate doc 01's "don't leak implementation details" rule and hand reconnaissance material to callers.

## The anti-patterns

The source doc's red flags include inconsistent error formats across endpoints (source doc). The verification checklist requires that error responses follow a single consistent format (source doc). Between those, the operational test is simple: pick any 2 endpoints in the system and check that a client could handle both failures with one code path. If a client needs per-endpoint error handling logic, the error strategy is not consistent yet.

The rationalization table adds the subtle one: "accepting the Idempotency-Key header is enough" is wrong because the header is the contract while storing the key against the result is the implementation (source doc). Error semantics apply to idempotency too: the in-flight duplicate strategies in doc 06 (409 Conflict, wait, 202 with a status URL) are themselves status-code commitments, and mixing them per endpoint would recreate the unpredictability this doc exists to prevent (source doc).

## Applying this doc

1. Define the error envelope once, as a type, in the contract (doc 02).
2. Fix the status code mapping as a table the whole team can cite.
3. Centralize error production in one helper so the envelope cannot drift per endpoint.
4. Review new endpoints against the checklist: single format, correct code from the mapping, no internal details in 500 bodies.
