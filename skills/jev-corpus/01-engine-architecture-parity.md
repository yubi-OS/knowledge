# 01 - Engine architecture and fixture parity

Scope: how the corpus-math engine is deployed as deterministic JavaScript on the steady-orbit worker, why every port is fixture-parity-tested against its Python source of record, and what the selftest gate guarantees before any result is trusted.

## The deployment shape

Source doc: the yubiOS corpus math (V2/curveball null, spherical-harmonic fit, dBc, RSI-descent atom, lens candidates, tautology discernment, drift) runs as deterministic JavaScript on the `steady-orbit` worker, exposed under `/api/jev/corpus/*`. The same worker also hosts the jev orchestrator, automations, and evolution loop, so corpus measurement is one module among several on one deployment rather than a separate service.

The input contract is deliberately small: a JSON matrix, either `[[0,1,...],...]` or `{rows, cols, data}`. Binary 0/1 values are required for atom and lens calls; real values are allowed for audit calls. That means every measurement the engine makes reduces a corpus to a coverage matrix first, and the matrix is the only thing the math ever sees.

## Sources of record and the parity rule

Source doc: the math's system of record is `yubi-OS/yubiOS/papers/data/lean/verify_claims.py` (v2_corr, curveball) plus `tools/rsi-descent`, `tools/spectral-decomposer`, `tools/spectral-defocus`, `tools/boltzmann-collapse`, and `tools/tautology-discerner`. The worker's JavaScript ports are "fixture-parity-tested, never re-derived". The viscoelastic instruments follow the same discipline: the Python source of record is `tools/visco-instruments/` (verify_visco.py + fixtures), and the JS port (`jev-visco-math.js`) is fixture-parity-tested. The taste extractor's source of record (`session/taste/lane-b/extractor.py`) was validated at 12/12 with a JS/Python maximum deviation of 3.1e-15 (source doc).

This is an instance of a widely used engineering pattern. Snapshot testing captures a program's output and compares it against a stored reference on every run, letting the test runner record the full serialized output once instead of hand-writing per-property assertions (Vitest guide, https://vitest.dev/guide/learn/snapshots, jev weight 0.90; Deno docs, https://docs.deno.com/runtime/test/snapshots/, jev weight 0.89; Jest snapshot testing, https://archive.jestjs.io/docs/ja/snapshot-testing, jev weight 0.78). The Verify tool generalizes the same idea to complex data models and documents (https://github.com/VerifyTests/Verify, jev weight 0.68).

The parity rule here is closer to golden-master testing than to plain snapshots. Characterization testing (also called golden master testing) captures the actual current behavior of existing software and protects that behavior against unintended change; the captured baseline is produced by running the system on known inputs and saving the result (Wikipedia, https://en.wikipedia.org/wiki/Characterization_test, jev weight 0.44; SitePoint, https://www.sitepoint.com/golden-master-testing-refactor-complicated-views/, jev weight 0.38 - weak backing, label it as such). In the engine's case the "legacy behavior" being protected is the Python reference implementation's numeric output, and the fixtures are generated from it.

Porting a live implementation to another language has a known shape: pick one implementation as the reference, generate the expectations from it, and make the port prove byte-for-byte agreement in CI (wire-parity, https://github.com/tanzilgr2288/wire-parity, jev weight 0.15 - weak backing). The engine applies exactly that shape, with the refinement that the parity fixtures live in a build bundle and the worker verifies itself against them on demand.

## Why determinism is the load-bearing property

Snapshot tests assume the same input plus the same code equals the same output; once a stochastic model call is inside the loop, that contract breaks and the suite quietly degrades (tianpan.co, https://tianpan.co/blog/2026/05/02/snapshot-tests-lie-when-model-stochastic, jev weight 0.19 - weak backing). The engine's answer to this is architectural: the corpus routes run deterministic JavaScript only, and anything non-deterministic lives outside them. The structured-evidence scorer is the borderline case, and the source doc is explicit about it: stage 1 is deterministic regex extraction, stage 2 is one batched decision-model request, and the residual decision-model jitter is bounded and then handled by hysteresis (source doc, doc 06).

Determinism is also what makes the audit idempotent. The audit computes the input's sha256 and returns the same `run_id` with `cached: true` on a repeat call (source doc). That property only holds because the compute path has no hidden state.

## The selftest gate

Source doc: `/api/jev/corpus/selftest` (GET) runs all three module selftests as fixture parity checks against the Python sources, returns 200 when all pass, and 500 with the failing checks otherwise. After the scorer v2 addition the selftest covers 92 checks including the scorer's extraction checks. The taste selftest carries 6-fixture parity against the Python extractor.

Source doc: "Fixtures are the truth: on any mismatch, the JS is wrong until proven otherwise." And on selftest failure the instruction is to stop and not trust results, then re-run the fixture generator (`fixtures/generate_fixtures.py` in the build bundle) against the current `papers/data/lean` sources. This is a strong failure posture: a failing selftest invalidates every downstream number until the fixture mismatch is resolved, rather than allowing per-endpoint spot checks.

The practical reading for a caller: after any engine-touching deploy, run `/selftest` before trusting any result (source doc guideline 3). A green selftest is the cheap certificate that the deployed port still agrees with the Python math on every fixture.

## What this buys

The combination of (1) a small deterministic input contract, (2) fixture parity against named Python sources, (3) an on-demand selftest, and (4) idempotent runs means a caller can treat the engine as a measurement instrument rather than a service with moods. Results from two different days are comparable because the code path and the fixtures pin the semantics. That is the foundation every other doc in this corpus stands on.
