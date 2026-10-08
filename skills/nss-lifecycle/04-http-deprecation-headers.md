# 04 - RFC 8594 Sunset versus RFC 9745 Deprecation on HTTP APIs

Scope: the two HTTP headers that carry deprecation state, what each one actually asserts, the deprecation link relation, the ordering rule, and notice periods as policy choices rather than RFC mandates.

Grounding spine: the source doc `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standard 4.

## The distinction the source doc insists on

For HTTP endpoints the source doc states: RFC 8594 defines `Sunset`, not the `Deprecation` header. `Sunset` indicates that a URI is likely to become unresponsive at a future point and is only a hint; it does not itself mean "no longer recommended." RFC 9745 defines the `Deprecation` response header and the `deprecation` link relation, and distinguishes "deprecated but still operational" from "expected to become unavailable." When both are present, Sunset must not precede the deprecation date (source doc).

The RFC texts retrieved in the digs back this up:

- The Deprecation HTTP response header field is used to signal to consumers of a resource (identified by a URI) that the resource will be or has been deprecated; additionally, the deprecation link relation can be used to link to a resource that provides further information about planned or existing deprecation and may also provide ways to find alternatives (https://www.rfc-editor.org/rfc/rfc9745.html, jev 0.81).
- The registered field is `Deprecation`, status permanent, with the deprecation link relation type registered as well (https://datatracker.ietf.org/doc/rfc9745/, jev 0.81).
- The Sunset HTTP response header field indicates that a URI is likely to become unresponsive at a specified point in the future (https://datatracker.ietf.org/doc/rfc8594/, jev 0.52). Note the weak weight on the RFC 8594 digs: the semantic claims about Sunset above are primarily source-doc claims, with the datatracker result as corroboration at weight 0.52.

## The canonical response shape

The source doc's correct API response pattern:

```http
Deprecation: @<effective-unix-timestamp>
Sunset: <HTTP-date>
Link: <https://example.com/migrations/old-api>; rel="deprecation"
```

(source doc). The headers are signals, not a substitute for an API specification, changelog, migration guide, customer communication, usage telemetry, or owner approval; all of those belong in the file's lifecycle block (source doc).

## Sunset is not Deprecation (the anti-pattern)

The source doc lists "Sunset as a Deprecation substitute" as a named anti-pattern: RFC 8594 Sunset is a hint, not the operational signal; RFC 9745 Deprecation is (source doc). The red-flags table adds the ordering violation: Sunset appearing before the Deprecation date violates the RFC 8594 versus RFC 9745 ordering (source doc).

## Notice periods are policy, not protocol

A 6-month (180-day) graceful deprecation period is a reasonable default for many stable APIs, but it is a policy choice, not a universal RFC requirement (source doc). The source doc anchors the practice points: Google recommends 180 days for beta API functionality, and Square commonly gives at least 12 months before retirement and describes a maintenance period of at least 6 months after a replacement reaches GA (source doc). In the yubiOS stage-semantics table, the deprecated stage carries a default notice_period of 180 days and removal becomes eligible only after the notice has elapsed and the replacement has reached stable (source doc).

A complete deprecation record in the Lifecycle block therefore carries: deprecated_since, reason, replacement, removal_in_version, sunset_at (the RFC 8594 term), and notice_period (source doc).

## Sources

- Source doc: `yubi-OS/yubiOS skills/nss-lifecycle/SKILL.md`, standard 4, "State machine" stage table, Anti-patterns, Red flags.
- https://www.rfc-editor.org/rfc/rfc9745.html (jev 0.81)
- https://datatracker.ietf.org/doc/rfc9745/ (jev 0.81)
- https://datatracker.ietf.org/doc/rfc8594/ (jev 0.52, weak)
