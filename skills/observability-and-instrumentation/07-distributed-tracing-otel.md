# 07 Distributed Tracing with OpenTelemetry

Scope: OpenTelemetry as the vendor-neutral tracing standard, auto-instrumentation for near-zero-cost coverage, manual spans only around meaningful units of work, context propagation across every async boundary, and head-versus-tail sampling.

## Why OpenTelemetry

The ground source (yubi-OS/yubiOS skills/observability-and-instrumentation/SKILL.md): "Use OpenTelemetry - it's the vendor-neutral standard, and auto-instrumentation covers HTTP, gRPC, and common DB clients with near-zero code" (source doc). The dig strongly corroborates the choice: opentelemetry.io's documentation site (https://opentelemetry.io/docs/, weight 0.97), the Node.js getting-started guide (https://opentelemetry.io/docs/languages/js/getting-started/nodejs/, weight 0.96), the JavaScript instrumentation guide (https://opentelemetry.io/docs/languages/js/instrumentation/, weight 0.95), and the project's GitHub organization (https://github.com/open-telemetry, weight 0.94) all carry near-maximal weights, and the npm package for auto-instrumentations is first-party (https://www.npmjs.com/package/@opentelemetry/auto-instrumentations-node, weight 0.72).

The bootstrap pattern from the source doc (source doc):

```typescript
// tracing.ts - must be imported before anything else
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  serviceName: 'checkout-service',
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();
```

The import-order note matters: the SDK must start before the modules it patches are loaded.

## Manual spans and attributes

Auto-instrumentation covers the boundaries; manual spans cover the internals. "Add manual spans only around meaningful internal units of work (e.g., applyDiscounts, chargeProvider) and attach the attributes on-call will filter by" (source doc). Two anti-patterns are implied: span-per-function noise, and spans without the attributes an on-call engineer would filter on. The attributes rule connects to doc 01: an attribute earns its place by answering one of the written on-call questions.

The rationalizations table has the entry for small systems: "Tracing is overkill for our two services - two services already means cross-service latency questions logs can't answer. Auto-instrumentation makes the cost trivial" (source doc). That is the same selection logic as doc 02: the trace is the only signal that answers "where did time go across services".

## Propagation and sampling

"Propagate context across every async boundary - HTTP headers, queue message metadata - or the trace dies at the gap" (source doc). This is the trace-side twin of doc 04's correlation-ID propagation; the wire format is W3C Trace Context (doc 04, weak-backed sources). "Sample head-based at a low rate by default; keep 100% of errors if your backend supports tail sampling" (source doc). A practitioner guide on sampling strategies describes the same split: head-based sampling decides at the root span with low cost but no foresight, tail-based sampling decides after the trace completes so error and latency policies can keep 100% of failures (https://codelit.io/blog/distributed-tracing-sampling, weight 0.24, weak). The source doc's default is the operationally safe one: cheap head sampling for volume, with tail sampling reserved for error retention where the backend supports it.

## Verification tie-in

The checklist requires "A single request can be followed end-to-end in the tracing UI without broken spans" (source doc). Broken spans are the specific failure of missed propagation, which is why doc 09's verification step tests the trace by following one real request rather than by reading configuration.

## Practical summary

Install OpenTelemetry once, import the SDK first, let auto-instrumentation cover HTTP, gRPC, and DB clients. Add manual spans around named units of work with filterable attributes. Propagate context across every boundary. Sample head-based low, keep errors via tail sampling when available. Two services is already enough to need this.

## What the trace is for at incident time

The trace earns its per-request cost by answering the one question neither logs nor metrics can: where did the time actually go in this specific slow or failed request (source doc, signal table). A p99 metric says checkout is slow; a trace says 3.8 of the 4.1 seconds were in the provider call, 0.2 in discounts, 0.1 in the queue. That decomposition is what makes the trace the "where" in the skill's rule of thumb, and it only works when spans cover the full path, which is why the auto-instrumentation boundary coverage plus manual spans on named units is the shape the source doc prescribes rather than either extreme alone (source doc). At review time the tracing red flag to look for is the missing middle: boundary spans from auto-instrumentation with no internal spans, so a slow request shows one opaque block.
