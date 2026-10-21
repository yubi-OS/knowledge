# 05. MVP Scope (one atomic loop)

**Scope:** MVP Scope (one atomic loop): detailed analysis grounded in yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md.

> Internal-record subtopic grounded in yubi-OS/yubiOS refs/hierarchy-router-solo-2026-10-06.md, no external web dig

## The MVP is one loop, four deliverables

The source titles this section "MVP Scope (one atomic loop)" and lists 4 numbered items. The generation log explains the choice: the "One atomic routed loop (MVP of the regime)" variation, from the Simplification lens, scored the top total of 17 (P 4, S 5, D 3, T 5).

### Deliverable 1: the route endpoint

`POST /api/jev/route {artifact}` executes, in order:

1. **measure**: edge-standard for images; the scorer for text docs;
2. **band lookup** from policy;
3. **propose** a routing action;
4. **gate**;
5. **on allow**: dispatch to the target lane, verify, write run rows.

Each arrow is an existing capability except the endpoint itself. The MVP intake is images: the Open Questions section resolves that the detector's claim set "is freshest there," while the scorer path is noted as also proven but deferred.

### Deliverable 2: the policy addition

A policy v7 addition named `routing.bands`, declared through the audited promote flow. Two properties matter:

- **Location.** Bands live in policy, not code. Changing a band is a policy promotion with its own audit trail.
- **Pinning.** The Not Doing list rules out adaptive adjustment; bands change only by promote.

The Open Questions add a design decision: route targets need their own capability declarations in policy v7, mirroring the `resend.send` pattern. A route target therefore becomes a policy tool, and the gate can reason about it with the same machinery it uses for any external action.

### Deliverable 3: the falsification gate for the bands

Before live routing, the bands must pass:

- a **synthetic gold corpus**: the falsification generators ARE the gold corpus;
- a **21-point calibration sweep**;
- a **jitter test**;
- a **record in refs/**.

The source compresses the whole idea into one parenthetical: the generators are the gold corpus. No new labelled dataset is needed, because the artifacts' classes are known by construction.

### Deliverable 4: the router card

A router card in the /jev/ console, placed in the Corpus tab family. This makes route decisions visible next to corpus and taste runs.

## Why "atomic"

An atomic loop has one entry and one exit and either completes or fails as a unit with a record. Here: one artifact in, one gated decision out, one run row set written. There is no batching, no multi-hop routing, and no fan-out in the MVP. That keeps the end-to-end test simple: push a synthetic gasket render and a synthetic non-hierarchical render through, and confirm they produce different band lookups, both pass through the gate, and both leave complete run rows.

## Acceptance criteria implied by the source

- The endpoint accepts an image artifact and returns a gate verdict (allowed, needs_approval, or blocked), never a bare dispatch.
- The band used is read from policy v7 `routing.bands`, and the run row records which policy version supplied it.
- The run row records the full measurement vector, not just the primary feature (from the stress-test answer).
- Calibration evidence (pre-registered edges, jitter, 21-point sweep) exists in refs/ before the first live route.
- The router card renders recent route decisions in the console.

## What the MVP deliberately does not prove

It does not prove that text routing works (deferred), that measurement predicates belong in the gate (deferred behind the MVP), or that bands should learn (ruled out). It proves only that measurement-gated routing can run one artifact class end-to-end without bypassing the gate. That is enough to decide whether the regime generalizes.
