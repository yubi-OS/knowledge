# TLA+ Formal Specification, Model Checking & Trace-Driven Testing Corpus (`skills/tlaplus/`)

- **Ref**: `tlaplus`
- **Minted**: `2026-11-19`
- **Decision Model**: `@cf/cloudflare/clef` via `https://steady-orbit.systems-a.workers.dev/api/decide`
- **Discovery Engine**: Self-hosted searXNG via `https://p01--n8n-service--mcx7zcrbvdyt.code.run/webhook/searxng`
- **Total Weighted Sources**: `87` unique results across `23` Clef decide calls (`71/87` high-weight `>= 0.50`)

## Why This Corpus Exists

Ad-hoc, linear UI/API test scripts check a handful of predetermined happy-path trajectories and repeatedly miss state-space interleaving bugs (concurrent `postMessage` frames arriving before WASM ready, follow-up prompts mutating file language or overwriting existing files instead of adding a second file, mid-step pause/resume races, or unverified boot/enrollment transitions). This corpus establishes a **3-stage TLA+ verification and testing cycle** across the Steady Orbit `/jev/` workbenches and `yubiOS` security pipelines:

1. **Stage 1 -- Formal State Machine Specification & Exhaustive Model Checking**: Specify state variables, atomic actions (`Next`), safety invariants (`TypeOK`, domain invariants), and liveness properties (`WF_vars`, `SF_vars`, `~>`) in TLA+ or PlusCal, and exhaustively verify finite state spaces with **TLC** (`tlc2.TLC`) and symbolic/inductive bounds with **Apalache** (Z3 SMT + Snowcat typechecker).
2. **Stage 2 -- Model-Based Testing (MBT) via Negated-Goal Counterexample Traces**: Automatically synthesize high-coverage multi-step test trajectories by checking negated reachability invariants (`INVARIANT NotGoal`) and compiling the emitted JSON witness traces (`-dumpTrace json`) directly into executable CDP/Playwright/API test runners.
3. **Stage 3 -- Post-Run Implementation Trace Validation (`TraceSpec.tla`)**: Ingest real runtime NDJSON logs (`jev_chat_logs`, Universal Bridge `postMessage` transcripts, or `yubiOS` enrollment logs) into a TLA+ trace specification to prove that every observed state transition in production or CI is a valid behavior of the formal specification.

## Corpus Index

| # | Document | Clef Score | Weighted Sources (`>=0.5` / Total) | Scope |
|---|---|---|---|---|
| `01` | [01-tlaplus-temporal-logic-and-spec-structure.md](./01-tlaplus-temporal-logic-and-spec-structure.md) | `1.9482/2` | `8/12` | Core TLA+ mathematical foundations: state predicates, action formulas (primed variables x', UNCHANGED), box/diamond temporal operators, fairness (WF_vars, SF_vars), Spec = Init /\ [][Next]_vars /\ Liveness, and module/EXTENDS/INSTANCE composition. |
| `02` | [02-pluscal-algorithm-language-and-translation.md](./02-pluscal-algorithm-language-and-translation.md) | `1.85/2` | `7/9` | Writing concurrent and sequential state machines in PlusCal (--algorithm / --fair algorithm), atomic grain via labels, await/when guards, process sets, procedures, macros, and automatic translation to TLA+ pc/stack state machines. |
| `03` | [03-tlc-explicit-state-model-checker-and-cfg.md](./03-tlc-explicit-state-model-checker-and-cfg.md) | `1.951/2` | `9/12` | Running the TLC explicit-state model checker via CLI (tlc2.TLC), authoring .cfg files (SPECIFICATION, INVARIANT, PROPERTY, CONSTANTS, SYMMETRY, CONSTRAINT, VIEW, ALIAS), deadlock detection, simulation mode, and taming state-space explosion. |
| `04` | [04-apalache-symbolic-model-checking-and-snowcat.md](./04-apalache-symbolic-model-checking-and-snowcat.md) | `1.5643/2` | `8/9` | Bounded symbolic model checking of TLA+ with Apalache and Z3 SMT constraints, Snowcat @type annotations, checking inductive invariants (IndInv /\ Next => IndInv'), and comparing explicit-state TLC vs symbolic Apalache. |
| `05` | [05-safety-invariants-liveness-and-refinement-mappings.md](./05-safety-invariants-liveness-and-refinement-mappings.md) | `1.8184/2` | `10/11` | Designing TypeOK and domain safety invariants, action properties [][A]_v, liveness properties with leads-to (P ~> Q) and weak/strong fairness, stuttering-insensitive refinement mappings (INSTANCE ... WITH), and auxiliary history/prophecy variables. |
| `06` | [06-model-based-testing-and-counterexample-trace-generation.md](./06-model-based-testing-and-counterexample-trace-generation.md) | `1.7768/2` | `10/12` | Generating high-coverage test suites and multi-step interaction sequences from TLA+/PlusCal specifications by negating target reachability predicates (~CanCompleteTask) in TLC/Apalache and driving automated test harnesses from counterexample traces. |
| `07` | [07-implementation-trace-validation-and-conformance.md](./07-implementation-trace-validation-and-conformance.md) | `1.78/2` | `9/10` | Validating real runtime execution logs (NDJSON/JSON event traces, D1 jev_chat_logs, postMessage bridge transcripts) against a TLA+ specification using trace specs (Trace.tla), TLC -Continue/-dumpTrace, and deterministic state-transition conformance. |
| `08` | [08-agentic-workbench-and-yubios-ci-tla-workflows.md](./08-agentic-workbench-and-yubios-ci-tla-workflows.md) | `1.2375/2` | `10/12` | Applying TLA+ to replace ad-hoc UI/API testing cycles: formalizing the /jev/ Coding & Design Workbench state machines (in-place file rewrite vs new-file creation, Universal Bridge load-hold queue & revision-acked save gate, mode/close resets) and yubiOS enrollment/boot gates in CI. |

## Typed Research DB (`research-db/`)

- [`research-db/preflight.json`](./research-db/preflight.json) -- Phase 0 endpoint verification (`searxng-proxy` + `steady-orbit` `/api/decide`).
- [`research-db/outline.json`](./research-db/outline.json) -- Phase 1 8-doc subtopic decomposition and Clef `score` decisions.
- [`research-db/archive.json`](./research-db/archive.json) -- Phase 2 complete archive of `87` searXNG results weighted with Clef `noul` probabilities.
- [`research-db/digs/`](./research-db/digs/) -- Per-document dig records (`01-*.json` through `08-*.json`).
- [`research-db/jev-log.json`](./research-db/jev-log.json) -- Append-only audit log of all `23` Clef `/api/decide` calls.
- [`research-db/db.ts`](./research-db/db.ts) -- TypeScript schema definitions for the v2 research DB.
