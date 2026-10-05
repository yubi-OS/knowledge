# 06 Parallel build lanes

Scope: the full-stack build: Lane A (Python source of record, 15/15 selftest, 102.86 hysteresis anchor), Lane B (JS port, 9/9 parity first run), Lane C (routes, builtins, ledger schema discovery), and the advisor lane reconciling 5 contract ambiguities including two runtime-crashing bugs.

## The lane structure

The visco instrument surface was built in full-stack lanes per the standing process. Lane A owned the Python source of record in `tools/visco-instruments/` and delivered a 15/15 selftest with the 102.86 hysteresis anchor reproduced exactly. Lane B owned the JavaScript port (`jev-visco-math.js`) and passed 9/9 fixture parity on its first run. Lane C owned the routes, builtins, dependency wiring, and selftest wiring, and in doing so discovered the live ledger schema facts the other lanes had assumed: the `observed_delta` column and the usability of `jev_corpus_runs.created_at` as a time basis. A fourth advisor lane reconciled 5 contract ambiguities across the lanes [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

## Why contract-first makes parallel lanes possible

Parallel development lets teams work simultaneously but can delay integration and cause problems if the pieces diverge [source: https://www.perforce.com/blog/p4/parallel-development, jev weight 0.617]. Continuous integration practice exists precisely to reduce build integration errors and maximize velocity across a development crew [source: https://microsoft.github.io/code-with-engineering-playbook/CI-CD/continuous-integration/, jev weight 0.8743]. Contract-first development addresses the divergence risk directly: it makes intent clear across team members, external teams, or third-party systems by writing the interface contract before the implementations [source: https://openpracticelibrary.com/practice/contract-first-development/, jev weight 0.5779]. Designing API specifications before writing code creates a clear contract that guides implementation and ensures consistency across services [source: https://kpavlov.me/blog/contract-first-vs-contract-last/, jev weight 0.5925]. The contract-first tooling lineage goes back to generating types from XSD schemas in WCF projects, where enabling contract-first mode makes the schema the definition language [source: https://learn.microsoft.com/en-us/dotnet/framework/wcf/contract-first-tool, jev weight 0.7803].

In the visco build the contract was `CONTRACTS.md` plus the generated fixtures: Lane A's Python defined the numbers, Lane B's JS matched them, and Lane C wired HTTP surfaces around both.

## What the advisor lane caught

The advisor lane reconciled 5 contract ambiguities, and the build record names the two with runtime consequences:

1. A `persistenceStats` object-shape call-site bug that would have crashed the C1 (persistence) route at runtime had it shipped [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].
2. A `pronyFit` opts-object bug that silently fit 2 arms for any `arms` value the caller passed, meaning the route's K parameter would have been decorative [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].
3. An advisor-owned fix in `jev-corpus-math.js` `selfTest` to skip `visco_*` fixture kinds, so the pre-existing selftest would not fail on fixture kinds it does not implement [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].

Both named bugs share a signature: they pass every per-lane test because each lane tests its own piece, and they surface only at the boundary where one lane's output shape meets another's expectation. That is the argument for a dedicated reconciliation lane rather than ad hoc integration: the ambiguities are a category, and 5 of them were found in one pass.

## Schema discovery in Lane C

Lane C's discovery of the live ledger schema is worth naming as a method: the route layer could not be written purely from the contract because the actual outcomes ledger carried an `observed_delta` column and a `created_at` timestamp the contract had not pinned [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]. The Prony route's time-basis selection (`created_at` with row-index fallback, [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md]) is the visible residue of that discovery: the contract gained a fallback rule because the integration lane found the real schema first.

## The lane discipline in one line

Each lane is verified against fixtures, not against the other lanes' code: Lane A against its selftest and the recorded anchor, Lane B against the same fixtures, Lane C against the contract and the live schema, the advisor against the union. The result was a deploy with no integration surprises: the post-deploy selftest passed all checks including the new visco parity checks on the first try [source: internal build record, https://raw.githubusercontent.com/yubi-OS/yubiOS/main/refs/visco-instruments-2026-10-02.md].
