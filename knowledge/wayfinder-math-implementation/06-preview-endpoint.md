# 06 Actual-text preview endpoint

Scope: `POST /api/map/preview`, its SHA256 validation order, its explicit error surface, its zero-persistence guarantee, and the frozen corpus the UI saves.

## The request shape

The preview endpoint accepts three things: a saved text baseline, the full resulting `texts` and `names`, and one target of `{action: "add"|"change", name}`. Exactly one target per request (source doc: actual-text preview section, primary project artifact).

The "actual-text" in the name is the design center: the candidate is previewed as the actual text it will become, not as a summary, a diff hint, or a vector placeholder. The operator sees the candidate the way the placement pipeline will see it.

## Validation order

The endpoint validates all unchanged source SHA256s before model work, then verifies their full points and bits afterwards (source doc: actual-text preview section, primary project artifact). The order matters. Hashing first is cheap and catches stale inputs before any expensive model work runs. Verifying full points and bits after the model work catches drift introduced or masked during the interval between validation and result assembly.

Content addressing by cryptographic hash is the standard primitive here: data addressed by what it is rather than where it lives, so any alteration, however small, changes the identifier (source: https://sambyte.net/systology/principles/content-addressable-storage/, jev weight 0.51; implementations in the wild use SHA256 digests as immutable content identities, source: https://github.com/o2alexanderfedin/angular-cas-disot, jev weight 0.60).

## Explicit errors

Stale inputs, missing evidence, altered surrounding documents, mismatched settings, and anchor drift each return explicit errors (source doc: actual-text preview section, primary project artifact). The live verification run confirmed the two most important negative paths: a stale second-source mutation returned HTTP 409, and a zero roundoff budget returned HTTP 422 (source doc: final publication section, primary project artifact). Distinguishing 409 from 422 matters for the operator: the first says "the world moved under you", the second says "your parameters are invalid".

## Zero persistence

Preview does not write a repository row, a D1 map row, or Vectorize. The one permitted side effect is population of the existing content-hash embedding cache (source doc: actual-text preview section, primary project artifact). The response returns an ephemeral map, target margins, the exact local ledger, source hashes, and unchanged anchor counts.

The live verification proved the guarantee rather than asserting it: three previews (noop, change, add) returned HTTP 200 with isolated deltas +0, +2, +1 respectively, 9 target margin axes each, and 12, 11, 12 unchanged anchors, and the saved map count did not change across the three previews. No repository or Vectorize writes occurred (source doc: final publication section, primary project artifact).

The side-effect-free preview principle is one the agent tooling literature recommends generally: mutating tools should offer a preview so reviewers can inspect predicted effects before they happen (source: https://aiengineerdex.com/practice/side-effect-free-tool-previews/, jev weight 0.21, weak backing). Ephemeral preview environments embody the same idea at infrastructure scale: fully functional, isolated, short-lived deployments that leave nothing behind (source: https://sachinsharma.dev/blogs/building-a-preview-environment-system-for-every-pr-2026, jev weight 0.40, weak backing).

## Failure honesty under storage outages

Storage outages return 503 rather than false missing-baseline responses (source doc: actual-text preview section, primary project artifact). This is a small detail with a large correctness consequence. If an outage masqueraded as "baseline not found", the operator would be told their baseline does not exist when it does, an error that could trigger destructive reconstruction. A 503 tells the truth: the service cannot answer right now, retry later.

## The frozen corpus

The UI saves a frozen copy of the corpus when the operator chooses a saved text baseline, and preview cannot overwrite that corpus or its ID (source doc: actual-text preview section, primary project artifact). Freezing the corpus at choice time means the preview is computed against a fixed, named input set; later edits to live sources cannot silently change what the preview meant.

The candidate panel completes the loop: it distinguishes neutral ADDs from unmoved CHANGEs, renders escaped literal paths so raw filenames cannot break the display or inject markup, and preserves the independent task-check boundary (source doc: actual-text preview section, primary project artifact). The task-check remains the only place where the question "is this edit worth making" is answered. The preview informs that judgment; it never makes it.
