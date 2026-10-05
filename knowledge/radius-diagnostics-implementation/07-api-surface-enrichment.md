# 07: API surface: additive radius fields and read-time enrichment

Scope: how a diagnostic layer reaches the API surface without breaking existing consumers: additive response fields, radius comparison inside existing endpoints, read-time enrichment of legacy records, explicit unavailable states, and storage that preserves old frames.

## Additive fields as the compatibility strategy

The radius diagnostic surfaces as new optional response fields: map.radius_profile on new maps and previews, and radius_comparison in baseline and candidate-preview results. Nothing existing is removed or re-typed. This is the additive-change strategy for API evolution: new optional fields appear, existing fields stay stable, and consumers that never heard of the new fields keep working (source: https://openrouter.ai/docs/guides/features/router-metadata , jev weight 0.77, which states its response shape is additive and should be decoded permissively). The tolerant-reader pattern gives the consumer-side complement: a consumer that ignores unrecognized fields makes every additive change by the provider non-breaking, while a strictly deserializing consumer turns each new field into a breakage (source: https://java-design-patterns.com/patterns/tolerant-reader/ , jev weight 0.75; the original formulation of the pattern is at https://martinfowler.com/bliki/TolerantReader.html , jev weight 0.07, weak backing). API-contract guidance summarizes the discipline: backward compatibility is preserved by observable behavior, not merely by endpoint paths (source: https://archman.dev/docs/quality-attributes/maintainability-and-modifiability/contracts-and-compatibility , jev weight 0.64).

The radius fields follow this shape deliberately. The existing compatible-name compare endpoint gains radius comparison inside its response, rather than gaining a new endpoint; the response grows, the contract does not break.

## Read-time enrichment of legacy records

Old saved maps predate the radius fields. Two enrichment strategies exist:

1. Write-time backfill: a migration computes and stores radius profiles for every legacy record. This rewrites historical rows.
2. Read-time enrichment: the API computes the profile when a legacy record is read and attaches it to the response, without writing anything.

The motivating implementation chooses read-time enrichment: saved-map GETs can enrich old v0.2 records without embedding or writing a row. If enrichment fails, the original record remains readable with an explicit radius_profile_unavailable reason (project record: https://github.com/yubi-OS/yubiOS/pull/233 ).

This mirrors how enrichment connectors are structured elsewhere: an enrichment step pulls external context and attaches it to an existing payload at a defined point in the flow, with the base payload remaining intact (source: https://learn.microsoft.com/en-us/azure/active-directory-b2c/add-api-connector-token-enrichment , jev weight 0.93). The key property is separation: the enrichment layer can fail without destroying the base record. An explicit unavailable reason converts a silent gap into a stated one, which is the same honesty rule the diagnostic applies to missing bounds (doc 05).

## Immutable history and unchanged frames

Legacy saved maps are historical artifacts; the diagnostic must not rewrite them. This is the write-once discipline of immutable storage: data is written once and read many times, and the immutability is what makes later verification trustworthy (source: https://docs.aws.amazon.com/prescriptive-guidance/latest/security-best-practices/safeguard.html , jev weight 0.92). The radius diagnostic respects this at two levels:

1. Read-time enrichment never persists a row. The motivating implementation verifies this at the system level: saved-map count stayed 76 before and after live previews, zero new rows (project record: https://github.com/yubi-OS/yubiOS/pull/233 ).
2. Existing storage packing preserves the radius fields without changing old frame IDs, so already-stored records keep their identifiers and their bit-for-bit frames (project record: https://github.com/yubi-OS/yubiOS/pull/233 ).

## Preview discipline

Candidate previews carry the strongest constraints because they are the paths most likely to have side effects. The motivating implementation's preview path:

1. Retains source SHA256 and unchanged-anchor checks, so a preview states exactly what it changed relative to its source.
2. Creates no repository, saved-map, or Vectorize record; the only mutable state is the disclosed embedding cache.
3. Rejects inconsistent geometry, as mutation and preview paths always have.
4. Rejects radius overrides and invalid bounds with 422 before any model work (docs 04 and 05).

Live verification receipts show the shape of a passing preview: HTTP 200, canonical delta stated explicitly (0, 1, or 2 items), unchanged-anchor counts reported, correctly bracketed same-sign interval, persisted=false (project record: https://github.com/yubi-OS/yubiOS/pull/233 ).

## Why enrich at read time at all

A skeptic can ask: if enrichment is never persisted, why attach profiles to legacy records at all? The answer is diagnostic continuity. A profile attached to a historical map lets a reader compare past and present on the same instrument. Without it, the diagnostic would be blind to history, and history is where drift shows. The cost is bounded by the enrichment's read-time nature: no storage grows, and a failed enrichment degrades to an explicit reason rather than a broken record.

The trade-off is honest and documented: read-time enrichment costs recomputation on each read and adds a failure mode, in exchange for zero writes to immutable history and zero migration risk. For a diagnostic layer, that trade favors the read path.

## Summary

1. The radius surface is additive: new optional fields on new maps and previews, and radius comparison inside the existing compare endpoint, with tolerant-reader semantics for old clients.
2. Legacy v0.2 records are enriched at read time, never persisted; failure yields an explicit radius_profile_unavailable reason while the original record stays readable.
3. Immutable-history discipline holds: no new rows from previews, unchanged frame IDs, preserved storage packing.
4. Previews stay side-effect-free except for the disclosed embedding cache, with SHA256, unchanged anchors, and explicit persistence=false receipts.

Project record: the motivating implementation's API surface, enrichment semantics and live receipts are recorded at https://github.com/yubi-OS/yubiOS/pull/233 .
