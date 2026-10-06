# Lane Assembly Methodology

Scope: how the five parallel lanes (A through E) and the R1/R2/R3 resolution refresh assembled the yubiOS endpoint reference, and the reconciliation arithmetic that turned 121 route rows into one documented surface.

Source of record: yubi-OS/yubiOS docs/ENDPOINTS.md (source doc, weight 0.62). All lane numbers below come from that document unless a dig source is named.

## The five lanes

The endpoint reference was assembled from five parallel lanes, each with a deliverable and headline numbers (source doc, weight 0.62):

- Lane A: endpoint inventory from worker code. 121 route rows across 7 module parts.
- Lane B: AGENT.md cross-reference. 85 documented, 14 code-only, 0 doc-only, 12 discrepancies.
- Lane C: capability map. 13 domains, 97 endpoint assignments, 16 cross-domain flows, 7 resources.
- Lane D: lean verification map. 12 Lean files, 15 endpoint-to-Lean mappings, 5 CI jobs.
- Lane E: API flow diagram. A 78-line mermaid graph.

Lane A reads the worker bundle and records every dispatch comparison as a route row. Lane B parses the AGENT.md instrument contract (72997 bytes JSON-quoted, decoded to 71810 chars of markdown) and cross-references every documented row against the actual dispatch comparisons in the 42 module parts under parts/ (source doc, weight 0.62). Lane C groups the routes into capability domains and flows. Lane D ties the math-bearing endpoints to their Lean and Python verification sources. Lane E renders the whole surface as one mermaid diagram.

## The resolution refresh

A 2026-10-05 refresh with lanes R1, R2 and R3 resolved what Lane B found (source doc, weight 0.62):

- Lane R1: AGENT.md doc additions written to KV. 15 new rows: public relays, site surfaces, CORS preflights, map/app.js, audio replies, jev pause GET, approvals guide POST, fits CRUD.
- Lane R2: code patches in index.js, exactly 4 hunks: a requireOperatorAuth/timingSafeEqual helper, the n_controls usage-block comment changed from 2..12 to 2..6, and one auth guard before each of the two destructive DELETE handlers. No route was added or removed.
- Lane R3: a fresh cross-reference of the updated KV AGENT.md (76399 bytes, byte-identical to the resolved doc R1 deployed) against the patched bundle: 110 documented, 0 code-only, 0 doc-only, 0 actionable discrepancies.

## The reconciliation arithmetic

Lane A has 121 route rows over 109 unique paths. Lane C assigns 85 unique paths to capability domains. The doc decomposes the 121 versus 97 gap (97 assignments over 85 paths) into three parts (source doc, weight 0.62):

1. 6 CORS preflight rows (OPTIONS).
2. 10 method variants collapsing onto shared paths: GET|POST pairs, the DELETE 405 guard, and the query-variant forms of GET /api/outcomes.
3. 24 paths Lane C did not assign at assembly time.

The 24 unassigned paths were placed into domains and marked with a dagger: 17 solar-rbs-entry site routes into Platform Surface and Ops Console, 2 chat assistants (/api/site-assistant, /api/brain/preview) into Public Relays, 2 FIT detail routes into Repo Assessment, POST /api/jev/approvals/:id/guide into Jev Orchestrator, and the DELETE /api/outcomes/* guard into Outcome Ledger. The catch-all OPTIONS /api/jev/* stays in the inventory only (source doc, weight 0.62).

Every endpoint from Lane A appears in the document at least once. After the resolution refresh every endpoint AGENT.md documents resolves to a served route and every served route is documented (source doc, weight 0.62).

## Reconciliation decisions

The doc records the assembly decisions explicitly (source doc, weight 0.62):

- Zero contradictions between lanes: every Lane C endpoint exists in Lane A, and no doc-only endpoints exist in Lane B. Numeric contracts (K 2..40 for /api/map, K 2..400 for azimuth, n_controls 2..6) were verified in agreement by Lane B.
- The mermaid diagram from Lane E is raw text fenced as mermaid.
- POST /api/jev/corpus/audit carries both single-pass and Decision-B multipass modes on one route; it is one endpoint, not two.
- POST /audit in the RSI-chain runbook is shorthand for POST /api/jev/corpus/audit, not a separate route. The builtins visco_hysteresis and visco_snapback row describes automation builtins, not HTTP endpoints.
- The daggers in the capability map are reconciliation history, not open gaps: every dagged endpoint is in AGENT.md after the refresh.

Method note (weak backing, weight 0.29): the action-bound fail-closed approval protocol pattern Lane B cross-references has a published analogue in agent-governance literature (https://microsoft.github.io/agent-governance-toolkit/adr/0030-action-bound-appro). This is context only; the numbers above are all from the source doc.
